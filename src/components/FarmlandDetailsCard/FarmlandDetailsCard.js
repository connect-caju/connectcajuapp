/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import { Icon } from "@rneui/base";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import COLORS from "../../consts/colors";
import { useNavigation } from "@react-navigation/native";
import { farmerTypes } from "../../consts/farmerTypes";
import { roles } from "../../consts/roles";

export default function FarmlandDetailsCard({
  refresh,
  setRefresh,
  farmer,
  customUserData,
  farmerType,
}) {
  const navigation = useNavigation();


  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: COLORS.ghostwhite,
        elevation: 3,
        opacity: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 8,
        }}
      >
        {
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              minHeight: 100,
            }}
          >
            {roles.haveReadAndWritePermissions.some(
              (role) => role === customUserData?.role,
            ) && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("FarmlandForm1", {
                      ownerId: farmer._id,
                      ownerName:
                        farmerType === farmerTypes.farmer
                          ? `${farmer?.names?.otherNames} ${farmer?.names?.surname}`
                          : `${farmer?.name}`,
                      ownerImage: farmer?.image || "",
                      ownerAddress: farmer?.address,
                      flag: farmerType,
                    });
                    setRefresh(!refresh);
                  }}
                >
                  <Icon name="add-circle" size={60} color={COLORS.main} />
                </TouchableOpacity>
              )}
          </View>
        }
      </View>
    </Animated.View>
  );
}
