import React from "react"

import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native"
import COLORS from "../../consts/colors"

export default function KeyboardAvoidingWrapper({
  children
}: any) {
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: COLORS.ghostwhite,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
