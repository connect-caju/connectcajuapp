import React, { useState, useEffect } from "react"
import { Button, Box, Center } from "native-base"
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native"
import { Icon, } from "@rneui/themed"
import {
   faBirthdayCake,
  faHome,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"

import COLORS from "../../consts/colors"
import { useNavigation } from "@react-navigation/native"
import CustomDivider from "../Divider/CustomDivider"
import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator"

const DuplicatesAlertItem = ({
  suspectedDuplicates
}: any) => {
  const navigation = useNavigation()
  const [itemIndex, setItemIndex] = useState(0)
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)

  const setNextItem = (itemsList: any) => {
    if (
      (itemsList?.length > 0 && itemIndex === itemsList?.length - 1) ||
      itemsList?.length === 1
    ) {
      setItemIndex(0)
    } else {
      setItemIndex((prev) => prev + 1)
    }
  }

  useEffect(() => {}, [itemIndex])

  if (loadingActivitiyIndicator) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CustomActivityIndicator
          backgroundColor={COLORS.dark}
          indicatorColor={COLORS.ghostwhite}
          loadingActivitiyIndicator={loadingActivitiyIndicator}
          setLoadingActivityIndicator={setLoadingActivityIndicator}
        />
      </View>
    )
  }

  return (
    <Box

      // @ts-expect-error TS(2322): Type '{ children: Element; style: { width: string;... Remove this comment to see the full error message
      style={{
        width: "85%",
        alignItems: "center",
        padding: 10,
        backgroundColor: COLORS.ghostwhite,
        borderRadius: 20,
      }}
    >
      <View>
        <Box

          // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { flexDirectio... Remove this comment to see the full error message
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity style={{}} onPress={() => {}}></TouchableOpacity>

          <Box

            // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { flexDirectio... Remove this comment to see the full error message
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: COLORS.grey,
                fontFamily: "JosefinSans-Regular",
              }}
            >
              {itemIndex + 1}/{suspectedDuplicates?.length}
            </Text>

            <TouchableOpacity
              style={{}}
              onPress={() => {
                setLoadingActivityIndicator(true)
                setNextItem(suspectedDuplicates)
              }}
            >
              <Icon name="arrow-forward-ios" size={25} color={COLORS.grey} />
            </TouchableOpacity>
          </Box>
        </Box>

        <Box

          // @ts-expect-error TS(2322): Type '{ children: Element; style: { paddingBottom:... Remove this comment to see the full error message
          style={{
            paddingBottom: 20,
            justifyContent: "center",
          }}
        >
          {suspectedDuplicates[itemIndex]?.image ? (
            <Center>
              <Image
                source={{ uri: suspectedDuplicates[itemIndex].image }}
                style={{
                  width: 150,
                  height: 150,
                  marginHorizontal: 3,
                  borderRadius: 120,
                }}
              />
            </Center>
          ) : (
            <Center>
              <Icon name="account-circle" size={180} color={COLORS.lightgrey} />
            </Center>
          )}
        </Box>

        <Box

          // @ts-expect-error TS(2322): Type '{ children: Element; style: { paddingBottom:... Remove this comment to see the full error message
          style={{
            paddingBottom: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              fontFamily: "JosefinSans-Bold",
              color: COLORS.black,
            }}
          >
            {suspectedDuplicates[itemIndex]?.names?.otherNames}{" "}
            {suspectedDuplicates[itemIndex]?.names?.surname}
          </Text>
        </Box>
        <Box>
          <CustomDivider thickness={2} my={2} bg={COLORS.grey} />
        </Box>

        <Box

          // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingVerti... Remove this comment to see the full error message
          style={{
            paddingVertical: 20,
          }}
        >
          <Box

            // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { flexDirectio... Remove this comment to see the full error message
            style={{
              flexDirection: "row",
              width: "100%",
              paddingVertical: 5,
              justifyContent: "center",
            }}
          >
            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element; style: { width: string;... Remove this comment to see the full error message
              style={{
                width: "20%",
              }}
            >
              <FontAwesomeIcon
                icon={faBirthdayCake}
                size={25}
                color={COLORS.grey}
              />
            </Box>

            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element; style: { width: string;... Remove this comment to see the full error message
              style={{
                width: "80%",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: COLORS.grey,
                  fontFamily: "JosefinSans-Regular",
                }}
              >
                {new Date(suspectedDuplicates[itemIndex]?.birthDate).getDate()}/
                {new Date(
                  suspectedDuplicates[itemIndex]?.birthDate,
                ).getMonth() + 1}
                /
                {new Date(
                  suspectedDuplicates[itemIndex]?.birthDate,
                ).getFullYear()}{" "}
                ({suspectedDuplicates[itemIndex]?.birthPlace?.province}:{" "}
                {suspectedDuplicates[itemIndex]?.birthPlace?.district})
              </Text>
            </Box>
          </Box>

          <Box

            // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { flexDirectio... Remove this comment to see the full error message
            style={{
              flexDirection: "row",
              width: "100%",
              paddingVertical: 5,
              justifyContent: "center",
            }}
          >
            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element; style: { width: string;... Remove this comment to see the full error message
              style={{
                width: "20%",
                // justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon
                style={
                  {
                    // alignSelf: 'center',
                  }
                }
                icon={faHome}
                size={25}
                color={COLORS.grey}
              />
            </Box>

            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element; style: { width: string;... Remove this comment to see the full error message
              style={{
                width: "80%",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: COLORS.grey,
                  fontFamily: "JosefinSans-Regular",
                }}
              >
                {suspectedDuplicates[itemIndex]?.address?.province} (
                {suspectedDuplicates[itemIndex]?.address?.district})
              </Text>
            </Box>
          </Box>
        </Box>

        <Box>
          <CustomDivider thickness={2} my={2} bg={COLORS.grey} />
        </Box>
        <Box

          // @ts-expect-error TS(2322): Type '{ children: Element; style: { paddingTop: nu... Remove this comment to see the full error message
          style={{
            paddingTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: COLORS.grey,
              fontFamily: "JosefinSans-Regular",
            }}
          >
            Registado por {suspectedDuplicates[itemIndex]?.userName} aos{" "}
            {new Date(suspectedDuplicates[itemIndex]?.createdAt).getDate()}/
            {new Date(suspectedDuplicates[itemIndex]?.createdAt).getMonth() + 1}
            /{new Date(suspectedDuplicates[itemIndex]?.createdAt).getFullYear()}
          </Text>
        </Box>
      </View>
    </Box>
    // </Animated.View>
  )
}

export default DuplicatesAlertItem
