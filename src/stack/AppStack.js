import React, { useState, useEffect } from "react";
import HomeScreen from "../../screens/HomeScreen";
import UpdateScreen from "../../screens/UpdateScreen";
import NavigationScreen from "../../screens/NavigationScreen";
import TextRScreen from "../../screens/TextRScreen";
import SosScreen from "../../screens/SosScreen";
import CustomizeMapping from "../../screens/CustomizeMapping";
import AssistanceScreen from "../../screens/AssistanceScreen";
import CameraScreen from "../../screens/CameraScreen";
import { Alert, ToastAndroid, Button } from "react-native";
import Tts from "react-native-tts";

// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import * as tf from "@tensorflow/tfjs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useKeepAwake } from "expo-keep-awake";
import GeoLocation from "react-native-geolocation-service";
import firestore from "@react-native-firebase/firestore";
import { isPointInPolygon } from "geolib";

const Stack = createNativeStackNavigator();
export default function AppStack(props) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [polygon, setPolygon] = useState([]);
  // const [point, setPoint] = useState();
  // const [update, setUpdate] = useState(false);

  const email = props.useremail;

  useKeepAwake();

  // const [model, setModel] = useState(null);

  // useEffect(()=>{
  //   (async ()=>{
  //     await tf.ready();
  //    setModel(await cocoSsd.load())
  //   })();
  // })

  useEffect(async () => {
    GeoLocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        // console.log(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  }, [latitude, longitude]);

  const checkUser = async () => {
    await firestore()
      .collection("geofences")
      .doc(email)
      .get()
      .then((documentSnapshot) => {
        // console.log(email)
        // console.log('geofences exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          // console.log('Geofences data: ', documentSnapshot.data().geofences);
          var geofencedata = documentSnapshot.data();
          setPolygon(geofencedata.geofences);
        }
      });
      if(polygon== null){
        console.log("polygon is null");
      }
    if (latitude != null && longitude != null && polygon != null) {
   
    let point = { latitude: latitude, longitude: longitude };
    let poly = [];
    polygon.map((polyline, i) => poly.push(polyline.latlng));

    if (point.latitude !== null && point.longitude !== null && poly!= null) {
      if (isPointInPolygon(point, poly)) {
        ToastAndroid.show(
          "User is within the saved geofence",
          ToastAndroid.SHORT
        );
        handleVoice("You are within the save geofence");
      } else {
        ToastAndroid.show(
          "you are not within the saved geofence",
          ToastAndroid.SHORT
        );
        handleVoice("You are not within saved geofence");
      }
    }
  }
  };

  const handleVoice = (ttsText) => {
    Tts.speak(ttsText);
  };

  return (
    <>
      <Button title="User Alert Status" onPress={checkUser} />
      <Stack.Navigator initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          initialParams={{ email: email }}
          
        />
        <Stack.Screen
          name="AssistanceScreen"
          component={AssistanceScreen}
          initialParams={{ email: email }}
        />
        <Stack.Screen name="NavigationScreen" component={NavigationScreen} />
        <Stack.Screen
          name="SosScreen"
          component={SosScreen}
          initialParams={{ email: email }}
        />
        <Stack.Screen
          name="UpdateScreen"
          component={UpdateScreen}
          initialParams={{ email: email }}
        />
        <Stack.Screen name="TextRScreen" component={TextRScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen
          name="CustomizeMapping"
          component={CustomizeMapping}
          initialParams={{
            latitude: latitude,
            longitude: longitude,
            email: email,
          }}
        />
      </Stack.Navigator>
    </>
  );
}
