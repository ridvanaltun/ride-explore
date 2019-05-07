import io from 'socket.io-client';

const socketConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ['websocket']
};

// santa-mobile hotspot -> http://192.168.43.120:3000/
// santa-laptop hotspot -> http://192.168.137.1:3000/
// Android Emulator -> http://10.0.2.2:3000/
// Genymontion -> http://10.0.3.2:3000/
// SSH desteklenmediği için yurt interenti dışında -> https://serveo.net/ veya ngrok kullanılabilir.
socket = io("http://10.0.2.2:3000/", socketConfig);

export default { socket };