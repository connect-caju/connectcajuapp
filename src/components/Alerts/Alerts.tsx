import React from "react";
import { Alert, AlertIcon, AlertText, InfoIcon } from "@gluestack-ui/themed";
import { View, Text } from "react-native";

export default function Alerts() {
  return (
    <Alert mx="$2.5" action="info" variant="solid">
      <AlertIcon as={InfoIcon} mr="$3" />
      <AlertText

      />
      <Text>Alert Alert</Text>
    </Alert>
  );
}
