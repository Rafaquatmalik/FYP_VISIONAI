import React , {useState,useEffect} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image,BackHandler } from 'react-native'
import navscreenSound from 'react-native-sound';
import Tts from 'react-native-tts';
import * as userLocation from 'expo-location';


export default function NavigateScreen({ navigation }) {

//  const [navAudio,navsetAudio]=React.useState("")
//  const navbuttonPressSound = new navscreenSound(navAudio, error => console.log(error));
//  const navplayButtonPress = () => {
//  navbuttonPressSound.play();
// }
const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Wait, we are fetching you location...');


Tts.setDefaultLanguage('en-US');
Tts.setDucking(true);
const handleVoice=ttsText=>{
  Tts.speak(ttsText);
};

useEffect(() => {
  GetCurrentLocation();
}, []);


const GetCurrentLocation = async () => {
  let { status } = await userLocation.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission not granted',
      'Allow the app to use location service.',
      [{ text: 'OK' }],
      { cancelable: false }
    );
  }

  let { coords } = await userLocation.getCurrentPositionAsync();

  if (coords) {
    const { latitude, longitude } = coords;
    let response = await userLocation.reverseGeocodeAsync({
      latitude,
      longitude
    });
  let add;
    for (let item of response) {
        if(`${item.name}` !== 'null'){
            add=`${item.name}`
        }
        if(`${item.district}` !== 'null'){
          add=add + ' ' + `${item.district}`
        }
        if(`${item.street}` !== 'null'){
          add=add + ' ' + `${item.street}`
        }
        if(`${item.streetNumber}` !== 'null'){
          add=add + ' ' + `${item.streetNumber}`
        }
        if(`${item.city}` !== 'null'){
          add=add + ' ' + `${item.city}`
        }
        if(`${item.subregion}` !== 'null'){
          add=add + ' ' + `${item.subregion}`
        }
        if(`${item.region}` !== 'null'){
          add=add + ' ' + `${item.region}`
        }
        if(`${item.postalCode}` !== 'null'){
          add=add + ' ' + `${item.postalCode}`
        }
        if(`${item.country}` !== 'null'){
          add=add + ' ' + `${item.country}.`
        }
     //let address = `${item.name}, ${item.district},${item.street}, ${item.city},${item.subregion},${item.region}, ${item.postalCode}`;
       let address=add;

      setDisplayCurrentAddress(address);
   
       // handleVoice('Your Current Address Is'+ address);
      
    }
  }
  
};


  return (
    <View style={styles.mainView}>

      <View style={styles.headView}>
        <TouchableOpacity 
          style={{height:24,width:110}}
        >
          <Image source={require('../assets/VisionAI_Logo.png')} style={styles.imagelogo} />
        </TouchableOpacity>
 
      </View>


      <View style={styles.bodyView}>


       <View style={{flexDirection:'row'}}> 
         <TouchableOpacity 
           style={styles.tchOpac}
           onPress={()=>{handleVoice('Current Location')}}
           onLongPress={()=>{handleVoice('Your Current Address Is'+ displayCurrentAddress);}} 
         > 
           <Text style={styles.tchOpactxt}> Current </Text>
           <Text style={styles.tchOpactxt}> Location </Text>
         </TouchableOpacity>
       </View>


       <View style={{flexDirection:'row'}}> 
         <TouchableOpacity 
           style={styles.tchOpac}
           onPress={()=>{handleVoice('Customize Mapping')}}
           onLongPress={()=>{navigation.navigate('CustomizeMapping'); handleVoice('Map Screen');}} 
         > 
           <Text style={styles.tchOpactxt}> Customize </Text>
           <Text style={styles.tchOpactxt}> Mapping </Text>
         </TouchableOpacity>
       </View>

       {/* <View style={{flexDirection:'row'}}> 
         <TouchableOpacity 
           style={styles.tchOpac} 
           onPress={()=>{handleVoice('Direction')}}
           onLongPress={()=>{handleVoice('Select Destination ');}}   
         > 
           <Text style={styles.tchOpactxt}> Direction</Text>
         </TouchableOpacity>
       </View> */}


       <View style={{flexDirection:'row'}}> 
         <TouchableOpacity 
           style={styles.tchOpacexit}
           onPress={()=>{handleVoice('Back')}}
           onLongPress={()=>{handleVoice('Back to Home Screen'); navigation.navigate('HomeScreen'); }}   
         > 
           <Text style={styles.tchOpactxt}> Back</Text>
         </TouchableOpacity>
       </View>
       
       <View style={{flexDirection:'row'}}> 
         <TouchableOpacity 
           style={styles.tchOpacexit}      
           onPress={()=>{handleVoice('Exit')}}
           onLongPress={()=>{handleVoice('Exit From App');BackHandler.exitApp();}}       
         > 
           <Text style={styles.tchOpactxt}> Exit</Text>
         </TouchableOpacity>
       </View>

     </View>
     
   
      <View style={styles.footView}>
       <Text style={styles.foottxt}> 
         All Rights Copy & Reserved @2022
       </Text>
      </View>
   
    </View>

  
  );
}



const styles=StyleSheet.create({
  mainView:{
    flex:1
  },
  headView:{
    flex:0.07,
    backgroundColor:'#8c93a1',
    justifyContent:'center'
  },
  bodyView:{
    flex:0.90,
    backgroundColor:'#ebebeb',
    alignItems:'center',
    justifyContent:'center',
  },
  footView:{
    flex:0.05,
    backgroundColor:'#8c93a1',
    justifyContent:'center',
    alignItems:'center'
  },
  tchOpac:{
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    borderColor:'#7c7c7d',
    margin:10,
    borderRadius: 40,
    borderWidth:5,
    padding:20,
    height:120  ,
    width:360,
    
  },
  tchOpacexit:{
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#7c7c7d',
    alignSelf:'center',
    marginTop:15,
    borderRadius: 0,
    borderWidth:5,
    height:80,
    width:360,
  },
  tchOpactxt:{
    color:'#333333',
    fontSize: 40,
    fontWeight:"900"
  },
  tchOpacback:{
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#7c7c7d',
    alignSelf:'center',
    marginTop:50,
    borderRadius: 0,
    borderWidth:5, 
    height:70,
    width:330,
  },
  

   imagelogo: {
     resizeMode: 'stretch',
      width:160,
      height:60,
      justifyContent:'center',
      alignItems:'center'
  },
  foottxt:{
    fontWeight:"700",
    fontSize:12,
    color:'black'
  },
})