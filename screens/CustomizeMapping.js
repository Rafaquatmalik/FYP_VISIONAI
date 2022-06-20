import React, { useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
} from "react-native-maps";
import Tts from 'react-native-tts';
import firestore from '@react-native-firebase/firestore';
export default function CustomizeMapping({ navigation, route}) {
  const [markers, setMarkers] = useState([]);
  const [polygon, setPolygon] = useState([]);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState();
  var arr = [];

  useEffect(() => {
    // console.log("Polygon", polygon);
    setEmail(route.params?.email);
    if (polygon !== [] && visible === false) {
      setVisible(true);
    }
  }, [polygon, visible]);

  const handleVoice=ttsText=>{
    Tts.speak(ttsText);
  };

  const createGeofence = () => {
    if(markers.length < 3){
      Alert.alert("Please Insert atleast three Markers");
      handleVoice('Please Insert atleast three Markers for Geofence Creation');
    }else{
      setPolygon([...markers, markers[0]]);
      handleVoice('Geofence Created for the Selected MArkers');
    }

    // console.log("Markers", markers);
  };

  const handleGeofence = async()=>{
    const ref =firestore().collection('geofences')
    //const ref =firestore().collection('users')
     const doc= await ref.doc(email).set({
            geofences: polygon
            
        })
        .then((res) => {
            Alert.alert("Geofence saved successfully");
            handleVoice('Selected Area for Geofence is saved successfully');
            
            setPolygon([]),
            setMarkers([])
            setVisible(false)
            //setLoading(false)
        })
        .catch((err) => {
          // console.error("Error occured: ", err);
          //setLoading("false");
        });
      

  }

  return (
    <>
      <View style={styles.mainView}>
        <MapView
          style={{ width: "100%", height: "100%" }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: route.params?.latitude, //24.8206229085144
            longitude: route.params?.longitude, //67.02958588017458
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          onPress={(e) =>{
            setMarkers([...markers, { latlng: e.nativeEvent.coordinate }]);
            handleVoice('A new Marker is Inserted on the Map Screen');
          }
          }
        >
          {
            // loop through markers array & render all markers
            markers.map((marker, i) => (
              <Marker coordinate={marker.latlng} key={i} pinColor="green" />
            ))
          }

          {visible && (
            <Polyline
              coordinates={polygon.map((polyline, i) => polyline.latlng)}
              strokeColor="red"
              strokeWidth={2}
            />
          )}
        </MapView>
      </View>
    
      <View style={{flexDirection:'row'}}> 
         <TouchableOpacity 
           style={styles.tchOpacexit}
           onPress={()=>{createGeofence()}}
           //onLongPress={()=>{handleVoice('Back to Home Screen'); navigation.navigate('HomeScreen'); }}   
         > 
           <Text style={styles.tchOpactxt}>Geofence</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={styles.tchOpacexit}
           onPress={()=>{handleGeofence()}}
           //onLongPress={()=>{handleVoice('Back to Home Screen'); navigation.navigate('HomeScreen'); }}   
         > 
           <Text style={styles.tchOpactxt}>Save</Text>
         </TouchableOpacity>
       </View>
       <View style={{flexDirection:'row'}}> 
         <TouchableOpacity 
           style={styles.tchOpacback}
           onPress={()=>{handleVoice('Back')}}
           onLongPress={()=>{handleVoice('Back to Home Screen'); navigation.navigate('HomeScreen'); }}   
         > 
           <Text style={styles.tchOpactxt}> Back</Text>
         </TouchableOpacity>
       </View>
  <View style={styles.footView}>
       <Text style={styles.foottxt}> 
         All Rights Copy & Reserved @2022
       </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    height: '100%', 
    width: '100%'

  },
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
    height:170,
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
    width:180,
  },
  tchOpactxt:{
    color:'#333333',
    fontSize: 30,
    fontWeight:"bold"
  },
  tchOpacback:{
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#7c7c7d',
    alignSelf:'center',
    marginTop:5,
    borderRadius: 0,
    borderWidth:5, 
    height:80,
    width:370,
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
});
