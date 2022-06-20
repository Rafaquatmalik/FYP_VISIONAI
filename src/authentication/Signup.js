import React,{useState, useEffect,useRef } from "react";
import { View , Text , TouchableOpacity, ActivityIndicator, TextInput, StyleSheet,Image} from "react-native"
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import PhoneInput from "react-native-phone-number-input";


const SignUp = (props) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [ecName, setECname] = useState("")
    const [loading, setLoading] = useState(false)
    // const [value, setValue] = useState("");
    const [valid, setValid] = useState(false);
    // const [showMessage, setShowMessage] = useState(false);
    const phoneInput = useRef<PhoneInput>(null)
    const checkValidPhone = () =>{
        const checkValid = phoneInput.current?.isValidNumber();
        setValid(checkValid ? checkValid : false);
    }
    const signUpUser = () =>{
        setLoading(true)
        auth().createUserWithEmailAndPassword(email, password)
        
        .then(() =>{  
            const ref =firestore().collection('users')
            if(phoneNumber === ''){
                alert('Phone Number is required.')
               } 
            else {  
                var doc=ref.doc(email).set({
                    email: email,
                    ecname: ecName,
                    phonenumber:phoneNumber,
                })
                
                .then((res) => {
                    setEmail(""),
                    setPassword("")
                    setPhoneNumber(""),
                    setECname(""),
                    setLoading(false)
              
                })
                .catch((err) => {
                  console.error("Error occured: ", err);
                  setLoading("false");
                });
              }
        })

        .catch(errr =>{
            setLoading(false)
            alert(errr.message)
            console.log(errr,"ERRRRRRRR");
        })
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
                 onPress={signUpUser}
            >
                <Text style={styles.tchOpactxt}>
                    Sign Up
                </Text>
            </TouchableOpacity>
            )
        }
    }

    return(
        <View style={styles.mainView}>
             
            <View style={styles.headView}>
                <TouchableOpacity style={{height:24,width:110}}>
                    <Image source={require('../../assets/VisionAI_Logo.png')} style={styles.imagelogo} />
                </TouchableOpacity>
            </View>
        
        <View style={styles.bodyView}>

        <View style={styles.inputView}>
            <TextInput
            placeholder="Email Address"
            placeholderTextColor="black"
            style={styles.inputtxt}
            value={email}
            onChangeText={(main)=>setEmail(main)}
            />
        </View>

        <View style={styles.inputView}>
            <TextInput
            placeholder="Password"
            placeholderTextColor="black"
            style={styles.inputtxt}
            secureTextEntry
            value={password}
            onChangeText={(main)=>setPassword(main)}
            />
        </View>
        <View style={{  marginHorizontal:25,
        marginTop:30}}>
        <PhoneInput
            placeholder="Emergency Contact Number"
            useRef={phoneInput}
            defaultValue={phoneNumber}
            defaultCode="PK"
            keyboardType="numeric"
            onChangeFormattedText={(text) => {
                setPhoneNumber(text);
            }}
            withDarkTheme
            withShadow
            autoFocus
          />
         
        </View>

        <View style={styles.inputView}>
            <TextInput
            placeholder="Emergeny Contact Person Name"
            placeholderTextColor="black"
            style={styles.inputtxt}
            value={ecName}
            onChangeText={(main)=>setECname(main)}
            />
        </View>

        <TouchableOpacity  onPress={()=>props.navigation.navigate("Login")} >
            <Text style={{textAlign:"center", marginTop:20,marginBottom:20 , color:"black",fontSize: 20,}}>
             Already Have Account? Login
            </Text>
        </TouchableOpacity>

            {renderButton()}
            
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
        height:120,
        width:360,
        
      },
      tchOpactxt:{
        color:'#333333',
        fontSize: 50,
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
        color:"black"
},
    imagelogo: {
        resizeMode: 'stretch',
        width:130,
        height:50,
        justifyContent:'center',
        alignItems:'center'
 },
});

export default SignUp