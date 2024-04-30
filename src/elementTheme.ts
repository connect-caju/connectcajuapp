/* eslint-disable prettier/prettier */
import { createTheme } from "@rneui/themed";

const elementTheme = createTheme({
  lightColors: {
    primary: "#e7e7e8",
  },
  darkColors: {
    primary: "#000",
  },
  mode: "light",
  components: {
    Button: {
      containerStyle: {
        margin: 10,
      },
      titleStyle: {
        color: "white",
        fontSize: 18,
        fontFamily: "JosefinSans-Bold",
      },
      buttonStyle: {
        backgroundColor: "#005000",
        borderRadius: 10,
        minWidth: 150,
        height: 50,
      },
    },
    Input: {
      containerStyle: {},
      disabledInputStyle: {},
      inputContainerStyle: {},
      // @ts-expect-error TS(2322): Type '{}' is not assignable to type 'string'.
      errorMessage: {},
      errorStyle: {},
      errorProps: {},
      inputStyle: {},
      // @ts-expect-error TS(2322): Type '{}' is not assignable to type 'ReactNode'.
      label: {},
      labelStyle: {},
      labelProps: {},
      leftIcon: {},
      leftIconContainerStyle: {},
      rightIcon: {},
      rightIconContainerStyle: {},
      // @ts-expect-error TS(2322): Type '{}' is not assignable to type 'ComponentType... Remove this comment to see the full error message
      InputComponent: {},
      placeholder: {},
    },
    ListItem: {
      containerStyle: {
        marginBottom: 5,
        marginTop: 5,
      },
    },
    Icon: {
      containerStyle: {},
    },
    // ListItemTitle: {
    //     titleStyle: {
    //         color: 'red',
    //     },
    // },
    FAB: {},
  },
});

export default elementTheme;
