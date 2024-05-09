import { Text, Pressable, View } from "react-native";
import React, { useState, useCallback, useEffect, ReactNode } from "react";
import { Icon, CheckBox } from "@rneui/themed";
import COLORS from "../../consts/colors";
import { useColorScheme } from "nativewind";
import { cn } from "../../../lib/utils";

interface InputCheckBoxProps {
  fontFamily: string;
  containerStyle: { backgroundColor: string };
  textStyle: { fontWeight: string; fontSize: number; color: string };
  title?: string;
  isChecked: boolean;
  checkedIcon: ReactNode;
  uncheckedIcon: ReactNode;
  onPress: () => void;
  errorProperty?: string;
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
        fontSize: 16,
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
        <Icon name="check-box" color={COLORS.main} size={35} iconStyle={{fontSize: 32 }} />
      }
      uncheckedIcon={
        <Icon
          name="crop-square"
          color={!!errorProperty ? COLORS.red : colorScheme === "dark" ? COLORS.white : COLORS.black}
          size={35}
          iconStyle={{fontSize: 32, }}
        />
      }
      onPress={onPress}
    />
  );
}
