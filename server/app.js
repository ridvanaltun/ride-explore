var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

const PORT = 3000;

app.get('/', function (req, res){
	//res.send('<h1>Hello world</h1>');
	res.sendFile(__dirname + '/index.html');
});

app.get('/user', function (req, res){
    res.sendFile(__dirname + '/user.html');
});

app.get('/configs/firebase.js', function (req, res){
    res.sendFile(__dirname + '/configs/firebase.js');
});

var users = {};
var client_list = [];
var ACTIVE_CLIENT_COUNT = 0;
var LOGGED_USER_COUNT = 0;
var ACTIVE_TEST_USER_COUNT = 0;
var DEBUG_COUNT = 0;

// The event will be called when a client is connected.
io.on('connection', socket => {

	ACTIVE_CLIENT_COUNT += 1;
    
	console.log("A client joined on -> [Socket ID] --> ", socket.id);

    // yeni client geldikçe online tüm clientleri liste şeklinde yazdirir
    io.clients( (error, clients) => {
        if (error) throw error;
        client_list = clients;
        //console.log('Clients --> ', clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
        //print_debug(clients);
    });

 	// Admin paneli için bir channel, not tested.
 	socket.on('SERVER-STATUS', () => {
 		io.emit('SERVER-STATUS', { 
 			"ACTIVE_CLIENT_COUNT": ACTIVE_CLIENT_COUNT, 
 			"LOGGED_USER_COUNT": LOGGED_USER_COUNT,
            "ACTIVE_TEST_USER_COUNT": ACTIVE_TEST_USER_COUNT
 		});
 	});

 	// Kullanıcı giriş yaptığında buraya bilgilerini bırakacak
 	socket.on('login', data => {
        if(data.uid != undefined){
            console.log('An user connected -> [User UID] --> ', data.uid);
            users[socket.id] = { ...users[socket.id], uid: data.uid };
            LOGGED_USER_COUNT += 1;
        }
        io.sockets.connected[socket.id].emit('socket-id', socket.id);
        socket.broadcast.emit('online-users', users);  
    });

    socket.on('update-location', data => {
        users[socket.id] = { ...users[socket.id], longitude: data.longitude, latitude: data.latitude }
        socket.broadcast.emit('online-users', users);
    });

    socket.on('update-person-data', data => {
        users[socket.id] = { 
            ...users[socket.id], 
            image_minified: data.image_minified, 
            name: data.name,
            surname: data.surname,
            about: data.about
            /* buraya age eklenecek sonra */ 
        }

        socket.broadcast.emit('online-users', users);
    });

    //////////////////////////////////////////////////////////////////////////////////////
    // for debug.. ///////////////////////////////

    socket.on('get-online-users', () =>{
        socket.emit('online-users', users);
    });

    socket.on('add-test-user', data => {
        if(users[data.uid] != undefined){
            console.log('The test user already exist!');
        }else{
            console.log('A test user created! -> [User UID] --> ', data.uid);
            users[data.uid] = { 
                uid: data.uid, 
                longitude: data.longitude, 
                latitude: data.latitude,
                name: data.name,
                surname: data.surname,
                about: data.about,
                image_minified: data.image_minified 
            }
            ACTIVE_CLIENT_COUNT += 1;
            ACTIVE_TEST_USER_COUNT += 1;
            socket.broadcast.emit('online-users', users);   
        }
    });

    socket.on('remove-test-user', data => {
        if(users[data.uid] != undefined){
            ACTIVE_CLIENT_COUNT -= 1;
            ACTIVE_TEST_USER_COUNT -= 1;
            console.log('A test user removed! -> [User UID] --> ', data.uid);
            delete users[data.uid];
            socket.broadcast.emit('online-users', users);     
        }else{
            console.log('Test user not found!');
        }
    });

    socket.on('print-debug', () => {
        console.clear();
        console.log('\n');
        console.log('## DEBUG ENTRY COUNT \t\t: ', DEBUG_COUNT);
        console.log('Current Logged User List \t: ', client_list);
        console.log('Active Client Count \t\t: ', ACTIVE_CLIENT_COUNT);
        console.log('Active Test User Count \t: ', ACTIVE_TEST_USER_COUNT);
        console.log('Logged User Count \t\t: ', LOGGED_USER_COUNT);
        console.log('\n');
        DEBUG_COUNT += 1; 
    });

    //////////////////////////////////////////////////////////////////////////////////////

 	// The event will be called when a client is disconnected.
	socket.on('disconnect', () => {
		ACTIVE_CLIENT_COUNT -= 1;

    	if(users[socket.id] != undefined){
    		LOGGED_USER_COUNT -= 1;
            console.log('A user left -> [User UID] --> ', users[socket.id].uid);
            delete users[socket.id];
            socket.broadcast.emit('online-users', users);

    	}else{
    		console.log('A guest left -> [Socket ID] --> ', socket.id);
    	}

  	});
});

server.listen(PORT, () => console.log("Server running on port : " + PORT));