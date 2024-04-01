import * as React from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  Image,
  Animated,
  Platform,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { Toast } from 'native-base';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import { images, SIZES, COLORS, FONTS, AppRequired } from '../../constants';
const ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width * 0.72 : SIZES.width * 0.74;
const EMPTY_ITEM_SIZE = (SIZES.width - ITEM_SIZE) / 2;
class SelectSubject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollX: new Animated.Value(0),
      loading: true,
      Subjects: [],
      openLogoutModal: false,
      checkLogoutLoading: false,
      visableSubscribeModal: false,
      selectedItem: {},
      selectedItemIndex: 0,
      subCode: '',
      requestLoading: false,
    };
  }

  async componentDidMount() {
    this.selectSub();

  }
  async selectSub() {
    const allData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      generation_id: allData.student_collection_id,
      student_id: allData.student_id,
    };

    axios
      .post(AppRequired.Domain + 'select_subject.php', data_to_send)
      .then((res) => {
        // console.log(res.data)
        if (res.status == 200) {
          if (Array.isArray(res.data.subject)) {
            if (res.data.subject.length == 0) {
              this.setState({
                Subjects: [],
              });
            } else {
              let mainData = res.data.subject;

              let newMainData = [{ name: '' }, ...mainData, { name: '' }];
              this.setState({
                Subjects: newMainData,
              });
            }
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'الرجاء المحاولة فى وقت لاحق',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  async Logout() {
    this.setState({
      checkLogoutLoading: true,
    });
    let data = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      student_id: data.student_id,
    };
    axios
      .post(AppRequired.Domain + 'student_logout.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {

          if (res.data == 'success') {
            this.setData();
            this.props.navigation.navigate('Auth');
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجي المحاوله في وقتا لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
            this.setState({
              checkLogoutLoading: false,
            });
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجي المحاوله في وقتا لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          this.setState({
            checkLogoutLoading: false,
          });
        }
      });
  }
  async setData() {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('switch', 'Auth');
  }

  async chareSubject() {
    let AllData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      subject_id: this.state.selectedItem.subject_id,
      student_id: AllData.student_id,
      code: this.state.subCode.trim(),
    };

    if (this.state.subCode.trim() == '') {
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة الكود الخاص بشحن المادة',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (this.state.subCode.trim().length != 14) {
      ToastAndroid.showWithGravityAndOffset(
        'يجب ان يتكون كود الشحن من 14 رقم',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (this.state.subCode * 0 != 0) {
      ToastAndroid.showWithGravityAndOffset(
        'يجب ان يتكون كود الشحن من ارقام',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    this.setState({
      requestLoading: true,
    });

    axios
      .post(AppRequired.Domain + 'sub_in_subject.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            let allData = this.state.Subjects;
            allData[this.state.selectedItemIndex].subscribed = '1';
            this.setState({
              Subjects: allData,
            });

            Toast.show({
              text: 'تم الاشتراك فى المادة بنجاح',
              buttonText: 'Okay',
              type: 'success',
              buttonTextStyle: { color: '#008000' },
              buttonStyle: { backgroundColor: '#5cb85c' },
            });
          } else if (res.data == 'used_code') {
            ToastAndroid.showWithGravity(
              'تم شحن الكارت من قبل',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
          } else if (res.data == 'invalid_code') {
            ToastAndroid.showWithGravityAndOffset(
              'الكود الذى ادخلتة غير صحيح',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'عفواً حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عفواً حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          visableSubscribeModal: false,
          requestLoading: false,
          subCode: '',
        });
      });
  }

  renderSubjects = () => {
    const { scrollX } = this.state;
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={this.state.Subjects}

          keyExtractor={(_, index) => index.toString()}
          horizontal
          bounces={false}
          decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
          contentContainerStyle={{ alignItems: 'center' }}
          snapToInterval={ITEM_SIZE}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={images.empty}
                  style={{
                    width: 200,
                    height: 200,
                    marginRight: SIZES.width * 0.25,
                  }}
                  resizeMode="center"
                />
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 22,
                    marginRight: SIZES.width * 0.25,
                  }}>
                  لا توجد اى بيانات حتى الأن
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      openLogoutModal: true,
                    });
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.primary,
                    padding: 7,
                    borderRadius: 7,
                    marginRight: SIZES.width * 0.25,
                    marginVertical: 10,
                  }}>
                  <Text style={{ fontFamily: FONTS.fontFamily, fontSize: 20 }}>
                    تسجيل الخروج...
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          snapToAlignment="center"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            if (!item.subject_photo) {
              return <View style={{ width: EMPTY_ITEM_SIZE }} />;
            }
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
            ];

            const translateY = this.state.scrollX.interpolate({
              inputRange: inputRange,

              outputRange: [50, 50, 50],

              extrapolate: 'clamp',
            });

            return (
              <>
                <View style={{ width: SIZES.width * 0.74 }}>

                  <Animated.View
                    style={{
                      marginHorizontal: 10,
                      padding: 10 * 2,
                      alignItems: 'center',
                      transform: [{ translateY }],
                      backgroundColor: 'white',
                      borderRadius: 34,
                      elevation: 5,
                    }}>
                    <Image
                      source={images.logo_app}

                      style={styles.posterImage}
                    />
                    <Text
                      style={{ fontSize: 20, fontFamily: FONTS.fontFamily }}
                      numberOfLines={1}>
                      {item.subject_name}
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        if (item.subscribed == '1') {
                          this.props.navigation.navigate('MainPage');

                          await AsyncStorage.setItem(
                            'drInfo',
                            JSON.stringify(item),
                          );
                        } else {
                          this.setState({
                            visableSubscribeModal: true,
                            selectedItem: item,
                            selectedItemIndex: index,
                          });
                        }
                      }}
                      style={{
                        width: '50%',
                        height: '10%',
                        borderRadius: 8,
                        padding: 8,
                        backgroundColor: COLORS.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{ color: '#fff', fontFamily: FONTS.fontFamily }}>
                        دخول
                      </Text>
                    </TouchableOpacity>




                  </Animated.View>




                </View>






              </>
            );
          }}
        />
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} />
        <View>
          <LinearGradient

            useAngle={true}
            angle={180}
            angleCenter={{ x: 0.5, y: 0.8 }}
            colors={[COLORS.primary, COLORS.secondary, COLORS.primary]}
            style={{
              height: '100%',
            }}>
            {this.state.loading
              ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={images.mainLoading}
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    resizeMode="contain"
                  />
                </View>
              ) : this.renderSubjects()
            }

            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 10,
                width: 100,
                height: 70,
                backgroundColor: '#fff',
                alignSelf: 'center',
                borderRadius: 10
              }}
              onPress={() => {
                this.setState({
                  openLogoutModal: true,
                });
              }}>
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  color: COLORS.primary,
                  fontSize: 20,
                }}>
                خروج
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          <Modal
            visible={this.state.openLogoutModal}
            onRequestClose={() => {
              this.setState({
                openLogoutModal: false,
              });
            }}
            transparent={true}>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  width: '90%',
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
                    {AppRequired.appName}
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
                      color: COLORS.primary,
                      fontSize: 17,
                      textAlign: 'center',
                    }}>
                    هل تريد تسجيل الخروج ؟
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
                    marginTop: 7,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderRightColor: '#ddd',
                    }}
                    onPress={() => {
                      this.Logout();
                      this.setState({
                        openLogoutModal: false,
                      });
                    }}>
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        color: COLORS.primary,
                        fontSize: 20,
                      }}>
                      خروج
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderLeftWidth: 1,
                      borderLeftColor: '#ddd',
                    }}
                    onPress={() => {
                      this.setState({
                        openLogoutModal: false,
                      });
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
          <Modal visible={this.state.checkLogoutLoading} transparent={true}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          </Modal>

          <Modal
            visible={this.state.visableSubscribeModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              this.setState({
                visableSubscribeModal: false,
              });
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  paddingVertical: 20,
                  backgroundColor: '#fff',
                  marginHorizontal: 20,
                  borderRadius: 10,
                  width: '90%',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: FONTS.fontFamily,
                      marginLeft: 10,
                    }}>
                    يجب الاشتراك اولاً فى الكورس
                  </Text>

                  <TextInput
                    autoFocus={true}
                    theme={{
                      colors: {
                        primary: COLORS.primary,
                        underlineColor: 'transparent',
                      },
                    }}
                    value={this.state.subCode}
                    label={'كود الشحن'}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                      this.setState({
                        subCode: text,
                      });
                    }}
                    autoCorrect={false}
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      margin: '5%',
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    disabled={this.state.requestLoading}
                    onPress={() => {
                      this.chareSubject();
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.secondary,
                      width: '35%',
                      height: 50,
                      padding: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}>
                    {this.state.requestLoading ? (
                      <ActivityIndicator color="#fff" size={18} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: FONTS.fontFamily,
                          color: '#fff',
                        }}>
                        شحن
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={this.state.requestLoading}
                    onPress={() => {
                      this.setState({
                        visableSubscribeModal: false,
                        subCode: '',
                      });
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'red',
                      width: '35%',
                      height: 50,

                      padding: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: FONTS.fontFamily,
                        color: '#fff',
                      }}>
                      إلغاء
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});
export default SelectSubject;
