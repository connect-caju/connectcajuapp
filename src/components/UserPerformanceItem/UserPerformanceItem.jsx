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
      <Text
        className={`font-bold pt-6 text-md text-center text-[${bgColor}]`}
      >
        {label}
      </Text>
      <View className="flex flex-row items-center justify-around gap-4">
        <View
          style={{
            backgroundColor: bgColor,
          }}
          className={"h-10 w-24 items-center justify-center rounded-t-md"}
        >
          <Text className="text-xl font-normal text-white">
            {getPercentage(achieved, target)}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: bgColor,
          }}
          className={"h-10 w-24 items-center justify-center rounded-t-md"}
        >
          <Text className="text-xl font-normal text-white">{target}</Text>
        </View>
      </View>
    </>
  );
};

export default UserPerformanceItem;
