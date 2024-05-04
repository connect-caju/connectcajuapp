import React, { useEffect, useState, useCallback } from "react"
import {
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Text,

} from "react-native"


export default function EllipsisModal({
  route
}: any) {
  const [isEllipsisVisible, settIsEllipsisVisible] = useState(false)
  // ---------------------------------------------------------------

  const handleEllipsisOptions = (option: any) => {
    console.log(`selected option: ${option}`)
    settIsEllipsisVisible(false)
  }

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#f2f2f2",
      }}
    >
      <Modal
        visible={isEllipsisVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => settIsEllipsisVisible(false)}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <TouchableOpacity onPress={() => handleEllipsisOptions("Aderir")}>
            <Text>Aderir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEllipsisOptions("Ver")}>
            <Text>Ver</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}
