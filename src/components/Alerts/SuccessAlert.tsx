/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { useNavigation } from "@react-navigation/native";
import { Center, Alert, Stack, Box } from "native-base";
import React, { useState } from "react";
import { Icon, CheckBox } from "@rneui/themed";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Button, Text, View, Pressable, TouchableOpacity } from "react-native";
import COLORS from "../../consts/colors";
import Modal from "react-native-modal";
import { farmerTypes } from "../../consts/farmerTypes";


function SuccessAlert({
  isCoordinatesModalVisible,
  setIsCoordinatesModalVisible,
  farmlandId,

  // an object with 3 properties: ownerId, ownerName and, flag=Individuo/Grupo/Instituicao
  farmerItem,

  // the farmland owner type (Farmer, Group or Institution)
  farmlandOwnerType,

  // the ownerId (farmland owner) is used after a successful farmland registration
  ownerId,

  // the flag here refers to the resourceType (farmer= Single, Group or Institution); (farmland)
  flag
}: any) {
  const navigation = useNavigation();

  // after any successful actor/farmland registration
  // the backward icon takes the user back to the respective registered actor main screen
  const navigateBack = () => {
    if (flag === "farmer") {
      if (
        farmerItem.flag === farmerTypes.farmer ||
        farmerItem.flag === farmerTypes.group ||
        farmerItem.flag === farmerTypes.institution
      ) {
        // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        navigation.navigate("Profile", {
          ownerId: farmerItem.ownerId,
          farmerType: farmerItem.flag,
          farmersIDs: [],
        });
      }
    } else if (flag === "farmland") {
      // after a successful farmland registration
      // find out which actor type is the owner of the farmland
      // take the user back to the current actor screen

      // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      navigation.navigate("Profile", {
        ownerId: ownerId,
        farmerType: farmlandOwnerType,
        farmersIDs: [],
      });
    }
  };

  return (
    <Modal
      isVisible={isCoordinatesModalVisible}
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
                setIsCoordinatesModalVisible(false);
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
            // @ts-expect-error TS(2322): Type '{ children: Element; w: "100%"; h: "60%"; st... Remove this comment to see the full error message
            style={{
              // flex: 1,
              justifyContent: "center",
            }}
          >
            <Stack
              direction="column"
              space={10}
              // py="6"
              // @ts-expect-error TS(2322): Type '{ children: Element[]; direction: "column"; ... Remove this comment to see the full error message
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
          <Center h="40%">
            {/* The block of code below is not used any more. Kindly remove it 
                whenever you feel to
            */}

            {farmlandId && (
              <TouchableOpacity
                onPress={() => {
                  // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                  navigation.navigate("FarmlandAreaAudit", {
                    farmlandId,
                  });
                  setIsCoordinatesModalVisible(false);
                }}
              >
                <Box
                  // @ts-expect-error TS(2322): Type '{ children: Element; style: { borderWidth: n... Remove this comment to see the full error message
                  style={{
                    borderWidth: 2,
                    borderColor: COLORS.main,
                    borderRadius: 30,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "JosefinSans-Bold",
                      color: COLORS.main,
                      textAlign: "center",
                    }}
                  >
                    Auditar Área
                  </Text>
                </Box>
              </TouchableOpacity>
            )}
            {/* 
            The block of code below is still in use
            Do not remove it
        */}
            {farmerItem?.ownerId && (
              <TouchableOpacity
                disabled={farmerItem.flag === farmerTypes.group}
                onPress={() => {
                  // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                  navigation.navigate("FarmlandForm1", farmerItem);
                  setIsCoordinatesModalVisible(false);
                }}
              >
                <Box
                  // @ts-expect-error TS(2322): Type '{ children: Element; style: { borderWidth: n... Remove this comment to see the full error message
                  style={{
                    borderWidth: 2,
                    borderColor: COLORS.main,
                    borderRadius: 30,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    opacity: farmerItem.flag === farmerTypes.group ? 0.4 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: "JosefinSans-Bold",
                      color: COLORS.main,
                      textAlign: "center",
                    }}
                  >
                    {farmerItem.flag === farmerTypes.group ? "Adicionar Membros" : "Registar Pomar"}
                  </Text>
                </Box>
              </TouchableOpacity>
            )}
          </Center>
        </View>
      </View>
    </Modal>
  );
}

export default SuccessAlert;
