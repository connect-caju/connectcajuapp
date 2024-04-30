// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    // paddingTop: 5,
    backgroundColor: "ghostwhite",
    padding: 8,
  },
  spinnerTextStyle: {
    color: "#005000",
  },
});

export default styles;
