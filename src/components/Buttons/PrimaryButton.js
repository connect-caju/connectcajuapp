/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import COLORS from "../../consts/colors";

const PrimaryButton = ({ onPress, title, disabled = false }) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={{
                backgroundColor: COLORS.main,
                width: "100%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
            }}
        >
            <Text
                style={{
                    fontSize: 18,
                    fontFamily: "RobotoCondensed-Thin",
                    color: COLORS.white,
                }}
            >{title}</Text>
        </TouchableOpacity>
    );
};

export default PrimaryButton;
