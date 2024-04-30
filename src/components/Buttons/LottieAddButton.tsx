// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, Pressable, Animated } from "react-native"
import React, { useRef, useState } from "react"
import LottieView from "lottie-react-native"

//  const

const LottieAddButton = ({
  styles,
  onPress
}: any) => {
  const progress = useRef(new Animated.Value(0)).current
  const [isAddButtonPressed, setIsAddButtonPressed] = useState(false)

  const handleAdd = () => {
    const newValue = isAddButtonPressed ? 0 : 1
    Animated.timing(progress, {
      toValue: newValue,
      duration: 2000,
      useNativeDriver: true,
    }).start()
    // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
    setTimeout(() => {
      onPress()
    }, 500)
    setIsAddButtonPressed(!isAddButtonPressed)
  }

  return (
    <Pressable style={styles} onPress={handleAdd}>
      <LottieView
        // @ts-expect-error TS(2591): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
        source={require("../../../assets/lottie/add.json")}
        progress={progress}
      />
    </Pressable>
  )
}

export default LottieAddButton
