/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, { useCallback, useEffect, useState } from "react";
import { Text, Stack, Box, Center, Divider } from "native-base";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { ScrollView, Pressable, TouchableOpacity, View } from "react-native";
import { Button, Icon } from "@rneui/themed";
import AwesomeAlert from "react-native-awesome-alerts";
import Modal from "react-native-modal";

import CustomDivider from "../Divider/CustomDivider";
import styles from "./styles";

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
import { generateUniqueNumber } from "../../helpers/generateUniqueNumber";
import PrimaryButton from "../Buttons/PrimaryButton";
const { useRealm, useObject, useQuery } = realmContext;

export default function InstitutionModal({
  modalVisible,
  setModalVisible,
  farmerData,
  farmerType,
  setFarmerType,
  setInstitutionType,
  setInstitutionName,
  setInstitutionAdminPost,
  setInstitutionVillage,
  setInstitutionManagerName,
  setInstitutionManagerPhone,
  setInstitutionNuit,
  setIsPrivateInstitution,
  setInstitutionLicence,
  setFarmerItem,
  farmerItem,
  setIsCoordinatesModalVisible,
  customUserData
}: any) {
  const [addDataModalVisible, setAddDataModalVisible] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const navigation = useNavigation();
  const realm = useRealm();

  // const currentUserStat = useObject('UserStat', customUserData?.userId);
  const currentUserStat = useQuery("UserStat").filtered(
    "userId == $0",
    customUserData?.userId,
  )[0];

  const addInstitution = useCallback(
    (farmerData: any, realm: any) => {
      const {
        type,
        name,
        // private: private,
        assets,
        identifier,
        address,
        manager,
        nuit,
        licence,
      } = farmerData;

      realm.write(async () => {
        const newInstitution = await realm.create("Institution", {
          _id: uuidv4(),
          type,
          name,
          identifier,
          private: farmerData?.private,
          assets,
          address,
          manager,
          nuit,
          licence,
          userDistrict: customUserData?.userDistrict,
          userProvince: customUserData?.userProvince,
          userId: customUserData?.userId,
          userName: customUserData?.name,
        });
        setFarmerItem({
          ownerId: newInstitution?._id,
          ownerName: `${newInstitution?.type} ${newInstitution?.name}`,
          flag: "Instituição",
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
    // <View>
    <Modal
      // visible={modalVisible}
      // onRequestClose={() => setModalVisible(false)}
      // animationType="slide"
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
                fontSize: 18,
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

        {/* <Stack 
                    direction="row" 
                    w="100%"
                    // pt="3"
                    style={{
                        backgroundColor: '#EBEBE4',
                    }}
                >
                    <Box >


                        <Pressable
                            onPress={()=>{
                                // navigation.goBack();
                                setModalVisible(false);
                            }} 
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                flexDirection: 'row',
                                // justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Icon 
                                name="arrow-back-ios" 
                                color={COLORS.main}
                                size={25}
                            /> 
                        </Pressable>

                    </Box>
                    <Box w="80%">
                    </Box>
                    <Box w="20%">
                        <Icon 
                            name="close" 
                            size={35} 
                            color="grey" 
                            onPress={() => setModalVisible(false)}
                        />
                    </Box>
                </Stack> */}
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
            <AwesomeAlert
              show={successAlert}
              showProgress={false}
              title="Registo Sucedido"
              message="Foi registado com sucesso!"
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={false}
              showConfirmButton={true}
              //   cancelText="No, cancel"
              confirmText="   OK!   "
              confirmButtonColor="#005000"
              //   onCancelPressed={() => {
              //     setGeoAlert(false);
              //   }}
              onConfirmPressed={() => {
                setSuccessAlert(false);
              }}
            />
            <Box mx="2">
              <Stack direction="row" w="100%" my="1">
                <Box w="40%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Instituição:</Text>
                </Box>
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "60%"; style: any; }... Remove this comment to see the full error message
                <Box w="60%" style={styles.values}>
                  <Box>
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.name} ({farmerData?.type})
                    </Text>
                    // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.isPrivate
                        ? "Instituição Privada"
                        : "Instituição Pública"}
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
                <Box w="40%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Documentos:</Text>
                </Box>
                <Box w="60%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.values}>
                    {farmerData?.nuit
                      ? farmerData?.nuit + " (NUIT)"
                      : "Nenhum (NUIT)"}
                  </Text>
                  {farmerData?.private && (
                    // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.licence
                        ? farmerData?.licence + " (Alvará/Licença)"
                        : "Nenhum (Alvará/Licença)"}
                    </Text>
                  )}
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <Stack direction="row" w="100%" my="1">
                <Box w="40%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Contacto:</Text>
                </Box>
                <Box w="60%">
                  // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                  <Text style={styles.values}>
                    {farmerData?.manager?.fullname} (Responsável)
                  </Text>
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.values}>
                    {farmerData?.manager?.phone
                      ? farmerData?.manager?.phone + " (Telefone)"
                      : "Nenhum (Telefone)"}
                  </Text>
                </Box>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <Stack direction="row" w="100%" my="1">
                <Box w="40%">
                  // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                  <Text style={styles.keys}>Endereço:</Text>
                </Box>
                <Box w="60%">
                  <Box>
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.address?.province} (Província)
                    </Text>
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.address?.district} (Distrito)
                    </Text>
                    // @ts-expect-error TS(2322): Type '{ children: any[]; style: any; }' is not ass... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.address?.adminPost} (Posto Admin.)
                    </Text>
                    // @ts-expect-error TS(2322): Type '{ children: string; style: any; }' is not as... Remove this comment to see the full error message
                    <Text style={styles.values}>
                      {farmerData?.address?.village
                        ? farmerData.address?.village + " (localidade)"
                        : "Nenhum (Localidade)"}
                    </Text>
                  </Box>
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
                      addInstitution(farmerData, realm);
                      setModalVisible(false);
                      setIsCoordinatesModalVisible(true);
                      // setSuccessAlert(true);
                    } catch (error) {
                      throw new Error("Failed to register Institution", {
                        // @ts-expect-error TS(2322): Type 'unknown' is not assignable to type 'Error | ... Remove this comment to see the full error message
                        cause: error,
                      });
                    } finally {
                      setInstitutionType("");
                      setInstitutionName("");
                      setInstitutionAdminPost("");
                      setInstitutionVillage("");
                      setInstitutionManagerName("");
                      setInstitutionManagerPhone(null);
                      setInstitutionNuit(null);
                      setIsPrivateInstitution(false);
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

// export default InstitutionModal;
