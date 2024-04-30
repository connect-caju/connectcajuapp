import React, { useEffect, useState, useRef, useCallback } from "react"
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Camera, useCameraDevices } from "react-native-vision-camera"
import Animated from "react-native-reanimated"
import { Divider, Icon, Avatar, BottomSheet } from "@rneui/base"
import COLORS from "../../consts/colors"
import { useNavigation } from "@react-navigation/native"

export default function PhotoBottomSheet({
  ownerType,
  ownerId,
  farmersIDs,
  setIsPhotoModalVisible,
  launchNativeImageLibrary
}: any) {
  const navigation = useNavigation()

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingTop: 20,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
          navigation.navigate("Camera", {
            ownerType,
            ownerId,
            farmersIDs,
          })
        }}
      >
        <Icon name="preview" size={35} color={COLORS.main} />
        <Text
          style={{
            fontSize: 14,
            color: COLORS.grey,
            fontFamily: "JosefinSans-Regular",
          }}
        >
          Visualização
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={launchNativeImageLibrary}>
        <Icon name="photo-library" size={35} color={COLORS.main} />
        <Text
          style={{
            fontSize: 14,
            color: COLORS.grey,
            fontFamily: "JosefinSans-Regular",
          }}
        >
          Galeria
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
          navigation.navigate("Camera", {
            ownerType,
            ownerId,
            farmersIDs,
          })
        }}
        style={
          {
            //
          }
        }
      >
        <Icon name="photo-camera" size={35} color={COLORS.main} />
        <Text
          style={{
            fontSize: 14,
            color: COLORS.grey,
            fontFamily: "JosefinSans-Regular",
          }}
        >
          Câmera
        </Text>
      </TouchableOpacity>
    </View>
  )
}
