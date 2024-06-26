import { Text, Pressable, View } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  FormControl,
  Stack,
  Select,
  CheckIcon,
  Center,
} from "native-base";
import { Icon, CheckBox } from "@rneui/themed";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { pt, registerTranslation } from "react-native-paper-dates";
registerTranslation("pt", pt);
import administrativePosts from "../../consts/administrativePosts";
import provinces from "../../consts/provinces";

import districts from "../../consts/districts";
import villages from "../../consts/villages";
import idDocTypes from "../../consts/idDocTypes";
import styles from "./styles";

import COLORS from "../../consts/colors";
import countries3 from "../../consts/countries3";
import { Input } from "../../../components/Input";
import DatePicker from "../../components/DatePicker/DatePicker";
import countries2 from "../../consts/countries2";
import { cn } from "../../../lib/utils";
import { useColorScheme } from "nativewind";
import InputLabel from "../../components/InputLabel/InputLabel";
import InputCheckBox from "../../components/InputCheckBox/InputCheckBox";

export default function IndividualFarmerForm({
  route,
  navigation,
  gender,
  setGender,
  familySize,
  setFamilySize,
  selectedAddressAdminPosts,
  addressVillage,
  setAddressVillage,
  addressAdminPost,
  setAddressAdminPost,
  birthProvince,
  setBirthProvince,
  birthDistrict,
  setBirthDistrict,
  birthAdminPost,
  setBirthAdminPost,
  birthDate,
  setBirthDate,
  docType,
  setDocType,
  docNumber,
  setDocNumber,
  isSprayingAgent,
  setIsSprayingAgent,
  isNotSprayingAgent,
  setIsNotSprayingAgent,
  surname,
  setSurname,
  otherNames,
  setOtherNames,
  primaryPhone,
  setPrimaryPhone,
  secondaryPhone,
  setSecondaryPhone,
  nuit,
  setNuit,
  isGroupMember,
  setIsGroupMember,
  isNotGroupMember,
  setIsNotGroupMember,
  errors,
  setErrors,
}: any) {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isMan, setIsMan] = useState(false);
  const [isWoman, setIsWoman] = useState(false);
  const [isTransgender, setIsTransgender] = useState(false);
  const { colorScheme } = useColorScheme();

  return (
    <View className="px-3 pt-6 justify-center w-full">
      <View className="w-full ">
        <FormControl isRequired isInvalid={"isSprayingAgent" in errors}>
          <InputLabel label="É Provedor de Serviços de Pulverização?" />
          <View className="flex flex-row mx-3 w-full justify-between gap-2 ">
            <View className="flex-1 justify-start">
              <InputCheckBox
                title="Sim"
                isChecked={isSprayingAgent}
                errorProperty={errors?.isSprayingAgent}
                onPress={() => {
                  setIsNotSprayingAgent(false);
                  setIsSprayingAgent(true);
                  setErrors({
                    ...errors,
                    isSprayingAgent: "",
                  });
                }}
              />
            </View>
            <View className="flex-1 justify-end">
              <InputCheckBox
                title="Não"
                isChecked={isNotSprayingAgent}
                errorProperty={errors?.isSprayingAgent}
                onPress={() => {
                  setIsNotSprayingAgent(true);
                  setIsSprayingAgent(false);
                  setErrors({
                    ...errors,
                    isSprayingAgent: "",
                  });
                }}
              />
            </View>
          </View>
          {"isSprayingAgent" in errors && (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      </View>

      <View className="flex justify-center items-center">
        <FormControl isRequired my="0" isInvalid={"surname" in errors}>
          <InputLabel label="Apelido" />
          <Input
            onChangeText={(newSurname: any) => {
              setErrors((prev: any) => ({
                ...prev,
                surname: "",
              }));
              setSurname(newSurname);
            }}
            value={surname}
            placeholder="Apelido"
            className=""
            autoCapitalize="words"
          />
          {"surname" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.surname}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </View>
      <View className="flex justify-center items-center">
        <FormControl isRequired my="1" isInvalid={"otherNames" in errors}>
          <InputLabel label="Outros Nomes" />
          <Input
            autoCapitalize="words"
            onChangeText={(newNames: any) => {
              setErrors((prev: any) => ({
                ...prev,
                otherNames: "",
              }));
              setOtherNames(newNames);
            }}
            value={otherNames}
            placeholder="Outros nomes"
          />
          {"otherNames" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.otherNames}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </View>

      <View className="flex flex-row justify-center items-center">
        <View className="flex-1">
          <FormControl isRequired my="1" isInvalid={"gender" in errors}>
            <InputLabel label="Gênero" />
            <View className="flex flex-row justify-between ">
              <View className="flex flex-row">
                <InputCheckBox
                  // title="Não"
                  isChecked={isMan}
                  errorProperty={errors?.gender}
                  onPress={() => {
                    setIsMan(true);
                    setIsWoman(false);
                    setIsTransgender(false);
                    setGender("Masculino");
                    setErrors({
                      ...errors,
                      gender: "",
                    });
                  }}
                />

                <View className="flex flex-col items-center -ml-4">
                  <FontAwesomeIcon
                    name="male"
                    color={
                      isMan
                        ? COLORS.main
                        : colorScheme === "dark"
                        ? COLORS.white
                        : COLORS.black
                    }
                    size={30}
                  />
                  <Text
                    className={cn("text-black dark:text-white text-xs", {
                      "text-green-700": isMan,
                    })}
                  >
                    Homem
                  </Text>
                </View>
              </View>
              <View className="flex flex-row">
                <InputCheckBox
                  // title="Não"
                  isChecked={isWoman}
                  errorProperty={errors?.gender}
                  onPress={() => {
                    setIsWoman(true);
                    setIsTransgender(false);
                    setIsMan(false);
                    setGender("Feminino");
                    setErrors({
                      ...errors,
                      gender: "",
                    });
                  }}
                />

                <View className="flex flex-col items-center -ml-4">
                  <FontAwesomeIcon
                    name="female"
                    color={
                      isWoman
                        ? COLORS.main
                        : colorScheme === "dark"
                        ? COLORS.white
                        : COLORS.black
                    }
                    size={30}
                  />
                  <Text
                    className={cn("text-black dark:text-white text-xs", {
                      "text-green-700": isWoman,
                    })}
                  >
                    Mulher
                  </Text>
                </View>
              </View>
              <View className="flex flex-row">
                <InputCheckBox
                  // title=""
                  isChecked={isTransgender}
                  errorProperty={errors?.gender}
                  onPress={() => {
                    setIsTransgender(true);
                    setIsWoman(false);
                    setIsMan(false);
                    setGender("Outro");
                    setErrors({
                      ...errors,
                      gender: "",
                    });
                  }}
                />

                <View className="flex flex-col items-center -ml-4">
                  <FontAwesomeIcon
                    name="transgender-alt"
                    color={
                      isTransgender
                        ? COLORS.main
                        : colorScheme === "dark"
                        ? COLORS.white
                        : COLORS.black
                    }
                    size={30}
                  />
                  <Text
                    className={cn("text-black text-xs dark:text-white", {
                      "text-green-700": isTransgender,
                    })}
                  >
                    Outro
                  </Text>
                </View>
              </View>
            </View>

            {"gender" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.gender}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText />
            )}
          </FormControl>
        </View>
      </View>

      <View className="w-1/2">
        <FormControl isRequired isInvalid={"familySize" in errors}>
          <InputLabel label="Agregado Familiar" />
          <Input
            // label="Agregado Familiar"
            onChangeText={(newSize: any) => {
              setErrors((prev: any) => ({
                ...prev,
                familySize: "",
              }));
              setFamilySize(newSize);
            }}
            value={familySize}
            placeholder="Agregado Familiar"
            keyboardType="numeric"
            className="text-center"
          />
          {"familySize" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.familySize}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </View>

      <View className="my-3">
        <Text style={styles.formSectionDescription}>Endereço e Contacto</Text>
      </View>

      <View className="">
        <FormControl isRequired my="1" isInvalid={"addressAdminPost" in errors}>
          <InputLabel label="Posto Administrativo" />
          <Select
            selectedValue={addressAdminPost}
            placeholder="Escolha posto administrativo"
            minHeight={50}
            _selectedItem={{
              bg: "gray.200",
              fontSize: "4xl",
              endIcon: <CheckIcon size="5" />,
            }}
            dropdownCloseIcon={
              <Icon
                name="arrow-drop-down"
                // size={35}
                color={COLORS.main}
                onPress={() => setAddressAdminPost("")}
              />
            }
            mt={1}
            onValueChange={(newAdminPost) => {
              setErrors((prev: any) => ({
                ...prev,
                institutionAdminPost: "",
              }));
              setAddressAdminPost(newAdminPost);
            }}
          >
            {selectedAddressAdminPosts?.map((adminPost: any, index: any) => (
              <Select.Item key={index} label={adminPost} value={adminPost} />
            ))}
          </Select>
          {"addressAdminPost" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.addressAdminPost}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </View>
      <View className="">
        <FormControl isRequired my="1">
          <InputLabel label="Localidade" />
          <Select
            selectedValue={addressVillage}
            placeholder="Escolha uma localidade"
            minHeight={50}
            _selectedItem={{
              bg: "gray.200",
              fontSize: "4xl",
              endIcon: <CheckIcon size="5" />,
            }}
            dropdownCloseIcon={
              <Icon
                name="arrow-drop-down"
                // size={35}
                color={COLORS.main}
                onPress={() => setAddressVillage("")}
              />
            }
            mt={1}
            onValueChange={(newVillage) => setAddressVillage(newVillage)}
          >
            {villages[addressAdminPost]?.map((village: any, index: any) => (
              <Select.Item key={index} label={village} value={village} />
            ))}
          </Select>

          <FormControl.ErrorMessage>{""}</FormControl.ErrorMessage>
        </FormControl>
      </View>

      <View className="flex flex-row w-full space-x-2 ">
        <View className="flex-1">
          <FormControl my="1" isInvalid={"primaryPhone" in errors}>
            <InputLabel label="Telemóvel" />
            <Input
              // label="Telemóvel"
              placeholder="Telemóvel"
              keyboardType="phone-pad"
              value={primaryPhone}
              onChangeText={(newPhone: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  primaryPhone: "",
                }));
                setPrimaryPhone(newPhone);
              }}
              className="text-center"
            />

            {"primaryPhone" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.primaryPhone}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText />
            )}
          </FormControl>
        </View>
        <View className="flex-1">
          <FormControl my="1" isInvalid={"secondaryPhone" in errors}>
            <InputLabel label="Telemóvel Alternativo" />
            <Input
              // label="Telemóvel Alternativo"
              placeholder="Telemóvel"
              keyboardType="phone-pad"
              value={secondaryPhone}
              onChangeText={(newPhone: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  secondaryPhone: "",
                }));
                setSecondaryPhone(newPhone);
              }}
              className="text-center"
            />

            {"secondaryPhone" in errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.secondaryPhone}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText />
            )}
          </FormControl>
        </View>
      </View>

      <View className="py-3">
        <Text style={styles.formSectionDescription}>Dados de Nascimento</Text>
      </View>

      <View className="py-3 ">
        <FormControl isRequired isInvalid={"birthDate" in errors}>
          <InputLabel label="Data de Nascimento" />
          <Pressable
            onPress={() => setOpenDatePicker(true)}
            className="flex flex-row h-[50px] mt-1 items-center w-1/2 shadow-md border border-gray-300 rounded-md p-1 space-x-2"
          >
            <FontAwesomeIcon name="calendar" size={30} color={COLORS.black} />
            <Text className="text-center text-[14px] ">
              {birthDate
                ? `${birthDate.getDate()}/${
                    birthDate.getMonth() + 1
                  }/${birthDate.getFullYear()}`
                : "Data"}
            </Text>
            <View className="absolute right-0 ">
              <Icon
                // size={45}
                name="arrow-drop-down"
                color={COLORS.main}
              />
            </View>
          </Pressable>

          <DatePicker
            date={birthDate}
            setDate={setBirthDate}
            open={openDatePicker}
            setOpen={setOpenDatePicker}
          />

          {"birthDate" in errors && (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.birthDate}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      </View>

      <View w="50%" px="1">
        <FormControl isRequired isInvalid={"birthProvince" in errors}>
          <InputLabel label="Província/País de Nascimento" />
          <Select
            selectedValue={birthProvince}
            placeholder="Escolha uma província"
            minHeight={50}
            _selectedItem={{
              bg: "gray.200",
              fontSize: "4xl",
              endIcon: <CheckIcon size="5" />,
            }}
            dropdownCloseIcon={
              <Icon name="arrow-drop-down" color={COLORS.main} />
            }
            mt={1}
            onValueChange={(newProvince) => {
              setErrors((prev: any) => ({
                ...prev,
                birthProvince: "",
              }));
              setBirthProvince(newProvince);
            }}
          >
            {provinces?.map((province, index) => (
              <Select.Item key={index} label={province} value={province} />
            ))}
          </Select>
          {"birthProvince" in errors && (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.birthProvince}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      </View>

      <View className="flex items-center justify-center ">
        {!birthProvince?.includes("Cidade") &&
          !birthProvince?.includes("País Estrangeiro") && (
            <View className="flex flex-col mx-3 my-3 w-full">
              <View className="">
                <FormControl
                  isRequired
                  my="1"
                  isInvalid={"birthDistrict" in errors}
                >
                  <InputLabel
                    label={
                      birthProvince === "País Estrangeiro" ? "País" : "Distrito"
                    }
                  />
                  <Select
                    selectedValue={birthDistrict}
                    placeholder={
                      birthProvince?.includes("Estrangeiro")
                        ? "Escolha um país"
                        : "Escolha um distrito"
                    }
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
                    onValueChange={(newDistrict) => {
                      setErrors((prev: any) => ({
                        ...prev,
                        birthDistrict: "",
                      }));
                      setBirthDistrict(newDistrict);
                    }}
                  >
                    {birthProvince === "País Estrangeiro"
                      ? countries3?.map((country, index) => (
                          <Select.Item
                            key={index}
                            // @ts-expect-error TS(2322): Type '{ key: string; value: string; }' is not assi... Remove this comment to see the full error message
                            label={country}
                            // @ts-expect-error TS(2322): Type '{ key: string; value: string; }' is not assi... Remove this comment to see the full error message
                            value={country}
                          />
                        ))
                      : // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                        districts[birthProvince]?.map(
                          (district: any, index: any) => (
                            <Select.Item
                              key={index}
                              label={district}
                              value={district}
                            />
                          ),
                        )}
                  </Select>

                  {"birthDistrict" in errors ? (
                    <FormControl.ErrorMessage
                      leftIcon={
                        <Icon name="error-outline" size={16} color="grey" />
                      }
                      _text={{ fontSize: "xs" }}
                    >
                      {errors?.birthDistrict}
                    </FormControl.ErrorMessage>
                  ) : (
                    <FormControl.HelperText />
                  )}
                </FormControl>
              </View>
              <View className="">
                {!birthProvince?.includes("Estrangeiro") &&
                  !birthDistrict?.includes("Cidade") &&
                  !birthProvince?.includes("Maputo") && (
                    <FormControl
                      isRequired
                      my="1"
                      isInvalid={"birthAdminPost" in errors}
                    >
                      <InputLabel label=" Posto Administrativo" />
                      <Select
                        selectedValue={birthProvince ? birthAdminPost : ""}
                        placeholder="Escolha um posto administrativo"
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
                            birthAdminPost: "",
                          }));
                          setBirthAdminPost(newAdminPost);
                        }}
                      >
                        {administrativePosts[birthDistrict]?.map(
                          (adminPost: any, index: any) => (
                            <Select.Item
                              key={index}
                              label={adminPost}
                              value={adminPost}
                            />
                          ),
                        )}
                      </Select>
                      {"birthAdminPost" in errors && (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          {errors?.birthAdminPost}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                  )}
              </View>
            </View>
          )}
      </View>

      <View className="flex items-center justify-center">
        {birthProvince?.includes("País Estrangeiro") && (
          <View className="w-full">
            <FormControl
              isRequired
              my="1"
              isInvalid={"birthDistrict" in errors}
            >
              <InputLabel
                label={
                  birthProvince === "País Estrangeiro"
                    ? "País de Nascimento"
                    : "Distrito de Nascimento"
                }
              />
              <Select
                selectedValue={birthDistrict}
                placeholder="Seleccionar país"
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
                onValueChange={(newDistrict: any) => {
                  setErrors((prev: any) => ({
                    ...prev,
                    birthDistrict: "",
                  }));
                  setBirthDistrict(newDistrict);
                }}
              >
                {countries2?.map((country: any, index: any) => (
                  <Select.Item
                    key={index}
                    label={country.label}
                    value={country.value}
                  />
                ))}
              </Select>

              {"birthDistrict" in errors && (
                <FormControl.ErrorMessage
                  leftIcon={
                    <Icon name="error-outline" size={16} color={COLORS.red} />
                  }
                  _text={{ fontSize: "xs" }}
                >
                  {errors?.birthDistrict}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
          </View>
        )}
      </View>

      <View className="my-3">
        <Text style={styles.formSectionDescription}>
          Documentos de Identificação
        </Text>
      </View>

      <View className="flex flex-row justify-center items-center space-x-2">
        <View className="flex-1">
          <FormControl my="2" isRequired isInvalid={"docType" in errors}>
            <InputLabel label="Tipo de Documento" />
            <Select
              selectedValue={docType}
              placeholder="Tipo de documento"
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
              onValueChange={(newDocType) => {
                setErrors((prev: any) => ({
                  ...prev,
                  docType: "",
                  docNumber: "",
                }));
                setDocType(newDocType);
              }}
            >
              {idDocTypes?.map((docType) => (
                <Select.Item key={docType} label={docType} value={docType} />
              ))}
            </Select>
            {"docType" in errors && (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.docType}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        </View>

        <View className="flex-1">
          <FormControl my="2" isInvalid={"docNumber" in errors}>
            <InputLabel label="Número de Documento" />
            <Input
              autoCapitalize="characters"
              value={docNumber}
              placeholder="Número do documento"
              onChangeText={(newDocNumber: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  docNumber: "",
                }));
                setDocNumber(newDocNumber);
              }}
              className="text-center"
            />

            {"docNumber" in errors && (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {errors?.docNumber}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        </View>
      </View>

      <View className="">
        <FormControl isInvalid={"nuit" in errors}>
          <InputLabel label="NUIT" />
          <Input
            value={nuit}
            placeholder="NUIT"
            onChangeText={(newNuit: any) => {
              setErrors((prev: any) => ({
                ...prev,
                nuit: "",
              }));
              setNuit(newNuit);
            }}
            className="text-center"
            keyboardType="numeric"
          />

          {"nuit" in errors && (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {errors?.nuit}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      </View>

      <View className="my-3">
        <Text style={styles.formSectionDescription}>Adesão à Cooperativa</Text>
      </View>

      <View className="w-full">
        <FormControl isRequired isInvalid={"isGroupMember" in errors}>
          <InputLabel label=" É membro de uma cooperativa?" />

          <View className="flex flex-row mx-3 w-full justify-between gap-2">
            <View className="flex-1 justify-start">
              <InputCheckBox
                title="Sim"
                isChecked={isGroupMember}
                errorProperty={errors?.isGroupMember}
                onPress={() => {
                  setIsNotGroupMember(false);
                  setIsGroupMember(true);
                  setErrors({
                    ...errors,
                    isGroupMember: "",
                  });
                }}
              />
            </View>
            <View className="flex-1 justify-end">
              <InputCheckBox
                title="Não"
                isChecked={isNotGroupMember}
                errorProperty={errors?.isGroupMember}
                onPress={() => {
                  setIsNotGroupMember(true);
                  setIsGroupMember(false);
                  setErrors({
                    ...errors,
                    isGroupMember: "",
                  });
                }}
              />
            </View>
          </View>

          {"isGroupMember" in errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </View>
    </View>
  );
}
