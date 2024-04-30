/* eslint-disable prettier/prettier */

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { StyleSheet } from "react-native";
import COLORS from "../../consts/colors";

const styles = StyleSheet.create({
  keys: {
    fontFamily: "JosefinSans-Bold",
    color: COLORS.black,
  },
  values: {
    fontFamily: "JosefinSans-Regular",
    color: COLORS.grey,
  },
  iconDescription: {
    textAlign: "center",
    fontFamily: "JosefinSans-Regular",
    color: COLORS.black,
    fontSize: 12,
  },
});

export default styles;
