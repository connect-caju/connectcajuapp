import React, { useState, useEffect, useCallback } from "react"
import {
  Text,
  Animated,
  Modal,
  Easing,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native"
import { Overlay, Icon, Button, CheckBox } from "@rneui/base"
import {
  Box,
  FormControl,
  Stack,
  Select,
  CheckIcon,
  Center,
  Radio,
} from "native-base"

import ConfirmData from "./ConfirmData"
import COLORS from "../../consts/colors"
import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator"

import administrativePosts from "../../consts/administrativePosts"
import provinces from "../../consts/provinces"
import districts from "../../consts/districts"
import villages from "../../consts/villages"
import countries from "../../consts/countries"
import idDocTypes from "../../consts/idDocTypes"
import { CustomInput } from "../Inputs/CustomInput"
import validateFarmerEditedData from "../../helpers/validateFarmerEditedData"

import { useUser } from "@realm/react"
import { realmContext } from "../../models/realmContext"
import { useRef } from "react"
const { useRealm } = realmContext

const EditFarmerData = ({
  isOverlayVisible,
  setIsOverlayVisible,
  isConfirmDataVisible,
  setIsConfirmDataVisible,
  resizeBox,
  scale,
  ownerName,
  resource,
  resourceName,
  dataToBeUpdated,
  newDataObject,
  oldDataObject,
  setNewDataObject,
  setOldDataObject,
  addressProvince,
  addressDistrict,
  addressAdminPost,
  addressVillage,
  addressOldProvince,
  addressOldDistrict,
  addressOldAdminPost,
  addressOldVillage,
  setAddressProvince,
  setAddressDistrict,
  setAddressAdminPost,
  setAddressVillage,
  selectedAddressAdminPosts,
  setSelectedAddressAdminPosts,
  setAddressOldProvince,
  setAddressOldDistrict,
  setAddressOldAdminPost,
  setAddressOldVillage,

  // contact
  primaryPhone,

  secondaryPhone,
  setPrimaryPhone,
  setSecondaryPhone,
  oldPrimaryPhone,
  oldSecondaryPhone,
  setOldPrimaryPhone,
  setOldSecondaryPhone,

  // idDocument
  docNumber,

  setDocNumber,
  docType,
  setDocType,
  nuit,
  setNuit,
  oldDocNumber,
  setOldDocNumber,
  oldDocType,
  setOldDocType,
  oldNuit,
  setOldNuit
}: any) => {
  const realm = useRealm()
  const user = useUser()
  const customUserData = user?.customData

  // // ----------------------------------------------------
  const [errors, setErrors] = useState({})
  const [overlayTitle, setOverlayTitle] = useState("")

  useEffect(() => {
    if (dataToBeUpdated === "address" && resourceName === "Farmer") {
      setAddressProvince(customUserData?.userProvince)
      setAddressDistrict(customUserData?.userDistrict)
      setAddressAdminPost(resource?.address.adminPost)
      setAddressVillage(resource?.address.village)
      setOverlayTitle("Actualizar endereço.")

      setAddressOldProvince(customUserData?.userProvince)
      setAddressOldDistrict(customUserData?.userDistrict)
      setAddressOldAdminPost(resource?.address.adminPost)
      setAddressOldVillage(resource?.address.village)
    }

    if (dataToBeUpdated === "contact" && resourceName === "Farmer") {
      setPrimaryPhone(resource?.contact.primaryPhone)
      setSecondaryPhone(resource?.contact.secondaryPhone)
      setOverlayTitle("Actualizar contactos.")

      setOldPrimaryPhone(resource?.contact.primaryPhone)
      setOldSecondaryPhone(resource?.contact.secondaryPhone)
    }

    if (dataToBeUpdated === "idDocument" && resourceName === "Farmer") {
      setDocType(resource?.idDocument.docType)
      setDocNumber(resource?.idDocument.docNumber)
      setNuit(resource?.idDocument.nuit)

      setOverlayTitle("Actualizar Documentos de Identidade.")

      setOldDocType(resource?.idDocument.docType)
      setOldDocNumber(resource?.idDocument.docNumber)
      setOldNuit(resource?.idDocument.nuit)
    }
  }, [dataToBeUpdated, resourceName])

  const onConfirmUpdate = (dataToBeUpdated: any, resourceName: any) => {
    const validatedData = validateFarmerEditedData(
      {
        addressAdminPost,
        addressVillage,
        primaryPhone,
        secondaryPhone,
        docType,
        docNumber,
        nuit,
        addressOldAdminPost,
        addressOldVillage,
        oldPrimaryPhone,
        oldSecondaryPhone,
        oldDocType,
        oldDocNumber,
        oldNuit,
      },
      errors,
      setErrors,
      dataToBeUpdated,
      resourceName,
    )

    const newData = {}
    const oldData = {}

    if (dataToBeUpdated === "address" && resourceName === "Farmer") {
      //  new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["province"] = addressProvince

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["district"] = addressDistrict

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["adminPost"] = validatedData?.adminPost

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["village"] = validatedData?.village

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["province"] = addressOldProvince

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["district"] = addressOldDistrict

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["adminPost"] = addressOldAdminPost

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["village"] = addressOldVillage

      setNewDataObject(newData)
      setOldDataObject(oldData)
    }

    if (dataToBeUpdated === "contact" && resourceName === "Farmer") {
      // new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["primaryPhone"] = validatedData?.primaryPhone

        // @ts-expect-error TS(2339): Property 'primaryPhone' does not exist on type 'fa... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.primaryPhone))
        : 0

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["secondaryPhone"] = validatedData?.secondaryPhone

        // @ts-expect-error TS(2339): Property 'secondaryPhone' does not exist on type '... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.secondaryPhone))
        : 0

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["primaryPhone"] = oldPrimaryPhone
        ? Number(parseInt(oldPrimaryPhone))
        : 0

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["secondaryPhone"] = oldSecondaryPhone
        ? Number(parseInt(oldSecondaryPhone))
        : 0

      setNewDataObject(newData)
      setOldDataObject(oldData)
    }

    if (dataToBeUpdated === "idDocument" && resourceName === "Farmer") {
      // new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["docType"] = validatedData?.docType?.trim()

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["docNumber"] = validatedData?.docNumber

        // @ts-expect-error TS(2339): Property 'docNumber' does not exist on type 'false... Remove this comment to see the full error message
        ? validatedData?.docNumber
        : ""

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["nuit"] = validatedData?.nuit

        // @ts-expect-error TS(2339): Property 'nuit' does not exist on type 'false | { ... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.nuit))
        : 0

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["docType"] = oldDocType ? oldDocType : "Não tem"

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["docNumber"] = oldDocNumber ? oldDocNumber : ""

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["nuit"] = oldNuit ? oldNuit : 0

      setNewDataObject(newData)
      setOldDataObject(oldData)
    }
  }

  useEffect(() => {
    if (docType === "Não tem") {
      setDocNumber("")
    }
  }, [docType])

  // console.log('errors: ', errors);
  // console.log('oldDataObject: ', oldDataObject);

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible)
  }

  return (
    // <Overlay
    //     overlayStyle={{
    //         backgroundColor: 'ghostwhite',
    //         width: '90%',
    //         maxHeight: '80%',
    //         borderRadius: 10,
    //         // paddingBottom: 10,
    //     }}
    //     isVisible={isOverlayVisible}
    //     onBackdropPress={toggleOverlay}
    // >
    // </Overlay>
    <Modal transparent visible={isOverlayVisible}>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            justifyContent: "center",
            backgroundColor: COLORS.ghostwhite,
            borderColor: COLORS.lightgrey,
            borderTopWidth: 2,
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            borderLeftWidth: 2,
            borderRightWidth: 2,
            // borderTopLeftRadius: 30,
            // borderTopRightRadius: 30,
            maxHeight: "80%",
            padding: 20,
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
            opacity: scale?.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            transform: [{ scale }],
          }}
        >
          <View
            style={{
              width: "100%",
              // backgroundColor: COLORS.pantone,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: COLORS.black,
                fontSize: 16,
                paddingVertical: 5,
                fontFamily: "JosefinSans-Bold",
              }}
            >
              {overlayTitle}
            </Text>
          </View>

          <View
            style={{
              position: "absolute",
              right: 10,
              top: 10,
            }}
          >
            <Icon
              onPress={() => {
                // setIsOverlayVisible(false);
                resizeBox(0)
              }}
              name="close"
              size={25}
              color={COLORS.grey}
            />
          </View>
          <ScrollView
            decelerationRate={"normal"}
            fadingEdgeLength={2}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            style={
              {
                // flex: 1,
                // minHeight: '100%',
                // marginVertical: 10,
              }
            }
          >
            {/* <Box>
                <Text
                    style={{ 
                        textAlign: 'center',
                        color: COLORS.black,
                        fontSize: 18,
                        paddingVertical: 15,
                        fontFamily: 'JosefinSans-Bold',
                        
                    }}
                >{overlayTitle}</Text>
            </Box> */}

            {/* update the farmer idDocuments */}

            {dataToBeUpdated === "idDocument" && resourceName === "Farmer" && (
              <Stack direction="column">
                <Stack>
                  <FormControl
                    my="2"
                    isRequired
                    isInvalid={"docType" in errors}
                  >
                    <FormControl.Label>Tipo do documento</FormControl.Label>
                    <Select
                      selectedValue={docType}

                      // @ts-expect-error TS(2322): Type '{ children: Element[]; selectedValue: any; a... Remove this comment to see the full error message
                      accessibilityLabel="Tipo de doc."
                      placeholder="Tipo de documento"
                      minHeight={55}
                      _selectedItem={{
                        bg: "teal.600",
                        fontSize: "lg",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      dropdownCloseIcon={
                        docType ? (
                          <Icon
                            name="close"
                            size={20}
                            color={COLORS.lightgrey}
                            onPress={() => setDocType("")}
                          />
                        ) : (
                          <Icon
                            // size={45}
                            name="arrow-drop-down"
                            color={COLORS.pantone}
                          />
                        )
                      }
                      mt={1}
                      onValueChange={(newDocType) => {
                        setErrors((prev) => ({
                          ...prev,
                          docType: "",
                          docNumber: "",
                        }))
                        setDocType(newDocType)
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
                          <Icon name="error-outline" size={16} color="red" />
                        }
                        _text={{ fontSize: "xs" }}
                      >
                        // @ts-expect-error TS(2339): Property 'docType' does not exist on type '{}'.
                        // @ts-expect-error TS(2339): Property 'docType' does not exist on type '{}'.
                        {errors?.docType}
                      </FormControl.ErrorMessage>
                    ) : (
                      <FormControl.HelperText></FormControl.HelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  {!(docType === "Não tem") && (
                    <FormControl my="3" isInvalid={"docNumber" in errors}>
                      <FormControl.Label>Número do documento</FormControl.Label>
                      <CustomInput
                        width="100%"
                        type="text"
                        isDisabled={
                          docType === "Não tem" || docType === "" ? true : false
                        }
                        value={docNumber?.toString()}
                        placeholder={
                          docNumber ? docNumber?.toString() : "Nenhum"
                        }
                        onChangeText={(newDocNumber: any) => {
                          setErrors((prev) => ({ ...prev, docNumber: "" }))
                          setDocNumber(newDocNumber)
                        }}
                      />
                      {"docNumber" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          // @ts-expect-error TS(2339): Property 'docNumber' does not exist on type '{}'.
                          // @ts-expect-error TS(2339): Property 'docNumber' does not exist on type '{}'.
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
                      placeholder={nuit ? nuit?.toString() : "Nenhum"}
                      value={nuit?.toString()}
                      keyboardType="numeric"
                      onChangeText={(newNuit: any) => {
                        setErrors((prev) => ({ ...prev, nuit: "" }))
                        setNuit(newNuit)
                      }}
                    />
                    {"nuit" in errors ? (
                      <FormControl.ErrorMessage
                        leftIcon={
                          <Icon name="error-outline" size={16} color="red" />
                        }
                        _text={{ fontSize: "xs" }}
                      >
                        // @ts-expect-error TS(2339): Property 'nuit' does not exist on type '{}'.
                        // @ts-expect-error TS(2339): Property 'nuit' does not exist on type '{}'.
                        {errors?.nuit}
                      </FormControl.ErrorMessage>
                    ) : (
                      <FormControl.HelperText></FormControl.HelperText>
                    )}
                  </FormControl>
                </Stack>
              </Stack>
            )}

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
                        primaryPhone ? primaryPhone?.toString() : "Nenhum"
                      }
                      keyboardType="numeric"
                      value={primaryPhone ? primaryPhone?.toString() : ""}
                      onChangeText={(newPhone: any) => {
                        setErrors((prev) => ({ ...prev, primaryPhone: "" }))
                        setPrimaryPhone(newPhone)
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
                        // @ts-expect-error TS(2339): Property 'primaryPhone' does not exist on type '{}... Remove this comment to see the full error message
                        // @ts-expect-error TS(2339): Property 'primaryPhone' does not exist on type '{}... Remove this comment to see the full error message
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
                    <FormControl.Label>Telemóvel Alternativo</FormControl.Label>
                    <CustomInput
                      width="100%"
                      type="telephoneNumber"
                      placeholder={
                        secondaryPhone ? secondaryPhone?.toString() : "Nenhum"
                      }
                      keyboardType="numeric"
                      value={secondaryPhone ? secondaryPhone?.toString() : ""}
                      onChangeText={(newPhone: any) => {
                        setErrors((prev) => ({ ...prev, secondaryPhone: "" }))
                        setSecondaryPhone(newPhone)
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
                        // @ts-expect-error TS(2339): Property 'secondaryPhone' does not exist on type '... Remove this comment to see the full error message
                        // @ts-expect-error TS(2339): Property 'secondaryPhone' does not exist on type '... Remove this comment to see the full error message
                        {errors?.secondaryPhone}
                      </FormControl.ErrorMessage>
                    ) : (
                      <FormControl.HelperText></FormControl.HelperText>
                    )}
                  </FormControl>
                </Box>
              </Stack>
            )}

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
                      selectedValue={addressProvince ? addressAdminPost : ""}

                      // @ts-expect-error TS(2322): Type '{ children: any[]; selectedValue: any; acces... Remove this comment to see the full error message
                      accessibilityLabel="Escolha um posto administrativo"
                      placeholder="Escolha um posto administrativo"
                      minHeight={55}
                      _selectedItem={{
                        bg: "teal.600",
                        fontSize: "lg",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      dropdownCloseIcon={
                        addressAdminPost ? (
                          <Icon
                            name="close"
                            size={20}
                            color={COLORS.lightgrey}
                            onPress={() => setAddressAdminPost("")}
                          />
                        ) : (
                          <Icon
                            // size={45}
                            name="arrow-drop-down"
                            color={COLORS.pantone}
                          />
                        )
                      }
                      mt={1}
                      onValueChange={(newAdminPost) => {
                        setErrors((prev) => ({ ...prev, addressAdminPost: "" }))
                        setAddressAdminPost(newAdminPost)
                      }}
                    >
                      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      {administrativePosts[addressDistrict]?.map(
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
                        // @ts-expect-error TS(2339): Property 'addressAdminPost' does not exist on type... Remove this comment to see the full error message
                        // @ts-expect-error TS(2339): Property 'addressAdminPost' does not exist on type... Remove this comment to see the full error message
                        {errors?.addressAdminPost}
                      </FormControl.ErrorMessage>
                    ) : (
                      <FormControl.HelperText></FormControl.HelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isRequired my="3">
                    <FormControl.Label>Localidade</FormControl.Label>
                    <Select
                      selectedValue={addressVillage}

                      // @ts-expect-error TS(2322): Type '{ children: any[]; selectedValue: any; acces... Remove this comment to see the full error message
                      accessibilityLabel="Escolha uma localidade"
                      placeholder="Escolha uma localidade"
                      minHeight={55}
                      _selectedItem={{
                        bg: "teal.600",
                        fontSize: "lg",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      dropdownCloseIcon={
                        addressVillage ? (
                          <Icon
                            name="close"
                            size={20}
                            color="grey"
                            onPress={() => setAddressVillage("")}
                          />
                        ) : (
                          <Icon
                            // size={45}
                            name="arrow-drop-down"
                            color={COLORS.pantone}
                          />
                        )
                      }
                      mt={1}
                      onValueChange={(newVillage) =>
                        setAddressVillage(newVillage)
                      }
                    >
                      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      {villages[addressAdminPost]?.map((village: any, index: any) => (
                        <Select.Item
                          key={index}
                          label={village}
                          value={village}
                        />
                      ))}
                    </Select>
                    <FormControl.ErrorMessage>{""}</FormControl.ErrorMessage>
                  </FormControl>
                </Stack>
              </Box>
            )}

            <Button
              title="Confirmar Dados"
              titleStyle={{
                color: COLORS.ghostwhite,
                fontFamily: "JosefinSans-Bold",
              }}
              iconPosition="right"
              // icon={
              // <Icon
              //     name="save"
              //     type="font-awesome"
              //     color="white"
              //     size={25}
              //     iconStyle={{
              //         marginRight: 10,
              //         // color: COLORS.ghostwhite,
              //         paddingHorizontal: 10,
              //      }}
              // />
              // }
              containerStyle={{
                backgroundColor: COLORS.pantone,
                borderRadius: 10,
                // color: COLORS.ghostwhite,
              }}
              type="outline"

              // @ts-expect-error TS(2322): Type '{ title: string; titleStyle: { color: string... Remove this comment to see the full error message
              onPress={() => {
                if (
                  !validateFarmerEditedData(
                    {
                      addressAdminPost,
                      addressVillage,
                      primaryPhone,
                      secondaryPhone,
                      docType,
                      docNumber,
                      nuit,
                      addressOldAdminPost,
                      addressOldVillage,
                      oldPrimaryPhone,
                      oldSecondaryPhone,
                      oldDocType,
                      oldDocNumber,
                      oldNuit,
                    },
                    errors,
                    setErrors,
                    dataToBeUpdated,
                    resourceName,
                  )
                ) {
                  return
                }
                onConfirmUpdate(dataToBeUpdated, resourceName)
                // setIsOverlayVisible(false);
                resizeBox(0)
                setIsConfirmDataVisible(true)
              }}
            />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
}

export default EditFarmerData
