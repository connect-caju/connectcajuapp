import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import SplashScreen from "react-native-splash-screen";
import AppTabs from "./navigation/Tabs/AppTabs";
import Providers from "./Providers";

export default function App() {

  useEffect(() => {
    setTimeout(()=>{
      SplashScreen.hide(); //hides the splash screen on app load.
    }, 3000)
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content"  />
      <Providers>
        <AppTabs />
      </Providers>
    </>
  );
}
