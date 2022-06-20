import React,{useState, useEffect,useRef } from "react";
import { View , Text , TouchableOpacity, ActivityIndicator, TextInput, StyleSheet,Image} from "react-native"
import firestore from '@react-native-firebase/firestore';
import PhoneInput from "react-native-phone-number-input";
import Tts from 'react-native-tts';

export default function UpdateScreen({ navigation,route }) {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [ecName, setECname] = useState("")    
    const [oldphoneNumber, setOldPhoneNumber] = useState("")
    const [oldecName, setOldECname] = useState("")
    const [loading, setLoading] = useState(false)
    // const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    // const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef<PhoneInput>(null)
    const checkValidPhone = () =>{
        const checkValid = phoneInput.current?.isValidNumber();
        setValid(checkValid ? checkValid : false);
    }
    Tts.setDefaultLanguage('en-US');
    Tts.setDucking(true);
    const handleVoice=ttsText=>{
      Tts.speak(ttsText);
    };
    firestore()
    .collection('users')
    .doc(route.params?.email)
    .get()
    .then(documentSnapshot => {     
      if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          var userdata = documentSnapshot.data();
          setOldPhoneNumber(userdata.phonenumber)
          setOldECname(userdata.ecname)
          setLoading(false)
            }
    })
    .catch(errr =>{
     
      alert(errr.message)
      console.log(errr,"ERRRRRRRR");
  })
    
  
    const updateContact = () =>{
        if(route.params?.email){
        setLoading(true)
        firestore()
        .collection('users')
        .doc(route.params?.email)
        .set({
            email: route.params?.email,
            ecname: ecName,
            phonenumber:phoneNumber,
        })
        .then(() => {
            console.log('User added!');
            setPhoneNumber(""),
            setECname(""),
            setOldPhoneNumber(""),
            setOldECname(""),
            setLoading(true)
            {navigation.navigate("UpdateScreen")}
              
  })
  .catch(errr =>{
    setLoading(false)
    alert(errr.message)
    console.log(errr,"ERRRRRRRR");
})
}
else{
    setLoading(false)
    console.log("User Doesnot Exist")
}     
    }

    const renderButton = () =>{
        if (loading == true){
            return(
                <ActivityIndicator 
                size="large"
                color="black"
                />
            )
        }
        else{
            return(
                <TouchableOpacity style={styles.tchOpac}
                 onPress={updateContact}
            >
                <Text style={styles.tchOpactxt}>
                    Update
                </Text>
            </TouchableOpacity>
            )
        }
    }

    return(
        <View style={styles.mainView}>
             
            <View style={styles.headView}>
                <TouchableOpacity style={{height:24,width:110}}>
                    <Image source={require('../assets/VisionAI_Logo.png')} style={styles.imagelogo} />
                </TouchableOpacity>
            </View>
        
        <View style={styles.bodyView}>
        
        <View style={styles.inputView}>
            <TextInput
            style={{ fontSize: 15,marginLeft:10,color:'grey'}}
            value={oldecName}   
            editable={false} 
            selectTextOnFocus={false}
            />
            <Text style={{fontWeight:'bold',paddingTop:10,fontSize:10}}>Old Contact Name</Text>
        </View>

        <View style={styles.inputView}>
            <TextInput
            style={{ fontSize: 15,marginLeft:10,color:'grey'}}
            value={oldphoneNumber}   
            editable={false} selectTextOnFocus={false}
            />
            <Text style={{fontWeight:'bold',paddingTop:10,fontSize:10}}>Old Contact Number</Text>
        </View>

        <View style={styles.inputView}>
            <TextInput
            placeholder="Person Name"
            placeholderTextColor="black"
            style={styles.inputtxt}
            value={ecName}
            onChangeText={(main)=>setECname(main)}
            />
            <Text style={{fontWeight:'bold',paddingTop:10,fontSize:10}}>New Contact Name</Text>
        </View>

        <View style={{marginHorizontal:25,marginTop:40,justifyContent:'flex-start'}}>
        <PhoneInput
            placeholder=" Contact Number"
            useRef={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="PK"
            keyboardType="numeric"
            onChangeFormattedText={(text) => {
                setPhoneNumber(text);
            }}
            withDarkTheme
            withShadow
            
          />         
          <Text style={{fontWeight:'bold',paddingTop:10,fontSize:10}}>New Contact Number</Text>
        </View>

        {renderButton()}

        <View style={{flexDirection:'row'}}> 
         <TouchableOpacity 
           style={styles.tchOpacexit}
           onPress={()=>{handleVoice('Back')}}
           onLongPress={()=>{handleVoice('Back to Home Screen'); navigation.navigate('HomeScreen'); }}   
         > 
           <Text style={styles.tchOpactxt}> Back</Text>
         </TouchableOpacity>
       </View>
        </View>
        <View style={styles.footView}>
            <Text style={styles.foottxt}> 
                All Rights Copy & Reserved @2022
            </Text>
       </View>
    </View>
    )
}

const styles=StyleSheet.create({
    mainView:{
        flex:1
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
        height:90,
        width:360,
        
      },
      tchOpactxt:{
        color:'#333333',
        fontSize: 30,
        fontWeight:"900"
      },
    footView:{
        flex:0.05,
        backgroundColor:'#8c93a1',
        justifyContent:'center',
        alignItems:'center'
      },
      headView:{
        flex:0.07,
        backgroundColor:'#8c93a1',
        justifyContent:'center'
      },

    signuptxt:{
        color:"#f7f7f7",
        fontSize:25
},
    bodyView:{
        
            flex:0.90,
            backgroundColor:'#ebebeb',
            justifyContent:'center',
            alignItems:'center'  
},

    inputView:{  
        height:40,
        width:350,
        borderBottomWidth:2,
        marginHorizontal:25,
        marginTop:30
},
    inputtxt:{
        fontSize: 15,
        marginLeft:10,
        
},
    imagelogo: {
        resizeMode: 'stretch',
        width:130,
        height:50,
        justifyContent:'center',
        alignItems:'center'
 },
 tchOpacexit:{
    justifyContent:'center',
    alignItems:'center',
    borderColor:'#7c7c7d',
    alignSelf:'center',
    marginTop:15,
    borderRadius: 0,
    borderWidth:5,
    height:60,
    width:360,
  },
});