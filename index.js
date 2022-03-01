/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './shim';
import 'react-native-gesture-handler'


import { LogBox } from 'react-native';
// ignore require cycle warning for react-native-cryppto
LogBox.ignoreLogs(['Require cycle:'])
console.reportErrorsAsExceptions = false;

AppRegistry.registerComponent(appName, () => App);
