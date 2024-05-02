
import React, { useState, useTransition } from "react";
import COLORS from "../../consts/colors";
import { farmerTypes } from "../../consts/farmerTypes";

import { View } from "react-native";
import { faInstitution, faPeopleGroup, faPerson } from "@fortawesome/free-solid-svg-icons";

import { FlatList } from "react-native";


import { Text } from "react-native";

import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

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

const FarmerTypeRadioButtons = ({
  farmerType,
  setFarmerType
}: any) => {
  const [focusedOption, setFocusedOption] = useState(farmerType);
  const [isPending, startTransition] = useTransition();

  const handleFocusedOption = (option: any, farmerType: any) => {
    startTransition(() => {
      setFocusedOption(option);
      setFarmerType(farmerType);
    });
  };

  const keyExtractor = (item: any, index: any) => index.toString();


  return (
    <View
      style={{
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <FlatList
        data={farmerTypeOptions}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={86}
        decelerationRate="fast"
        renderItem={({
          item
        }: any) => {
          return (
            <TouchableOpacity
              style={{
                marginHorizontal: 10,
                backgroundColor:
                  ((focusedOption === item.focusedOption) || (farmerType === item.farmerType))
                    ? COLORS.main
                    : "transparent",
                borderColor:
                  ((focusedOption === item.focusedOption) || (farmerType === item.farmerType))
                    ? COLORS.main
                    : COLORS.lightgrey,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                borderRadius: 8,
                flexDirection: "row",
              }}
              onPress={() => handleFocusedOption(item.focusedOption, item.farmerType)}
            >
              <FontAwesomeIcon
                icon={item.iconName} size={20} color={((focusedOption === item.focusedOption) || (farmerType === item.farmerType))
                  ? COLORS.ghostwhite
                  : COLORS.grey}
              />
              <Text
                style={{
                  fontSize: 14,
                  marginLeft: 3,
                  color:
                    ((focusedOption === item.focusedOption) || (farmerType === item.farmerType))
                      ? COLORS.ghostwhite
                      : COLORS.grey,
                  fontFamily: "JosefinSans-Bold",
                  textAlign: "center",
                }}
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
