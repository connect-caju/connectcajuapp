/* eslint-disable prettier/prettier */

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, Pressable, Animated } from "react-native";
import React, { useRef, useState } from "react";
import LottieView from "lottie-react-native";

//  const

const TickComponent = ({ }) => {
  return (
    <View
      style={{
        width: 100,
        height: 100,
      }}
    >
      <LottieView

        // @ts-expect-error TS(2591): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        source={require("../../../assets/lottie/tick.json")}
        autoPlay
        loop
      />
    </View>
  );
};

// PropTypes.

export default TickComponent;
