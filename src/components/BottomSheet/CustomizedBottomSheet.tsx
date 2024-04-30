import React, { useCallback, useRef, useMemo } from "react"
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { StyleSheet, View, Text, Button } from "react-native"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"

export default function CustomizedBottomSheet({}) {
  // hooks

  const sheetRef = useRef(null)
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], [])

  const handleSnapPress = useCallback((index: any) => {
    // @ts-expect-error TS(2339): Property 'snapToIndex' does not exist on type 'nev... Remove this comment to see the full error message
    sheetRef.current?.snapToIndex(index)
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log("press: ", index)
  }, [])

  const handleSheetChange = useCallback((index: any) => {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log("handleSheetChange", index)
  }, [])

  const handleClosePress = useCallback(() => {
    // @ts-expect-error TS(2339): Property 'close' does not exist on type 'never'.
    sheetRef.current?.close()
  }, [])

  // callbacks

  // render
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 100,
      }}
    >
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        // @ts-expect-error TS(2741): Property 'children' is missing in type '{}' but re... Remove this comment to see the full error message
        <BottomSheetView></BottomSheetView>
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
})
