import React from "react"

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Pressable, View, Text } from "react-native"
import COLORS from "../../consts/colors"

export default function SplitOTPBoxesContainer({
  inputRef
}: any) {

  // @ts-expect-error TS(2304): Cannot find name 'useState'.
  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false)

  // @ts-expect-error TS(2304): Cannot find name 'maximumLength'.
  const boxArray = new Array(maximumLength).fill(0)

  const handleOnPress = () => {
    setIsInputBoxFocused(true)
    inputRef.current.focus()
  }

  const handleOnBlur = () => {
    setIsInputBoxFocused(false)
  }

  return (
    <Pressable
      style={{
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
      // onPress={}
    ></Pressable>
  )
}
