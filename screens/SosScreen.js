
import React, {useState} from 'react';
import {SafeAreaView,StyleSheet,View,Text,TouchableOpacity,TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SendSMS from 'react-native-sms';


export default function  SosScreen ({ navigation,route }) {


  const [mobileNumber, setMobileNumber] = useState();
  const [bodySMS, setBodySMS] = useState();

   firestore()
    .collection('users')
    .doc(route.params?.email)
    .get()
    .then(documentSnapshot => {
      console.log('User exists: ', documentSnapshot.exists);
      if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          var userdata=documentSnapshot.data();
          setMobileNumber(userdata.phonenumber);
          setBodySMS("Help Call Me");      }
    });

  const initiateSMS = () => {
   
    SendSMS.send(
      {
        // Message body
        body: bodySMS,
        // Recipients Number
        recipients: [mobileNumber],
        // An array of types 
        // "completed" response when using android
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true
      },
      (completed, cancelled, error) => {
        if (completed) {
          console.log('SMS Sent Completed');
        } else if (cancelled) {
          console.log('SMS Sent Cancelled');
        } else if (error) {
          console.log('Some error occured');
        }
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

        <Text style={styles.titleText}>
          Example to Send Text SMS on Button Click in React Native
        </Text>
        
        <Text style={styles.titleTextsmall}>
          Enter Mobile Number
        </Text>
        
        <TextInput
          value={mobileNumber}
          placeholder={'Enter Contact Number to Call'}
          keyboardType="numeric"
          style={styles.textInput}
        />
      
        
        <Text style={styles.titleTextsmall}>
          Enter SMS body
        </Text>
        
        <TextInput
          value={bodySMS}
          onChangeText={(bodySMS) => setBodySMS(bodySMS)}
          placeholder={'Enter SMS body'}
          style={styles.textInput}
        />
        
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={initiateSMS}>
          <Text style={styles.buttonTextStyle}>
            Send Message
          </Text>
        </TouchableOpacity>
      
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  titleTextsmall: {
    marginVertical: 8,
    fontSize: 16,
  },
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#8ad24e',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
});