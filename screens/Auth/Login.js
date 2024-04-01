import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  StyleSheet,
  StatusBar,
  ActivityIndicator
} from 'react-native';
// import { Container, Header, ActivityIndicator } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
// import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Hoshi } from 'react-native-textinput-effects';
// import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { COLORS, AppRequired, FONTS, images, SIZES } from '../../constants';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      icon: false,
      secure: true,
      emailerr: '',
      passerr: '',
      connection_Status: 'Offline',
      loading: false,
      bottomConnectionMsg: new Animated.Value(-100),
      loggedModal: false,
      resMassage: '',
    };
    // this._subscription;
  }
  componentWillUnmount() {
    // this._subscription && this._subscription();
  }

  componentDidMount() {
    // this.checkPermission();

    // this._subscription = NetInfo.addEventListener(
    //   this._handelConnectionInfoChange,
    // );
  }

  // async checkPermission() {
  //   // const enabled = await firebase.messaging().hasPermission();
  //   // If Premission granted proceed towards token fetch
  //   if (enabled) {
  //     this.getToken();
  //   } else {
  //     // If permission hasn’t been granted to our app, request user in requestPermission method.
  //     this.requestPermission();
  //   }
  // }
  // async getToken() {
  //   let fcmToken = await AsyncStorage.getItem('fcmToken');
  //   if (!fcmToken) {
  //     // fcmToken = await firebase.messaging().getToken();
  //     if (fcmToken) {
  //       // user has a device token
  //       await AsyncStorage.setItem('fcmToken', fcmToken);
  //     }
  //   }
  // }

  // async requestPermission() {
  //   try {
  //     // await firebase.messaging().requestPermission();
  //     // User has authorised
  //     this.getToken();
  //   } catch (error) {
  //     // User has rejected permissions
  //     console.log('permission rejected');
  //   }
  // }

  // _handelConnectionInfoChange = (NetInfoState) => {
  //   if (NetInfoState.isConnected == true) {
  //     this.setState(({ }) => ({
  //       connection_Status: 'Online',
  //     }));
  //     Animated.spring(this.state.bottomConnectionMsg, {
  //       toValue: -100,
  //     }).start();
  //   } else {
  //     this.setState(({ }) => ({
  //       connection_Status: 'offline',
  //     }));
  //     Animated.spring(this.state.bottomConnectionMsg, { toValue: 0 }).start();
  //   }
  // };



  setData = async (data, status) => {
    await AsyncStorage.setItem('AllData', JSON.stringify(data));

    let credentials = {
      email: this.state.email,
      password: this.state.password,
    };

    await AsyncStorage.setItem('credentials', JSON.stringify(credentials));

    if (status == 'Home') {
      await AsyncStorage.setItem('switch', 'Home');
    }
  };

  // validate = (text) => {
  //   let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  //   if (reg.test(text) === false) {
  //     this.setState({email: text});
  //     return false;
  //   } else {
  //     this.setState({email: text});
  //     return true;
  //   }
  // };

  validate = (text) => {
    let arr = text.split('@');
    let init_text = arr[0] + '';
    init_text = init_text.replace(/\./g, '');
    text = init_text + '@' + arr[1];
    let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;

    if (reg.test(text) === false) {
      // this.setState({email: text});
      return false;
    } else {
      // this.setState({email: text});
      return true;
    }
  };
  checkbutton() {
    let error = 0;
    if (this.validate(this.state.email.trim())) {
      this.setState({ emailerr: '' });
    } else {
      error++;
      this.setState({ emailerr: 'ادخل بريد الكتروني صحيح' });
    }

    if (this.state.password.trim() == '') {
      error++;
      this.setState({ passerr: ' يجب ادخال كلمه المرور ' });
    } else {
      this.setState({ passerr: '' });
    }

    if (error === 0) {
      this.signin();
    }
  }

  signin = async () => {
    // let uniqueId = DeviceInfo.getUniqueId();
    // let student_token = await AsyncStorage.getItem('fcmToken');

    let data_to_send = {
      email: this.state.email.trim(),
      password: this.state.password,
      // mac: uniqueId,
      // student_token,
    };
    console.log(data_to_send)
    this.setState({ loading: true });
    // if (this.state.connection_Status == 'Online') {
    axios
      .post("https://programmingcourses1231.000webhostapp.com/Programming_Courses/student_new_login.php", data_to_send)
      .then((res) => {
        this.setState({ loading: false });
        // console.log((res.data));
        if (res.status == 200) {
          // console.log((res.data));
          if (res.data == 'not_authorized') {
            this.setState({
              loggedModal: true,
              resMassage: 'البريد الالكتروني او كلمه المرور غير صحيحه',
            });
          } else if (res.data == 'error') {
            this.setState({
              loggedModal: true,
              resMassage: 'عذرا يرجي المحاوله في وقت لاحق',
            });
          }
          // else if (res.data == 'logged') {
          //   // this.setData(res.data, 'Home');
          //   //   this.props.navigation.navigate('HomePages');
          //   this.setState({
          //     loggedModal: true,
          //     resMassage:
          //       'هذا الحساب قيد نشط على هاتف اخر لايمكنك تسجيل الدخول فى الوقت الحالى',
          //   });
          // }
          // else if (res.data == 'another_mac') {
          //   this.setState({
          //     loggedModal: true,
          //     resMassage:
          //       'الرجاء الدخول من خلال الجهاز الذى قمت بالتسجيل بة عند إنشاء الحساب لأول مرة',
          //   });
          // }
          else {
            this.setData(res.data, 'Home');
            this.props.navigation.navigate('HomePages');
          }
        } else {
          this.setState({
            loggedModal: true,
            resMassage: 'عذرا يرجي المحاوله في وقت لاحق',
          });
        }
        this.setState({ loading: false });
      });

    // } else {
    //   this.setState({ loading: false });
    //   this.setState({
    //     loggedModal: true,
    //     resMassage: 'من فضلك تحقق من اتصالك بالأنترنت',
    //   });
    // }
  };

  render() {
    return (
      <>
        <StatusBar backgroundColor={COLORS.secondary} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              backgroundColor: COLORS.primary,
              position: 'absolute',
              right: 10,
              top: -50,
            }}></View>
          <View
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              backgroundColor: COLORS.secondary,
              position: 'absolute',
              right: -45,
              top: -25,
              //   alignContent: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 60,
                // backgroundColor: 'yellow',
                marginLeft: 30,
              }}>
              {/* <Image
                // source={require('./logocamp.jpg')}
                source={images.AppLogo}
                // resizeMode="contain"
                style={{
                  width: null,
                  height: null,
                  flex: 1,
                  // borderRadius: 120 / 2,
                }}
              /> */}
            </View>
          </View>
          {/* -----------------project_name--------------- */}
          <View
            style={{
              width: '90%',
              marginHorizontal: '5%',
              marginTop: 220,
              paddingLeft: 10,
            }}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 20,
                color: COLORS.fontColor,
              }}>
              {/* {Programming Course}
               */}
              Programming Course
            </Text>
          </View>
          {/* ------------------Textinput----------------- */}
          <View
            style={{
              width: '90%',
              marginTop: 20,
              marginHorizontal: '5%',
              //   backgroundColor: 'yellow',
            }}>
            {/* --email-- */}
            <View
              style={{
                width: '100%',
                height: 60,
                marginBottom: 15,
              }}>
              <Hoshi
                label={'البريد الإلكترونى'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                borderColor={COLORS.primary}
                style={{
                  width: '100%',
                  paddingLeft: 15,
                }}
                borderHeight={0.85}
                labelStyle={{
                  color: '#C9CCCC',
                }}
                inputStyle={{
                  color: '#000',
                  textAlign: 'right',
                  fontFamily: FONTS.fontFamily,
                }}
                value={this.state.email}
                onChangeText={(value) => {
                  this.setState({ email: value });
                }}
              />
            </View>
            {this.state.emailerr != '' ? (
              <Text
                style={{
                  textAlign: 'center',
                  color: 'red',
                  fontSize: 14,
                  // fontWeight: '800',
                  fontFamily: FONTS.fontFamily,
                }}>
                {this.state.emailerr}
              </Text>
            ) : null}
            {/* --pass-- */}
            <View
              style={{
                width: '100%',
                height: 60,
                marginBottom: 15,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: '100%',
                  //   backgroundColor: 'yellow',
                  justifyContent: 'center',
                }}>
                <Hoshi
                  label={'كلمه المرور'}
                  borderColor={COLORS.primary}
                  style={{
                    width: '100%',
                  }}
                  borderHeight={0.85}
                  labelStyle={{
                    color: '#C9CCCC',
                  }}
                  inputStyle={{
                    color: '#000',
                    textAlign: 'right',
                    paddingRight: 60,
                    fontFamily: FONTS.fontFamily,
                  }}
                  secureTextEntry={!this.state.icon}
                  value={this.state.password}
                  onChangeText={(value) => {
                    this.setState({ password: value });
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  let x = this.state.icon;
                  this.setState({ icon: !x });
                }}
                style={{
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  marginBottom: -2,
                }}>
                <Icon name={this.state.icon ? 'eye' : 'eye-slash'} size={20} />
              </TouchableOpacity>
            </View>
            {this.state.passerr != '' ? (
              <Text
                style={{
                  textAlign: 'center',
                  color: 'red',
                  fontSize: 14,
                  fontFamily: FONTS.fontFamily, // fontFamily: fontFamily,
                }}>
                {this.state.passerr}
              </Text>
            ) : null}
          </View>
          {/* ---------------------forgetpass------------------- */}
          {/* <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ForgetPassword')}
            style={{ marginLeft: '10%', marginTop: '5%' }}>
            <Text
              style={{ fontFamily: FONTS.fontFamily, color: COLORS.fontColor }}>
              هل نسيت كلمة المرور؟
            </Text>
          </TouchableOpacity> */}
          {/* -----------------------press_to_log--------------------------- */}
          <TouchableOpacity
            onPress={() => {
              this.checkbutton();
            }}
            style={{
              width: '90%',
              height: 60,
              marginHorizontal: '5%',
              backgroundColor: COLORS.primary,
              borderRadius: 30,
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.state.loading == true ? (
              <ActivityIndicator color="#fff" size={40} />
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  color: '#FFFFFF',
                  fontFamily: FONTS.fontFamily, // fontFamily: fontFamily,
                }}>
                دخول
              </Text>
            )}
          </TouchableOpacity>
          {/* -------------new_user------------------ */}
          <View
            style={{
              width: '100%',
              height: SIZES.height * 0.1,
              // backgroundColor: "blue",
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <TouchableOpacity
              disabled={this.state.loading}
              onPress={() => {
                this.props.navigation.navigate('Signup');
              }}
              style={{
                width: '85%',
                height: SIZES.height * 0.07,
                borderWidth: 1,
                borderColor: COLORS.primary,
                backgroundColor: '#f7f7f7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: COLORS.primary,
                  fontFamily: FONTS.fontFamily,
                }}>
                إنشاء حساب
              </Text>
            </TouchableOpacity>
          </View>
          {/* -------------------------- */}
          <View style={{ width: '100%', height: 50 }}></View>
        </ScrollView>
        <Modal
          visible={this.state.loggedModal}
          onRequestClose={() => {
            this.setState({ loggedModal: false });
          }}
          transparent={true}>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                width: SIZES.width * 0.9,
                padding: 10,
                backgroundColor: '#fff',
                elevation: 22,
                borderRadius: 15,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: COLORS.primary,
                    fontSize: 22,
                  }}>
                  Programming Course
                </Text>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  borderWidth: 1.5,
                  borderColor: '#ddd',
                }}
              />

              <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: COLORS.fontColor,
                    fontSize: 17,
                    textAlign: 'center',
                  }}>
                  {this.state.resMassage}
                </Text>
              </View>

              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  borderWidth: 1.5,
                  borderColor: '#ddd',
                }}
              />

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 7,
                }}>
                <TouchableOpacity
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => {
                    this.setState({ loggedModal: false });
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 20,
                    }}>
                    إلغاء
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالأنترنت" /> */}
      </>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    width: '90%',
    margin: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  textTitleStyle: {
    fontSize: 40,
    // fontFamily: fontFamily,
    fontWeight: '600',
  },
  inputContainerView: {
    width: '90%',
    margin: '5%',
  },
  ConnectionView: {
    width: '100%',
    height: 20,
    position: 'absolute',
    zIndex: 222,
    backgroundColor: '#492E41',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
