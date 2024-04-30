/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/**
 * @format
 */


// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";
import "react-native-get-random-values";


AppRegistry.registerComponent(appName, () => App);
