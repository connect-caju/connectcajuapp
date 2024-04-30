import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import SplashScreen from "react-native-splash-screen";
import AppTabs from "./navigation/Tabs/AppTabs";
import Providers from "./Providers";

export default function App() {

  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#EBEBE4" />
      <Providers>
        <AppTabs />
      </Providers>
    </>
  );
}
