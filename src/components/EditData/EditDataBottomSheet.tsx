import React, { useCallback, useImperativeHandle } from "react"
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { Divider, Icon } from "@rneui/base"

import COLORS from "../../consts/colors"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useEffect } from "react"
import { bottomSheetFlags } from "../../consts/bottomSheetFlags"
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faHome, faIdCard } from "@fortawesome/free-solid-svg-icons"
import { useNavigation } from "@react-navigation/native"
import EditFarmerDetails from "../EditFarmerDetails/EditFarmerDetails"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50

const EditDataBottomSheet = React.forwardRef(
  (
    {
      // @ts-expect-error TS(2339): Property 'dataToBeUpdated' does not exist on type ... Remove this comment to see the full error message
      dataToBeUpdated,
      // @ts-expect-error TS(2339): Property 'isOverlayVisible' does not exist on type... Remove this comment to see the full error message
      isOverlayVisible,
      // @ts-expect-error TS(2339): Property 'setIsOverlayVisible' does not exist on t... Remove this comment to see the full error message
      setIsOverlayVisible,
      // @ts-expect-error TS(2339): Property 'isConfirmDataVisible' does not exist on ... Remove this comment to see the full error message
      isConfirmDataVisible,
      // @ts-expect-error TS(2339): Property 'setIsConfirmDataVisible' does not exist ... Remove this comment to see the full error message
      setIsConfirmDataVisible,
      // farmerId,
      // @ts-expect-error TS(2339): Property 'farmersIDs' does not exist on type '{}'.
      farmersIDs,
      // @ts-expect-error TS(2339): Property 'bottomSheetFlag' does not exist on type ... Remove this comment to see the full error message
      bottomSheetFlag,
      // @ts-expect-error TS(2339): Property 'setBottomSheetFlag' does not exist on ty... Remove this comment to see the full error message
      setBottomSheetFlag,
      // @ts-expect-error TS(2339): Property 'farmer' does not exist on type '{}'.
      farmer,
      // @ts-expect-error TS(2339): Property 'resourceName' does not exist on type '{}... Remove this comment to see the full error message
      resourceName,
    },
    ref,
  ) => {
    const navigation = useNavigation()
    const translateY = useSharedValue(0)
    const context = useSharedValue({ y: 0 })
    const active = useSharedValue(false)

    const removeFlag = () => {
      if (bottomSheetFlag !== "") {
        setBottomSheetFlag("")
      }
    }

    const scrollTo = useCallback(
      (destination: any) => {
        "worklet"
        if (destination === 0) {
          active.value = false
        } else {
          active.value = true
        }

        active.value = destination !== 0

        translateY.value = withSpring(destination, { damping: 50 })
      },
      [bottomSheetFlag, active],
    )

    const isActive = () => {
      return active.value
    }

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ])

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value }
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
      })
      .onEnd(() => {
        if (translateY.value > -SCREEN_HEIGHT / 3) {
          scrollTo(0)
          translateY.value = withSpring(0, { damping: 50 })
          runOnJS(removeFlag)()
        } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
          scrollTo(MAX_TRANSLATE_Y)
          translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 })
        }
      })

    useEffect(() => {
      scrollTo(0)
    }, [])

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolate.CLAMP,
      )

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      }
    })

    useEffect(() => {}, [bottomSheetFlag])

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.line} />

          <View
            style={{
              padding: 8,
              // width: '100%',
              justifyContent: "center",
            }}
          >
            {bottomSheetFlag === bottomSheetFlags.farmerDetails && (
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  paddingHorizontal: 20,
                }}
              ></View>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    )
  },
)

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: COLORS.ghostwhite,
    position: "absolute",
    top: SCREEN_HEIGHT,
    zIndex: 1,
    borderRadius: 25,
  },
  line: {
    width: 60,
    height: 8,
    backgroundColor: COLORS.grey,
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 8,
  },
})

export default EditDataBottomSheet
