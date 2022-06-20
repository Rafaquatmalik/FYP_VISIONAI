import * as React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default class SplashScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.header}></View>
        <View style={styles.main}>
          <Image source={require('../assets/VisionAI_Logo.png')} style={styles.imagelogo} />
        </View>
        <View style={styles.footer}>
          <Image
            source={require('../assets/Sights_Logo.jpg')}
            style={styles.imgfooter}
          />
          <Text style={styles.txtfooter}>
            Copyright All Right Reserved 2021, Sights{' '}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 2
  },
  main: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagelogo: {
     resizeMode: 'stretch',
      width:300,
      height:170,
  },

  imgfooter: {
    width: 100,
    height: 25,
  },

  txtfooter: {
    color: '#000099',
    fontSize:11

  },
});