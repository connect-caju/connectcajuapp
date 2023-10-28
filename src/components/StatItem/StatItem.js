/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { TouchableOpacity, View, Text } from "react-native";
import React from "react";
import { Avatar } from "@rneui/themed";

import { Box, Center, Stack } from "native-base";
import { getInitials } from "../../helpers/getInitials";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../consts/colors";
import { getPercentage } from "../../helpers/getPercentage";

export default function StatItem({ item, route }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UserStat", {
          userId: item?.userId,
          userName: item?.userName,
        });
      }}
      style={{
        padding: 6,
        alignSelf: "center",
        margin: 10,
        elevation: 1,
        width: "100%",
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.lightestgrey,
        shadowColor: COLORS.main,
      }}
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
            style={{
              fontSize: 16,
              fontFamily: "JosefinSans-Bold",
              color: COLORS.black,
            }}
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
                style={{
                  color: COLORS.grey,
                  fontFamily: "JosefinSand-Bold",
                  fontSize: 12,
                }}
              >
                Produtores ({getPercentage(item?.registeredFarmers, item?.targetFarmers)})
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: COLORS.grey,
                  fontFamily: "JosefinSand-Bold",
                  fontSize: 12,
                }}
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
