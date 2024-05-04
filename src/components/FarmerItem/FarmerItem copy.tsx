import { TouchableOpacity, View, Text } from "react-native"
import React, { useState, useEffect } from "react"
import { Icon, Avatar } from "@rneui/themed"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen"

import {
  responsiveFontSize,
} from "react-native-responsive-dimensions"
import Animated, {
  Layout,
  LightSpeedInLeft,
  LightSpeedOutRight,
} from "react-native-reanimated"

import { Box, Center, Stack } from "native-base"
import { getInitials } from "../../helpers/getInitials"
import { useNavigation } from "@react-navigation/native"
import COLORS from "../../consts/colors"
import { months } from "../../helpers/dates"
import { resourceValidation } from "../../consts/resourceValidation"


import { realmContext } from "../../models/realmContext"
const { useRealm, useQuery, useObject } = realmContext


const FarmerItem = ({
  item,
  route,
  farmerType
}: any) => {
  const navigation = useNavigation()
  const [farmlandStatus, setFarmlandStatus] = useState("")

  useEffect(() => {
    if (item?.farmlandsList?.length > 0) {
      if (
        item?.farmlandsList.some(
          (farmland: any) => farmland.status === resourceValidation.status.invalidated,
        )
      ) {
        setFarmlandStatus(resourceValidation.status.invalidated)
      } else if (
        item?.farmlandsList.some(
          (farmland: any) => farmland.status === resourceValidation.status.pending,
        )
      ) {
        setFarmlandStatus(resourceValidation.status.pending)
      } else {
        setFarmlandStatus(resourceValidation.status.validated)
      }
    } else {
    }
  }, [item])

  return (
    <Animated.View
      exiting={LightSpeedOutRight}
      style={{
        paddingHorizontal: 10,
        marginVertical: hp("1%"),
        height: 110,
        width: "100%",
        backgroundColor: "#F5F5F5",
        flex: 1,
        borderTopColor: COLORS.second,
        // borderTopWidth: 2,
        borderTopEndRadius: 10,
        borderTopLeftRadius: 10,
        borderColor: COLORS.main,
        shadowColor: COLORS.main,
        shadowOffset: {
          width: 0,
          height: 3,
        },
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
              : item?.status === resourceValidation.status.validated
              ? "check-circle"
              : "dangerous"
          }
          size={wp("6%")}
          color={
            item?.status === resourceValidation.status.pending
              ? COLORS.danger
              : item?.status === resourceValidation.status.validated
              ? COLORS.main
              : COLORS.red
          }
        />
      </Box>
      <Stack direction="row" w="100%">
        <Center w="15%" m="2">
          <Avatar
            size={wp("16%")}
            rounded
            title={item.imageAlt}
            containerStyle={{ backgroundColor: COLORS.grey }}
            source={{
              uri: item.image,
            }}
          />
          {item?.isSprayingAgent && (
            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element; style: { position: stri... Remove this comment to see the full error message
              style={{
                position: "absolute",
                bottom: -1,
                left: -8,
              }}
            >
              <Icon name="verified-user" size={wp("6%")} color="blue" />
            </Box>
          )}
        </Center>

        <Box w="80%">
          <TouchableOpacity
            onPress={() => {

              // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
              navigation.navigate("Farmer", {
                ownerId: item._id,
                farmersIDs: item?.farmersIDs,
              })
            }}
          >
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                fontFamily: "JosefinSans-Bold",
                color: COLORS.main,
              }}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {item.name}
              <Text
                style={{
                  fontSize: responsiveFontSize(1.7),
                  fontFamily: "JosefinSans-Italic",
                  color: COLORS.main,
                  paddingTop: 6,
                }}
              ></Text>
            </Text>

            <Stack direction="column">
              <Stack direction="row">
                <Box w="100%">
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: any; style: {}; }' is not assign... Remove this comment to see the full error message
                    style={
                      {
                        // flexDirection: 'row',
                      }
                    }
                  >
                    {item.assets?.map((asset: any, index: any) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: responsiveFontSize(1.7),
                          fontFamily: "JosefinSans-Italic",
                        }}
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                      >
                        {asset.category} {asset.subcategory}
                      </Text>
                    ))}
                  </Box>
                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.7),
                          fontFamily: "JosefinSans-Italic",
                        }}
                      >
                        Tel: {item.phone}
                      </Text>
                    </Box>
                    {/* <Box w="50%"> */}
                    {/* <Stack direction="row"> */}
                    <Box
                      // w="30%"

                      // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { flexDirectio... Remove this comment to see the full error message
                      style={{
                        flexDirection: "row",
                        // borderWidth: 1,
                        borderRadius: 20,
                        borderColor:
                          farmlandStatus === resourceValidation.status.pending
                            ? COLORS.danger
                            : farmlandStatus ===
                              resourceValidation.status.validated
                            ? COLORS.main
                            : COLORS.red,
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.7),
                          fontFamily: "JosefinSans-Italic",
                          marginHorizontal: 2,
                          paddingHorizontal: 5,
                        }}
                      >
                        Pomares: {item.farmlands}
                      </Text>
                      <Icon
                        name={
                          farmlandStatus === resourceValidation.status.pending
                            ? "pending-actions"
                            : farmlandStatus ===
                              resourceValidation.status.validated
                            ? "check-circle"
                            : item?.farmlandsList.length === 0
                            ? "error-outline"
                            : "dangerous"
                        }
                        size={wp("6%")}
                        color={
                          farmlandStatus === resourceValidation.status.pending
                            ? COLORS.danger
                            : farmlandStatus ===
                              resourceValidation.status.validated
                            ? COLORS.main
                            : COLORS.red
                        }
                      />
                      {/* </Box> */}
                      {/* </Stack> */}
                    </Box>
                    <Box w="5%"></Box>
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </TouchableOpacity>
        </Box>
      </Stack>

      <Stack
        direction="row"
        w="100%"
        // style={{ paddingTop: 5,  }}
      >
        <Box w="100%">
          <Text
            style={{
              textAlign: "right",
              color: COLORS.grey,
              fontFamily: "JosefinSans-Italic",
              fontSize: responsiveFontSize(1.5),
            }}
          >
            Registo: {item.createdAt} por {item.user}
          </Text>
        </Box>
      </Stack>
    </Animated.View>
  );
}

export default FarmerItem
