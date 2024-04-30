/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  input: {
    height: 50,
    flex: 1,
    backgroundColor: "#F8F9FA",
    marginHorizontal: 10,
    paddingLeft: 20,
    borderRadius: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#E4E7EB",
    color: "#555",
  },
  label: {
    textAlign: "left",
    fontFamily: "JosefinSans-Italic",
    fontSize: 12,
  },
  error: {
    textAlign: "right",
    fontFamily: "JosefinSans-Italic",
    fontSize: 12,
    color: "red",
  },
  icon: {
    // position: 'absolute',
    // right: 3,
    // bottom: 5,
  },
});

export default styles;
