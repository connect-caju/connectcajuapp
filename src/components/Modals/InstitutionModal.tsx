import React, { useCallback, useEffect, useState } from "react";
import { Text, Stack, Box, Center, Divider } from "native-base";
import { ScrollView, Pressable, TouchableOpacity, View } from "react-native";
import { Button, Icon } from "@rneui/themed";
import AwesomeAlert from "react-native-awesome-alerts";
import Modal from "react-native-modal";

import CustomDivider from "../Divider/CustomDivider";
import styles from "./styles";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useNavigation } from "@react-navigation/native";

import { realmContext } from "../../models/realmContext";
import COLORS from "../../consts/colors";
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
          currentUserStat.registeredFarmers = currentUserStat.registeredFarmers + 1;
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
          <View style={{                fontFamily: "JosefinSans-Bold",
                fontSize: 18,
                // fontWeigth: 'bold',
                color: COLORS.black,
                paddingTop: 15,
                textAlign: "center", width: "90%" }}>
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
                onConfirmPressed={() => {
                setSuccessAlert(false);
              }}
            />
            <Box mx="2">
              <Stack direction="row" w="100%" my="1">
                <View w="40%" style={[styles.keys, { width: "40%"}]}>
                  <Text >Instituição:</Text>
                </View>
                <View w="60%" style={styles.values}>
                  <View style={styles.values}>
                    <Text >
                      {farmerData?.name} ({farmerData?.type})
                    </Text>
                    <Text >
                      {farmerData?.isPrivate
                        ? "Instituição Privada"
                        : "Instituição Pública"}
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
                <View style={[styles.keys, { width: "40%"}]}>
                  <Text>Documentos:</Text>
                </View>
                <View style={[styles.values, { width: "60%"}]}>
                  <Text >
                    {farmerData?.nuit
                      ? farmerData?.nuit + " (NUIT)"
                      : "Nenhum (NUIT)"}
                  </Text>
                  {farmerData?.private && (

                    <Text>
                      {farmerData?.licence
                        ? farmerData?.licence + " (Alvará/Licença)"
                        : "Nenhum (Alvará/Licença)"}
                    </Text>
                  )}
                </View>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <Stack direction="row" w="100%" my="1">
                <View style={[styles.keys, {width: "40%"}]}>
                  <Text >Contacto:</Text>
                </View>
                <View  style={[styles.values, {width: "60%"}]}>
                  <Text >
                    {farmerData?.manager?.fullname} (Responsável)
                  </Text>
                  <Text>
                    {farmerData?.manager?.phone
                      ? farmerData?.manager?.phone + " (Telefone)"
                      : "Nenhum (Telefone)"}
                  </Text>
                </View>
              </Stack>

              <CustomDivider
                marginVertical="1"
                thickness={1}
                bg={COLORS.lightgrey}
              />

              <View style={{flexDirection: "row", width: "100%", marginVertical: 1, }}>
                <View style={[styles.keys, {width: "40%"}]}>
                  <Text >Endereço:</Text>
                </View>
                <View style={[styles.values, {width: "60%"}]}>
                  <View>
                    <Text>
                      {farmerData?.address?.province} (Província)
                    </Text>
                    <Text >
                      {farmerData?.address?.district} (Distrito)
                    </Text>
                    <Text >
                      {farmerData?.address?.adminPost} (Posto Admin.)
                    </Text>
                    <Text >
                      {farmerData?.address?.village
                        ? farmerData.address?.village + " (localidade)"
                        : "Nenhum (Localidade)"}
                    </Text>
                  </View>
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
                      addInstitution(farmerData, realm);
                      setModalVisible(false);
                      setIsCoordinatesModalVisible(true);
                      // setSuccessAlert(true);
                    } catch (error) {
                      throw new Error("Failed to register Institution", {
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

