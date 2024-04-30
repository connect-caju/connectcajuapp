/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import COLORS from "../../consts/colors";

const PrimaryButton = ({
    onPress,
    title,
    disabled = false
}: any) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            className="bg-green-700 disabled:bg-gray-300"
            style={{
                // backgroundColor: COLORS.main,
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
