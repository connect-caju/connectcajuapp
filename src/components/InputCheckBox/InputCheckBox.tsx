import { Text, Pressable, View } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { Icon, CheckBox } from "@rneui/themed";
import COLORS from "../../consts/colors";
import { useColorScheme } from "nativewind";
import { cn } from "../../../lib/utils";

interface InputCheckBoxProps {
  isChecked: boolean;
  onPress: () => void;
  errorProperty?: string;
  title?: string;
}

export default function InputCheckBox({
  isChecked,
  onPress,
  errorProperty,
  title,
}: InputCheckBoxProps) {
    const { colorScheme } = useColorScheme();
  return (
    <CheckBox
      fontFamily="JosefinSans-Regular"
      containerStyle={{
        backgroundColor: "transparent",
      }}
      textStyle={{
        fontWeight: "100",
        fontSize: 18,
        color: isChecked
          ? COLORS.main
          : !!errorProperty
          ? COLORS.red
          : colorScheme === "dark"
          ? COLORS.white
          : COLORS.black,
      }}
      title={title}
      checked={isChecked}
      checkedIcon={
        <Icon name="check-box" color={COLORS.main} size={35} iconStyle={{}} />
      }
      uncheckedIcon={
        <Icon
          name="crop-square"
          color={!!errorProperty ? COLORS.red : colorScheme === "dark" ? COLORS.white : COLORS.black}
          size={35}
          iconStyle={{}}
        />
      }
      onPress={onPress}
    />
  );
}
