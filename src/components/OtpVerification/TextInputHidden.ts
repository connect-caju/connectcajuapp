
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { TextInput } from "react-native"

export default function TextInputHidden({
  code,
  setCode,
  maximumLength,
  setIsPinReady
}: any) {
  return (
    <TextInput

      // @ts-expect-error TS(2304): Cannot find name 'style'.
      style={{

        // @ts-expect-error TS(7027): Unreachable code detected.
        width: 300,

        // @ts-expect-error TS(2304): Cannot find name 'borderColor'.
        borderColor: "#e5e5e5",

        // @ts-expect-error TS(2304): Cannot find name 'borderWidth'.
        borderWidth: 1,

        // @ts-expect-error TS(2304): Cannot find name 'borderRadius'.
        borderRadius: 5,

        // @ts-expect-error TS(2304): Cannot find name 'padding'.
        padding: 15,
      }}

      // @ts-expect-error TS(2304): Cannot find name 'maxLength'.
      maxLength={maximumLength}
    />
  )
}
