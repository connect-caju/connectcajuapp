
import { View, Text, Pressable, Animated } from "react-native"
import React, { useRef, useState } from "react"
import LottieView from "lottie-react-native"

//  const

const DangerAlert = ({
  styles,
  onPress
}: any) => {

  return (

    <View
      style={{
        width: 100,
        height: 100,
      }}
    >
      <LottieView
        source={require("../../../assets/lottie/dangerAlert.json")}
        style={{}}
        autoPlay
        loop
      />
    </View>
  )
}

export default DangerAlert
