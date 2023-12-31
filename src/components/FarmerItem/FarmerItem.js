/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { TouchableOpacity, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Icon, Avatar } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { responsiveFontSize } from "react-native-responsive-dimensions";

import { Box, Center, Stack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../consts/colors";
import { resourceValidation } from "../../consts/resourceValidation";
import { farmerTypes } from "../../consts/farmerTypes";


const FarmerItem = ({ item, route, farmerType }) => {
  const navigation = useNavigation();
  const [farmlandStatus, setFarmlandStatus] = useState("");

  useEffect(() => {
    if (item?.farmlandsList?.length > 0) {
      if (
        item?.farmlandsList.some(
          (farmland) =>
            farmland.status === resourceValidation.status.invalidated,
        )
      ) {
        setFarmlandStatus(resourceValidation.status.invalidated);
      } else if (
        item?.farmlandsList.some(
          (farmland) => farmland.status === resourceValidation.status.pending,
        )
      ) {
        setFarmlandStatus(resourceValidation.status.pending);
      } else {
        setFarmlandStatus(resourceValidation.status.validated);
      }
    } else {
      // setFarmlandStatus(resourceValidation.status.invalidated);
    }
  }, [item]);

  return (
    <View
      className="bg-white mx-2 my-1 py-1 rounded-md"
    >
      <Box
        style={{
          position: "absolute",
          top: 20,
          right: 5,
          zIndex: 1,
        }}
      >
        <Icon
          name={
            item?.status === resourceValidation.status.pending
              ? "pending-actions"
              : item?.status === resourceValidation.status.validated
                ? "check-circle"
                : "dangerous"
          }
          size={15}
          color={
            item?.status === resourceValidation.status.pending
              ? COLORS.danger
              : item?.status === resourceValidation.status.validated
                ? COLORS.main
                : COLORS.red
          }
        />
      </Box>
      <Stack direction="row" w="100%">
        <Center w="15%" m="2">
          <Avatar
            size={wp("16%")}
            rounded
            title={item?.imageAlt}
            containerStyle={{ backgroundColor: COLORS.grey }}
            source={{
              uri: item?.image,
            }}
          />
          {item?.isSprayingAgent && (
            <Box
              style={{
                position: "absolute",
                bottom: 1,
                left: 2,
              }}
            >
              <Icon name="verified-user" size={15} color="blue" />
            </Box>
          )}
        </Center>

        <Box w="80%" pt="3">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile", {
                ownerId: item._id,
                farmersIDs: item?.farmersIDs,
                farmerType: farmerTypes.farmer,
              });
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "JosefinSans-Bold",
                color: COLORS.black,
              }}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {item?.name}
            </Text>
            {item?.assets?.map((asset, index) => (
              <Text
                key={index}
                style={{
                  fontSize: 14,
                  fontFamily: "JosefinSans-Italic",
                  color: item.farmlands === 0 ? COLORS.danger : COLORS.grey,

                }}
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >
                {asset?.subcategory} {item?.farmlands > 0 ? `${item?.gender === "Feminino" ? "(Dona" : "(Dono"} de ${item?.farmlands} ${item.farmlands <= 1 ? "pomar" : "pomares"})` : "(Sem pomar ainda)"}
              </Text>
            ))}
            <Text
              style={{
                textAlign: "right",
                color: COLORS.grey,
                fontFamily: "JosefinSans-Italic",
                fontSize: 12,
              }}
            >
              Registo: {item?.createdAt} por {item?.user}
            </Text>
          </TouchableOpacity>
        </Box>
      </Stack>
    </View>
  );
};

export default FarmerItem;
