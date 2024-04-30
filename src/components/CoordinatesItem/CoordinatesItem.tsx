import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Stack, Box, Center } from "native-base";
import { Icon } from "@rneui/base";
import AwesomeAlert from "react-native-awesome-alerts";

import CustomDivider from "../Divider/CustomDivider";

import { realmContext } from "../../models/realmContext";
import { updateCoordinates } from "../../helpers/updateCoordinates";
import COLORS from "../../consts/colors";
const { useRealm, useObject, useQuery } = realmContext;

let FLAG = false;

const CoordinatesItem = ({ item, farmland }) => {
  const realm = useRealm();

  const [deleteAlert, setDeleteAlert] = useState(false);

  const onDeletePoint = () => {
    if (item.icon === "delete-forever") {
      realm.write(() => {
        farmland.extremeCoordinates.pop();
      });
    }
  };

  if (FLAG) {
    onDeletePoint();
    FLAG = false;
    return;
  }

  return (
    <View className="bg-white m-2 p-2 self-center rounded-md">
      <AwesomeAlert
        show={deleteAlert}
        showProgress={false}
        title={"Coordenadas do Ponto"}
        message={"Apagar as coordenados deste ponto!"}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Não Apagar"
        confirmText="   Apagar   "
        cancelButtonColor={COLORS.main}
        confirmButtonColor={COLORS.danger}
        onCancelPressed={() => {
          setDeleteAlert(false);
        }}
        onConfirmPressed={() => {
          setDeleteAlert(false);
          FLAG = true;
        }}
      />

      <Stack direction="row" w="100%">
        <Box
          w="20%"
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#000",
              fontFamily: "JosefinSans-Bold",
              fontSize: 20,
            }}
          >
            P{item?.position}
          </Text>
        </Box>
        <Box w="60%">
          <Stack direction="row">
            <Box>
              <Text
                style={{
                  color: "#000",
                  fontFamily: "JosefinSans-Regular",
                }}
              >
                Latitude:{"  "}
              </Text>
              <Text
                style={{
                  color: "#000",
                  fontFamily: "JosefinSans-Regular",
                }}
              >
                Longitude:{"  "}
              </Text>
            </Box>
            <Box>
              <Text
                style={{
                  color: "#000",
                  fontFamily: "JosefinSans-Regular",
                }}
              >
                {item?.latitude}
              </Text>
              <Text
                style={{
                  color: "#000",
                  fontFamily: "JosefinSans-Regular",
                }}
              >
                {item?.longitude}
              </Text>
            </Box>
          </Stack>
        </Box>
        <Box w="20%" alignItems={"center"}>
          <Box
            w="50%"
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              disabled={item?.icon === "check-circle" ? true : false}
              onPress={() => {
                if (item.icon === "delete-forever") {
                  setDeleteAlert(true);
                }
              }}
            >
              <Icon
                name={item.icon}
                size={25}
                color={item.icon === "check-circle" ? COLORS.main : "red"}
              />
            </TouchableOpacity>
          </Box>
        </Box>
      </Stack>
    </View>
  );
};

export default CoordinatesItem;
