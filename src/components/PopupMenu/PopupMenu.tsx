import { Icon } from "@rneui/base"
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  SafeAreaView,

} from "react-native"


import { useRef, useState } from "react"


import COLORS from "../../consts/colors"

export function PopupMenu({
  popupMenuVisible,
  setPopupMenuVisible
}: any) {
  const scale = useRef(new Animated.Value(0)).current

  const options = [
    {
      title: "Publicar",
      icon: "add",

      // @ts-expect-error TS(2304): Cannot find name 'alert'.
      action: () => alert("publicar"),
    },
    {
      title: "Delete",
      icon: "delete",

      // @ts-expect-error TS(2304): Cannot find name 'alert'.
      action: () => alert("delete"),
    },
    {
      title: "Directions",
      icon: "directions",

      // @ts-expect-error TS(2304): Cannot find name 'alert'.
      action: () => alert("directions"),
    },
  ]

  return (
    <>
      <Modal transparent visible={popupMenuVisible}>
        <SafeAreaView
          style={{ flex: 1 }}
          onTouchStart={() => setPopupMenuVisible(false)}
        >
          <Animated.View
            style={{
              width: 300,
              height: 200,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
          >
            {options?.map((op, i) => (
              <TouchableOpacity
                key={i}
                onPress={op.action}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 15,
                  borderBottomColor: COLORS.lightgrey,
                  borderBottomWidth: i === options.length - 1 ? 0 : 1,
                }}
              >
                <Text>{op.title}</Text>
                <Icon
                  name={op.icon}
                  size={26}
                  color={COLORS.grey}
                  style={{
                    marginLeft: 10,
                  }}
                />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </SafeAreaView>
      </Modal>
    </>
  )
}
