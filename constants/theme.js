import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  // base colors
  fontColor: '#303531',
  primary: '#24b1b0',
  // primary: '#3687ef',

  secondary: '#095f5e',
  // secondary: '#7663d8',

  searchBar: '#095f5e',

  third: '#095f5e',
  askTeacherGadge: '#9ed4f5',

  lightGray: '#F5F5F6',
  lightGray2: '#F6F6F7',
  lightGray3: '#EFEFF1',
  lightGray4: '#F8F8F9',
  transparent: 'transparent',
  darkgray: '#898C95',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  fontFamily: 'Janna LT Bold',
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
