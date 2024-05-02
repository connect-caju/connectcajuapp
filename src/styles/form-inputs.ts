import { StyleSheet, Appearance } from "react-native";
import COLORS from "../consts/colors";

const colorScheme = Appearance.getColorScheme() || "light";

export const inputStyles = StyleSheet.create({
    dark: {
        label: {
          color: COLORS.white ,
          fontSize: 16,
          fontFamily: "JosefinSans-Regular",
        },
    },
    light: {
        label: {
            color: COLORS.black,
            fontSize: 16,
            fontFamily: "JosefinSans-Regular",
          },
    }
});
