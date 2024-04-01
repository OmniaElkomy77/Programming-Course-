import * as React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import RNBootSplash from 'react-native-bootsplash';

import {
  Login,
  Signup,
} from './screens/Auth';
import {
  SelectSubject, WatchStreamVideo, MainPage, All_exams,
  Exam, Old_All_exam, Old_exam,
  About_courses,
  First_page
} from './screens/Home';
import SwitchControle from './screens/SwitchControle';


const Auth = createStackNavigator(
  {
    Login: { screen: Login },
    Signup: { screen: Signup },
  },

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

;

const AppSwitch = createSwitchNavigator({
  SwitchControle: { screen: SwitchControle },
});

const HomePagesTabs = createStackNavigator(
  {
    First_page: { screen: First_page },
    SelectSubject: { screen: SelectSubject },
    MainPage: { screen: MainPage },
    All_exams: { screen: All_exams },
    Exam: { screen: Exam },
    WatchStreamVideo: { screen: WatchStreamVideo },
    Old_All_exam: { screen: Old_All_exam },
    Old_exam: { screen: Old_exam },
    About_courses: { screen: About_courses },


  },
  {
    initialRouteName: 'First_page',
    headerMode: 'none',
  },
);

const MainApp = createAppContainer(
  createSwitchNavigator(
    {
      AppSwitch: AppSwitch,
      Auth: Auth,
      HomePages: HomePagesTabs,
    },
    {
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      },
    },
  ),
);

export default class App extends React.Component {
  componentDidMount() {
    RNBootSplash.hide({ fade: true });
    // this.createNotificationListeners();
    // this.clearNotification();
  }
  // clearNotification() {
  //   PushNotification.cancelAllLocalNotifications({id: 123});
  // }

  // async createNotificationListeners() {
  //   // when app oppening
  //   this.notificationListener = firebase
  //     .notifications()
  //     .onNotification((notification) => {
  //       const {title, body} = notification;
  //       PushNotification.localNotification({
  //         title: title,
  //         message: body,
  //       });

  //       // setTimeout(() => {
  //       //   PushNotification.removeDeliveredNotifications();
  //       // }, 9000);
  //       // PushNotification.cancelAllLocalNotifications();

  //       // this.displayNotification(title, body);
  //     });

  //   // when app is on cash
  //   this.notificationOpenedListener = firebase
  //     .notifications()
  //     .onNotificationOpened((notificationOpen) => {
  //       // const {title, body} = notificationOpen.notification;
  //       // this.displayNotification(title, body);
  //     });

  //   // when app is colsed
  //   const notificationOpen = await firebase
  //     .notifications()
  //     .getInitialNotification();
  //   if (notificationOpen) {
  //     // const {title, body} = notificationOpen.notification;
  //     // this.displayNotification(title, body);
  //   }
  // }

  render() {
    return <MainApp />;
  }
}
