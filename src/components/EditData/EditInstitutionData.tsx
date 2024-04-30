import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import { Overlay, Icon, Button, CheckBox } from "@rneui/base";
import {
  Box,
  FormControl,
  Stack,
  Select,
  CheckIcon,
  Center,
  Radio,
} from "native-base";
import Modal from "react-native-modal";
import ConfirmFarmlandData from "./ConfirmFarmlandData";
import COLORS from "../../consts/colors";
import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator";

import administrativePosts from "../../consts/administrativePosts";
import provinces from "../../consts/provinces";
import districts from "../../consts/districts";
import villages from "../../consts/villages";
import countries from "../../consts/countries";
import idDocTypes from "../../consts/idDocTypes";
import { CustomInput } from "../Inputs/CustomInput";
import validateInstitutionEditedData from "../../helpers/validateInstitutionEditedData";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
const { useRealm } = realmContext;

const EditInstitutionData = ({
  isOverlayVisible,
  setIsOverlayVisible,
  setIsConfirmDataVisible,
  farmerId,
  resourceName,
  dataToBeUpdated,
  setNewDataObject,
  setOldDataObject
}: any) => {
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;
  const farmer = realm.objectForPrimaryKey("Institution", farmerId);

  // // ----------------------------------------------------
  const [errors, setErrors] = useState({});
  const [overlayTitle, setOverlayTitle] = useState("");

  // the institution manager details
  const [institutionManagerPhone, setInstitutionManagerPhone] = useState("");
  const [institutionManagerName, setInstitutionManagerName] = useState("");

  const [oldInstitutionManagerPhone, setOldInstitutionManagerPhone] =
    useState("");
  const [oldInstitutionManagerName, setOldInstitutionManagerName] =
    useState("");

  // the institution documents
  const [institutionNuit, setInstitutionNuit] = useState("");
  const [institutionLicence, setInstitutionLicence] = useState("");

  const [oldInstitutionNuit, setOldInstitutionNuit] = useState("");
  const [oldInstitutionLicence, setOldInstitutionLicence] = useState("");

  useEffect(() => {
    if (
      dataToBeUpdated === "institutionDocument" &&
      resourceName === "Institution"
    ) {

      // @ts-expect-error TS(2339): Property 'nuit' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setInstitutionNuit(farmer?.nuit);

      // @ts-expect-error TS(2339): Property 'licence' does not exist on type 'Object<... Remove this comment to see the full error message
      setInstitutionLicence(farmer?.licence);
      setOverlayTitle("Actualizar Documentação.");


      // @ts-expect-error TS(2339): Property 'nuit' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setOldInstitutionNuit(farmer?.nuit);

      // @ts-expect-error TS(2339): Property 'licence' does not exist on type 'Object<... Remove this comment to see the full error message
      setOldInstitutionLicence(farmer?.licence);
    }

    if (
      dataToBeUpdated === "institutionManager" &&
      resourceName === "Institution"
    ) {

      // @ts-expect-error TS(2339): Property 'manager' does not exist on type 'Object<... Remove this comment to see the full error message
      setInstitutionManagerName(farmer?.manager.fullname);

      // @ts-expect-error TS(2339): Property 'manager' does not exist on type 'Object<... Remove this comment to see the full error message
      setInstitutionManagerPhone(farmer?.manager.phone);
      setOverlayTitle("Actualizar Contacto.");


      // @ts-expect-error TS(2339): Property 'manager' does not exist on type 'Object<... Remove this comment to see the full error message
      setOldInstitutionManagerName(farmer?.manager.fullname);

      // @ts-expect-error TS(2339): Property 'manager' does not exist on type 'Object<... Remove this comment to see the full error message
      setOldInstitutionManagerPhone(farmer?.manager.phone);
    }
  }, [dataToBeUpdated, resourceName]);

  const onConfirmUpdate = (dataToBeUpdated: any, resourceName: any) => {
    const validatedData = validateInstitutionEditedData(
      {
        institutionNuit,
        oldInstitutionNuit,
        institutionLicence,
        oldInstitutionLicence,
        institutionManagerName,
        oldInstitutionManagerName,
        institutionManagerPhone,
        oldInstitutionManagerPhone,
      },
      errors,
      setErrors,
      dataToBeUpdated,
      resourceName,
    );

    const newData = {};
    const oldData = {};

    if (
      dataToBeUpdated === "institutionDocument" &&
      resourceName === "Institution"
    ) {
      //  new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["nuit"] = validatedData?.nuit;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["licence"] = validatedData?.licence;

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["nuit"] = oldInstitutionNuit;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["licence"] = oldInstitutionLicence;

      setNewDataObject(newData);
      setOldDataObject(oldData);
    }

    if (
      dataToBeUpdated === "institutionManager" &&
      resourceName === "Institution"
    ) {
      // new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["fullname"] = validatedData?.fullname
        ? validatedData?.fullname?.trim()
        : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["phone"] = validatedData?.phone
        ? Number(parseInt(validatedData?.phone))
        : 0;

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["fullname"] = oldInstitutionManagerName
        ? oldInstitutionManagerName?.trim()
        : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["phone"] = oldInstitutionManagerPhone
        ? Number(parseInt(oldInstitutionManagerPhone))
        : 0;

      setNewDataObject(newData);
      setOldDataObject(oldData);
    }
  };

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  return (
    <Modal
      isVisible={isOverlayVisible}
      supportedOrientations={["portrait", "landscape"]}
      propagateSwipe
      avoidKeyboard
      animationIn={"zoomIn"}
      animationInTiming={600}
      animationOut={"zoomOut"}
      hideModalContentWhileAnimating={true}
      onBackButtonPress={() => {
        setIsOverlayVisible(false);
      }}
      onBackdropPress={() => {
        setIsOverlayVisible(false);
      }}
      onModalHide={() => {

        // @ts-expect-error TS(2304): Cannot find name 'isConfirmButtonPressed'.
        if (isConfirmButtonPressed) {
          setIsConfirmDataVisible(true);
        }
      }}
      onSwipeComplete={() => {
        setIsOverlayVisible(false);
      }}
      swipeDirection={["left", "right"]}
    >
      <View>
        <View
          style={{
            width: "100%",
            minHeight: 50,
            flexDirection: "row",
            backgroundColor: COLORS.main,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <View style={{ width: "90%" }}>
            <Text
              style={{
                fontFamily: "JosefinSans-Bold",
                fontSize: 16,
                // fontWeigth: 'bold',
                color: COLORS.ghostwhite,
                paddingTop: 15,
                textAlign: "center",
              }}
            >
              {overlayTitle}
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
              color={COLORS.ghostwhite}
              onPress={() => {
                setIsOverlayVisible(false);
              }}
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
              padding: 10,
            }}
          >
            <>
              {dataToBeUpdated === "institutionManager" &&
                resourceName === "Institution" && (
                  <Stack direction="column">
                    <FormControl
                      isRequired
                      my="1"
                      isInvalid={"institutionManagerName" in errors}
                    >
                      <FormControl.Label>
                        Nome do Representante
                      </FormControl.Label>
                      <CustomInput
                        width="100%"
                        type="text"
                        autoCapitalize="words"
                        placeholder="Nome completo do representante"
                        value={institutionManagerName}
                        onChangeText={(newManagerName: any) => {
                          setErrors((prev) => ({
                            ...prev,
                            institutionManagerName: "",
                          }));
                          setInstitutionManagerName(newManagerName);
                        }}
                      />
                      {"institutionManagerName" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          // @ts-expect-error TS(2339): Property 'institutionManagerName' does not exist o... Remove this comment to see the full error message
                          // @ts-expect-error TS(2339): Property 'institutionManagerName' does not exist o... Remove this comment to see the full error message
                          {errors?.institutionManagerName}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText></FormControl.HelperText>
                      )}
                    </FormControl>

                    <FormControl
                      isInvalid={"institutionManagerPhone" in errors}
                    >
                      <FormControl.Label>Tel. do Responsável</FormControl.Label>
                      <CustomInput
                        width="100%"
                        type="telephoneNumber"
                        placeholder={
                          institutionManagerPhone
                            ? institutionManagerPhone.toString()
                            : "Nenhum"
                        }
                        keyboardType="numeric"
                        value={

                          // @ts-expect-error TS(2367): This condition will always return 'true' since the... Remove this comment to see the full error message
                          institutionManagerPhone !== 0 &&
                          institutionManagerPhone?.toString()
                        }
                        onChangeText={(newManagerPhone: any) => {
                          setErrors((prev) => ({
                            ...prev,
                            institutionManagerPhone: "",
                          }));
                          setInstitutionManagerPhone(newManagerPhone);
                        }}
                        InputLeftElement={
                          <Icon
                            name="phone"
                            color="grey"
                            size={25}
                            type="material"
                          />
                        }
                      />
                      {"institutionManagerPhone" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          // @ts-expect-error TS(2339): Property 'institutionManagerPhone' does not exist ... Remove this comment to see the full error message
                          // @ts-expect-error TS(2339): Property 'institutionManagerPhone' does not exist ... Remove this comment to see the full error message
                          {errors?.institutionManagerPhone}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText></FormControl.HelperText>
                      )}
                    </FormControl>
                  </Stack>
                )}
            </>

            <>
              {/* update the institution Documents */}

              {dataToBeUpdated === "institutionDocument" &&
                resourceName === "Institution" && (
                  <Stack direction="column">
                    <FormControl isInvalid={"institutionNuit" in errors}>
                      <FormControl.Label>NUIT da Instituição</FormControl.Label>
                      <CustomInput
                        width="100%"
                        type="number"
                        placeholder={
                          institutionNuit
                            ? institutionNuit.toString()
                            : "Nenhum"
                        }
                        value={institutionNuit}
                        keyboardType="numeric"
                        onChangeText={(newNuit: any) => {
                          setErrors((prev) => ({
                            ...prev,
                            institutionNuit: "",
                          }));
                          setInstitutionNuit(newNuit);
                        }}
                      />
                      {"institutionNuit" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          // @ts-expect-error TS(2339): Property 'institutionNuit' does not exist on type ... Remove this comment to see the full error message
                          // @ts-expect-error TS(2339): Property 'institutionNuit' does not exist on type ... Remove this comment to see the full error message
                          {errors?.institutionNuit}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText></FormControl.HelperText>
                      )}
                    </FormControl>

                    <FormControl isInvalid={"institutionLicence" in errors}>
                      <FormControl.Label>
                        N°. de Alvará da Instituição
                      </FormControl.Label>
                      <CustomInput
                        width="100%"
                        type="text"
                        placeholder={
                          institutionLicence
                            ? institutionLicence?.toString()
                            : "Nenhum"
                        }
                        // keyboardType="numeric"
                        value={institutionLicence?.toString()}
                        onChangeText={(newLicence: any) => {
                          setErrors((prev) => ({
                            ...prev,
                            institutionLicence: "",
                          }));
                          setInstitutionLicence(newLicence);
                        }}
                      />
                      {"institutionLicence" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          // @ts-expect-error TS(2339): Property 'institutionLicence' does not exist on ty... Remove this comment to see the full error message
                          // @ts-expect-error TS(2339): Property 'institutionLicence' does not exist on ty... Remove this comment to see the full error message
                          {errors?.institutionLicence}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText></FormControl.HelperText>
                      )}
                    </FormControl>
                  </Stack>
                )}
            </>

            <Button
              title="Confirmar Dados"
              titleStyle={{
                color: COLORS.ghostwhite,
                fontFamily: "JosefinSans-Bold",
              }}
              iconPosition="right"
              containerStyle={{
                backgroundColor: COLORS.main,
                borderRadius: 10,
                marginTop: 30,

                // color: COLORS.ghostwhite,
              }}
              type="outline"

              // @ts-expect-error TS(2322): Type '{ title: string; titleStyle: { color: string... Remove this comment to see the full error message
              onPress={() => {
                if (
                  !validateInstitutionEditedData(
                    {
                      institutionNuit,
                      oldInstitutionNuit,
                      institutionLicence,
                      oldInstitutionLicence,
                      institutionManagerName,
                      oldInstitutionManagerName,
                      institutionManagerPhone,
                      oldInstitutionManagerPhone,
                    },
                    errors,
                    setErrors,
                    dataToBeUpdated,
                    resourceName,
                  )
                ) {
                  return;
                }
                onConfirmUpdate(dataToBeUpdated, resourceName);
                setIsOverlayVisible(false);
                setIsConfirmDataVisible(true);
              }}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EditInstitutionData;
