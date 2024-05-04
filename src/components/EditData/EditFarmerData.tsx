import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
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

import ConfirmData from "./ConfirmFarmlandData";
import COLORS from "../../consts/colors";
import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator";

import administrativePosts from "../../consts/administrativePosts";
import provinces from "../../consts/provinces";
import districts from "../../consts/districts";
import villages from "../../consts/villages";
import countries from "../../consts/countries";
import idDocTypes from "../../consts/idDocTypes";
import { CustomInput } from "../Inputs/CustomInput";
import validateFarmerEditedData from "../../helpers/validateFarmerEditedData";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { useRef } from "react";
import { far } from "@fortawesome/free-regular-svg-icons";
const { useRealm } = realmContext;

const EditFarmerData = ({
  isOverlayVisible,
  setIsOverlayVisible,
  setIsConfirmDataVisible,

  // resizeBox,
  // scale,
  resourceName,

  dataToBeUpdated,
  farmerId,
  setNewDataObject,
  setOldDataObject
}: any) => {
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;
  const farmer = realm.objectForPrimaryKey("Actor", farmerId);

  // // ----------------------------------------------------
  const [errors, setErrors] = useState({});
  const [overlayTitle, setOverlayTitle] = useState("");

  // Address code block

  const [address, setAddress] = useState({
    addressProvince: "",
    addressDistrict: "",
    addressAdminPost: "",
    addressVillage: "",
    overlayTitle: "",
  });

  const [oldAddress, setOldAddress] = useState({
    addressProvince: "",
    addressDistrict: "",
    addressAdminPost: "",
    addressVillage: "",
  });

  const [contact, setContact] = useState({
    primaryPhone: "",
    secondaryPhone: "",
    overlayTitle: "",
  });

  const [oldContact, setOldContact] = useState({
    primaryPhone: "",
    secondaryPhone: "",
  });

  const [idDocument, setIdDocument] = useState({
    docType: "",
    docNumber: "",
    nuit: "",
    overlayTitle: "",
  });

  const [oldIdDocument, setOldIdDocument] = useState({
    docType: "",
    docNumber: "",
    nuit: "",
  });

  const handleAddressChange = useCallback(() => { }, []);

  // Contact code block

  useEffect(() => {
    if (dataToBeUpdated === "address" && resourceName === "Farmer") {
      const currentAddress = {
        addressProvince: customUserData?.userProvince,
        addressDistrict: customUserData?.userDistrict,

        // @ts-expect-error TS(2339): Property 'address' does not exist on type 'Object<... Remove this comment to see the full error message
        addressAdminPost: farmer?.address.adminPost,

        // @ts-expect-error TS(2339): Property 'address' does not exist on type 'Object<... Remove this comment to see the full error message
        addressVillage: farmer?.address.village,
      };


      // @ts-expect-error TS(2345): Argument of type '() => { addressProvince: unknown... Remove this comment to see the full error message
      setAddress(() => currentAddress);

      // @ts-expect-error TS(2345): Argument of type '() => { addressProvince: unknown... Remove this comment to see the full error message
      setOldAddress(() => currentAddress);

      setOverlayTitle("Actualizar endereço.");
    }

    if (dataToBeUpdated === "contact" && resourceName === "Farmer") {
      const currentContact = {

        // @ts-expect-error TS(2339): Property 'contact' does not exist on type 'Object<... Remove this comment to see the full error message
        primaryPhone: farmer?.contact.primaryPhone,

        // @ts-expect-error TS(2339): Property 'contact' does not exist on type 'Object<... Remove this comment to see the full error message
        secondaryPhone: farmer?.contact.secondaryPhone,
      };


      // @ts-expect-error TS(2345): Argument of type '() => { primaryPhone: any; secon... Remove this comment to see the full error message
      setContact(() => currentContact);
      setOldContact(() => currentContact);

      setOverlayTitle("Actualizar contactos.");
    }

    if (dataToBeUpdated === "idDocument" && resourceName === "Farmer") {
      const currentIdDocument = {

        // @ts-expect-error TS(2339): Property 'idDocument' does not exist on type 'Obje... Remove this comment to see the full error message
        docType: farmer?.idDocument.docType,

        // @ts-expect-error TS(2339): Property 'idDocument' does not exist on type 'Obje... Remove this comment to see the full error message
        docNumber: farmer?.idDocument.docNumber,

        // @ts-expect-error TS(2339): Property 'idDocument' does not exist on type 'Obje... Remove this comment to see the full error message
        nuit: farmer?.idDocument.nuit,
        // overlayTitle: 'Actualizar Documentos de Identidade',
      };


      // @ts-expect-error TS(2345): Argument of type '() => { docType: any; docNumber:... Remove this comment to see the full error message
      setIdDocument(() => currentIdDocument);
      setOldIdDocument(() => currentIdDocument);

      setOverlayTitle("Actualizar Documentos de Identidade.");
    }
  }, [dataToBeUpdated, resourceName]);

  const onConfirmUpdate = (dataToBeUpdated: any, resourceName: any) => {
    const validatedData = validateFarmerEditedData(
      {
        address,
        oldAddress,
        contact,
        oldContact,
        idDocument,
        oldIdDocument,
      },
      errors,
      setErrors,
      dataToBeUpdated,
      resourceName,
    );

    const newData = {};
    const oldData = {};

    if (dataToBeUpdated === "address" && resourceName === "Farmer") {
      //  new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["province"] = address?.addressProvince;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["district"] = address?.addressDistrict;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["adminPost"] = validatedData?.adminPost;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["village"] = validatedData?.village;

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["province"] = oldAddress?.addressProvince;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["district"] = oldAddress?.addressDistrict;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["adminPost"] = oldAddress?.addressAdminPost;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["village"] = oldAddress?.addressVillage;

      setNewDataObject(newData);
      setOldDataObject(oldData);
    }

    if (dataToBeUpdated === "contact" && resourceName === "Farmer") {
      // new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["primaryPhone"] = validatedData?.primaryPhone

        // @ts-expect-error TS(2339): Property 'primaryPhone' does not exist on type 'fa... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.primaryPhone))
        : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["secondaryPhone"] = validatedData?.secondaryPhone

        // @ts-expect-error TS(2339): Property 'secondaryPhone' does not exist on type '... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.secondaryPhone))
        : 0;

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["primaryPhone"] = oldContact?.primaryPhone
        ? Number(parseInt(oldContact?.primaryPhone))
        : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["secondaryPhone"] = oldContact?.secondaryPhone
        ? Number(parseInt(oldContact?.secondaryPhone))
        : 0;

      setNewDataObject(newData);
      setOldDataObject(oldData);
    }

    if (dataToBeUpdated === "idDocument" && resourceName === "Farmer") {
      // new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["docType"] = validatedData?.docType?.trim();

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["docNumber"] = validatedData?.docNumber

        // @ts-expect-error TS(2339): Property 'docNumber' does not exist on type 'false... Remove this comment to see the full error message
        ? validatedData?.docNumber
        : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["nuit"] = validatedData?.nuit

        // @ts-expect-error TS(2339): Property 'nuit' does not exist on type 'false | { ... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.nuit))
        : 0;

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["docType"] = oldIdDocument?.docType
        ? oldIdDocument?.docType
        : "Não tem";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["docNumber"] = oldIdDocument?.docNumber
        ? oldIdDocument?.docNumber
        : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["nuit"] = oldIdDocument?.nuit ? oldIdDocument?.nuit : 0;

      setNewDataObject(newData);
      setOldDataObject(oldData);
    }
  };

  const [isConfirmButtonPressed, setIsConfirmButtonPressed] = useState(false);

  useEffect(() => {
    if (idDocument?.docType === "Não tem") {
      // setDocNumber('');
      setIdDocument((prev) => ({
        ...prev,
        docNumber: "",
      }));
    }
  }, [idDocument.docType]);

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
                setErrors({});
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
              {/* update the farmer idDocuments */}
              {dataToBeUpdated === "idDocument" &&
                resourceName === "Farmer" && (
                  <Stack direction="column">
                    <Stack>
                      <FormControl
                        my="2"
                        isRequired
                        isInvalid={"docType" in errors}
                      >
                        <FormControl.Label>Tipo do documento</FormControl.Label>
                        <Select
                          selectedValue={idDocument?.docType}

                          // @ts-expect-error TS(2322): Type '{ children: Element[]; selectedValue: string... Remove this comment to see the full error message
                          accessibilityLabel="Tipo de doc."
                          placeholder="Tipo de documento"
                          minHeight={55}
                          _selectedItem={{
                            bg: "teal.600",
                            fontSize: "lg",
                            endIcon: <CheckIcon size="5" />,
                          }}
                          dropdownCloseIcon={
                            idDocument?.docType ? (
                              <Icon
                                name="close"
                                size={20}
                                color={COLORS.lightgrey}
                                onPress={() => {
                                  // setDocType('')
                                  setIdDocument((prev) => ({
                                    ...prev,
                                    docType: "",
                                  }));
                                }}
                              />
                            ) : (
                              <Icon
                                // size={45}
                                name="arrow-drop-down"
                                color={COLORS.main}
                              />
                            )
                          }
                          mt={1}
                          onValueChange={(newDocType) => {
                            setErrors((prev) => ({
                              ...prev,
                              docType: "",
                              docNumber: "",
                            }));
                            setIdDocument((prev) => ({
                              ...prev,
                              docType: newDocType,
                            }));
                            // setDocType(newDocType);
                          }}
                        >
                          {idDocTypes?.map((docType) => (
                            <Select.Item
                              key={docType}
                              label={docType}
                              value={docType}
                            />
                          ))}
                        </Select>
                        {"docType" in errors ? (
                          <FormControl.ErrorMessage
                            leftIcon={
                              <Icon
                                name="error-outline"
                                size={16}
                                color="red"
                              />
                            }
                            _text={{ fontSize: "xs" }}
                          >
                            {errors?.docType}
                          </FormControl.ErrorMessage>
                        ) : (
                          <FormControl.HelperText></FormControl.HelperText>
                        )}
                      </FormControl>
                    </Stack>
                    <Stack>
                      {!(idDocument?.docType === "Não tem") && (
                        <FormControl my="3" isInvalid={"docNumber" in errors}>
                          <FormControl.Label>
                            Número do documento
                          </FormControl.Label>
                          <CustomInput
                            width="100%"
                            type="text"
                            isDisabled={
                              idDocument?.docType === "Não tem" ||
                                idDocument?.docType === ""
                                ? true
                                : false
                            }
                            value={idDocument?.docNumber?.toString()}
                            placeholder={
                              idDocument?.docNumber
                                ? idDocument?.docNumber?.toString()
                                : "Nenhum"
                            }
                            onChangeText={(newDocNumber: any) => {
                              setErrors((prev) => ({ ...prev, docNumber: "" }));
                              // setDocNumber(newDocNumber)
                              setIdDocument((prev) => ({
                                ...prev,
                                docNumber: newDocNumber,
                              }));
                            }}
                          />
                          {"docNumber" in errors ? (
                            <FormControl.ErrorMessage
                              leftIcon={
                                <Icon
                                  name="error-outline"
                                  size={16}
                                  color="red"
                                />
                              }
                              _text={{ fontSize: "xs" }}
                            >
                              {errors?.docNumber}
                            </FormControl.ErrorMessage>
                          ) : (
                            <FormControl.HelperText></FormControl.HelperText>
                          )}
                        </FormControl>
                      )}
                    </Stack>

                    <Stack>
                      <FormControl isInvalid={"nuit" in errors}>
                        <FormControl.Label>NUIT</FormControl.Label>
                        <CustomInput
                          width="100%"
                          type="number"
                          placeholder={
                            idDocument?.nuit
                              ? idDocument?.nuit?.toString()
                              : "Nenhum"
                          }
                          value={idDocument?.nuit?.toString()}
                          keyboardType="numeric"
                          onChangeText={(newNuit: any) => {
                            setErrors((prev) => ({ ...prev, nuit: "" }));
                            // setNuit(newNuit)
                            setIdDocument((prev) => ({
                              ...prev,
                              nuit: newNuit,
                            }));
                          }}
                        />
                        {"nuit" in errors ? (
                          <FormControl.ErrorMessage
                            leftIcon={
                              <Icon
                                name="error-outline"
                                size={16}
                                color="red"
                              />
                            }
                            _text={{ fontSize: "xs" }}
                          >
                            {errors?.nuit}
                          </FormControl.ErrorMessage>
                        ) : (
                          <FormControl.HelperText></FormControl.HelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Stack>
                )}
            </>

            <>
              {/* update the farmer contacts  */}
              {dataToBeUpdated === "contact" && resourceName === "Farmer" && (
                <Stack direction="column">
                  <Box
                    w="100%"

                    // @ts-expect-error TS(2322): Type '{ children: Element; w: "100%"; style: { ali... Remove this comment to see the full error message
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <FormControl my="1" isInvalid={"primaryPhone" in errors}>
                      <FormControl.Label>Telemóvel</FormControl.Label>
                      <CustomInput
                        width="100%"
                        type="telephoneNumber"
                        placeholder={
                          contact?.primaryPhone
                            ? contact?.primaryPhone?.toString()
                            : "Nenhum"
                        }
                        keyboardType="numeric"
                        value={
                          contact?.primaryPhone
                            ? contact?.primaryPhone?.toString()
                            : ""
                        }
                        onChangeText={(newPhone: any) => {
                          setErrors((prev) => ({ ...prev, primaryPhone: "" }));
                          // setPrimaryPhone(newPhone);
                          setContact((prev) => ({
                            ...prev,
                            primaryPhone: newPhone,
                          }));
                        }}
                        InputLeftElement={
                          <Icon
                            name="phone"
                            color="grey"
                            size={20}
                            type="material"
                          />
                        }
                      />
                      {"primaryPhone" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          {errors?.primaryPhone}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText></FormControl.HelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box
                    w="100%"

                    // @ts-expect-error TS(2322): Type '{ children: Element; w: "100%"; style: { ali... Remove this comment to see the full error message
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <FormControl my="1" isInvalid={"secondaryPhone" in errors}>
                      <FormControl.Label>
                        Telemóvel Alternativo
                      </FormControl.Label>
                      <CustomInput
                        width="100%"
                        type="telephoneNumber"
                        placeholder={
                          contact?.secondaryPhone
                            ? contact?.secondaryPhone?.toString()
                            : "Nenhum"
                        }
                        keyboardType="numeric"
                        value={
                          contact?.secondaryPhone
                            ? contact?.secondaryPhone?.toString()
                            : ""
                        }
                        onChangeText={(newPhone: any) => {
                          setErrors((prev) => ({
                            ...prev,
                            secondaryPhone: "",
                          }));
                          // setSecondaryPhone(newPhone)
                          setContact((prev) => ({
                            ...prev,
                            secondaryPhone: newPhone,
                          }));
                        }}
                        InputLeftElement={
                          <Icon
                            name="phone"
                            color="grey"
                            size={20}
                            type="material"
                          />
                        }
                      />
                      {"secondaryPhone" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >

                          {errors?.secondaryPhone}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText></FormControl.HelperText>
                      )}
                    </FormControl>
                  </Box>
                </Stack>
              )}
            </>

            <>
              {/*  update the farmer address */}

              {dataToBeUpdated === "address" && resourceName === "Farmer" && (
                <Box>
                  <Stack>
                    <FormControl
                      isRequired
                      my="1"
                      isInvalid={"addressAdminPost" in errors}
                    >
                      <FormControl.Label>Posto Adm.</FormControl.Label>
                      <Select
                        selectedValue={
                          address?.addressProvince
                            ? address?.addressAdminPost
                            : ""
                        }

                        // @ts-expect-error TS(2322): Type '{ children: any[]; selectedValue: string; ac... Remove this comment to see the full error message
                        accessibilityLabel="Escolha um posto administrativo"
                        placeholder="Escolha um posto administrativo"
                        minHeight={55}
                        _selectedItem={{
                          bg: "teal.600",
                          fontSize: "lg",
                          endIcon: <CheckIcon size="5" />,
                        }}
                        dropdownCloseIcon={
                          address?.addressAdminPost ? (
                            <Icon
                              name="close"
                              size={20}
                              color={COLORS.lightgrey}
                              onPress={() => {
                                // setAddressAdminPost('');
                                setAddress((prev) => ({
                                  ...prev,
                                  addressAdminPost: "",
                                }));
                              }}
                            />
                          ) : (
                            <Icon
                              // size={45}
                              name="arrow-drop-down"
                              color={COLORS.main}
                            />
                          )
                        }
                        mt={1}
                        onValueChange={(newAdminPost) => {
                          setErrors((prev) => {
                            return {
                              ...prev,
                              addressAdminPost: "",
                              addressVillage: "",
                            };
                          });
                          // setAddressAdminPost(newAdminPost);
                          setAddress((prev) => ({
                            ...prev,
                            addressAdminPost: newAdminPost,
                            addressVillage: "",
                          }));
                        }}
                      >
                        {administrativePosts[address?.addressDistrict]?.map(
                          (adminPost: any, index: any) => (
                            <Select.Item
                              key={index}
                              label={adminPost}
                              value={adminPost}
                            />
                          ),
                        )}
                      </Select>
                      {"addressAdminPost" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          {errors?.addressAdminPost}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText></FormControl.HelperText>
                      )}
                    </FormControl>
                  </Stack>
                  <Stack>
                    <FormControl
                      isRequired
                      my="3"
                      isInvalid={"addressVillage" in errors}
                    >
                      <FormControl.Label>Localidade</FormControl.Label>
                      <Select
                        selectedValue={address?.addressVillage}

                        // @ts-expect-error TS(2322): Type '{ children: any[]; selectedValue: string; ac... Remove this comment to see the full error message
                        accessibilityLabel="Escolha uma localidade"
                        placeholder="Escolha uma localidade"
                        minHeight={55}
                        _selectedItem={{
                          bg: "teal.600",
                          fontSize: "lg",
                          endIcon: <CheckIcon size="5" />,
                        }}
                        dropdownCloseIcon={
                          address?.addressVillage ? (
                            <Icon
                              name="close"
                              size={20}
                              color="grey"
                              onPress={() => {
                                // setAddressVillage('');
                                setAddress((prev) => ({
                                  ...prev,
                                  addressVillage: "",
                                }));
                              }}
                            />
                          ) : (
                            <Icon
                              // size={45}
                              name="arrow-drop-down"
                              color={COLORS.main}
                            />
                          )
                        }
                        mt={1}
                        onValueChange={(newVillage) => {
                          setErrors((prev) => {
                            return {
                              ...prev,
                              addressAdminPost: "",
                              addressVillage: "",
                            };
                          });
                          // setAddressVillage(newVillage);
                          setAddress((prev) => ({
                            ...prev,
                            addressVillage: newVillage,
                          }));
                        }}
                      >
                        {villages[address?.addressAdminPost]?.map(
                          (village: any, index: any) => (
                            <Select.Item
                              key={index}
                              label={village}
                              value={village}
                            />
                          ),
                        )}
                      </Select>
                      {"addressVillage" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          {errors?.addressVillage}
                        </FormControl.ErrorMessage>
                      ) : (
                        <FormControl.HelperText></FormControl.HelperText>
                      )}
                    </FormControl>
                  </Stack>
                </Box>
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
                  !validateFarmerEditedData(
                    {
                      address,
                      oldAddress,
                      contact,
                      oldContact,
                      idDocument,
                      oldIdDocument,
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
                // setIsConfirmButtonPressed(true);
              }}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EditFarmerData;
