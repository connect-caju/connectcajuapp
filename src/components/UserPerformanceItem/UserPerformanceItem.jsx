/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { View, Text } from "react-native";
import React from "react";
import { getPercentage } from "../../helpers/getPercentage";
import COLORS from "../../consts/colors";

const UserPerformanceItem = ({ achieved, target, bgColor, label }) => {
  return (
    <>
      <Text className={"font-normal pt-6 text-xs text-center text-gray-600"}>
        {label}
      </Text>
      <View className="flex flex-row items-center justify-around gap-4">
        <View
          className={"h-10 w-24 items-center justify-center rounded-t-md border-2 border-green-600 dark:border-gray-600"}
        >
          <Text className="text-sm font-normal text-green-700">
            {getPercentage(achieved, target)}
          </Text>
        </View>

        <View
          className={"h-10 w-24 items-center justify-center rounded-t-md border-2 border-green-600 dark:border-gray-600"}
        >
          <Text className="text-sm font-normal text-green-700">{target}</Text>
        </View>
      </View>
    </>
  );
};

export default UserPerformanceItem;
