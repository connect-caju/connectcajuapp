/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { TouchableOpacity, View, Text } from "react-native";
import React from "react";
import { Avatar } from "@rneui/themed";

import { Box, Center, Stack } from "native-base";
import { getInitials } from "../../helpers/getInitials";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../consts/colors";
import { getPercentage } from "../../helpers/getPercentage";

export default function StatItem({
  item,
  route
}: any) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        navigation.navigate("UserStat", {
          userId: item?.userId,
          userName: item?.userName,
        });
      }}
      className="flex flex-1 bg-white dark:bg-gray-800 mx-2 my-1 py-2 rounded-md "
    >
      <Stack direction="row" w="100%">
        <Center w="20%">
          <Avatar
            size={50}
            rounded
            title={getInitials(item?.userName)}
            containerStyle={{ backgroundColor: COLORS.grey }}
            source={{ uri: "http://localhost/not-set-yet" }}
          />
        </Center>
        <Box w="80%">
          <Text
            className="text-gray-600 text-sm font-normal"
          >
            {item?.userName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingRight: 6,
            }}
          >
            <View>
              <Text
                className="text-xs text-gray-400 font-normal"
              >
                Produtores ({getPercentage(item?.registeredFarmers, item?.targetFarmers)})
              </Text>
            </View>
            <View>
              <Text
                className="text-xs text-gray-400 font-normal"
              >
                Pomares ({getPercentage(
                  item?.registeredFarmlands,
                  item?.targetFarmlands,
                )})
              </Text>
            </View>
          </View>
        </Box>
      </Stack>
    </TouchableOpacity>
  );
}

// export default StatItem;
