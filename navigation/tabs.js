import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { isIphoneX } from 'react-native-iphone-x-helper';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { COLORS, FONTS, icons, images } from '../constants';
import {
  MainPage,
  // MorePages,
  // MyLibrary,
  WatchStreamVideo,
  WatchIndvidualVideo,
  // Charge,/
  // Profile,
  // Notifications,
  // SeeMore,
  // Seloved_Student_Exam,
  // TeacherInfo,
  // MoneyTransactionsDetails,
  // ChargeDetails,
  // ExpensesDetails,
  // //
  // MovePage,
  // StudentChallenge,
  // MovePageExamsQuizes,
  // FinishDetails,
  // QuestionDetails,
  // ExamPageQuestion,
  // FinishChallenge,
  // PendingChalenge,
  // VSpage,
  // //
  // SummaryList,
  // Viewer,
  // //
  // QuizList,
  // QuizQutionsWithoutTime,
  // QuizQuationWithoutTime2,
  // QuizQuationWithTime,
  // QuizPageWithTimeCheck,
  // //
  // ExamList,
  // FullPageExam,
  // FullPageExamWithAnswers,
  // FullPageTimerAnswerdExam,
  // FullPageTimerExam,
  // //
  // Setting,
} from '../screens/Home';
import { createStackNavigator } from 'react-navigation-stack';
const MainPageStack = createStackNavigator(
  {
    MainPage: { screen: MainPage },
    WatchStreamVideo: { screen: WatchStreamVideo },
    //
    // FullPageExam: { screen: FullPageExam },
    // FullPageExamWithAnswers: { screen: FullPageExamWithAnswers },
    // FullPageTimerExam: { screen: FullPageTimerExam },
    // FullPageTimerAnswerdExam: { screen: FullPageTimerAnswerdExam },
    //
    // QuizQutionsWithoutTime: { screen: QuizQutionsWithoutTime },
    // QuizQuationWithoutTime2: { screen: QuizQuationWithoutTime2 },
    // QuizQuationWithTime: { screen: QuizQuationWithTime },
    // QuizPageWithTimeCheck: { screen: QuizPageWithTimeCheck },
    //
    // Charge: { screen: Charge },
    // WatchIndvidualVideo: { screen: WatchIndvidualVideo },
  },
  {
    initialRouteName: 'MainPage',
    headerMode: 'none',
  },
);
MainPageStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  if (
    routeName == 'WatchStreamVideo'
    // routeName == 'FullPageExam' ||
    // routeName == 'FullPageExamWithAnswers' ||
    // routeName == 'FullPageTimerExam' ||
    // routeName == 'FullPageTimerAnswerdExam' ||
    // routeName == 'Charge' ||
    // routeName == 'WatchIndvidualVideo'||
    // routeName == 'QuizQutionsWithoutTime' ||
    // routeName == 'QuizQuationWithoutTime2' ||
    // routeName == 'QuizQuationWithTime' ||
    // routeName == 'QuizPageWithTimeCheck'
  ) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

// const MyLibraryStack = createStackNavigator(
//   {
//     MyLibrary: { screen: MyLibrary },
//     WatchStreamVideo: { screen: WatchStreamVideo },
//     //
//     FullPageExam: { screen: FullPageExam },
//     FullPageExamWithAnswers: { screen: FullPageExamWithAnswers },
//     FullPageTimerExam: { screen: FullPageTimerExam },
//     FullPageTimerAnswerdExam: { screen: FullPageTimerAnswerdExam },
//     //
//     QuizQutionsWithoutTime: { screen: QuizQutionsWithoutTime },
//     QuizQuationWithoutTime2: { screen: QuizQuationWithoutTime2 },
//     QuizQuationWithTime: { screen: QuizQuationWithTime },
//     QuizPageWithTimeCheck: { screen: QuizPageWithTimeCheck },
//     WatchIndvidualVideo: { screen: WatchIndvidualVideo },
//     Profile: { screen: Profile },
//     Notifications: { screen: Notifications },
//     SeeMore: { screen: SeeMore },
//     Seloved_Student_Exam: { screen: Seloved_Student_Exam },
//   },
//   {
//     initialRouteName: 'MyLibrary',
//     headerMode: 'none',
//   },
// );

// MyLibraryStack.navigationOptions = ({ navigation }) => {
//   let tabBarVisible = true;
//   let routeName = navigation.state.routes[navigation.state.index].routeName;
//   if (
//     routeName == 'WatchStreamVideo' ||
//     routeName == 'FullPageExam' ||
//     routeName == 'FullPageExamWithAnswers' ||
//     routeName == 'FullPageTimerExam' ||
//     routeName == 'FullPageTimerAnswerdExam' ||
//     routeName == 'QuizQutionsWithoutTime' ||
//     routeName == 'QuizQuationWithoutTime2' ||
//     routeName == 'QuizQuationWithTime' ||
//     routeName == 'QuizPageWithTimeCheck' ||
//     routeName == 'WatchIndvidualVideo' ||
//     routeName == 'Profile' ||
//     routeName == 'Notifications' ||
//     routeName == 'SeeMore' ||
//     routeName == 'Seloved_Student_Exam'
//   ) {
//     tabBarVisible = false;
//   }
//   return {
//     tabBarVisible,
//   };
// };

// const MorePagesStack = createStackNavigator(
//   {
//     MorePages: { screen: MorePages },
//     //
//     //
//     TeacherInfo: { screen: TeacherInfo },
//     //
//     MoneyTransactionsDetails: { screen: MoneyTransactionsDetails },
//     ChargeDetails: { screen: ChargeDetails },
//     ExpensesDetails: { screen: ExpensesDetails },
//     //
//     MovePage: { screen: MovePage },
//     StudentChallenge: { screen: StudentChallenge },
//     MovePageExamsQuizes: { screen: MovePageExamsQuizes },
//     FinishDetails: { screen: FinishDetails },
//     QuestionDetails: { screen: QuestionDetails },
//     ExamPageQuestion: { screen: ExamPageQuestion },
//     FinishChallenge: { screen: FinishChallenge },
//     PendingChalenge: { screen: PendingChalenge },
//     VSpage: { screen: VSpage },
//     //
//     SummaryList: { screen: SummaryList },
//     Viewer: { screen: Viewer },
//     //
//     QuizList: { screen: QuizList },
//     QuizQutionsWithoutTime: { screen: QuizQutionsWithoutTime },
//     QuizQuationWithoutTime2: { screen: QuizQuationWithoutTime2 },
//     QuizQuationWithTime: { screen: QuizQuationWithTime },
//     QuizPageWithTimeCheck: { screen: QuizPageWithTimeCheck },
//     //
//     ExamList: { screen: ExamList },
//     FullPageExam: { screen: FullPageExam },
//     FullPageExamWithAnswers: { screen: FullPageExamWithAnswers },
//     FullPageTimerExam: { screen: FullPageTimerExam },
//     FullPageTimerAnswerdExam: { screen: FullPageTimerAnswerdExam },
//     Setting: { screen: Setting },
//   },
//   {
//     headerMode: 'none',
//   },
// );

// MorePagesStack.navigationOptions = ({ navigation }) => {
//   let tabBarVisible = true;
//   let routeName = navigation.state.routes[navigation.state.index].routeName;
//   if (
//     routeName == 'TeacherInfo' ||
//     routeName == 'MoneyTransactionsDetails' ||
//     routeName == 'ChargeDetails' ||
//     routeName == 'ExpensesDetails' ||
//     routeName == 'MovePage' ||
//     routeName == 'StudentChallenge' ||
//     routeName == 'MovePageExamsQuizes' ||
//     routeName == 'FinishDetails' ||
//     routeName == 'QuestionDetails' ||
//     routeName == 'ExamPageQuestion' ||
//     routeName == 'FinishChallenge' ||
//     routeName == 'PendingChalenge' ||
//     routeName == 'VSpage' ||
//     routeName == 'SummaryList' ||
//     routeName == 'Viewer' ||
//     routeName == 'QuizList' ||
//     routeName == 'QuizQutionsWithoutTime' ||
//     routeName == 'QuizQuationWithoutTime2' ||
//     routeName == 'QuizQuationWithTime' ||
//     routeName == 'QuizPageWithTimeCheck' ||
//     routeName == 'ExamList' ||
//     routeName == 'FullPageExam' ||
//     routeName == 'FullPageExamWithAnswers' ||
//     routeName == 'FullPageTimerExam' ||
//     routeName == 'FullPageTimerAnswerdExam' ||
//     routeName == 'Setting'
//   ) {
//     tabBarVisible = false;
//   }
//   return {
//     tabBarVisible,
//   };
// };

// const TabBarCustomButton = ({accessibilityState, children, onPress}) => {
const TabBarCustomButton = (props) => {
  // var isSelected = accessibilityState.selected;

  if (props.accessibilityStates == 'selected') {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', position: 'absolute', top: 0 }}>
          <View style={{ flex: 1, backgroundColor: '#EAEFF2' }}></View>
          <Svg width={75} height={61} viewBox="0 0 75 61">
            <Path
              d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
              fill={'#EAEFF2'}
            />
          </Svg>
          <View style={{ flex: 1, backgroundColor: '#EAEFF2' }}></View>
        </View>

        <TouchableOpacity
          style={{
            top: -22.5,
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#EAEFF2',
          }}
          onPress={props.onPress}>
          {props.children}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: 60,
          backgroundColor: '#EAEFF2',
        }}
        activeOpacity={1}
        onPress={props.onPress}>
        {props.children}
      </TouchableOpacity>
    );
  }
};

const CustomTabBar = (props) => {
  if (isIphoneX()) {
    return (
      <View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 30,
            backgroundColor: COLORS.white,
          }}></View>
        <BottomTabBar {...props.props} />
      </View>
    );
  } else {
    return <BottomTabBar {...props.props} />;
  }
};
const Tabs = createBottomTabNavigator(
  {
    MainPage: {
      screen: MainPageStack,
      navigationOptions: {
        tabBarLabel: 'الرئيسيه',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <SimpleLineIcons
              style={[{ color: tintColor }]}
              size={25}
              name={'home'}
            />
          </View>
        ),
        tabBarButtonComponent: (props) => <TabBarCustomButton {...props} />,
      },
    },

    // MyLibrary: {
    //   screen: MyLibraryStack,
    //   navigationOptions: {
    //     tabBarLabel: 'مكتبتى',
    //     tabBarIcon: ({ tintColor }) => (
    //       <View>
    //         <Ionicons
    //           style={[{ color: tintColor }]}
    //           size={25}
    //           name={'ios-book-outline'}
    //         />
    //       </View>
    //     ),
    //     tabBarButtonComponent: (props) => <TabBarCustomButton {...props} />,
    //   },
    // },

    // MorePages: {
    //   screen: MorePagesStack,
    //   navigationOptions: {
    //     tabBarLabel: 'المزيد',

    //     tabBarIcon: ({ tintColor }) => (
    //       <View>
    //         <Image
    //           style={[{ tintColor: tintColor, width: 25, height: 25 }]}
    //           source={icons.list}
    //         />
    //       </View>
    //     ),
    //     tabBarButtonComponent: (props) => <TabBarCustomButton {...props} />,
    //   },
    // },
  },
  {
    // tabBarOptions: {
    //   style: {
    //     height: 55,
    //     paddingVertical: 15,
    //   },
    //   activeTintColor: COLORS.primary,
    //   labelStyle: {fontFamily: FONTS.fontFamily},
    // },
    // initialRouteName: 'MainPage',
    tabBarOptions: {
      style: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        backgroundColor: 'transparent',
        elevation: 0,
      },
      showLabel: false,
      activeTintColor: COLORS.primary,
      labelStyle: { fontFamily: FONTS.fontFamily },
    },
    tabBarComponent: (props) => <CustomTabBar props={props} />,

    initialRouteName: 'MainPage',
  },
);

export default Tabs;
