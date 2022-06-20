import React from 'react';
import ForgotPassword from '../authentication/ForgotPassword';
import Login from '../authentication/Login';
import SignUp from '../authentication/Signup';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthStack= () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} 
      // options={{
      //   headerShown:false
      // }}
      />
      <Stack.Screen name="SignUp" component={SignUp} 
      //  options={{
     //   headerShown:false
     // }}
      />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} 
      //   options={{
    //     headerShown:false
    // }}
      />

    </Stack.Navigator>
  );
}

export default AuthStack