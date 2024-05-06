import React, { useCallback, useState } from "react";
import { Text, Stack, Box, Center } from "native-base";
import { ScrollView, View, } from "react-native";
import { Button, Icon } from "@rneui/themed";
import Modal from "react-native-modal";
import CustomDivider from "../Divider/CustomDivider";
import styles from "./styles";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { generateUAID } from "../../helpers/generateUAID";
import { useEffect } from "react";
import COLORS from "../../consts/colors";
import { dateLimits } from "../../helpers/dates";
import PrimaryButton from "../Buttons/PrimaryButton";

import { realmContext } from "../../models/realmContext";
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
          currentUserStat.registeredFarmers =  currentUserStat.registeredFarmers + 1;
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

          console.log("Could not save actor as spraying service provider:", {
            cause: error,
          });
        }
      }

      if (farmerData?.isGroupMember) {
        try {
          addActorMembership(actor, realm);
        } catch (error) {
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
          <View style={{ width: "90%", fontFamily: "JosefinSans-Bold",
                fontSize: 16,
                color: COLORS.black,
                paddingTop: 15,
                textAlign: "center", }}>
            <Text>
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
        <ScrollView
          
        >
          <View
            flex={1}
            onStartShouldSetResponder={() => true}
            style={{
              backgroundColor: COLORS.ghostwhite,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <View style={{marginHorizontal: 2}}>
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                  <Text>Nome Completo:</Text>
                </View>
                <View style={[styles.values, { width: "50%"}]} >
                  <View>
                    <Text>
                      {farmerData?.names?.surname} (Apelido)
                    </Text>
                    <Text>
                      {farmerData?.names?.otherNames} (Outros nomes)
                    </Text>
                  </View>
                </View>
              </View>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                  <Text>Provedor de Serviços:</Text>
                </View>
                <View style={[styles.values, { width: "50%"}]}>
                  <Text>
                    {farmerData?.isSprayingAgent ? "Sim" : "Não"}
                  </Text>
                </View>
              </View>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                  <Text>Membro de organização:</Text>
                </View>
                <View style={[styles.values, { width: "50%"}]}>
                  <Text>
                    {farmerData?.isGroupMember ? "Sim" : "Não"}
                  </Text>
                </View>
              </View>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                  <Text>Género:</Text>
                </View>
                <View style={[styles.values, { width: "50%"}]}>
                  <Text>{farmerData?.gender}</Text>
                </View>
              </View>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                  <Text>Agregado Familiar:</Text>
                </View>
                <View style={[styles.values, { width: "50%"}]}>
                  <Text>
                    {farmerData?.familySize} (membros)
                  </Text>
                </View>
              </View>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                  <Text>Data Nascimento:</Text>
                </View>
                <View style={[styles.values, { width: "50%"}]}>
                  <Text>
                    {farmerData?.birthDate
                      ? `${new Date(farmerData?.birthDate).getDate()}/${new Date(farmerData?.birthDate).getMonth() + 1
                      }/${new Date(farmerData?.birthDate).getFullYear()}`
                      : "Nenhum"}
                  </Text>
                </View>
              </View>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                  <Text>Residência:</Text>
                </View>
                <View style={{ width: "50%"}}>
                  <View style={[styles.values, ]}>
                      <Text>
                      {farmerData?.address?.province} (província)
                    </Text>
                    <Text>
                      {farmerData?.address?.district} (distrito)
                    </Text>
                    <Text>
                      {farmerData?.address?.adminPost} (posto admin.)
                    </Text>
                    <Text>
                      {farmerData?.address?.village
                        ? farmerData?.address?.village + " (localidade)"
                        : "Nenhum (localidade)"}
                    </Text>
                  </View>
                </View>
              </View>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                   <Text>Telemóveis:</Text>
                </View>
                <View style={{ width: "50%"}}>
                  {farmerData?.contact?.primaryPhone &&
                    farmerData?.contact?.secondaryPhone ? (
                    <View style={styles.values}>
                      <Text>
                        {farmerData?.contact?.primaryPhone} (principal)
                      </Text>
                      <Text>
                        {farmerData?.contact?.secondaryPhone} (alternativo)
                      </Text>
                    </View>
                  ) : farmerData?.contact?.primaryPhone ? (
                    <View style={styles.value}>
                      <Text>
                        {farmerData?.contact?.primaryPhone} (principal)
                      </Text>
                      <Text>Nenhum (alternativo)</Text>
                    </View>
                  ) : farmerData?.contact?.secondaryPhone ? (
                    <View style={styles.value}>
                      <Text>Nenhum (principal)</Text>
                      <Text>
                        {farmerData?.contact?.secondaryPhone} (alternativo)
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.values}>
                      <Text>Nenhum (principal)</Text>
                      <Text>Nenhum (alternativo)</Text>
                    </View>
                  )}
                </View>
              </View>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                  <Text>Local Nascimento:</Text>
                </View>
                <View w="50%">
                  {!farmerData?.birthPlace?.province?.includes(
                    "Estrangeiro",
                  ) ? (
                    <View style={styles.values}>
                      <Text>
                        {farmerData?.birthPlace?.province + " (província)"}
                      </Text>
                      <Text>
                        {farmerData?.birthPlace?.district + " (distrito)"}
                      </Text>
                      <Text>
                        {farmerData?.birthPlace?.adminPost + " (posto admin.)"}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.values}>
                      <Text>
                        {farmerData?.birthPlace?.district +
                          " (País Estrangeiro)"}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}>
                  <Text>Doc. Identificação:</Text>
                </View>
                <View style={[styles.values, { width: "50%"}]}>
                  {farmerData?.idDocument?.docNumber !== "Nenhum" ? (

                    <Text>
                      {farmerData?.idDocument?.docNumber} (
                      {farmerData?.idDocument?.docType})
                    </Text>
                  ) : farmerData?.idDocument?.docType === "Não tem" ? (
                    <Text>Não tem</Text>
                  ) : (
                    <Text>Nenhum (Nenhum)</Text>
                  )}
                </View>
              </View>
              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, { width: "50%"}]}></View>
                <View style={[styles.values, { width: "50%"}]}>
                  {farmerData?.idDocument?.nuit ? (
                    <Text>
                      {farmerData?.idDocument?.nuit} (NUIT)
                    </Text>
                  ) : (
                    <Text>Nenhum (NUIT)</Text>
                  )}
                </View>
              </View>
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
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
