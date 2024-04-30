
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
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

      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
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
        // width: '100%',
        // height: '100%',
        // borderRadius: 10,
        // paddingBottom: 50,
      }}
      isVisible={successLottieVisible}
      onBackdropPress={() => {
        setSuccessLottieVisible(!successLottieVisible)
      }}
    >
      <LottieView

        // @ts-expect-error TS(2591): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        source={require("../../../assets/lottie/success.json")}
        progress={progress}
      />
    </Overlay>
  )
}
