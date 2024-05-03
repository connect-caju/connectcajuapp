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
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";

import { CustomInput } from "../../components/Inputs/CustomInput";
import villages from "../../consts/villages";
import CustomDivider from "../../components/Divider/CustomDivider";
import styles from "./styles";

import {
  fullYears,
  getFullYears,
  getFullYears2,
  localeDateService,
  useDatepickerState,
} from "../../helpers/dates";
import { groups, institutions } from "../../consts/farmerTypes";
import { groupPurposes } from "../../consts/groupPurposes";

import { realmContext } from "../../models/realmContext";
import COLORS from "../../consts/colors";
import {
  groupAffiliationStatus,
  groupAffiliationStatus2,
} from "../../consts/groupAffiliationStatus";
import InputLabel from "../../components/InputLabel/InputLabel";
import InputCheckBox from "../../components/InputCheckBox/InputCheckBox";
import { Input } from "../../../components/Input";
const { useRealm } = realmContext;

export default function GroupFarmerForm({
  route,
  navigation,
  groupType,
  setGroupType,
  groupName,
  setGroupName,
  groupAdminPost,
  setGroupAdminPost,
  groupVillage,
  setGroupVillage,
  groupOperatingLicence,
  setGroupOperatingLicence,
  groupNuel,
  setGroupNuel,
  groupNuit,
  setGroupNuit,
  groupAffiliationYear,
  setGroupAffiliationYear,
  groupMembersNumber,
  setGroupMembersNumber,
  groupWomenNumber,
  setGroupWomenNumber,
  errors,
  setErrors,
  selectedAddressAdminPosts,
  groupGoals,
  setGroupGoals,
  groupCreationYear,
  setGroupCreationYear,
  groupLegalStatus,
  setGroupLegalStatus,
  isGroupActive,
  setIsGroupActive,
  isGroupInactive,
  setIsGroupInactive,
}: any) {
  return (
    <View className="px-3 pt-6">
      <View className="w-full">
        <FormControl isRequired isInvalid={"isGroupActive" in errors}>
          <InputLabel label="Esta organização é..." />
          <View className="flex flex-row mx-3 w-full justify-between gap-2 ">
            <View className="flex-1 justify-start">
              <InputCheckBox
                title="Activa"
                isChecked={isGroupActive}
                onPress={() => {
                  setIsGroupInactive(false);
                  setIsGroupActive(true);
                  setErrors({
                    ...errors,
                    isGroupActive: "",
                  });
                }}
                errorProperty={errors?.isGroupActive}
              />
            </View>
            <View className="flex-1 justify-end">
              <InputCheckBox
                title="Inactiva"
                isChecked={isGroupInactive}
                onPress={() => {
                  setIsGroupInactive(true);
                  setIsGroupActive(false);
                  setErrors({
                    ...errors,
                    isGroupActive: "",
                  });
                }}
                errorProperty={errors?.isGroupActive}
              />
            </View>
          </View>
          {"isGroupActive" in errors ? (
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

      <View className="">
        <FormControl isRequired my="1" isInvalid={"groupType" in errors}>
          <InputLabel 
            label="Tipo de organização"
          />
          <Select
            selectedValue={groupType}
            placeholder="Tipo de grupo "
            minHeight={50}
            _selectedItem={{
              bg: "teal.600",
              fontSize: "lg",
              endIcon: <CheckIcon size="5" />,
            }}
            mt={1}
            dropdownCloseIcon={
              <Icon
                // size={45}
                name="arrow-drop-down"
                color={COLORS.main}
              />
            }
            onValueChange={(newGroupType) => {
              setErrors((prev: any) => ({
                ...prev,
                groupType: "",
              }));
              setGroupType(newGroupType);
            }}
          >
            {groups?.map((group, index) => (
              <Select.Item key={index} label={group} value={group} />
            ))}
          </Select>
          {"groupType" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.groupType}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText></FormControl.HelperText>
          )}
        </FormControl>
      </View>

      <View className="">
        <FormControl isRequired my="1" isInvalid={"groupName" in errors}>
          <InputLabel label="Nome da organização" />

          <Input
            placeholder="Nome da organização"
            value={groupName}
            autoCapitalize="words"
            onChangeText={(newGroupName: any) => {
              setErrors((prev: any) => ({
                ...prev,
                groupName: "",
              }));
              setGroupName(newGroupName);
            }}
          />
          {"groupName" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.groupName}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText></FormControl.HelperText>
          )}
        </FormControl>
      </View>

      <View>
        <FormControl isInvalid={"groupMembersNumber" in errors} isRequired>
          <InputLabel label="Membros" />
          <View className="flex flex-row w-full  items-center justify-center">
            <View className="flex-1 mr-1">
              <Input
                value={groupMembersNumber}
                onChangeText={(groupMembers: any) => {
                  setErrors((prev: any) => ({
                    ...prev,
                    groupMembersNumber: "",
                  }));
                  setGroupMembersNumber(groupMembers);
                }}
                keyboardType="numeric"
                placeholder="Total"
                className="text-center"
              />
            </View>
            <View className="flex-1 ml-1">
              <Input
                keyboardType="numeric"
                placeholder="Mulheres"
                className="text-center"
                onChangeText={(womenNumber: any) => {
                  setErrors((prev: any) => ({
                    ...prev,
                    groupWomenNumber: "",
                  }));
                  setGroupWomenNumber(womenNumber);
                }}
              />
            </View>
          </View>

          <View className="flex flex-row w-full  items-center justify-center">
            <View className="flex-1 mr-1">
              {"groupMembersNumber" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.groupMembersNumber}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText></FormControl.HelperText>
              )}
            </View>
            <View className="flex-1 ml-1">
              {"groupWomenNumber" in errors ? (
                <FormControl.ErrorMessage
                  leftIcon={<Icon name="error-outline" size={16} color="red" />}
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.groupWomenNumber}
                </FormControl.ErrorMessage>
              ) : (
                <FormControl.HelperText></FormControl.HelperText>
              )}
            </View>
          </View>
        </FormControl>
      </View>

      <View direction="row" mx="3" w="100%">
        <View w="100%" px="1" my="2">
          <FormControl isInvalid={"groupGoals" in errors} isRequired>
            <InputLabel
              label={`Finalidades de ${!groupType ? "Grupo" : groupType}`}
            />
            <MultipleSelectList
              setSelected={(goal: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  groupGoals: "",
                }));
                setGroupGoals(goal);
              }}
              data={groupPurposes}
              notFoundText={"Finalidade não encontrada"}
              placeholder="Finalidade de grupo"
              searchPlaceholder="Seleccionar finalidades"
              save="value"
              label="Finalidade de grupo"
              badgeStyles={{
                backgroundColor: COLORS.main,
              }}
              badgeTextStyles={{
                fontSize: 16,
              }}
              arrowicon={
                <Icon
                  // size={45}
                  name="arrow-drop-down"
                  color={COLORS.main}
                />
              }
              closeicon={<Icon name="close" size={20} color="grey" />}
              fontFamily="JosefinSans-Regular"
              dropdownTextStyles={{
                fontSize: 16,
                color: COLORS.black,
                padding: 5,
              }}
              inputStyles={{
                fontSize: 15,
                color: groupGoals?.length > 0 ? COLORS.black : COLORS.grey,
              }}
              boxStyles={{
                minHeight: 50,
                borderRadius: 5,
                borderColor: COLORS.lightgrey,
              }}
            />
            {"groupGoals" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.groupGoals}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
      </View>

      <View>
        <View>
          <FormControl
            isRequired
            my="1"
            isInvalid={"groupCreationYear" in errors}
          >
            <InputLabel label="Ano de criação" />
            <SelectList
              data={getFullYears2(50)}
              setSelected={(newYear: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  groupCreationYear: "",
                }));
                setGroupCreationYear(newYear);
              }}
              save="value"
              placeholder="Escolher ano"
              searchPlaceholder="Procurar ano"
              maxHeight={400}
              fontFamily="JosefinSans-Regular"
              notFoundText="Ano não encontrado"
              dropdownTextStyles={{
                fontSize: 16,
                color: COLORS.black,
                padding: 5,
              }}
              arrowicon={
                <Icon
                  // size={35}
                  name="arrow-drop-down"
                  color={COLORS.main}
                />
              }
              closeicon={<Icon name="close" size={20} color={COLORS.grey} />}
              inputStyles={{
                fontSize: 15,
                color: groupCreationYear ? COLORS.black : COLORS.grey,
              }}
              boxStyles={{
                minHeight: 50,
                borderRadius: 5,
                borderColor: COLORS.lightgrey,
                marginTop: 5,
              }}
            />

            {"groupCreationYear" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.groupCreationYear}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>

        <View>
          <FormControl
            isRequired
            my="1"
            isInvalid={"groupLegalStatus" in errors}
          >
            <InputLabel label="Situação Legal" />

            <SelectList
              data={groupAffiliationStatus2}
              setSelected={(status: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  groupCreationYear: "",
                  groupLegalStatus: "",
                  groupNuel: "",
                  groupNuit: "",
                  groupOperatingLicence: "",
                  groupAffiliationYear: "",
                }));
                setGroupLegalStatus(status);
                setGroupNuit();
                setGroupOperatingLicence("");
                setGroupAffiliationYear("");
              }}
              save="value"
              placeholder="Escolher situação"
              searchPlaceholder="Escolher situação"
              maxHeight={400}
              fontFamily="JosefinSans-Regular"
              notFoundText="Situação não encontrada"
              dropdownTextStyles={{
                fontSize: 16,
                color: COLORS.black,
                padding: 5,
              }}
              arrowicon={
                <Icon
                  // size={35}
                  name="arrow-drop-down"
                  color={COLORS.main}
                />
              }
              closeicon={<Icon name="close" size={20} color={COLORS.grey} />}
              inputStyles={{
                fontSize: 15,
                color: groupLegalStatus ? COLORS.black : COLORS.grey,
              }}
              boxStyles={{
                minHeight: 50,
                borderRadius: 5,
                borderColor: COLORS.lightgrey,
                marginTop: 5,
              }}
            />

            {"groupLegalStatus" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.groupLegalStatus}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
      </View>

      {groupLegalStatus === groupAffiliationStatus.affiliated && (
        <>
          <View direction="row" mx="3" w="100%">
            <View w="50%" px="1">
              <FormControl
                isRequired
                my="1"
                isInvalid={
                  groupLegalStatus === groupAffiliationStatus.affiliated &&
                  "groupAffiliationYear" in errors
                }
              >
                <InputLabel 
                  label="Ano de legalização"
                />
                <SelectList
                  data={getFullYears2(50)}
                  setSelected={(newYear: any) => {
                    setErrors((prev: any) => ({
                      ...prev,
                      groupAffiliationYear: "",
                    }));
                    setGroupAffiliationYear(newYear);
                  }}
                  save="value"
                  placeholder="Escolher ano"
                  searchPlaceholder="Escolher ano"
                  maxHeight={400}
                  fontFamily="JosefinSans-Regular"
                  notFoundText="Ano não encontrado"
                  dropdownTextStyles={{
                    fontSize: 16,
                    color: COLORS.black,
                    padding: 5,
                  }}
                  arrowicon={
                    <Icon
                      // size={35}
                      name="arrow-drop-down"
                      color={COLORS.main}
                    />
                  }
                  closeicon={
                    <Icon name="close" size={20} color={COLORS.grey} />
                  }
                  inputStyles={{
                    fontSize: 15,
                    color: groupAffiliationYear ? COLORS.black : COLORS.grey,
                  }}
                  boxStyles={{
                    minHeight: 50,
                    borderRadius: 5,
                    borderColor: COLORS.lightgrey,
                    marginTop: 5,
                  }}
                />

                {groupLegalStatus === groupAffiliationStatus.affiliated &&
                "groupAffiliationYear" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupAffiliationYear}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>
            </View>

            <View>
              <FormControl
                my="1"
                isInvalid={
                  groupLegalStatus === groupAffiliationStatus.affiliated &&
                  "groupOperatingLicence" in errors
                }
                isRequired
              >
                <InputLabel label="Licença de Operação" />
                <Input
                  autoCapitalize="characters"
                  placeholder="Licença de Operação"
                  value={groupOperatingLicence}
                  onChangeText={(newOperatingLicence: any) => {
                    setErrors((prev: any) => ({
                      ...prev,
                      groupOperatingLicence: "",
                    }));
                    setGroupOperatingLicence(newOperatingLicence);
                  }}
                />

                {groupLegalStatus === groupAffiliationStatus.affiliated &&
                "groupOperatingLicence" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupOperatingLicence}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>
            </View>
          </View>

          <View className="flex flex-row w-full items-center justify-center ">
            <View className="w-1/2 mr-1">
              <FormControl
                my="1"
                isInvalid={
                  groupLegalStatus === groupAffiliationStatus.affiliated &&
                  "groupNuit" in errors
                }
                isRequired
              >
                <InputLabel label="NUIT" />
                <Input
                  value={groupNuit}
                  onChangeText={(newNuit: any) => {
                    setErrors((prev: any) => ({
                      ...prev,
                      groupNuit: "",
                    }));
                    setGroupNuit(newNuit);
                  }}
                  keyboardType="numeric"
                  placeholder="NUIT"
                  className="text-center"
                />
                {groupLegalStatus === groupAffiliationStatus.affiliated &&
                "groupNuit" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupNuit}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>
            </View>

            <View className="w-1/2 ml-1">
              <FormControl
                isInvalid={
                  groupLegalStatus === groupAffiliationStatus.affiliated &&
                  "groupNuel" in errors
                }
                isRequired
              >
                <InputLabel label="NUEL" />
                <Input
                  keyboardType="numeric"
                  value={groupNuel}
                  onChangeText={(newNuel: any) => {
                    setErrors((prev: any) => ({
                      ...prev,
                      groupNuel: "",
                    }));
                    setGroupNuel(newNuel);
                  }}
                  placeholder="NUEL"
                  className="text-center"
                />

                {groupLegalStatus === groupAffiliationStatus.affiliated &&
                "groupNuel" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupNuel}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>
            </View>
          </View>
        </>
      )}

      <View className="py-3">
        <Text style={styles.formSectionDescription}>Endereço e Contacto</Text>
      </View>

      <View className="flex flex-row w-full justify-center items-center">
        <View className="w-1/2 mr-1">
          <FormControl isRequired my="1" isInvalid={"groupAdminPost" in errors}>
            <InputLabel label="Posto Administrativo" />
            <Select
              selectedValue={groupAdminPost}
              placeholder="Posto Administrativo"
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
                color={COLORS.main}
              />
              }
              mt={1}
              onValueChange={(newAdminPost) => {
                setErrors((prev: any) => ({
                  ...prev,
                  groupAdminPost: "",
                }));
                setGroupAdminPost(newAdminPost);
              }}
            >
              {selectedAddressAdminPosts?.map((adminPost: any, index: any) => (
                <Select.Item key={index} label={adminPost} value={adminPost} />
              ))}
            </Select>
            {"groupAdminPost" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.groupAdminPost}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
        
        <View className="w-1/2 ml-1">
          <FormControl isRequired my="1">
            <InputLabel 
              label="Localidade"
            />
            <Select
              selectedValue={groupVillage}
              placeholder="Localidade"
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
                color={COLORS.main}
              />
              }
              mt={1}
              onValueChange={(newVillage) => setGroupVillage(newVillage)}
            >
              {villages[groupAdminPost]?.map((village: any, index: any) => (
                <Select.Item key={index} label={village} value={village} />
              ))}
            </Select>
            <FormControl.ErrorMessage>{""}</FormControl.ErrorMessage>
          </FormControl>
        </View>
      </View>
    </View>
  );
}
