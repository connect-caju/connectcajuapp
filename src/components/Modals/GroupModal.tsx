/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, { useCallback, useEffect, useState } from "react";
import { Text, Stack, Box, Center, Divider } from "native-base";

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { ScrollView, Pressable, View, TouchableOpacity } from "react-native";
import { Button, Icon } from "@rneui/themed";
import CustomDivider from "../Divider/CustomDivider";
import styles from "./styles";
import Modal from "react-native-modal";

import "react-native-get-random-values";

// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from "uuid";
import Realm from "realm";

import SuccessModal from "./SuccessModal";

// @ts-expect-error TS(2307): Cannot find module '../../helpers/generateUUID' or... Remove this comment to see the full error message
import { generateUUID } from "../../helpers/generateUUID";
import { generateFormattedDate } from "../../helpers/generateFormattedDate";
import { generateFormattedAdminPost } from "../../helpers/generateFormattedAdminPost";
import { generateFormattedSurname } from "../../helpers/generateFormattedSurname";
import { useNavigation } from "@react-navigation/native";
import { user } from "../../consts/user";

import { realmContext } from "../../models/realmContext";
import COLORS from "../../consts/colors";
import { groupAffiliationStatus } from "../../consts/groupAffiliationStatus";
import { generateUniqueNumber } from "../../helpers/generateUniqueNumber";
import PrimaryButton from "../Buttons/PrimaryButton";
const { useRealm, useObject, useQuery } = realmContext;

export default function GroupModal({
  modalVisible,
  setModalVisible,
  farmerData,
  farmerType,
  setFarmerType,
  setGroupType,
  setGroupName,
  setGroupAffiliationYear,
  setGroupAdminPost,
  setGroupVillage,

  // setGroupManagerName,
  // setGroupManagerPhone,
  setGroupOperatingLicence,

  setGroupNuit,
  setGroupMembersNumber,
  setGroupWomenNumber,
  setFarmerItem,
  setIsCoordinatesModalVisible,
  customUserData,
}: any) {
  const [addDataModalVisible, setAddDataModalVisible] = useState(false);
  // const [farmerId, setFarmerId] = useState(null);
  const navigation = useNavigation();
  const realm = useRealm();

  // const currentUserStat = useObject('UserStat', customUserData?.userId);
  const currentUserStat = useQuery("UserStat").filtered(
    "userId == $0",
    customUserData?.userId,
  )[0];

  const addGroup = useCallback(
    (farmerData: any, realm: any) => {
      const {
        operationalStatus,
        type,
        name,
        address,
        identifier,
        creationYear,
        legalStatus,
        affiliationYear,
        numberOfMembers,
        assets,
        // manager,
        licence,
        nuel,
        nuit,
      } = farmerData;

      realm.write(async () => {
        const newGroup = await realm.create("Group", {
          _id: uuidv4(),
          operationalStatus,
          type,
          name,
          identifier,
          creationYear,
          legalStatus,
          affiliationYear,
          address,
          numberOfMembers,
          assets,
          // manager,
          licence,
          nuel,
          nuit,
          userDistrict: customUserData?.userDistrict,
          userProvince: customUserData?.userProvince,
          userId: customUserData?.userId,
          userName: customUserData?.name,
        });
        setFarmerItem({
          ownerId: newGroup._id,
          ownerName: newGroup.type + " " + newGroup.name,
          flag: "Grupo",
        });
      });

      // update userStat (1 more farmer registered by the user)
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
            userName: customUserData.name,
            userId: customUserData.userId,
            userDistrict: customUserData.userDistrict,
            userProvince: customUserData.userProvince,
            userRole: customUserData.role,
            registeredFarmers: 1,
          });
        });
      }
    },
    [
      realm,
      farmerData,
      // farmerType
    ],
  );

  return (
    // </View>
    <Modal
      isVisible={modalVisible}
      supportedOrientations={["portrait", "landscape"]}
      propagateSwipe
      animationIn={"zoomIn"}
      animationInTiming={600}
      animationOut={"zoomOut"}
      swipeDirection={["left", "right"]}
      // animationOutTiming={600}
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
                // fontWeigth: 'bold',
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
              // style={{ position: 'relative', top: 10, right: 10, }}
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
            <View
              style={{
                marginHorizontal: 2,
              }}
            >
              <Stack direction="row" w="100%" my="1">
                <View style={[styles.keys, {width: "40%"}]}>
                  <Text>Organização:</Text>
                </View>
                <View w="60%" style={styles.values}>
                  <View style={styles.values}>
                    <Text>
                      {farmerData?.name} ({farmerData?.type})
                    </Text>
                    <Text>
                      {farmerData?.operationalStatus ? "Activo" : "Inactivo"}
                    </Text>
                  </View>
                </View>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <Stack direction="row" w="100%" my="1">
                <View style={[styles.keys, {width: "40%"}]} >
                  <Text>Finalidade:</Text>
                </View>
                <View w="60%" style={[styles.values, {width: "60%", }]}>
                  <View style={styles.values}>
                    {farmerData?.assets?.map((asset: any, index: any) => (
                      <Text key={index}>
                        {asset?.subcategory}
                      </Text>
                    ))}
                  </View>
                </View>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <View style={{ flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, {width: "40%"}]} >
                  <Text >Membros</Text>
                </View>
                <View w="60%">
                  <View style={styles.values}>
                    <Text>
                      {farmerData.numberOfMembers?.women} (Mulheres)
                    </Text>
                  </View>
                  <View style={styles.values}>
                    <Text>
                      {farmerData.numberOfMembers?.total -
                        farmerData.numberOfMembers?.women}{" "}
                      (Homens)
                    </Text>
                  </View>
                  <View style={styles.values}>
                    <Text>________</Text>
                    <Text>
                      {farmerData.numberOfMembers?.total} (Total)
                    </Text>
                  </View>
                </View>
              </View>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  marginVertical: 1,
                }}
              >
                <View style={[styles.keys, { width: "40%" }]}>
                  <Text>Estado de legalização</Text>
                </View>
                <View style={{ width: "40%" }}>
                  <View style={styles.values}>
                    <Text>{farmerData?.legalStatus}</Text>
                    <Text>{farmerData?.creationYear} (ano de criação)</Text>
                    {farmerData?.legalStatus ===
                      groupAffiliationStatus.affiliated && (
                      <Text>
                        {farmerData?.affiliationYear} (ano de legalização)
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {farmerData?.legalStatus ===
                groupAffiliationStatus.affiliated && (
                <View>
                  <CustomDivider
                    marginVertical="1"
                    thickness={1}
                    bg={COLORS.lightgrey}
                  />

                  <Stack direction="row" w="100%" my="1">
                    <View style={[styles.keys, { width: "40%" }]}>
                      <Text>Documentação:</Text>
                    </View>
                    <View w="60%" style={{ width: "60%" }}>
                      <View style={styles.values}>
                        <Text>
                          {farmerData?.nuel
                            ? farmerData?.nuel + " (NUEL)"
                            : "Nenhum (NUEL"}
                        </Text>

                        <Text>
                          {farmerData?.nuit
                            ? farmerData?.nuit + " (NUIT)"
                            : "Nenhum (NUIT)"}
                        </Text>

                        <Text>
                          {farmerData?.licence
                            ? farmerData?.licence + " (Licença/Alvará)"
                            : "Nenhum (Licença/Alvará)"}
                        </Text>
                      </View>
                    </View>
                  </Stack>
                </View>
              )}

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <Stack direction="row" w="100%" my="1">
                <View style={[styles.keys, { width: "40%" }]}>
                  <Text>Endereço:</Text>
                </View>
                <View style={{ width: "60%" }} w="60%">
                  <View style={[styles.values]}>
                    <Text>{farmerData?.address?.province} (Província)</Text>
                    <Text>{farmerData?.address?.district} (Distrito)</Text>
                    <Text>{farmerData?.address?.adminPost} (Posto Admin.)</Text>
                    <Text>
                      {farmerData.address?.village
                        ? farmerData.address?.village + " (localidade)"
                        : "Nenhum (Localidade)"}
                    </Text>
                  </View>
                </View>
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
                      addGroup(farmerData, realm);
                      setModalVisible(false);
                      setIsCoordinatesModalVisible(true);
                    } catch (error) {
                      throw new Error("Failed to register Group", {
                        cause: error,
                      });
                    } finally {
                      setGroupType("");
                      setGroupName("");
                      setGroupAffiliationYear("");
                      setGroupAdminPost("");
                      setGroupVillage("");
                      setGroupOperatingLicence("");
                      setGroupNuit("");
                      setGroupMembersNumber("");
                      setGroupWomenNumber("");
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
