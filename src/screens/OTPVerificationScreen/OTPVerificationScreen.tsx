import React from "react";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text } from "react-native";

export default function OTPVerificationScreen({}) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Text>OTP verification screen</Text>
    </View>
  );
}
