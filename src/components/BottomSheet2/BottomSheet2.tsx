import React from "react"
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import COLORS from "../../consts/colors"
import BottomSheet from "@gorhom/bottom-sheet"
import { useMemo } from "react"

export default function BottomSheet2({
  ref
}: any) {
  const snapPoints = useMemo(() => ["25%", "40%", "60%", "80%"], [])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.fourth,
      }}
    >
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={() => {}}
      >
        <View
          style={{
            minHeight: 200,
            width: "100%",
          }}
        >
          <Text>Awesome</Text>
        </View>
      </BottomSheet>
    </View>
  )
}
