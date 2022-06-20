import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  LogBox,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  
} from "react-native";
import { Camera } from "expo-camera";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import React, { useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Canvas from "react-native-canvas";
import Tts from "react-native-tts";

const TensorCamera = cameraWithTensors(Camera);

const { width, height } = Dimensions.get("window");
LogBox.ignoreAllLogs(true);

export default function Assistance({ navigation, route }) {
  Tts.setDefaultLanguage("en-US");
  Tts.setDucking(true);
  const handleVoice = (ttsText) => {
    Tts.speak(ttsText);
  };
  // const [isTFready, setTFready] = useState(false);
  // const [ismodelready, setModelready] = useState(false);
  // const [showCamera, setShowcamera] = useState(false);

  //const [model, setModel] = useState(null);
  let context = useRef(null);
  let canvas = useRef(null);
  const { model, tf } = route.params;

  useEffect(async () => {
    // if (Platform.OS === 'android') {
    //     PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.CAMERA,
    //   );
    // }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);

  let textureDims =
    Platform.OS == "ios"
      ? { height: 1920, width: 1080 }
      : { height: 1200, width: 1600 };

  // useEffect(() => {
  //   // (async () => {
  //   //  // await tf.ready();
  //   //   //tf.getBackend();
  //   //   //setTFready(true);
  //   //   //setModel(await cocoSsd.load());
  //   //   // setModelready(true);
  //   // })();
  // }, []);

  function handleCameraStream(images) {
    const loop = async () => {
      const nextImageTensor = images.next().value;
      if (!model || !nextImageTensor)
        throw new Error("No model or image tensor");
      model
        .detect(nextImageTensor)
        .then((prediction) => {
          //we will draw the rectangles
          drawRectangle(prediction, nextImageTensor);
        })
        .catch((error) => {
          console.log(error);
        });
      tf.dispose([nextImageTensor]);
      requestAnimationFrame(loop);
    };
    loop();
  }

  function drawRectangle(predictions, nextImageTensor) {
    if (!context.current || !canvas.current) return;

    //to Match the size of camera preview
    const scaleWidth = width / nextImageTensor.shape[1];
    const scaleHeight = height / nextImageTensor.shape[0];

    const flipHorizontal = Platform.OS == "ios" ? false : true;

    //we wil clear the previous prediction.
    context.current.clearRect(0, 0, width, height);

    //Draw the rectangle for each prediction

    for (const prediction of predictions) {
      const [x, y, width, height] = prediction.bbox;

      // scale the coordinates based on the ratios calcualted
      const boundingBoxX = flipHorizontal
        ? canvas.current.width - x * scaleWidth - width * scaleWidth
        : x * scaleWidth;

      const boundingBoxY = y * scaleHeight;

      //draw the rectangle
      context.current.strokeRect(
        boundingBoxX,
        boundingBoxY,
        width * scaleWidth,
        height * scaleHeight
      );

      //Draw the label
      context.current.strokeText(
        prediction.class,
        boundingBoxX - 5,
        boundingBoxY - 5,
        handleVoice(prediction.class)
      );
    }
  }

  async function handleCanvas(can) {
    if (can) {
      can.width = width;
      can.height = height;
      const ctx = can.getContext("2d");
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.lineWidth = 3;

      context.current = ctx;
      canvas.current = can;
    }
  }

  //  useEffect(()=>{
  //    (async ()=>{
  //     const {status}= await Camera.requestCameraPermissionsAsync();
  //     await tf.ready();
  //     setModel(await cocoSsd.load())
  //    })();
  //  })

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TensorCamera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          cameraTextureHeight={textureDims.height}
          cameraTextureWidth={textureDims.width}
          resizeHeight={200}
          resizeWidth={152}
          resizeDepth={3}
          onReady={handleCameraStream}
          autorender={true}
          useCustomShadersToResize={false}
        />

        <Canvas style={styles.canvas} ref={handleCanvas} />
      </View>
      <View style={{ flexDirection: "row", flex: 0.25 }}>
        <TouchableOpacity
          style={styles.tchOpacexit}
          onPress={() => {
            handleVoice("Back");
          }}
          onLongPress={() => {
            handleVoice("Back to Assistance Screen");
            navigation.navigate("AssistanceScreen");
          }}
        >
          <Text style={styles.tchOpactxt}> Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 0.75,
    backgroundColor: "#fff",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  canvas: {
    position: "absolute",
    zIndex: 10000000,
    width: "100%",
    height: "100%",
  },
  tchOpacexit: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#7c7c7d",
    alignSelf: "center",
    marginTop: 15,
    borderRadius: 0,
    borderWidth: 5,
    height: 90,
    width: 360,
  },
  tchOpactxt: {
    color: "#333333",
    fontSize: 50,
    fontWeight: "900",
  },
  loadingContainer: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    alignItems: "center",
  },
  loadingTfContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  loadingModelContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});
