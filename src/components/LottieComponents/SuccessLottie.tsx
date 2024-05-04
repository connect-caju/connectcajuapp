
import { View, Text, Pressable, Animated } from "react-native"
import React, { useRef, useState } from "react"
import LottieView from "lottie-react-native"
import { Overlay, Icon, Button } from "@rneui/base"
import COLORS from "../../consts/colors"
import { useEffect } from "react"

export function SuccessLottie({
  successLottieVisible,
  setSuccessLottieVisible
}: any) {
  const progress = useRef(new Animated.Value(0)).current

  const handleAdd = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    handleAdd()

    if (successLottieVisible) {
      setTimeout(() => {
        setSuccessLottieVisible(false)
      }, 3000)
    }
  }, [successLottieVisible])

  return (
    <Overlay
      fullScreen
      overlayStyle={{
        backgroundColor: COLORS.ghostwhite,
      }}
      isVisible={successLottieVisible}
      onBackdropPress={() => {
        setSuccessLottieVisible(!successLottieVisible)
      }}
    >
      <LottieView
        source={require("../../../assets/lottie/success.json")}
        progress={progress}
      />
    </Overlay>
  )
}
