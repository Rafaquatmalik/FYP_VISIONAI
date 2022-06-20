import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
} from "react-native";
import Tts from "react-native-tts";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

export default function AssistanceScreen({ navigation }) {
  //  const [navAudio,navsetAudio]=React.useState("")
  //  const navbuttonPressSound = new navscreenSound(navAudio, error => console.log(error));
  //  const navplayButtonPress = () => {
  //  navbuttonPressSound.play();
  // }
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Wait, we are fetching you location..."
  );

  Tts.setDefaultLanguage("en-US");
  Tts.setDucking(true);
  const handleVoice = (ttsText) => {
    Tts.speak(ttsText);
  };
  //const [model, setModel] = useState(null);
  let model;
  const [isTFready, setTFready] = useState(false);
  const [ismodelready, setModelready] = useState(false);
  useEffect(() => {
    (async () => {
       await tf.setBackend('cpu');
      console.log(tf.getBackend());
      await tf.ready();
      //tf.getBackend();
      setTFready(true);
      model = await cocoSsd.load();
      setModelready(true);
    })();
  }, []);

  return (
    <View style={styles.mainView}>
      <View style={styles.headView}>
        <TouchableOpacity style={{ height: 24, width: 110 }}>
          <Image
            source={require("../assets/VisionAI_Logo.png")}
            style={styles.imagelogo}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bodyView}>
      {isTFready ? <Text style={{color:'green'}}>TensorFlow is  Ready</Text>: <Text> Loading Tensorflow....</Text>}
      {ismodelready ? <Text style={{color: 'green'}}>Model is Ready </Text>: <Text> Loading Model...</Text>}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.tchOpac}
            onPress={() => {
              handleVoice("Object detection");
            }}
            //onLongPress={()=>{navigation.navigate('CommonObjectsScreen'); handleVoice('Camera Opened For Object Detection');}}
            onLongPress={() => {
              if(isTFready && ismodelready){
                navigation.navigate("CameraScreen", {
                  model: model,
                  tf:tf
                });
                handleVoice("Camera Opened For classifying objects");
              }else{
                handleVoice("Wait for the model to load");
              }
            }
              }
              
          >
            <Text style={styles.tchOpactxt}> Classify </Text>
            <Text style={styles.tchOpactxt}> Objects</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.tchOpac}
            onPress={() => {
              handleVoice("Text Reading");
            }}
            onLongPress={() => {
              navigation.navigate("TextRScreen");
              handleVoice("Camera Opened For Text Reading");
            }}
          >
            <Text style={styles.tchOpactxt}> Text </Text>
            <Text style={styles.tchOpactxt}> Reading </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.tchOpacexit}
            onPress={() => {
              handleVoice("Back");
            }}
            onLongPress={() => {
              handleVoice("Back to Home Screen");
              navigation.navigate("HomeScreen");
            }}
          >
            <Text style={styles.tchOpactxt}> Back</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.tchOpacexit}
            onPress={() => {
              handleVoice("Exit");
            }}
            onLongPress={() => {
              handleVoice("Exit From App");
              BackHandler.exitApp();
            }}
          >
            <Text style={styles.tchOpactxt}> Exit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footView}>
        <Text style={styles.foottxt}>All Rights Copy & Reserved @2022</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  headView: {
    flex: 0.07,
    backgroundColor: "#8c93a1",
    justifyContent: "center",
  },
  bodyView: {
    flex: 0.9,
    backgroundColor: "#ebebeb",
    alignItems: "center",
    justifyContent: "center",
  },
  footView: {
    flex: 0.05,
    backgroundColor: "#8c93a1",
    justifyContent: "center",
    alignItems: "center",
  },
  tchOpac: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderColor: "#7c7c7d",
    margin: 10,
    borderRadius: 40,
    borderWidth: 5,
    padding: 20,
    height: 120,
    width: 360,
  },
  tchOpacexit: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#7c7c7d",
    alignSelf: "center",
    marginTop: 15,
    borderRadius: 0,
    borderWidth: 5,
    height: 80,
    width: 360,
  },
  tchOpactxt: {
    color: "#333333",
    fontSize: 40,
    fontWeight: "900",
  },
  tchOpacback: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#7c7c7d",
    alignSelf: "center",
    marginTop: 50,
    borderRadius: 0,
    borderWidth: 5,
    height: 70,
    width: 330,
  },

  imagelogo: {
    resizeMode: "stretch",
    width: 160,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  foottxt: {
    fontWeight: "700",
    fontSize: 12,
    color: "black",
  },
});
