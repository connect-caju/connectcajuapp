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
import { useInstitutionStore } from "../../app/stores/institutionStore";
const { useRealm } = realmContext;

interface Props {
  selectedAddressAdminPosts: string[];
}

export default function InstitutionFarmerForm({
  selectedAddressAdminPosts,
}: Props) {
  const { institutionData, updateInstitutionField, resetInstitutionForm } =
    useInstitutionStore();

  useEffect(() => {
    resetInstitutionForm();
  }, []);

  return (
    <View className="px-3 pt-6 w-full">
      <View className="w-full">
        <FormControl
          isRequired
          my="1"
          isInvalid={"isPrivate" in institutionData?.errors}
        >
          <InputLabel label="Esta instituição é..." />
          <View className="flex flex-row w-full justify-between gap-2 ">
            <View className="flex-1 justify-start">
              <InputCheckBox
                title="Privada"
                isChecked={institutionData.isPrivate === "Sim" ? true : false}
                errorProperty={institutionData?.errors?.isPrivateInstitution}
                onPress={() => {
                  updateInstitutionField("isPrivate", "Sim");
                  updateInstitutionField("errors", {
                    ...institutionData?.errors,
                    isPrivate: "",
                  });
                }}
              />
            </View>
            <View className="flex-1 justify-end">
              <InputCheckBox
                title="Pública"
                isChecked={institutionData.isPrivate === "Não" ? true : false}
                errorProperty={institutionData?.errors?.isPrivateInstitution}
                onPress={() => {
                  updateInstitutionField("isPrivate", "Não");
                  updateInstitutionField("errors", {
                    ...institutionData?.errors,
                    isPrivate: "",
                  });
                }}
              />
            </View>
          </View>
          {"isPrivate" in institutionData?.errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {institutionData?.errors.isPrivate}
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
            isInvalid={"type" in institutionData?.errors}
          >
            <InputLabel label="Tipo de Instituicação" />
            <Select
              selectedValue={institutionData.type}
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
                updateInstitutionField("type", newInstitutionType);
                updateInstitutionField("errors", {
                  ...institutionData.errors,
                  type: "",
                  isPrivate: "",
                })
              }}
            >
              {institutionData.isPrivate === "Sim" &&
                privateInstitutions?.map((institution, index) => (
                  <Select.Item
                    key={index}
                    label={institution}
                    value={institution}
                  />
                ))}
              {institutionData.isPrivate === "Não" &&
                publicInstitutions?.map((institution, index) => (
                  <Select.Item
                    key={index}
                    label={institution}
                    value={institution}
                  />
                ))}
            </Select>

            {"type" in institutionData?.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {institutionData?.errors?.type}
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
            isInvalid={"name" in institutionData?.errors}
          >
            <InputLabel label="Nome da Instituição" />
            <Input
              value={institutionData.name}
              onChangeText={(newInstitutionName: string) => {
                updateInstitutionField("errors", {
                  ...institutionData?.errors,
                  name: "",
                });
                updateInstitutionField("name", newInstitutionName);
              }}
              placeholder="Nome da Instituição"
            />

            {"name" in institutionData?.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {institutionData?.errors?.name}
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

      <View className="flex flex-row justify-center w-full">
        <View className="flex-1 mr-1">
          <FormControl
            isRequired
            my="2"
            isInvalid={"adminPost" in institutionData?.errors}
          >
            <InputLabel label="Posto Adm." />
            <Select
              selectedValue={institutionData.address.adminPost}
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
                updateInstitutionField("address", {
                  ...institutionData.address,
                  adminPost: newAdminPost,
                });
              }}
            >
              {selectedAddressAdminPosts?.map((adminPost: string) => (
                <Select.Item
                  key={adminPost}
                  label={adminPost}
                  value={adminPost}
                />
              ))}
            </Select>
            {"adminPost" in institutionData?.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {institutionData?.errors?.adminPost}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
        <View className="flex-1 ml-1">
          <FormControl isRequired my="2">
            <InputLabel label="Localidade" />
            <Select
              selectedValue={institutionData.address.village}
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
              onValueChange={(newVillage) => {
                updateInstitutionField("address", {
                  ...institutionData.address,
                  village: newVillage,
                });
              }}
            >
              {institutionData.address.adminPost && villages[institutionData.address.adminPost]?.map(
                (village: string, index: number) => (
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
        isInvalid={"managerName" in institutionData?.errors}
      >
        <InputLabel label="Nome do Responsável" />
        <Input
          autoCapitalize="words"
          value={institutionData.manager.fullname}
          onChangeText={(newManagerName: string) => {
            updateInstitutionField("manager", {
              ...institutionData.manager,
              fullname: newManagerName,
            });
            updateInstitutionField("errors", {
              ...institutionData.errors,
              managerName: "",
            });
          }}
          placeholder="Nome completo do responsável"
        />

        {"managerName" in institutionData?.errors ? (
          <FormControl.ErrorMessage
            leftIcon={<Icon name="error-outline" size={16} color="red" />}
            _text={{ fontSize: "xs" }}
          >
            {institutionData?.errors?.managerName}
          </FormControl.ErrorMessage>
        ) : (
          <FormControl.HelperText></FormControl.HelperText>
        )}
      </FormControl>

      <View className="flex flex-row w-full">
        <View className="flex-1 mr-1">
          <FormControl
            isInvalid={"phone" in institutionData?.errors}
          >
            <InputLabel label="Tel. do Responsável" />
            <Input
              keyboardType="phone-pad"
              value={institutionData.manager.phone}
              onChangeText={(newManagerPhone: string) => {
                updateInstitutionField("manager", {
                  ...institutionData.manager,
                  phone: newManagerPhone,
                });
                updateInstitutionField("errors", {
                  ...institutionData.errors,
                  phone: "",
                })
              }}
              placeholder="Telemóvel do responsável"
              className="text-center"
            />

            {"phone" in institutionData?.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {institutionData?.errors?.phone}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
        <View className="flex-1 ml-1">
          <FormControl isInvalid={"nuit" in institutionData?.errors}>
            <InputLabel label="NUIT da Instituição" />
            <Input
              keyboardType="numeric"
              value={institutionData.nuit}
              onChangeText={(newNuit: number) => {
                updateInstitutionField("nuit", newNuit);
                updateInstitutionField("errors", {
                  ...institutionData.errors,
                  nuit: "",
                });
              }}
              placeholder="NUIT"
              className="text-center"
            />

            {"nuit" in institutionData?.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {institutionData?.errors?.nuit}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
      </View>
      {(institutionData.type.includes("Empresa") ||
        institutionData.type?.includes("Outr") ||
        institutionData.type?.includes("ONG")) && (
        <View direction="row" mx="3" w="100%">
          <View w="50%" px="1" my="2">
            <FormControl
              isInvalid={"licence" in institutionData?.errors}
            >
              <InputLabel label="N°. de Alvará" />
              <Input
                autoCapitalize="characters"
                value={institutionData.licence}
                onChangeText={(newLicence: string) => {
                  updateInstitutionField("licence", newLicence);
                  updateInstitutionField("errors", {
                    ...institutionData.errors,
                    licence: "",
                  })
                }}
                placeholder="Alvará"
                className="text-center"
              />

              {"licence" in institutionData?.errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {institutionData.errors?.licence}
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
