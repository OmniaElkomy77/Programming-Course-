import * as React from 'react';
import {Text, View, StyleSheet, StatusBar, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNExitApp from 'react-native-exit-app';
import DeviceInfo from 'react-native-device-info';

export default class SwitchControle extends React.Component {
  componentDidMount = async () => {
    var SwitchNavigation = await AsyncStorage.getItem('switch');
    // alert(SwitchNavigation)
    DeviceInfo.getCarrier().then((carrier) => {
      let SIMCard = carrier.toLowerCase();
      if (
        SIMCard.includes('vodafone') ||
        SIMCard.includes('orange') ||
        SIMCard.includes('we') ||
        SIMCard.includes('etisalat') ||
        SIMCard.includes('mobinil') ||
        SIMCard == ''
      ) {
        if (SwitchNavigation != null || SwitchNavigation != undefined) {
          if (SwitchNavigation == 'Auth') {
            this.props.navigation.navigate('Auth');
          } else if (SwitchNavigation == 'Home') {
            this.props.navigation.navigate('HomePages');
          } else if (SwitchNavigation == 'Pending') {
            this.props.navigation.navigate('PendingStack');
          }
        } else {
          this.props.navigation.navigate('Auth');

          // this.props.navigation.navigate('IntroSlider');
        }
      } else {
        RNExitApp.exitApp();
      }
    });
  };

  render() {
    return (
      // <View />
      <View
        style={{
          backgroundColor: '#fff',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <StatusBar backgroundColor="#fff" />

        {/* <Image
          source={images.logo}
          style={{width: '95%', height: 400, resizeMode: 'contain'}}
        /> */}
      </View>
    );
  }
}
