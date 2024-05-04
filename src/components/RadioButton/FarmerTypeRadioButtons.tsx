import React, { useState, useTransition } from "react";
import COLORS from "../../consts/colors";
import { farmerTypes } from "../../consts/farmerTypes";

import { View } from "react-native";
import {
  faInstitution,
  faPeopleGroup,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

import { FlatList } from "react-native";

import { Text } from "react-native";

import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { cn } from "../../../lib/utils";
import { useColorScheme } from "nativewind";

const farmerTypeOptions = [
  {
    farmerDisplayName: "Produtor",
    farmerType: farmerTypes.farmer,
    iconName: faPerson,
    focusedOption: 1,
  },
  {
    farmerDisplayName: "Instituição",
    farmerType: farmerTypes.institution,
    iconName: faInstitution,
    focusedOption: 2,
  },
  {
    farmerDisplayName: "Organização",
    farmerType: farmerTypes.group,
    iconName: faPeopleGroup,
    focusedOption: 3,
  },
];

const FarmerTypeRadioButtons = ({ farmerType, setFarmerType }: any) => {
  const [focusedOption, setFocusedOption] = useState(farmerType);
  const [isPending, startTransition] = useTransition();
  const { colorScheme } = useColorScheme();

  const handleFocusedOption = (option: any, farmerType: any) => {
    startTransition(() => {
      setFocusedOption(option);
      setFarmerType(farmerType);
    });
  };

  const keyExtractor = (item: any, index: any) => index.toString();

  return (
    <View
      className="my-4 flex flex-row justify-around"
    >
      <FlatList
        data={farmerTypeOptions}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={86}
        decelerationRate="fast"
        renderItem={({ item }: any) => {
          return (
            <TouchableOpacity
              className={cn(
                "flex flex-row items-center justify-center mx-3 rounded-xl p-2 border border-gray-300",
                focusedOption === item.focusedOption ||
                  farmerType === item.farmerType
                  ? "bg-[#008000] border-[#008000]"
                  : "bg-transparent ",
              )}
              onPress={() =>
                handleFocusedOption(item.focusedOption, item.farmerType)
              }
            >
              <FontAwesomeIcon
                icon={item.iconName}
                size={20}
                color={
                  focusedOption === item.focusedOption ||
                  farmerType === item.farmerType ||
                  colorScheme === "dark"
                    ? COLORS.white
                    : COLORS.black
                }
              />
              <Text
                className={cn(
                  "text-sm text-black dark:text-white text-center ml-0.5",
                  (focusedOption === item.focusedOption ||
                    farmerType === item.farmerType) &&
                    "text-white",
                )}
              >
                {item.farmerDisplayName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default FarmerTypeRadioButtons;
