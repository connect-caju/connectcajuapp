import { Text, SafeAreaView, ScrollView, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Stack,
  Select,
  CheckIcon,
  Center,
  Radio,
} from "native-base";
import { Icon, Button, CheckBox } from "@rneui/themed";
import { Datepicker } from "@ui-kitten/components";
import AwesomeAlert from "react-native-awesome-alerts";

import { CustomInput } from "../../components/Inputs/CustomInput";
import villages from "../../consts/villages";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import {
  groups,
  institutions,
  privateInstitutions,
  publicInstitutions,
} from "../../consts/farmerTypes";

import { realmContext } from "../../models/realmContext";
import COLORS from "../../consts/colors";
import InputCheckBox from "../../components/InputCheckBox/InputCheckBox";
import InputLabel from "../../components/InputLabel/InputLabel";
const { useRealm } = realmContext;

export default function InstitutionFarmerForm({
  route,
  navigation,
  institutionType,
  setInstitutionType,
  institutionName,
  setInstitutionName,
  institutionManagerName,
  setInstitutionManagerName,
  institutionManagerPhone,
  setInstitutionManagerPhone,
  institutionAdminPost,
  setInstitutionAdminPost,
  institutionVillage,
  setInstitutionVillage,
  institutionNuit,
  setInstitutionNuit,
  isPrivateInstitution,
  setIsPrivateInstitution,
  institutionLicence,
  setInstitutionLicence,
  errors,
  setErrors,
  selectedAddressAdminPosts,
  setSelectedAddressAdminPosts,
  isInstitutionPrivate,
  isInstitutionPublic,
  setIsInstitutionPrivate,
  setIsInstitutionPublic,
}: any) {
  useEffect(() => {
    if (institutionType === "") {
      setInstitutionName("");
    }
  }, [institutionType]);

  return (
    <View className="px-3 pt-6 w-full">
      <View className="w-full">
        <FormControl
          isRequired
          my="1"
          isInvalid={"isPrivateInstitution" in errors}
        >
          <InputLabel label="Esta instituição é..." />
          <View className="flex flex-row w-full justify-between gap-2 ">
            <View className="flex-1 justify-start">
              <InputCheckBox
                title="Privada"
                isChecked={isPrivateInstitution}
                errorProperty={errors.isInstitutionPrivate}
                onPress={() => {
                  setIsInstitutionPrivate(true);
                  setIsInstitutionPublic(false);
                  setIsPrivateInstitution(true);
                  setInstitutionType("");
                  setErrors({
                    ...errors,
                    isPrivateInstitution: "",
                  });
                }}
              />
            </View>
            <View className="flex-1 justify-end">
              <InputCheckBox
                title="Pública"
                isChecked={isInstitutionPublic}
                errorProperty={errors?.isInstitutionPrivate}
                onPress={() => {
                  setIsInstitutionPrivate(false);
                  setIsInstitutionPublic(true);
                  setIsPrivateInstitution(false);
                  setInstitutionType("");
                  setInstitutionLicence("");
                  setErrors({
                    ...errors,
                    isPrivateInstitution: "",
                  });
                }}
              />
            </View>
          </View>
          {"isPrivateInstitution" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText></FormControl.HelperText>
          )}
        </FormControl>
      </View>

      <View className="flex flex-row gap-2 justify-center w-full">
        <View className="flex-1">
          <FormControl
            isRequired
            my="3"
            isInvalid={"institutionType" in errors}
          >
            <FormControl.Label>Tipo de Instituição</FormControl.Label>
            <Select
              isDisabled={
                !isInstitutionPrivate && !isInstitutionPublic ? true : false
              }
              selectedValue={institutionType}
              // @ts-expect-error TS(2322): Type '{ children: any[]; isDisabled: boolean; sele... Remove this comment to see the full error message
              accessibilityLabel="Tipo de Instituição"
              placeholder={"Escolha uma instituição"}
              minHeight={55}
              dropdownCloseIcon={
                institutionType ? (
                  <Icon
                    name="close"
                    size={20}
                    color="grey"
                    onPress={() => setInstitutionType("")}
                  />
                ) : (
                  <Icon
                    // size={45}
                    name="arrow-drop-down"
                    color="#005000"
                  />
                )
              }
              _selectedItem={{
                bg: "gray.200",
                fontSize: "4xl",
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(newInstitutionType) => {
                setErrors((prev: any) => ({
                  ...prev,
                  institutionType: "",
                }));
                setInstitutionType(newInstitutionType);
              }}
            >
              {isPrivateInstitution &&
                privateInstitutions?.map((institution, index) => (
                  <Select.Item
                    key={index}
                    label={institution}
                    value={institution}
                  />
                ))}
              {!isPrivateInstitution &&
                publicInstitutions?.map((institution, index) => (
                  <Select.Item
                    key={index}
                    label={institution}
                    value={institution}
                  />
                ))}
            </Select>

            {"institutionType" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.institutionType}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
        <View className="flex-1">
          <FormControl
            isRequired
            my="4"
            isInvalid={"institutionName" in errors}
          >
            <FormControl.Label>Nome</FormControl.Label>
            <CustomInput
              width="100%"
              isDisabled={institutionType === "" ? true : false}
              autoCapitalize="words"
              placeholder="Nome da Instituição"
              value={institutionName}
              onChangeText={(newInstitutionName: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  institutionName: "",
                }));
                setInstitutionName(newInstitutionName);
              }}
            />
            {"institutionName" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.institutionName}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
      </View>

      <View className="flex flex-row gap-2 justify-center w-full">
        <View className="flex-1">
          <FormControl
            isRequired
            my="2"
            isInvalid={"institutionAdminPost" in errors}
          >
            <FormControl.Label>Posto Adm.</FormControl.Label>
            <Select
              selectedValue={institutionAdminPost}
              accessibilityLabel="posto administrativo"
              placeholder="Escolha posto administrativo"
              minHeight={55}
              _selectedItem={{
                bg: "gray.200",
                fontSize: "4xl",
                endIcon: <CheckIcon size="5" />,
              }}
              dropdownCloseIcon={
                institutionAdminPost ? (
                  <Icon
                    name="close"
                    size={20}
                    color="grey"
                    onPress={() => setInstitutionAdminPost("")}
                  />
                ) : (
                  <Icon
                    // size={45}
                    name="arrow-drop-down"
                    color="#005000"
                  />
                )
              }
              mt={1}
              onValueChange={(newAdminPost) => {
                setErrors((prev: any) => ({
                  ...prev,
                  institutionAdminPost: "",
                }));
                setInstitutionAdminPost(newAdminPost);
              }}
            >
              {selectedAddressAdminPosts?.map((adminPost: any, index: any) => (
                <Select.Item key={index} label={adminPost} value={adminPost} />
              ))}
            </Select>
            {"institutionAdminPost" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.institutionAdminPost}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
        <View className="flex-1">
          <FormControl isRequired my="2">
            <FormControl.Label>Localidade</FormControl.Label>
            <Select
              selectedValue={institutionVillage}
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
                institutionVillage ? (
                  <Icon
                    name="close"
                    size={20}
                    color="grey"
                    onPress={() => setInstitutionVillage("")}
                  />
                ) : (
                  <Icon
                    // size={45}
                    name="arrow-drop-down"
                    color="#005000"
                  />
                )
              }
              mt={1}
              onValueChange={(newVillage) => setInstitutionVillage(newVillage)}
            >
              {villages[institutionAdminPost]?.map(
                (village: any, index: any) => (
                  <Select.Item key={index} label={village} value={village} />
                ),
              )}
            </Select>
            <FormControl.ErrorMessage>{""}</FormControl.ErrorMessage>
          </FormControl>
        </View>
      </View>

      <FormControl
        isRequired
        my="1"
        isInvalid={"institutionManagerName" in errors}
      >
        <FormControl.Label>Nome do Representante</FormControl.Label>
        <CustomInput
          width="100%"
          type="text"
          autoCapitalize="words"
          placeholder="Nome completo do representante"
          value={institutionManagerName}
          onChangeText={(newManagerName: any) => {
            setErrors((prev: any) => ({
              ...prev,
              institutionManagerName: "",
            }));
            setInstitutionManagerName(newManagerName);
          }}
        />
        {"institutionManagerName" in errors ? (
          <FormControl.ErrorMessage
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: "xs" }}
          >
            {errors?.institutionManagerName}
          </FormControl.ErrorMessage>
        ) : (
          <FormControl.HelperText></FormControl.HelperText>
        )}
      </FormControl>

      <Stack direction="row" mx="3" w="100%">
        <Box w="50%" px="1" my="2">
          <FormControl isInvalid={"institutionManagerPhone" in errors}>
            <FormControl.Label>Tel. do Responsável</FormControl.Label>
            <CustomInput
              width="100%"
              type="telephoneNumber"
              placeholder="Telemóvel"
              keyboardType="phone-pad"
              value={institutionManagerPhone}
              onChangeText={(newManagerPhone: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  institutionManagerPhone: "",
                }));
                setInstitutionManagerPhone(newManagerPhone);
              }}
              InputLeftElement={
                <Icon name="phone" color="grey" size={25} type="material" />
              }
            />
            {"institutionManagerPhone" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.institutionManagerPhone}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </Box>
        <Box w="50%" px="1" my="2">
          <FormControl isInvalid={"institutionNuit" in errors}>
            <FormControl.Label>NUIT da Instituição</FormControl.Label>
            <CustomInput
              width="100%"
              type="number"
              placeholder="NUIT"
              value={institutionNuit}
              keyboardType="numeric"
              onChangeText={(newNuit: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  institutionNuit: "",
                }));
                setInstitutionNuit(newNuit);
              }}
            />
            {"institutionNuit" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.institutionNuit}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </Box>
      </Stack>
      {(institutionType.includes("Empresa") ||
        institutionType?.includes("Outr") ||
        institutionType?.includes("ONG")) && (
        <Stack direction="row" mx="3" w="100%">
          <Box w="50%" px="1" my="2">
            <FormControl isInvalid={"institutionManagerPhone" in errors}>
              <FormControl.Label>N°. de Alvará</FormControl.Label>
              <CustomInput
                width="100%"
                type="text"
                placeholder="Alvará"
                // keyboardType="numeric"
                value={institutionLicence}
                onChangeText={(newLicence: any) => {
                  setErrors((prev: any) => ({
                    ...prev,
                    institutionLicence: "",
                  }));
                  setInstitutionLicence(newLicence);
                }}
              />
              {"institutionLicence" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.institutionLicence}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText></FormControl.HelperText>
              )}
            </FormControl>
          </Box>
          <Box w="50%" px="1" my="2"></Box>
        </Stack>
      )}
    </View>
  );
}
