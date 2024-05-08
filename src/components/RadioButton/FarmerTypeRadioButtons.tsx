import React, { RefObject, useRef, useState, useTransition } from "react";
import COLORS from "../../consts/colors";
import { farmerTypes } from "../../consts/farmerTypes";

import { View, FlatList, Text, TouchableOpacity, ScrollView} from "react-native";
import {
  faInstitution,
  faPeopleGroup,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";



import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { cn } from "../../../lib/utils";
import { useColorScheme } from "nativewind";

type ItemType = {
  farmerDisplayName: string;
  farmerType: string;
  iconName: any;
  focusedOption: number;
};

const farmerTypeOptions : ItemType[] = [
  {
    farmerDisplayName: "Singular",
    farmerType: farmerTypes.farmer!,
    iconName: faPerson,
    focusedOption: 1,
  },
  {
    farmerDisplayName: "Cooperativa",
    farmerType: farmerTypes.group!,
    iconName: faPeopleGroup,
    focusedOption: 3,
  },
  {
    farmerDisplayName: "Instituição",
    farmerType: farmerTypes.institution!,
    iconName: faInstitution,
    focusedOption: 2,
  },
];

const FarmerTypeRadioButtons = ({ farmerType, setFarmerType }: any) => {
  const [focusedOption, setFocusedOption] = useState(farmerType);
  const [isPending, startTransition] = useTransition();
  const { colorScheme } = useColorScheme();
  const flatListRef = useRef<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleItemPress = (index: any) => {
    setSelectedIndex(index);
    flatListRef.current?.scrollToIndex({
     index,
      animated: true,
      viewPosition: undefined,
    } as any);
  }

  const handleFocusedOption = (option: ItemType, farmerType: string) => {
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
      ref={flatListRef}
        data={farmerTypeOptions}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={86}
        decelerationRate="fast"
        renderItem={({ item, index }: any) => {
          return (
            <TouchableOpacity
              className={cn(
                "flex flex-row items-center justify-center mx-3 rounded-xl p-2 border border-gray-300",
                focusedOption === item.focusedOption ||
                  farmerType === item.farmerType
                  ? "bg-[#008000] border-[#008000]"
                  : "bg-transparent ",
              )}
              onPress={() =>{
                handleItemPress(index)
                handleFocusedOption(item.focusedOption, item.farmerType)
              }}
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
