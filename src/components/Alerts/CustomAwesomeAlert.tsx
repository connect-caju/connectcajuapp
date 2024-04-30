import React from "react"
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View } from "react-native"
import AwesomeAlert from "react-native-awesome-alerts"

const CustomAwesomeAlert = ({
  alert,
  title,
  message,
  confirmText,
  cancelText,
  showCancelButton,
  showConfirmButton,
  onCancelPressed,
  onConfirmPressed
}: any) => {
  return (
    <AwesomeAlert
      show={alert}
      titleStyle={{
        fontSize: 20,
        // @ts-expect-error TS(2304): Cannot find name 'COLORS'.
        color: COLORS.main,
        fontWeight: "bold",
      }}
      messageStyle={{
        fontSize: 18,
        // @ts-expect-error TS(2304): Cannot find name 'COLORS'.
        color: COLORS.grey,
        fontFamily: "JosefinSans-Regular",
        lineHeight: 20,
      }}
      alertContainerStyle={
        {
          // width: 300,
        }
      }
      cancelButtonStyle={{
        width: 600,
      }}
      cancelButtonTextStyle={{
        fontSize: 100,
      }}
      confirmButtonStyle={{}}
      confirmButtonTextStyle={{}}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showCancelButton={showCancelButton}
      showConfirmButton={showConfirmButton}
      cancelText={cancelText}
      confirmText={confirmText}
      cancelButtonColor="#DD6B55"
      // @ts-expect-error TS(2304): Cannot find name 'COLORS'.
      confirmButtonColor={COLORS.main}
      onCancelPressed={onCancelPressed}
      onConfirmPressed={onConfirmPressed}
    />
  )
}
