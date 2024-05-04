
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Stack, Box, Center } from "native-base"
import CustomDivider from "../Divider/CustomDivider"
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faEllipsisVertical,
  faEye,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons"
import COLORS from "../../consts/colors"

const { SlideInMenu } = renderers

export function CustomizedMenuOption({
  text,
  iconName,
  value
}: any) {
  return (
    <MenuOption

      // @ts-expect-error TS(2304): Cannot find name 'alert'.
      onSelect={() => alert(`You clicked ${value}`)}
      customStyles={{
        optionWrapper: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      }}
    >
      <FontAwesomeIcon icon={iconName} size={20} color={COLORS.grey} />
      <Text>{text}</Text>
    </MenuOption>
  )
}

export function PopupMenu({}) {
  const [isOpen, setIsOpen] = useState(false)
  const navigation = useNavigation()

  return (
    <MenuProvider backHandler={true} style={{}}>
      <Menu renderer={SlideInMenu}>
        <MenuTrigger
          // text="Click"
          customStyles={{
            triggerWrapper: {
              // top: -20,
            },
          }}
        >
          <Box>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              size={20}
              color={COLORS.main}

              // @ts-expect-error TS(2322): Type '{ icon: IconDefinition; size: number; color:... Remove this comment to see the full error message
              fade
            />
          </Box>
        </MenuTrigger>

        <MenuOptions
          customStyles={{
            optionsContainer: {
              // borderRadius: 8,
              // flexDirection: 'row'
            },
          }}
        >
          <CustomizedMenuOption
            text="Aderir a uma organização"
            iconName={faPeopleGroup}
          />
          <CustomDivider />
          <CustomizedMenuOption text="Ver organizações" iconName={faEye} />
        </MenuOptions>
      </Menu>
    </MenuProvider>
  )
}

export function PopMenuWrapper({
  children
}: any) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#231547",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
})

