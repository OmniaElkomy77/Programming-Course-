import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  ImageBackground,
  Modal,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,


} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SearchBar } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';
import { AppRequired, COLORS, FONTS, images, SIZES } from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import ModalHome from 'react-native-modalbox';
const ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width * 0.72 + 40 : SIZES.width * 0.74 + 40;
export default class MainPage extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedItem: {},
      streamsOfMonth: [],
      loading: true,
      refreshing: false,
      search_type: '',

      end_sub: '',
      visableEndSub: false,
      subject_name: '',
      searchQuery: "",
      modalVisible: false,
      videos: [],
    };
  }
  async componentWillUnmount() {
    Orientation.lockToPortrait();
  }
  async CustomComponentDidMount() {
    this.getData();
    this.info()
  }

  info = async () => {
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

    let data_to_send = {
      generation_id: studentData.student_generation_id,
      student_id: studentData.student_id,
      subject_id: drInfo.subject_id,
    };

    axios
      .post(AppRequired.Domain + 'get_profile_info.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data != 'error') {
            if (Object.keys(res.data).length > 3) {
              this.setState({
                end_sub: res.data.end_date,
              });
              this.save_points(res.data);
            } else {
              this.setData();
              ToastAndroid.showWithGravityAndOffset(
                'قد تمت إزالتك',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25,
                50,
              );
              this.props.navigation.navigate('Auth');
            }
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجى المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
        this.setState({ loading: false });
      });
  };




  getData = async () => {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));
    this.setState({
      subject_name: drInfo.subject_name,
    });

    let data_to_send = {

      student_id: StudentData.student_id,
      subject_id: drInfo.subject_id,
    };

    axios
      .post("https://programmingcourses1231.000webhostapp.com/Programming_Courses/select_home.php", data_to_send)
      .then((res) => {
        if (res.status == 200) {

          if (res.data != "error") {

            let chainsArray = res.data.chains;
            for (let i = 0; i < chainsArray.length; i++) {
              chainsArray[i].show = true
            }


            this.setState({
              streamsOfMonth: chainsArray,
            });



          } else {
            this.setState({
              streamsOfMonth: [],
            });
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجى المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          this.setState({
            streamsOfMonth: [],
          });
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
          refreshing: false,
        });
      });
  };



  onChangeSearch = searchQuery => {
    let list = this.state.streamsOfMonth;
    for (let i = 0; i < list.length; i++) {
      if (
        list[i].chain_name.toLowerCase().includes(searchQuery.toLowerCase() || list[i].chain_name.toUpperCase().includes(searchQuery.toUpperCase()))
      ) {
        list[i].show = true


      } else {
        list[i].show = false
      }
    }

    if (searchQuery.length == 0) {

      for (let x = 0; x < list.length; x++) {
        list[x].show = true
      }
    }

    this.setState({ streamsOfMonth: list });
  };



















  underHeader = () => {
    return (
      <View>
        <SearchBar
          lightTheme
          placeholder=" اسم السلسله"
          onChangeText={query => {
            this.setState({ searchQuery: query });
            this.onChangeSearch(query);
          }}
          value={this.state.searchQuery}
          style={{ width: "90%", height: "100%" }}
        />

      </View>
    );
  };

  renderStreamsOfMonth = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.state.streamsOfMonth}
          snapToInterval={ITEM_SIZE}
          keyExtractor={(i, k) => k.toString()}
          bounces={false}
          contentContainerStyle={{
            alignItems: 'center',
            marginBottom: 100,
          }}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: SIZES.width,
                }}>
                <Image
                  source={images.empty}
                  style={{
                    width: 200,
                    height: 200,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                  }}>
                  لا توجد فيديوهات متاحه
                </Text>
              </View>
            );
          }}
          snapToAlignment="center"
          scrollEventThrottle={16}
          renderItem={({ index, item }) => {

            return (
              item.show == true ?
                <View
                  style={{
                    width: ITEM_SIZE,
                    marginVertical: 15,
                  }}>
                  <View
                    style={{
                      ...styles.item_of_month_stream,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        if (item.type == 'subscribed') {

                          this.setState({
                            videos: item.videos, modalVisible: true
                          })

                        } else {
                          this.setState({

                            selectedItem: item,
                          });
                        }
                      }}
                      style={{ flex: 1, }}>
                      <ImageBackground
                        source={{ uri: item.preview_photo }}
                        style={{
                          height: 200,
                          width: '100%',
                          alignItems: 'flex-end',
                        }}
                        resizeMode="cover">
                        <LinearGradient
                          start={{ x: 0.0, y: 0 }}
                          end={{ x: 0.1, y: 1.0 }}
                          locations={[0, 0.5, 0.8]}
                          useAngle={true}
                          angle={90}
                          angleCenter={{ x: 0.5, y: 0.5 }}
                          colors={[
                            '#fff',
                            'rgba(255,255,255,0.9)',
                            'rgba(255,255,255,0.01)',
                          ]}
                          style={{ ...styles.LinearGradientStyle }}>
                          {item.type == 'new' ? (
                            <View
                              style={{
                                ...styles.newBagde,
                              }}>
                              <Text style={{ color: '#fff' }}>جديد</Text>
                            </View>
                          ) : item.type == 'popular' ? (
                            <View
                              style={{
                                ...styles.popularBadge,
                                marginTop: 0,
                                marginRight: 0,
                              }}>
                              <Text
                                style={{
                                  alignSelf: 'center',
                                  color: '#fff',
                                  fontFamily: FONTS.fontFamily,
                                  fontSize: 12,
                                }}>
                                شائع
                              </Text>
                            </View>
                          ) : item.type == 'subscribed' ? (
                            <View
                              style={{
                                ...styles.popularBadge,
                                marginTop: 0,
                                marginRight: 0,
                              }}>
                              <Text
                                style={{
                                  alignSelf: 'center',
                                  color: '#fff',
                                  fontFamily: FONTS.fontFamily,
                                  fontSize: 10,
                                }}>
                                اشتراك
                              </Text>
                            </View>
                          ) : null}

                          <View
                            style={{
                              marginVertical: 20,
                            }}>
                            <Text
                              numberOfLines={2}
                              style={{
                                fontSize: 17,
                                textAlign: 'right',
                                fontFamily: FONTS.fontFamily,
                              }}>
                              {item.chain_name}
                            </Text>
                            <Text
                              numberOfLines={2}
                              style={{
                                fontSize: 15,
                                textAlign: 'right',
                                fontFamily: FONTS.fontFamily,
                              }}>
                              {item.description}
                            </Text>
                          </View>
                          <View
                            style={{ position: 'absolute', bottom: 4, right: 15 }}>
                            <Text style={{ color: 'rgba(0,0,0,0.7)' }}>
                              {item.chain_date}
                            </Text>
                          </View>
                        </LinearGradient>
                      </ImageBackground>
                    </TouchableOpacity>
                  </View>
                </View>
                : null
            );
          }}
        />

      </View>
    );
  };
  render() {
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <NavigationEvents onDidFocus={() => this.CustomComponentDidMount()} />
        <View
          style={{
            backgroundColor: COLORS.primary,
            height: 70,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-around"
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                visableEndSub: true,
              });
            }}>
            <AntDesign name="calendar" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={{
            color: "#fff", width: "70%",
            fontSize: 20,
            fontWeight: "bold"
          }}>{AppRequired.appName}</Text>


        </View>

        {this.state.loading == true

          ? (
            <View
              style={{

                height: "100%",
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
          ) : this.state.loading == false ? (
            <>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.getData.bind(this)}
                    colors={[COLORS.primary, COLORS.primary]}
                  />
                }
                showsVerticalScrollIndicator={false}>
                {this.underHeader()}
                {this.renderStreamsOfMonth()}

              </ScrollView>

            </>
          ) : null}

        <Modal
          visible={this.state.visableEndSub}
          onRequestClose={() => {
            this.setState({
              visableEndSub: false,
            });
          }}
          transparent={true}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <View
              style={{
                padding: 20,
                backgroundColor: '#fff',
                elevation: 4,
                borderRadius: 15,
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    visableEndSub: false,
                  });
                }}
                style={{
                  position: 'absolute',
                  top: -10,
                  left: 2,
                  backgroundColor: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 35,
                  height: 35,
                  borderRadius: 25,
                }}>
                <Text style={{ color: '#fff' }}>X</Text>
              </TouchableOpacity>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                  تاريخ انتهاء اشتراك  الكورس{this.state.subject_name}
                </Text>
              </View>

              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: '#eee',
                  marginVertical: 10,
                }}
              />

              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {this.state.loading ? (
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={COLORS.primary} size={22} />
                  </View>
                ) : (
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                      style={{ fontSize: 16, fontFamily: FONTS.fontFamily }}>
                      الرجاء الانتباه بأنة سوف يتم انتهاء الاشتراك في الكورس فى
                      تاريخ :
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: FONTS.fontFamily,
                        textAlign: 'center',
                      }}>
                      {this.state.end_sub}
                    </Text>
                  </View>
                )}

              </View>
            </View>
          </View>
        </Modal>

        <ModalHome
          onRequestClose={() => {
            this.setState({
              modalVisible: false,
            });
          }}
          style={{
            height: (SIZES.height * 1.5) / 4,
            backgroundColor: '#fff',

          }}
          backButtonClose={true}
          backdropPressToClose={true}
          isOpen={this.state.modalVisible}
          backdrop={true}

          onClosed={() => {
            this.setState({
              modalVisible: false,
            });
          }}
          swipeArea={50}
          position="bottom"
          useNativeDriver={true}>
          <TouchableOpacity
            style={{
              height: 100,
              alignItems: 'flex-end',
              justifyContent: 'center',
              borderBottomWidth: 1,
              borderColor: '#777',
              paddingRight: 15,
            }}
            onPress={() => {
              this.setState({ modalVisible: false });
              this.props.navigation.navigate('WatchStreamVideo', {
                videos: this.state.videos

              });
            }}>
            <Text style={{ fontSize: 20, color: '#000' }}>الفديوهات</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 100,
              alignItems: 'flex-end',
              justifyContent: 'center',
              borderBottomWidth: 1,
              borderColor: '#777',
              paddingRight: 15,
            }}
            onPress={() => {
              this.setState({ modalVisible: false });
              this.props.navigation.navigate('Old_All_exam');
            }}>
            <Text style={{ fontSize: 20, color: '#000' }}>الإمتحانات السابقه</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              height: 100,
              alignItems: 'flex-end',
              justifyContent: 'center',
              borderBottomWidth: 1,
              borderColor: '#777',
              paddingRight: 15,
            }}
            onPress={() => {
              this.setState({ modalVisible: false });
              this.props.navigation.navigate('About_courses');
            }}>
            <Text style={{ fontSize: 20, color: '#000' }}>معلومات عن الكورس</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              height: 100,
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingRight: 15,

            }}
            onPress={() => {
              this.setState({ modalVisible: false });
              this.props.navigation.navigate("All_exams")
            }}>
            <Text style={{ fontSize: 20, color: '#000' }}> الإمتحانات</Text>
          </TouchableOpacity>







        </ModalHome>









      </View>
    );
  }
}
const styles = StyleSheet.create({

  item_of_month_stream: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
    flexDirection: 'row',
    elevation: 1,
    overflow: 'hidden',
  },

  LinearGradientStyle: {
    width: '75%',
    height: '100%',
    padding: 15,
  },
  newBagde: {
    padding: 3,
    backgroundColor: '#4a812e',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  popularBadge: {
    padding: 7,
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 10,
  },



});
