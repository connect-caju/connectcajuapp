
import { TouchableOpacity, View, Text } from "react-native"
import React, { useState } from "react"
import { Icon, Avatar } from "@rneui/themed"

import { Box, Center, Stack } from "native-base"
import { useNavigation } from "@react-navigation/native"
import COLORS from "../../consts/colors"
import { resourceValidation } from "../../consts/resourceValidation"
import { getPlantingYears } from "../../helpers/getPlantingYears"

export default function FarmlandItem({
  item,
  route
}: any) {
  const [visible, setVisible] = useState(false)
  const navigation = useNavigation()

  return (
    <View
      style={{
        padding: 10,
        marginVertical: 10,
        // minHeight: 100,
        width: "100%",
        flex: 1,
        borderColor: COLORS.main,
        shadowColor: COLORS.main,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 3,
      }}
    >
      <Box

        // @ts-expect-error TS(2322): Type '{ children: Element; style: { position: stri... Remove this comment to see the full error message
        style={{
          position: "absolute",
          top: 1,
          right: 1,
          zIndex: 1,
        }}
      >
        <Icon
          name={
            item?.status === resourceValidation.status.pending
              ? "pending-actions"
              : item?.validated === resourceValidation.status.validated
              ? "check-circle"
              : "dangerous"
          }
          size={30}
          color={
            item?.status === resourceValidation.status.pending
              ? COLORS.danger
              : item?.validated === resourceValidation.status.validated
              ? COLORS.main
              : COLORS.red
          }
        />
      </Box>
      <TouchableOpacity
        onPress={() => {
          if (item?.ownerType === "Single") {

            // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
            navigation.navigate("Farmer", {
              ownerId: item?.farmerId,
            })
          } else if (item?.ownerType === "Group") {

            // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
            navigation.navigate("Group", {
              ownerId: item?.farmerId,
            })
          } else if (item?.ownerType === "Institution") {

            // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
            navigation.navigate("Institution", {
              ownerId: item?.farmerId,
            })
          }
        }}
      >
        <Stack direction="row" w="100%" space={3}>
          <Box w="50%">
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Bold",
                color: COLORS.main,
              }}
            >
              Anos de plantio:
            </Text>
          </Box>

          <Box w="50%">
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Regular",
                color: COLORS.grey,
              }}
            >
              [ {getPlantingYears(item?.blocks)} ]
            </Text>
          </Box>
        </Stack>

        <Stack direction="row" w="100%" space={3}>
          <Box w="50%">
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Bold",
                color: COLORS.main,
              }}
            >
              Cajueiros:
            </Text>
          </Box>

          <Box w="50%">
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Regular",
                color: COLORS.grey,
              }}
            >
              {item?.trees} árvores.
            </Text>
          </Box>
        </Stack>
      </TouchableOpacity>
    </View>
  )
}

