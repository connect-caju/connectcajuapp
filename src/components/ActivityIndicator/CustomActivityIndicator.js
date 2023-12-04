import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import styles from "./style";
import COLORS from "../../consts/colors";
import { backgroundStyle } from "../../styles/globals";

const CustomActivityIndicator = ({
  loadingActivitiyIndicator,
  setLoadingActivityIndicator,
  backgroundColor,
  indicatorColor,
}) => {
  // const startLoading = ()=>{
  // setLoadingActivityIndicator(true);
  // }

  if (loadingActivitiyIndicator) {
    // startLoading();
    setTimeout(() => {
      setLoadingActivityIndicator(false);
    }, 0);
  }

  return (
    <View
      className={`flex flex-1 justify-center items-center ${backgroundStyle}`}
    >
      <ActivityIndicator
        visible={loadingActivitiyIndicator}
        // textContent={'Connect Caju...'}
        textStyle={{
          color: indicatorColor ? indicatorColor : COLORS.main,
        }}
        size={"large"}
        color={indicatorColor ? indicatorColor : COLORS.main}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          color: indicatorColor ? indicatorColor : COLORS.main,
          fontFamily: "JosefinSans-Regular",
        }}
      >
        Connect Caju...
      </Text>
    </View>
  );
};

export default CustomActivityIndicator;
