
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, Pressable, Animated } from "react-native"
import React, { useRef, useState } from "react"
import LottieView from "lottie-react-native"

//  const

const TreeComponent = ({
  styles
}: any) => {
  return (
    <View
      style={{
        width: 200,
        height: 200,
      }}
    >
      <LottieView

        // @ts-expect-error TS(2591): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        source={require("../../../assets/lottie/tree.json")}
        autoPlay
        loop
      />
    </View>
  )
}

// PropTypes.

export default TreeComponent
