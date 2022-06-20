import 'react-native-gesture-handler';
import React, { useEffect, useState,ActivityIndicator} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Loader from './src/components/Loader';
import AppStack from "./src/stack/AppStack"
import AuthStack from "./src/stack/AuthStack"
import auth from '@react-native-firebase/auth';
import SplashScreen from './screens/SplashScreen';

function App() {

const [component, setComponent]= useState(<SplashScreen />)

useEffect(()=>{
  if(component!==null)
  {
    setTimeout(() =>{
      auth().onAuthStateChanged(user =>{
        if(user){
         email=user.email;
          setComponent(<AppStack useremail = {email}/>)
        }
    
        else{
          setComponent(<AuthStack/>)
        }
      })
      },3000);
  }
  else{
  setComponent(<SplashScreen />)
}
},[])  


  return (

    <NavigationContainer>
    {component}
  </NavigationContainer>

  );
}

export default App;
