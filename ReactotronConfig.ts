/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import Reactotron from "reactotron-react-native";

// @ts-expect-error TS(2614): Module '"@react-native-async-storage/async-storage... Remove this comment to see the full error message
import { AsyncStorage } from "@react-native-async-storage/async-storage";

Reactotron.setAsyncStorageHandler(AsyncStorage)
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    .configure() // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .connect(); // let's connect!

    