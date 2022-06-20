import React,{useState} from "react";
import { View , Text , TouchableOpacity, ActivityIndicator, TextInput, StyleSheet,Image} from "react-native"
import auth from '@react-native-firebase/auth';

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const loginUser = () => {
        setLoading(true)
        auth().signInWithEmailAndPassword(email, password)

        .then(respone =>{
            setLoading(false)
            console.log(respone,"LOGINNN");
            setEmail("")
            setPassword("")
        })
        .catch(errr =>{
            setLoading(false)
            alert(errr.message)
            console.log(errr,"ERRRRRRRRRR");
        })
    }


    const renderButton = () => {
        if (loading == true){
            return(
                <ActivityIndicator
                size="large"
                color="black"
                />
            )
        }
        else {
            return(
                <TouchableOpacity style={styles.tchOpac}
                onPress={loginUser}
                >
                <Text style={styles.tchOpactxt}>
                    Login
                </Text>
            </TouchableOpacity>
            )
        }
    }
console.log("PROPSS>>",props);
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
            style={styles.inputtxt}
            placeholder="Email Address"
            placeholderTextColor="black"
            value={email}
            onChangeText={(main)=>setEmail(main)}
            />
        </View>
        <View style={styles.inputView}>
            <TextInput
            style={styles.inputtxt}
            placeholder="Password"
            placeholderTextColor="black"
            secureTextEntry
            value={password}
            onChangeText={(main)=>setPassword(main)}
            />
        </View>

        <TouchableOpacity 
        onPress={()=>props.navigation.navigate("SignUp")}
        >
            <Text style={{textAlign:"center", marginTop:10, color:"black"  ,marginTop:20,marginBottom:15 ,fontSize: 20,}}>
                Dont Have Account? SignUp
            </Text>
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={()=>props.navigation.navigate("ForgotPassword")}
        >
            <Text style={{textAlign:"center", marginTop:10, color:"black" ,marginTop:20,marginBottom:15 ,fontSize: 20,}}>
                Forgot Password
            </Text>
        </TouchableOpacity>

            {renderButton()}
            
        </View>

        <View style={styles.footView}>
            <Text style={styles.foottxt}> 
                All Rights Copy & Reserved @2021
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


export default Login