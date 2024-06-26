
import { View, Text } from "react-native"
import React from "react"
import { Divider } from "native-base"

export default function CustomDivider({
  marginVertical,
  thickness,
  bg,
  orientation
}: any) {
  return (
    <Divider
      my={marginVertical}
      thickness={thickness}
      bg={bg}
      orientation={orientation ? orientation : "horizontal"}
    />
  )
}
