import firebase from 'firebase';
import { Constants, ImagePicker, ImageManipulator } from 'expo';
import { cloudinaryConfig } from '../configs/cloudinary';

const PickImage = async (uid) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
    base64: true,
    quality: 1 // compression ratio -> max 1 <<->> min 0 -> 1 meaning no compression
  });

  if(result.cancelled){
     //pass
   }else if(result.type != 'image'){
     Alert.alert('It Is Not An Image', 'Please select an image. Your selection is ' + result.type + '.');
   }else if(result.height < 180 || result.width < 180){
     Alert.alert('Your Image Too Small', 'Image has to be 180x180px minimum.');
   }else{

    let apiUrl = 'https://api.cloudinary.com/v1_1/' + cloudinaryConfig.cloud_name + '/image/upload';

    // we make a small copy of our image
    const resizedImage = await ImageManipulator.manipulateAsync(
      result.uri,
      [{resize: { width: 180 }}], //height resize automaticly
      { format: 'jpeg', base64: true }
    );

    // Orginal Image
    const orginalBase64Img = `data:image/jpg;base64,${result.base64}`
    const originalData = {"file": orginalBase64Img, "upload_preset": cloudinaryConfig.upload_preset }

    // 180px x 180px Image
    const size180Base64Img = `data:image/jpg;base64,${resizedImage.base64}`
    const size180Data = {"file": size180Base64Img, "upload_preset": cloudinaryConfig.upload_preset }

    fetch(apiUrl, {
      body: JSON.stringify(originalData),
      headers: {'content-type': 'application/json'},
      method: 'POST',
    }).then(async r =>  {
        let original = await r.json()

      firebase.database().ref('/users/' + uid)
        .update({ image_original: original.secure_url })
        .catch(err => console.log('pickImage Firebase Error: ', err));

    }).catch(err => console.log('pickImage Fetch Error: ', err));

    fetch(apiUrl, {
      body: JSON.stringify(size180Data),
      headers: {'content-type': 'application/json'},
      method: 'POST',
    }).then(async r => {
        let size180 = await r.json()

      firebase.database().ref('/users/' + uid)
        .update({ image_minified: size180.secure_url })
        .catch(err => console.log('pickImage Firebase Error: ', err));

    }).catch(err => console.log('pickImage Fetch Error: ', err));
  }
}

export default PickImage;