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
import { CustomInput } from "../../components/Inputs/CustomInput";
import villages from "../../consts/villages";
import {
  groups,
  institutions,
  privateInstitutions,
  publicInstitutions,
} from "../../consts/farmerTypes";
import { Input } from "../../../components/Input";

import { realmContext } from "../../models/realmContext";
import InputCheckBox from "../../components/InputCheckBox/InputCheckBox";
import InputLabel from "../../components/InputLabel/InputLabel";
import styles from "./styles";
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
                errorProperty={errors?.isPrivateInstitution}
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
                errorProperty={errors?.isPrivateInstitution}
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

      <View className="flex flex-col justify-center w-full">
        <View className="flex-1">
          <FormControl
            isRequired
            my="1"
            isInvalid={"institutionType" in errors}
          >
            <InputLabel label="Tipo de Instituicação" />
            <Select
              // isDisabled={
              //   !isInstitutionPrivate && !isInstitutionPublic ? true : false
              // }
              selectedValue={institutionType}
              placeholder={"Escolha uma instituição"}
              minHeight={50}
              dropdownCloseIcon={
                <Icon
                // size={45}
                name="arrow-drop-down"
                color="#005000"
              />
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
            my="1"
            isInvalid={"institutionName" in errors}
          >
            <InputLabel label="Nome da Instituição" />
            <Input 
              value={institutionName}
              onChangeText={(newInstitutionName: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  institutionName: "",
                }));
                setInstitutionName(newInstitutionName);
              }}
              placeholder="Nome da Instituição"
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

      <View className="my-3">
        <Text style={styles.formSectionDescription}>Endereço e Contacto</Text>
      </View>

      <View className="flex flex-row gap-2 justify-center w-full">
        <View className="flex-1">
          <FormControl
            isRequired
            my="2"
            isInvalid={"institutionAdminPost" in errors}
          >
            <InputLabel label="Posto Adm." />
            <Select
              selectedValue={institutionAdminPost}
              placeholder="Escolha posto administrativo"
              minHeight={50}
              _selectedItem={{
                bg: "gray.200",
                fontSize: "4xl",
                endIcon: <CheckIcon size="5" />,
              }}
              dropdownCloseIcon={
                <Icon
                // size={45}
                name="arrow-drop-down"
                color="#005000"
              />
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
            <InputLabel label="Localidade" />
            <Select
              selectedValue={institutionVillage}
              placeholder="Escolha uma localidade"
              minHeight={50}
              _selectedItem={{
                bg: "gray.200",
                fontSize: "4xl",
                endIcon: <CheckIcon size="5" />,
              }}
              dropdownCloseIcon={
                <Icon
                // size={45}
                name="arrow-drop-down"
                color="#005000"
              />
                
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
        <InputLabel label="Nome do Responsável" />
        <Input 
          autoCapitalize="words"
          value={institutionManagerName}
          onChangeText={(newManagerName: any) => {
            setErrors((prev: any) => ({
              ...prev,
              institutionManagerName: "",
            }))
            setInstitutionManagerName(newManagerName);
          }}
          placeholder="Nome completo do responsável"

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

      <View className="flex flex-row w-full gap-2" >
        <View className="flex-1" >
          <FormControl isInvalid={"institutionManagerPhone" in errors}>
            <InputLabel label="Tel. do Responsável" />
            <Input 
              keyboardType="phone-pad"
              value={institutionManagerPhone}
              onChangeText={(newManagerPhone: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  institutionManagerPhone: "",
                }))
                setInstitutionManagerPhone(newManagerPhone);
              }}
              placeholder="Telemóvel do responsável"
              className="text-center"
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
        </View>
        <View className="flex-1">
          <FormControl isInvalid={"institutionNuit" in errors}>
            <InputLabel label="NUIT da Instituição" />
            <Input 
              keyboardType="numeric"
              value={institutionNuit}
              onChangeText={(newNuit: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  institutionNuit: "",
                }));
                setInstitutionNuit(newNuit);
              }}
              placeholder="NUIT"
              className="text-center"
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
        </View>
      </View>
      {(institutionType.includes("Empresa") ||
        institutionType?.includes("Outr") ||
        institutionType?.includes("ONG")) && (
        <View direction="row" mx="3" w="100%">
          <View w="50%" px="1" my="2">
            <FormControl isInvalid={"institutionManagerPhone" in errors}>
              <InputLabel label="N°. de Alvará" />
              <Input
                autoCapitalize="characters"
                value={institutionLicence}
                onChangeText={(newLicence: any) => {
                  setErrors((prev: any) => ({
                    ...prev,
                    institutionLicence: "",
                  }));
                  setInstitutionLicence(newLicence);
                }}
                placeholder="Alvará"
                className="text-center"
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
          </View>
        </View>
      )}
    </View>
  );
}
