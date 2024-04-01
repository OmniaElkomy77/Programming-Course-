import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Animated,
  ImageBackground,
  LayoutAnimation,
  UIManager,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { AppRequired, COLORS, FONTS, images, SIZES } from '../../constants';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation';
import Video from 'react-native-af-video-player-updated';
import { NavigationEvents } from 'react-navigation';
import { Transition, Transitioning } from 'react-native-reanimated';
import axios from 'axios';

export default class WatchStreamVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Videos: [
        {
          video_price: '0',
        },
      ],
      chain_id: '',
      video_folder: '',
      titlePlayingVideo: '',
      view_count: '',
      view_limit_count: '',
      playingVideo: null,
      playingVideoId: 0,
      playingIndex: 0,

      loading: true,
      downloaded: false,
      send_message: '',
      waitingModalVisable: false,

      checkInsertViewFun: false,
      view_count: '',
      view_limit_count: '',
      WrongModalReason: '',
      wrongModal: false,
      moveingIdLeft: 0,
      moveingIdUp: 0,
      selectedTab: 1,
      student_id: '',
      videoDetails: {},
      which_player: '',
      isRefresh: false,
      finishLoad: false,

      videoUrl: '',
      pageLoading: true,
    };
    UIManager.setLayoutAnimationEnabledExperimental(true);

    this.ref = React.createRef();
  }

  componentWillUnmount() {

    Orientation.lockToPortrait();
  }


  get_url(video_player_id) {
    const VIMEO_ID = video_player_id;
    fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          videoUrl:
            res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
        });
      });
  }

  async CustomcomponentDidMount() {
    let chain_id = this.props.navigation.getParam('chain_id');
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));

    this.setState({
      chain_id: chain_id,
      student_id: data.student_id,
    });


    this.getStreamPlaylist();

  }

  insert_one_view = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      video_id: this.state.playingVideoId,
      student_id: data.student_id,
    };
    axios
      .post(AppRequired.Domain + 'insert_one_view.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            let videoData = this.state.Videos[this.state.playingIndex];
            // alert(JSON.stringify(videoData))
            videoData.view_count = (
              parseInt(videoData.view_count) + 1
            ).toString();
            let allVideos = this.state.Videos;
            allVideos[this.state.playingIndex] = videoData;

            this.setState({
              Videos: allVideos,
              view_count: allVideos[this.state.playingIndex].view_count,
              view_limit_count:
                allVideos[this.state.playingIndex].view_limit_count,
            });
          } else if (res.data == 'error') {
          }
        } else {
        }
      });
  };


  insert_finished_video = async () => {
    if (this.state.Videos[this.state.playingIndex].add_point == false) {
      this.setState({ waitingModalVisable: true });

      let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
      let data_to_send = {
        video_id: this.state.playingVideoId,
        student_id: StudentData.student_id,
      };
      axios
        .post(AppRequired.Domain + 'insert_finished_video.php', data_to_send)
        .then((res) => {
          if (res.status == 200) {
            if (res.data == 'success') {
              ToastAndroid.showWithGravity(
                'قد تم إضافه نقاط فى حسابك',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
              let updateIndex = this.state.Videos[this.state.playingIndex];
              updateIndex.add_point = true;
              let all_Videos = this.state.Videos;
              all_Videos[this.state.playingIndex] = updateIndex;
              this.setState({ waitingModalVisable: false, Videos: all_Videos });
            } else {
              this.setState({ waitingModalVisable: false });

              ToastAndroid.showWithGravity(
                'عذرا حدث خطأ ما',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            }
          } else {
            this.setState({ waitingModalVisable: false });

            ToastAndroid.showWithGravity(
              'عذرا حدث خطأ ما',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }
        });
    }
  };





  getStreamPlaylist = async () => {
    let videos = this.props.navigation.getParam("videos")
    console.log(videos)

    if (videos.length == 0) {
      let allVideos = videos;
      this.setState({
        Videos: allVideos,

        loading: false,

        pageLoading: false,
      });
    } else {
      let allVideos = videos;
      for (let i = 0; i < allVideos.length; i++) {
        allVideos[i].add_point = false;
        allVideos[i].downloaded = false;
      }

      this.setState({
        Videos: allVideos,
        playingVideo: allVideos[0].video_link,
        playingVideoId: allVideos[0].video_id,
        titlePlayingVideo: allVideos[0].video_title,
        descriptionPlayingVideo: allVideos[0].video_description,
        view_count: allVideos[0].view_count,
        view_limit_count: allVideos[0].view_limit_count,
        downloaded: allVideos.downloaded,
        video_folder: allVideos[0].video_folder,
        loading: false,
        videoDetails: allVideos[0],
        which_player: allVideos[0].which_player,
        pageLoading: false,
      });
      if (
        allVideos[0].which_player == 'player_1'
        &&
        allVideos[0].video_link.includes('update_app.mp4')
      ) {
        this.get_url(allVideos[0].video_player_id);
      }
    }
  };


  changeVideo = (item, index) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        500,
        LayoutAnimation.Types.easeOut,
        LayoutAnimation.Properties.scaleXY,
      ),
    );

    if (
      item.which_player == 'player_1' &&
      item?.video_link.includes('update_app.mp4')
    ) {
      this.get_url(item.video_player_id);
    }

    this.setState({
      playingVideo: item.video_link,
      playingVideoId: item.video_id,
      titlePlayingVideo: item.video_title,
      descriptionPlayingVideo: item.video_description,
      playingIndex: index,
      video_folder: item.video_folder,
      downloaded: item.downloaded,
      videoDetails: item,
      which_player: item.which_player,
    });
    this.insert_one_view();
  };
  selectTab = (tabIndex) => {
    this.ref.current.animateNextTransition();

    this.setState({
      selectedTab: tabIndex,
    });
  };
  transition = (
    <Transition.Together>
      <Transition.In type="scale" durationMs={550} interpolation="easeInOut" />
      <Transition.In type="fade" durationMs={550} />
      <Transition.Change />
    </Transition.Together>
  );



  renderVideos = ({ item, index }) => {
    if (this.state.playingIndex != index) {
      return (
        <View
          style={{
            width: '90%',
            minHeight: 120,
            margin: '5%',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.changeVideo(item, index);
            }}>
            <ImageBackground
              imageStyle={{ resizeMode: 'cover' }}
              source={{ uri: item.video_image_link }}
              style={{ flex: 1, width: null, height: null }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#000',
                  opacity: 0.7,
                }}>
                <View style={{ margin: 10 }}>
                  <View
                    style={{
                      marginBottom: 10,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        width: '80%',
                        justifyContent: 'center',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          opacity: 1,
                          color: 'white',
                          fontSize: 20,
                          fontFamily: FONTS.fontFamily,
                        }}>
                        {item.video_title}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: FONTS.fontFamily,
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <FontAwesome name="play" color="white" />
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                        fontFamily: FONTS.fontFamily,
                      }}
                      numberOfLines={2}>
                      {item.video_description}
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      <View
        style={{
          paddingBottom: this.state.selectedTab == 0 ? 70 : 0,
          backgroundColor: '#fff',
        }}>
        <StatusBar hidden />

        <NavigationEvents onDidFocus={() => this.CustomcomponentDidMount()} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.Videos.length == 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={images.empty}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
              <Text style={{ fontFamily: FONTS.fontFamily, fontSize: 22 }}>
                لا توجد فيديوهات متاحة فى هذة السلسلة
              </Text>
            </View>
          )


            :



            (
              <>
                <View
                  style={{
                    width: '100%',
                    minHeight: 200,
                  }}>
                  {
                    (
                      <>
                        {

                          true ? (
                            !this.state.playingVideo?.includes(
                              'update_app.mp4',
                            ) ? (
                              <Video
                                url={this.state.playingVideo}
                                title={this.state.student_id}
                                onLoad={() => {
                                  this.insert_one_view();
                                }}
                                onEnd={() => {
                                  this.insert_finished_video();
                                }}
                                rotateToFullScreen={true}
                                lockPortraitOnFsExit={true}
                                hideFull
                                scrollBounce={true}
                              />

                            ) : this.state.which_player == 'player_1' ? (

                              <Video
                                url={this.state.videoUrl}
                                title={this.state.student_id}
                                onLoad={() => {
                                  this.insert_one_view();
                                }}
                                onEnd={() => {
                                  this.insert_finished_video();
                                }}
                                rotateToFullScreen={true}
                                lockPortraitOnFsExit={true}
                                hideFull
                                scrollBounce={true}
                              />

                            ) : (
                              <>
                                <WebView
                                  style={{ alignSelf: 'stretch' }}
                                  allowsFullscreenVideo={true}
                                  scalesPageToFit={true}
                                  bounces={false}
                                  javaScriptEnabled
                                  onLoad={() => {
                                    this.setState({
                                      finishLoad: true,
                                    });

                                  }}
                                  source={{
                                    html: `
                <!DOCTYPE html>
                <html>
                  <head></head>
                  <body>
                      <div style="width:100%;height:100%">
                      <iframe id='my_iFrame' src="https://player.vimeo.com/video/${this.state.videoDetails.video_player_id
                                      }" frameborder="0"
                      allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%"
                      title="forme_validation.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js">
    
                      if(${!this.state.isRefresh}){
                        var f = document.getElementById('my_iFrame');
                        f.src = f.src;
                      }
                     </script>
                  </body>
                </html>
          `,
                                  }}
                                  automaticallyAdjustContentInsets={false}
                                />




                              </>
                            )
                          ) :
                            (
                              <View style={{ width: '100%', padding: 20 }}>
                                <Text
                                  style={{
                                    color: COLORS.primary,
                                    fontFamily: FONTS.fontFamily,
                                    alignSelf: 'center',
                                    fontSize: 22,
                                  }}>
                                  {AppRequired.appName}
                                </Text>
                                <View
                                  style={{
                                    width: '90%',
                                    alignSelf: 'center',
                                    borderWidth: 2,
                                    borderColor: '#ddd',
                                  }}
                                />
                                <Text
                                  style={{
                                    fontFamily: FONTS.fontFamily,
                                    fontSize: 18,
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    marginTop: '4%',
                                  }}>
                                  عفواً لم يعد متاح إليك مشاهده هذا الفيديو من
                                  السلسه
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({ unableWatchModal: true })
                                  }
                                  style={{
                                    alignSelf: 'center',
                                    paddingVertical: 10,
                                    paddingHorizontal: 30,
                                    backgroundColor: COLORS.primary,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#fff',
                                      fontFamily: FONTS.fontFamily,
                                      fontSize: 20,
                                    }}>
                                    متابعه
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )
                        }
                      </>
                    )
                  }


                </View>
                <View style={{ backgroundColor: '#fff' }}>
                  <View
                    style={{
                      width: '100%',
                      borderWidth: 0.5,
                      borderColor: '#ddd',
                    }}
                  />
                </View>

                <Transitioning.View
                  ref={this.ref}
                  transition={this.transition}
                  style={{
                    flex: 1,
                    backgroundColor: '#fff',
                  }}>
                  <View
                    style={{
                      ...styles.tabContainer,
                      alignSelf: 'center',
                      width: SIZES.width,
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                      }}
                      onPress={() => {
                        this.selectTab(1);
                      }}>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color:
                              this.state.selectedTab == 1
                                ? COLORS.third
                                : 'lightgray',
                          }}>
                          محتويات المسار
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        position: 'absolute',
                        height: 5,
                        alignSelf: 'center',
                        width: SIZES.width,

                        backgroundColor: COLORS.secondary,
                        bottom: 0,
                      }}
                    />
                  </View>
                  {this.state.loading == true ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: SIZES.height * 0.4,
                        width: '100%',
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
                  ) : (
                    <>

                      <>
                        <FlatList
                          data={this.state.Videos}
                          keyExtractor={(i, k) => k.toString()}
                          renderItem={this.renderVideos}
                          showsVerticalScrollIndicator={false}
                        />
                      </>

                    </>
                  )}
                </Transitioning.View>
              </>
            )}
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            top: this.state.moveingIdUp,
            left: this.state.moveingIdLeft,
            width: 160,
            height: 40,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#fff', fontFamily: FONTS.fontFamily }}>
            {' '}
            كود الطالب  : {this.state.student_id}
          </Text>
        </View>

        <Modal visible={this.state.waitingModalVisable} transparent={true}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <Image
              source={images.mainLoading}
              style={{
                height: 100,
                width: 100,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 20,
                color: '#000',
              }}>
              الرجاء الانتظار للحظات
            </Text>
          </View>
        </Modal>








      </View>
    );
  }
}
const styles = StyleSheet.create({
  tabContainer: {
    height: 70,
    flexDirection: 'row',
    marginTop: 20,
    width: SIZES.width - 30,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    marginTop: SIZES.width > SIZES.height ? 300 : 0,
  },
  chatMessage: {
    marginVertical: 10,
    backgroundColor: '#fff',
    elevation: 5,
    alignSelf: 'center',
    width: '95%',
    padding: 10,
  },
  downloadButton: {
    backgroundColor: '#f60941',
    padding: 10,

    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  testYourselfButton: {
    backgroundColor: '#3ab54a',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askingBadge: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.askTeacherGadge,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },

  streamContentsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
  },
  lessonContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#eee',
    marginVertical: 10,
    borderRadius: 10,
  },
  lessonUnlockedAccess: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  lessonNotAilableContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#eee',
    marginVertical: 10,
    borderRadius: 10,
  },
});
