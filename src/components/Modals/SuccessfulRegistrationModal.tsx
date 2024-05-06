import { useNavigation } from "@react-navigation/native";
import { Center, Alert, Stack, Box } from "native-base";
import React, { useState } from "react";
import { Icon, CheckBox } from "@rneui/themed";
import { Button, Text, View, Pressable, TouchableOpacity } from "react-native";
import COLORS from "../../consts/colors";
import Modal from "react-native-modal";
import { farmerTypes } from "../../consts/farmerTypes";

interface SuccessfulRegistrationModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean)=>void
  actor: any;
}

export default function SuccessfulRegistrationModal({
  isOpen,
  setIsOpen,
  actor 
}: SuccessfulRegistrationModalProps) {
  const navigation = useNavigation();

  // after any successful actor/farmland registration
  // the backward icon takes the user back to the respective registered actor main screen
  const navigateBack = () => {
    // if (flag === "farmer") {
    //   if (
    //     farmerItem.flag === farmerTypes.farmer ||
    //     farmerItem.flag === farmerTypes.group ||
    //     farmerItem.flag === farmerTypes.institution
    //   ) {

        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        navigation.navigate("Profile", {
          ownerId: actor._id,
          // farmerType: farmerItem.flag,
        });
    //   }
    // } else if (flag === "farmland") {
    //   // after a successful farmland registration
    //   // find out which actor type is the owner of the farmland
    //   // take the user back to the current actor screen


    //   // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
    //   navigation.navigate("Profile", {
    //     ownerId: ownerId,
    //     farmerType: farmlandOwnerType,
    //     farmersIDs: [],
    //   });
    // }
  };

  return (
    <Modal
      isVisible={isOpen}
      supportedOrientations={["portrait", "landscape"]}
      propagateSwipe
      animationIn={"zoomIn"}
      animationInTiming={600}
      animationOut={"zoomOut"}
      hideModalContentWhileAnimating={true}
      swipeThreshold={1000}
    >
      <View
        style={{
          backgroundColor: COLORS.ghostwhite,
          height: "100%",
          width: "100%",
        }}
      >
        <View
          style={{
            flex: 1,
            marginTop: 25,
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <Box w="100%">
            <Pressable
              onPress={() => {
                navigateBack();
                setIsOpen(false);
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 4,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="arrow-back" color={COLORS.main} size={30} />
            </Pressable>
          </Box>
          <Box
            w="100%"
            h="60%"

          >
            <Stack
              direction="column"
              space={10}
              mh="10"
              w="100%"
            >
              <Box alignItems={"center"}>
                <Icon name="check-circle" size={150} color={COLORS.main} />
              </Box>
              <Box
                w="100%"
                alignItems={"center"}
              // ph="40"
              >
                <Text
                  style={{
                    fontFamily: "JosefinSans-Bold",
                    textAlign: "center",
                    color: COLORS.main,
                    fontSize: 24,
                    paddingHorizontal: 30,
                  }}
                >
                  Registo ocorrido com successo!
                </Text>
              </Box>
            </Stack>
          </Box>

        </View>
      </View>
    </Modal>
  );
}
