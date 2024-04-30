/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";
import { Text, Stack, Box, Center } from "native-base";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { ScrollView, View, } from "react-native";
import { Button, Icon } from "@rneui/themed";
import Modal from "react-native-modal";
import CustomDivider from "../Divider/CustomDivider";
import styles from "./styles";

import "react-native-get-random-values";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from "uuid";

import { generateUAID } from "../../helpers/generateUAID";

import { realmContext } from "../../models/realmContext";
import { useEffect } from "react";
import COLORS from "../../consts/colors";
import { dateLimits } from "../../helpers/dates";
import PrimaryButton from "../Buttons/PrimaryButton";
const { useRealm, useQuery, useObject } = realmContext;

export default function IndividualModal({
  modalVisible,
  setModalVisible,
  farmerData,
  setSurname,
  setOtherNames,
  setIsSprayingAgent,
  setGender,
  setFamilySize,
  setAddressVillage,
  setAddressAdminPost,
  setPrimaryPhone,
  setSecondaryPhone,
  setBirthProvince,
  setBirthDistrict,
  setBirthAdminPost,
  setBirthDate,
  setDocType,
  setDocNumber,
  setNuit,
  setFarmerItem,
  setIsCoordinatesModalVisible,
  customUserData,
  setActor,
  actor
}: any) {
  const realm = useRealm();
  const [isActorSaved, setIsActorSaved] = useState(false);

  const currentUserStat = useQuery("UserStat").filtered(
    "userId == $0",
    customUserData?.userId,
  )[0];

  // create a new actor with data received from the form
  const addFarmer = useCallback(
    (farmerData: any, realm: any) => {
      const {
        names,
        // isSprayingAgent,
        gender,
        familySize,
        identifier,
        assets,
        birthDate,
        birthPlace,
        address,
        contact,
        idDocument,
      } = farmerData;

      // use this to check potential farmer duplicates
      const uaid = generateUAID({ names, birthDate, birthPlace });

      // assign actor identification code
      // const identifier = generateUniqueNumber(birthPlace, 'farmer');
      realm.write(async () => {
        const newFarmer = await realm.create("Actor", {
          _id: uuidv4(),
          names,
          uaid,
          identifier,
          gender,
          familySize,
          birthDate,
          birthPlace,
          address,
          contact,
          idDocument,
          assets,
          userDistrict: customUserData?.userDistrict,
          userProvince: customUserData?.userProvince,
          userId: customUserData?.userId,
          userName: customUserData?.name,
        });

        setActor(newFarmer);
        setIsActorSaved(true);

        setFarmerItem({
          ownerId: newFarmer._id,
          ownerName:
            newFarmer.names?.otherNames + " " + newFarmer.names?.surname,
          flag: "Indivíduo",
        });
      });

      // update user stat (1 more farmer registered by the user)
      if (currentUserStat) {
        realm.write(() => {
          // @ts-expect-error TS(2339): Property 'registeredFarmers' does not exist on typ... Remove this comment to see the full error message
          currentUserStat.registeredFarmers =
            // @ts-expect-error TS(2339): Property 'registeredFarmers' does not exist on typ... Remove this comment to see the full error message
            currentUserStat.registeredFarmers + 1;
        });
      } else {
        realm.write(() => {
          const newStat = realm.create("UserStat", {
            _id: uuidv4(),
            userName: customUserData?.name,
            userId: customUserData?.userId,
            userDistrict: customUserData?.userDistrict,
            userProvince: customUserData?.userProvince,
            userRole: customUserData?.role,
            registeredFarmers: 1,
          });
        });
      }
    },
    [realm, farmerData],
  );

  const addSprayingServiceProvider = useCallback(
    (actor: any, realm: any) => {
      const sprayingProviderObject = {
        _id: uuidv4(),
        actorId: actor?._id,
        actorName: actor?.names?.otherNames + " " + actor?.names?.surname,

        userName: customUserData?.name,
        userId: customUserData?.userId,
        userDistrict: customUserData?.userDistrict,
        userProvince: customUserData?.userProvince,
      };

      realm.write(async () => {
        const serviceProvider = await realm.create(
          "SprayingServiceProvider",
          sprayingProviderObject,
        );
      });
    },
    [realm, actor],
  );

  const addActorMembership = useCallback(
    (actor: any, realm: any) => {
      const actorMembershipObject = {
        _id: uuidv4(),
        actorId: actor?._id,
        actorName: actor?.names?.otherNames + " " + actor?.names?.surname,

        userName: customUserData?.name,
        userId: customUserData?.userId,
        userDistrict: customUserData?.userDistrict,
        userProvince: customUserData?.userProvince,
      };

      realm.write(async () => {
        const actorMembership = await realm.create(
          "ActorMembership",
          actorMembershipObject,
        );
      });
    },
    [realm, actor],
  );

  useEffect(() => {
    if (isActorSaved) {
      if (farmerData?.isSprayingAgent) {
        try {
          addSprayingServiceProvider(actor, realm);
        } catch (error) {
          // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
          console.log("Could not save actor as spraying service provider:", {
            cause: error,
          });
        }
      }

      if (farmerData?.isGroupMember) {
        try {
          addActorMembership(actor, realm);
        } catch (error) {
          // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
          console.log("Could not save actor as member of an organization:", {
            cause: error,
          });
        }
      }
      setIsActorSaved(false);
    }
  }, [realm, isActorSaved, farmerData]);

  return (
    <Modal
      isVisible={modalVisible}
      supportedOrientations={["portrait", "landscape"]}
      propagateSwipe
      animationIn={"zoomIn"}
      animationInTiming={600}
      animationOut={"zoomOut"}
      swipeDirection={["left", "right"]}
      hideModalContentWhileAnimating={true}
      swipeThreshold={1000}
    >
      <View>
        <View
          style={{
            width: "100%",
            height: 50,
            flexDirection: "row",
            backgroundColor: COLORS.lightgrey,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <View style={{ width: "90%" }}>
            <Text
              // @ts-expect-error TS(2322): Type '{ children: string; style: { fontFamily: str... Remove this comment to see the full error message
              style={{
                fontFamily: "JosefinSans-Bold",
                fontSize: 16,
                color: COLORS.black,
                paddingTop: 15,
                textAlign: "center",
              }}
            >
              Confirmar Dados
            </Text>
          </View>
          <View
            style={{
              width: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name="close"
              size={20}
              color={COLORS.black}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
        <ScrollView>
          <View
            flex={1}
            onStartShouldSetResponder={() => true}
            style={{
              backgroundColor: COLORS.ghostwhite,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Box mx="2">
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Nome Completo:</Text>
                </Box>
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: any; }... Remove this comment to see the full error message
                <Box w="50%" style={styles.values}>
                  <Box>
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.names?.surname} (Apelido)
                    </Text>
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.names?.otherNames} (Outros nomes)
                    </Text>
                  </Box>
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Provedor de Serviços:</Text>
                </Box>
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: any; }... Remove this comment to see the full error message
                <Box w="50%" style={styles.values}>
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.values}>
                    {farmerData?.isSprayingAgent ? "Sim" : "Não"}
                  </Text>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Membro de organização:</Text>
                </Box>
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: any; }... Remove this comment to see the full error message
                <Box w="50%" style={styles.values}>
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.values}>
                    {farmerData?.isGroupMember ? "Sim" : "Não"}
                  </Text>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Género:</Text>
                </Box>
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: any; }... Remove this comment to see the full error message
                <Box w="50%" style={styles.values}>
                  // @ts-expect-error TS(2322): Type '{ children: any; style: any; }' is not assig... Remove this comment to see the full error message
                  <Text style={styles.values}>{farmerData?.gender}</Text>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Agregado Familiar:</Text>
                </Box>
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: any; }... Remove this comment to see the full error message
                <Box w="50%" style={styles.values}>
                  // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                  <Text style={styles.values}>
                    {farmerData?.familySize} (membros)
                  </Text>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Data Nascimento:</Text>
                </Box>
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: any; }... Remove this comment to see the full error message
                <Box w="50%" style={styles.values}>
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.values}>
                    {farmerData?.birthDate
                      ? `${new Date(farmerData?.birthDate).getDate()}/${new Date(farmerData?.birthDate).getMonth() + 1
                      }/${new Date(farmerData?.birthDate).getFullYear()}`
                      : "Nenhum"}
                  </Text>
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Residência:</Text>
                </Box>
                <Box w="50%">
                  <Box>
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.address?.province} (província)
                    </Text>
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.address?.district} (distrito)
                    </Text>
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.address?.adminPost} (posto admin.)
                    </Text>
                    // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.address?.village
                        ? farmerData?.address?.village + " (localidade)"
                        : "Nenhum (localidade)"}
                    </Text>
                  </Box>
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Telemóveis:</Text>
                </Box>
                <Box w="50%">
                  {farmerData?.contact?.primaryPhone &&
                    farmerData?.contact?.secondaryPhone ? (
                    <Box>
                      // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                      <Text style={styles.values}>
                        {farmerData?.contact?.primaryPhone} (principal)
                      </Text>
                      // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                      <Text style={styles.values}>
                        {farmerData?.contact?.secondaryPhone} (alternativo)
                      </Text>
                    </Box>
                  ) : farmerData?.contact?.primaryPhone ? (
                    <Box>
                      // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                      <Text style={styles.values}>
                        {farmerData?.contact?.primaryPhone} (principal)
                      </Text>
                      // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                      <Text style={styles.values}>Nenhum (alternativo)</Text>
                    </Box>
                  ) : farmerData?.contact?.secondaryPhone ? (
                    <Box>
                      // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                      <Text style={styles.values}>Nenhum (principal)</Text>
                      // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                      <Text style={styles.values}>
                        {farmerData?.contact?.secondaryPhone} (alternativo)
                      </Text>
                    </Box>
                  ) : (
                    <Box>
                      // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                      <Text style={styles.values}>Nenhum (principal)</Text>
                      // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                      <Text style={styles.values}>Nenhum (alternativo)</Text>
                    </Box>
                  )}
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Local Nascimento:</Text>
                </Box>
                <Box w="50%">
                  {!farmerData?.birthPlace?.province?.includes(
                    "Estrangeiro",
                  ) ? (
                    <Box>
                      // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                      <Text style={styles.values}>
                        {farmerData?.birthPlace?.province + " (província)"}
                      </Text>
                      // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                      <Text style={styles.values}>
                        {farmerData?.birthPlace?.district + " (distrito)"}
                      </Text>
                      // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                      <Text style={styles.values}>
                        {farmerData?.birthPlace?.adminPost + " (posto admin.)"}
                      </Text>
                    </Box>
                  ) : (
                    <Box>
                      // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                      <Text style={styles.values}>
                        {farmerData?.birthPlace?.district +
                          " (País Estrangeiro)"}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Stack direction="row" w="100%" my="1">
                <Box w="50%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Doc. Identificação:</Text>
                </Box>
                <Box w="50%">
                  {farmerData?.idDocument?.docNumber !== "Nenhum" ? (
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.idDocument?.docNumber} (
                      {farmerData?.idDocument?.docType})
                    </Text>
                  ) : farmerData?.idDocument?.docType === "Não tem" ? (
                    // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                    <Text style={styles.values}>Não tem</Text>
                  ) : (
                    // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                    <Text style={styles.values}>Nenhum (Nenhum)</Text>
                  )}
                </Box>
              </Stack>
              <Stack direction="row" w="100%" my="1">
                <Box w="50%"></Box>
                <Box w="50%">
                  {farmerData?.idDocument?.nuit ? (
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.idDocument?.nuit} (NUIT)
                    </Text>
                  ) : (
                    // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                    <Text style={styles.values}>Nenhum (NUIT)</Text>
                  )}
                </Box>
              </Stack>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <Center w="100%" py="3">
                <PrimaryButton 
                  onPress={() => {
                    try {
                      addFarmer(farmerData, realm);
                      setModalVisible(false);
                      setIsCoordinatesModalVisible(true);
                    } catch (error) {
                      throw new Error("Failed to register IndividualFarmer", {
                        // @ts-expect-error TS(2322): Type 'unknown' is not assignable to type 'Error | ... Remove this comment to see the full error message
                        cause: error,
                      });
                    } finally {
                      setSurname("");
                      setOtherNames("");
                      setIsSprayingAgent(false);
                      setGender("");
                      setFamilySize("");
                      setAddressVillage("");
                      setAddressAdminPost("");
                      setPrimaryPhone(null);
                      setSecondaryPhone(null);
                      setBirthProvince("");
                      setBirthDistrict("");
                      setBirthAdminPost("");
                      setBirthDate(new Date(dateLimits.maximumDate));
                      setDocType("");
                      setDocNumber("");
                      setNuit(null);
                    }
                  }}
                  title="Salvar dados"
                />
              </Center>
            </Box>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
