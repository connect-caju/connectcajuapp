/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { TouchableOpacity, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Avatar, Icon } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  responsiveFontSize,
} from "react-native-responsive-dimensions";

import { Box, Center, Stack } from "native-base";
import { getInitials } from "../../helpers/getInitials";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../consts/colors";
import { resourceValidation } from "../../consts/resourceValidation";
import { farmerTypes } from "../../consts/farmerTypes";
import ResourceSignature from "../ResourceSignature/ResourceSignature";

const GroupItem = ({
  item,
  customUserData
}: any) => {
  const navigation = useNavigation();
  const [farmlandStatus, setFarmlandStatus] = useState("");

  useEffect(() => {
    if (item?.farmlandsList?.length > 0) {
      if (
        item?.farmlandsList.some(
          (farmland: any) => farmland.status === resourceValidation.status.invalidated,
        )
      ) {
        setFarmlandStatus(resourceValidation.status.invalidated);
      } else if (
        item?.farmlandsList.some(
          (farmland: any) => farmland.status === resourceValidation.status.pending,
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
    className="bg-white dark:bg-gray-800 mx-2 my-1 py-1 rounded-md"
    >
      <Box
        // @ts-expect-error TS(2322): Type '{ children: Element; style: { position: stri... Remove this comment to see the full error message
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
            title={item.imageAlt}
            containerStyle={{ backgroundColor: COLORS.grey }}
            source={{ uri: item.image }}
          />
        </Center>

        <Box w="80%" pt="3">
          <TouchableOpacity
            onPress={() => {
              // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
              navigation.navigate("Profile", {
                ownerId: item._id,
                farmersIDs: item?.farmersIDs,
                farmerType: farmerTypes.group,
              });
            }}
          >
            <Text
              className="text-gray-600 text-[15px] font-semibold"
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {item?.name}
              <Text
                className="text-gray-600 text-[12px] font-semibold"
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >
                {" "}
                ({item?.type})
              </Text>
            </Text>
            <Text
              className={"text-gray-500 text-xs font-light"}
            >
              {item.legalStatus} (Criado em {item.creationYear})
            </Text>
            <ResourceSignature
              resource={item}
              customUserData={customUserData}
            />
          </TouchableOpacity>
        </Box>
      </Stack>

    </View>
  );
};

export default GroupItem;
