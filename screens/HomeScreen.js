import React , {useState,useEffect,Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image,BackHandler,PermissionsAndroid,NativeModules } from 'react-native'
import Tts from 'react-native-tts';
import firestore from '@react-native-firebase/firestore';
// import SendSMS from 'react-native-sms';
// import Geocoder from 'react-native-geocoding';
// import Geolocation from 'react-native-geolocation-service';
import * as userLocation from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const DirectSms = NativeModules.DirectSms;

export default function HomeScreen({ navigation,route }) {

Tts.setDefaultLanguage('en-US');
Tts.setDucking(true);
const handleVoice=ttsText=>{
  Tts.speak(ttsText);
};


const [mobileNumber, setMobileNumber] = useState();
const [bodySMS, setBodySMS] = useState();

const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Wait, we are fetching you location...');


// const [latitude, setLatitude] = useState();
// const [longitude, setLongitude] = useState();
// const [address, setAddress] = useState();
// const [error,setError]=useState();

   firestore()
    .collection('users')
    .doc(route.params?.email)
    .get()
    .then(documentSnapshot => {
     
      if (documentSnapshot.exists) {
          // console.log('User data: ', documentSnapshot.data());
          var userdata=documentSnapshot.data();
          setMobileNumber(userdata.phonenumber);
            }
    });
    
  
    sendDirectSms = async () => {
      try {
          const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.SEND_SMS,
              {
                  title: 'App Sms Permission',
                  message:
                      'App needs access to your inbox ' +
                      'so you can send messages in background.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                  allowAndroidSendWithoutReadPermission: true,
              },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
             DirectSms.sendDirectSms(mobileNumber, bodySMS);
            //  console.log(bodySMS) ;
             handleVoice('Message Send');

          } else {
              // console.log('SMS permission denied');
          }
      } catch (err) {
          // console.warn(err);
      }
  }


  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, [displayCurrentAddress]);



  const CheckIfLocationEnabled = async () => {
    let enabled = await userLocation.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        'Location Service not enabled',
        'Please enable your location services to continue',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

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
         let userAddress=add;
  
        setDisplayCurrentAddress(userAddress);
     
         handleVoice('Your Current Address Is'+ displayCurrentAddress);
          // console.log(displayCurrentAddress)
          setBodySMS("Help Call Me \n\n" + "My Current Address : \n" + displayCurrentAddress);
 
      }
    }
    
  };


//  useEffect(()=>{  
//       if (Platform.OS === 'ios') {
//         CAMERA.requestAuthorization();
//         CAMERA.setRNConfiguration({
//           skipPermissionRequests: false,
//           authorizationLevel: 'whenInUse',
//        });
//       }
    
//       if (Platform.OS === 'android') {
//           PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//         );
//       }
//   },[]) 


    useEffect(()=>{  
      // if (Platform.OS === 'ios') {
      //   Geolocation.requestAuthorization();
      //   Geolocation.setRNConfiguration({
      //     skipPermissionRequests: false,
      //    authorizationLevel: 'whenInUse',
      //  });
      // }
    
      if (Platform.OS === 'android') {
         PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,

        );
      }
        },[]) 

  return (
  
    <View style={styles.mainView}>
    
     <View style={styles.headView}>
        <View style={{flexDirection:'column',paddingRight:130,alignItems:'center'}}>
        <TouchableOpacity style={{height:24,width:140}}>
          <Image source={require('../assets/VisionAI_Logo.png')} style={styles.imagelogo} />
        </TouchableOpacity>
        </View>
        
        <View style={{flexDirection:'column',alignItems:'center'}}>    
        <TouchableOpacity style={{height:24,width:90, alignItems:'flex-end'}} 
            onPress={()=>{handleVoice('Update Mobile Number')}}
            onLongPress={()=>{navigation.navigate('UpdateScreen');handleVoice('Update Screen');}} >
               <View style={{flexDirection:'row'}}> 
                <View style={{flexDirection:'column'}}> 
                  <Text style={{fontWeight:'700',fontSize:20,color:'black'}}>EDIT NUM </Text>
                </View>
                <View style={{flexDirection:'column'}}> 
                  <MaterialCommunityIcons name="menu-open" size={30} color="black" />
                </View>
              </View>
        </TouchableOpacity>
        </View>

      </View>


      <View style={styles.bodyView}>
        <View style={{flexDirection:'row'}}> 
          <TouchableOpacity 
            style={styles.tchOpac}
            onPress={()=>{handleVoice('Assistance')}}
            onLongPress={()=>{navigation.navigate('AssistanceScreen');handleVoice('Assistance Screen');}}       
          > 
            <Text style={styles.tchOpactxt}> Assistance </Text>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection:'row'}}> 
          <TouchableOpacity 
                style={styles.tchOpac}
                onPress={()=>{handleVoice('Navigation')}}
                onLongPress={()=>{navigation.navigate('NavigationScreen');handleVoice('Navigation Screen');}}   
          > 
            <Text style={styles.tchOpactxt}> Navigation </Text>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection:'row'}}> 
          <TouchableOpacity 
            style={styles.tchOpac}
            onPress={()=>{handleVoice('S O S Alert')}}
            onLongPress={()=>{sendDirectSms();handleVoice('S O S  ALERT Performing');}}   
          > 
            <Text style={styles.tchOpactxt}> SOS Alert</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row'}}> 
          <TouchableOpacity 
            style={styles.tchOpacexit}
            onPress={()=>{handleVoice('Exit')}}
            onLongPress={()=>{handleVoice('Exit From App');BackHandler.exitApp();}}   
          > 
            <Text style={styles.tchOpactxt}> EXIT</Text>
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
 
    flexDirection:'row'
  },
  bodyView:{
    flex:0.90,
    backgroundColor:'#ebebeb',
    justifyContent:'center',
    alignItems:'center'
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
    height:140,
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
    height:90,
    width:360,
  },
  tchOpactxt:{
    color:'#333333',
    fontSize: 50,
    fontWeight:"900"
  },

   imagelogo: {
     resizeMode: 'stretch',
      width:130,
      height:50,
      justifyContent:'center',
      alignItems:'center'
  },
  foottxt:{
    fontWeight:'700',
    fontSize:10,
    color:'black'
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