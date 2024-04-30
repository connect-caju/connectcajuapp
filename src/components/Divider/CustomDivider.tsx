/* eslint-disable prettier/prettier */
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
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
