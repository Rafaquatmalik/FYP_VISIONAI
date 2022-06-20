import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image,TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
// import { shareAsync } from 'expo-sharing';
// import * as MediaLibrary from 'expo-media-library';
import TextRecognition from 'react-native-text-recognition';
import Tts from 'react-native-tts';
export default function App({navigation}) {
  
Tts.setDefaultLanguage('en-US');
Tts.setDucking(true);
const handleVoice=ttsText=>{
  Tts.speak(ttsText);
};

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
 
  const [photo, setPhoto] = useState();
 
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  (async () => {
    if(photo){
      let result = (await TextRecognition.recognize(photo.uri)).toString();
      console.log(result);
       
      handleVoice("Start Text Reading");
      handleVoice(result);
// textR=result
// console.log(text);
      //setText(result);
      //console.log(text);
    }
  })();
  

  return (
    <>
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
           style={styles.snapBtn}
           onPress={()=>handleVoice('Snap Button')}
           onLongPress={()=>{takePic(); handleVoice ("Snap is Taken");}}
         > 
           <Text style={styles.tchOpactxt}>SNAP</Text>
         </TouchableOpacity> 
      </View>
    </Camera>

    <View style={{flexDirection:'row',flex:0.25}}> 
         <TouchableOpacity 
           style={styles.tchOpacexit}
           onPress={()=>{handleVoice('Back')}}
           onLongPress={()=>{handleVoice('Back to Home Screen'); navigation.navigate('HomeScreen'); }}   
         > 
           <Text style={styles.tchOpactxt}> Back</Text>
         </TouchableOpacity>
       </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end'
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  },

 
 
  tchOpacexit:{
  
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#7c7c7d',
    alignSelf:'center',
    marginTop:15,
    borderRadius: 0,
    borderWidth:5,
    height:90,
    width:360,
  },
  snapBtn:{
  
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#7c7c7d',
    alignSelf:'center',
    marginTop:15,
    borderRadius: 0,
    borderWidth:5,
    height:120,
    width:360,
  },
  tchOpactxt:{
    color:'#333333',
    fontSize: 50,
    fontWeight:"900"
  },
});

