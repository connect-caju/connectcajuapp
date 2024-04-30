/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */


import React, { useEffect, useState } from "react";
import { Text, Stack, Box, Center } from "native-base";
import { Button, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Pressable, View, Modal, StyleSheet } from "react-native";
import COLORS from "../../consts/colors";

export default function SuccessModal({
  addDataModalVisible,
  setAddDataModalVisible,
  setFarmerType
}: any) {
  const navigation = useNavigation();

  useEffect(() => {
    if (addDataModalVisible) {
      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(() => {
        setAddDataModalVisible(false);
        setFarmerType("");
      }, 5000);
    }
  }, [addDataModalVisible]);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={addDataModalVisible}
        onRequestClose={() => {
          setAddDataModalVisible(false);
          setFarmerType("");
        }}
        statusBarTranslucent={false}
      >
        <View
          style={{
            flex: 1,
            paddingVertical: 50,
            alignItems: "center",
          }}
        >
          {/* <LottieProcessCompletedButton /> */}
          <Icon name="check-circle" size={100} color={COLORS.main} />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginVertical: 20,
              paddingVertical: 20,
            }}
          >
            <Text
              // @ts-expect-error TS(2322): Type '{ children: string; style: { paddingVertical... Remove this comment to see the full error message
              style={{
                paddingVertical: 10,
                fontSize: 18,
                fontFamily: "JosefinSans-Regular",
                color: COLORS.main,
              }}
            >
              O registo ocorrido com sucesso!
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}