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
import { useActorStore } from "../../app/stores/actorStore";

export default function IndividualFarmerForm({
  selectedAddressAdminPosts,
}: any) {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isMan, setIsMan] = useState(false);
  const [isWoman, setIsWoman] = useState(false);
  const [isTransgender, setIsTransgender] = useState(false);
  const { colorScheme } = useColorScheme();

  const { actorData, setActorData, updateActorField, resetActorForm, validateActorForm, submitActorForm,  } = useActorStore();

  return (
    <View className="px-3 pt-6 justify-center w-full">
      <View className="w-full ">
        <FormControl isRequired isInvalid={"isSprayingAgent" in actorData.errors}>
          <InputLabel label="É Provedor de Serviços de Pulverização?" />
          <View className="flex flex-row mx-3 w-full justify-between gap-2 ">
            <View className="flex-1 justify-start">
              <InputCheckBox
                title="Sim"
                isChecked={actorData?.isSprayingAgent}
                errorProperty={actorData?.errors?.isSprayingAgent}
                onPress={() => {
                  updateActorField("isSprayingAgent", true);
                  updateActorField("isNotSprayingAgent", false);
                  updateActorField("errors", {
                    ...actorData.errors,
                    isSprayingAgent: "",
                  });
                }}
              />
            </View>
            <View className="flex-1 justify-end">
              <InputCheckBox
                title="Não"
                isChecked={actorData?.isSprayingAgent}
                errorProperty={actorData.errors.isSprayingAgent}
                onPress={() => {
                  updateActorField("isNotSprayingAgent", true);
                  updateActorField("isSprayingAgent", false);
                  updateActorField("errors", {
                    ...actorData.errors,
                    isSprayingAgent: "",
                  });
                }}
              />
            </View>
          </View>
          {"isSprayingAgent" in actorData.errors && (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {actorData.errors.isSprayingAgent}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      </View>

      <View className="flex justify-center items-center">
        <FormControl isRequired my="0" isInvalid={"surname" in actorData.errors}>
          <InputLabel label="Apelido" />
          <Input
            onChangeText={(newSurname: any) => {
              updateActorField("surname", newSurname);
              updateActorField("errors", {
                ...actorData.errors,
                surname: "",
              });
            }}
            value={actorData?.surname}
            placeholder="Apelido"
            className=""
            autoCapitalize="words"
          />
          {"surname" in actorData.errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {actorData.errors.surname}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </View>
      <View className="flex justify-center items-center">
        <FormControl isRequired my="1" isInvalid={"otherNames" in actorData.errors}>
          <InputLabel label="Outros Nomes" />
          <Input
            autoCapitalize="words"
            onChangeText={(newNames: any) => {
              updateActorField("otherNames", newNames);
              updateActorField("errors", {
                ...actorData.errors,
                otherNames: "",
              })
            }}
            value={actorData.otherNames}
            placeholder="Outros nomes"
          />
          {"otherNames" in actorData.errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {actorData.errors.otherNames}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </View>

      <View className="flex flex-row justify-center items-center">
        <View className="flex-1">
          <FormControl isRequired my="1" isInvalid={"gender" in actorData.errors}>
            <InputLabel label="Gênero" />
            <View className="flex flex-row justify-between ">
              <View className="flex flex-row">
                <InputCheckBox
                  // title="Não"
                  isChecked={isMan}
                  errorProperty={actorData?.errors?.gender}
                  onPress={() => {
                    setIsMan(true);
                    setIsWoman(false);
                    setIsTransgender(false);
                    updateActorField("gender", "Masculino");
                    updateActorField("errors", {
                      ...actorData.errors,
                      gender: "",
                    })
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
                  errorProperty={actorData?.errors?.gender}
                  onPress={() => {
                    setIsWoman(true);
                    setIsTransgender(false);
                    setIsMan(false);
                    // setGender("Feminino");
                    updateActorField("gender", "Feminino");
                    updateActorField("errors", {
                      ...actorData.errors,
                      gender: "",
                    })
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
                  errorProperty={actorData?.errors?.gender}
                  onPress={() => {
                    setIsTransgender(true);
                    setIsWoman(false);
                    setIsMan(false);
                    updateActorField("gender", "Outro");
                    updateActorField("errors", {
                      ...actorData.errors,
                      gender: "",
                    })
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

            {"gender" in actorData.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {actorData.errors.gender}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText />
            )}
          </FormControl>
        </View>
      </View>

      <View className="w-1/2">
        <FormControl isRequired isInvalid={"familySize" in actorData.errors}>
          <InputLabel label="Agregado Familiar" />
          <Input
            // label="Agregado Familiar"
            onChangeText={(newSize: any) => {
              
              updateActorField("errors", {
                ...actorData.errors,
                familySize: "",
              })

              updateActorField("familySize", newSize);
            }}
            value={actorData?.familySize}
            placeholder="Agregado Familiar"
            keyboardType="numeric"
            className="text-center"
          />
          {"familySize" in actorData.errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {actorData.errors.familySize}
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
        <FormControl isRequired my="1" isInvalid={"addressAdminPost" in actorData.errors}>
          <InputLabel label="Posto Administrativo" />
          <Select
            selectedValue={actorData?.addressAdminPost}
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
                onPress={() => {
                  updateActorField("addressAdminPost", "");
                }}
              />
            }
            mt={1}
            onValueChange={(newAdminPost) => {
              updateActorField("errors", {
                ...actorData.errors,
                addressAdminPost: "",
              })
              updateActorField("addressAdminPost", newAdminPost);
            }}
          >
            {selectedAddressAdminPosts?.map((adminPost: any, index: any) => (
              <Select.Item key={index} label={adminPost} value={adminPost} />
            ))}
          </Select>
          {"addressAdminPost" in actorData.errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {actorData.errors.addressAdminPost}
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
            selectedValue={actorData?.addressVillage}
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
                onPress={() => {
                  updateActorField("addressVillage", "");
                }}
              />
            }
            mt={1}
            onValueChange={(newVillage) => {
              updateActorField("addressVillage", newVillage);
            }}
          >
            {actorData?.addressAdminPost && villages[actorData?.addressAdminPost]?.map((village: any, index: any) => (
              <Select.Item key={index} label={village} value={village} />
            ))}
          </Select>

          <FormControl.ErrorMessage>{""}</FormControl.ErrorMessage>
        </FormControl>
      </View>

      <View className="flex flex-row w-full space-x-2 ">
        <View className="flex-1">
          <FormControl my="1" isInvalid={"primaryPhone" in actorData.errors}>
            <InputLabel label="Telemóvel" />
            <Input
              // label="Telemóvel"
              placeholder="Telemóvel"
              keyboardType="phone-pad"
              value={actorData?.primaryPhone}
              onChangeText={(newPhone: any) => {

                updateActorField("errors", {
                  ...actorData.errors,
                  primaryPhone: "",
                })
                updateActorField("primaryPhone", newPhone);
              }}
              className="text-center"
            />

            {"primaryPhone" in actorData.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {actorData.errors.primaryPhone}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText />
            )}
          </FormControl>
        </View>
        <View className="flex-1">
          <FormControl my="1" isInvalid={"secondaryPhone" in actorData.errors}>
            <InputLabel label="Telemóvel Alternativo" />
            <Input
              // label="Telemóvel Alternativo"
              placeholder="Telemóvel"
              keyboardType="phone-pad"
              value={actorData?.secondaryPhone}
              onChangeText={(newPhone: any) => {
                updateActorField("errors", {
                  ...actorData.errors,
                  secondaryPhone: "",
                })
                updateActorField("secondaryPhone", newPhone);
              }}
              className="text-center"
            />

            {"secondaryPhone" in actorData.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {actorData.errors.secondaryPhone}
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
        <FormControl isRequired isInvalid={"birthDate" in actorData.errors}>
          <InputLabel label="Data de Nascimento" />
          <Pressable
            onPress={() => setOpenDatePicker(true)}
            className="flex flex-row h-[50px] mt-1 items-center w-1/2 shadow-md border border-gray-300 rounded-md p-1 space-x-2"
          >
            <FontAwesomeIcon name="calendar" size={30} color={COLORS.black} />
            <Text className="text-center text-[14px] ">
              {actorData?.birthDate
                ? `${actorData?.birthDate.getDate()}/${
                  actorData?.birthDate.getMonth() + 1
                  }/${actorData?.birthDate.getFullYear()}`
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
            open={openDatePicker}
            setOpen={setOpenDatePicker}
          />

          {"birthDate" in actorData.errors && (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {actorData.errors.birthDate}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      </View>

      <View w="50%" px="1">
        <FormControl isRequired isInvalid={"birthProvince" in actorData.errors}>
          <InputLabel label="Província/País de Nascimento" />
          <Select
            selectedValue={actorData.birthProvince}
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
              updateActorField("errors", {
                ...actorData.errors,
                birthProvince: "",
              })
              updateActorField("birthProvince", newProvince);
            }}
          >
            {provinces?.map((province, index) => (
              <Select.Item key={index} label={province} value={province} />
            ))}
          </Select>
          {"birthProvince" in actorData.errors && (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {actorData.errors.birthProvince}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      </View>

      <View className="flex items-center justify-center ">
        {!actorData?.birthProvince?.includes("Cidade") &&
          !actorData?.birthProvince?.includes("País Estrangeiro") && (
            <View className="flex flex-col mx-3 my-3 w-full">
              <View className="">
                <FormControl
                  isRequired
                  my="1"
                  isInvalid={"birthDistrict" in actorData.errors}
                >
                  <InputLabel
                    label={
                      actorData.birthProvince === "País Estrangeiro" ? "País" : "Distrito"
                    }
                  />
                  <Select
                    selectedValue={actorData.birthDistrict}
                    placeholder={
                      actorData.birthProvince?.includes("Estrangeiro")
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
                      updateActorField("errors", {
                        ...actorData.errors,
                        birthDistrict: "",
                      })
                      updateActorField("birthDistrict", newDistrict);
                    }}
                  >
                    {actorData.birthProvince === "País Estrangeiro"
                      ? countries3?.map((country, index) => (
                          <Select.Item
                            key={index}
                            label={country.value}
                            value={country.value}
                          />
                        ))
                      : 
                        districts[actorData.birthProvince]?.map(
                          (district: any, index: any) => (
                            <Select.Item
                              key={index}
                              label={district}
                              value={district}
                            />
                          ),
                        )}
                  </Select>

                  {"birthDistrict" in actorData.errors ? (
                    <FormControl.ErrorMessage
                      leftIcon={
                        <Icon name="error-outline" size={16} color="grey" />
                      }
                      _text={{ fontSize: "xs" }}
                    >
                      {actorData.errors.birthDistrict}
                    </FormControl.ErrorMessage>
                  ) : (
                    <FormControl.HelperText />
                  )}
                </FormControl>
              </View>
              <View className="">
                {!actorData?.birthProvince?.includes("Estrangeiro") &&
                  !actorData?.birthDistrict?.includes("Cidade") &&
                  !actorData?.birthProvince?.includes("Maputo") && (
                    <FormControl
                      isRequired
                      my="1"
                      isInvalid={"birthAdminPost" in actorData.errors}
                    >
                      <InputLabel label=" Posto Administrativo" />
                      <Select
                        selectedValue={actorData.birthAdminPost ? actorData.birthAdminPost : ""}
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
                          updateActorField("errors", {
                            ...actorData.errors,
                            birthAdminPost: "",
                          })
                          updateActorField("birthAdminPost", newAdminPost);
                        }}
                      >
                        {administrativePosts[actorData.birthDistrict]?.map(
                          (adminPost: any, index: any) => (
                            <Select.Item
                              key={index}
                              label={adminPost}
                              value={adminPost}
                            />
                          ),
                        )}
                      </Select>
                      {"birthAdminPost" in actorData.errors && (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon name="error-outline" size={16} color="red" />
                          }
                          _text={{ fontSize: "xs" }}
                        >
                          {actorData.errors?.birthAdminPost}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                  )}
              </View>
            </View>
          )}
      </View>

      <View className="flex items-center justify-center">
        {actorData?.birthProvince?.includes("País Estrangeiro") && (
          <View className="w-full">
            <FormControl
              isRequired
              my="1"
              isInvalid={"birthDistrict" in actorData.errors}
            >
              <InputLabel
                label={
                  actorData.birthProvince === "País Estrangeiro"
                    ? "País de Nascimento"
                    : "Distrito de Nascimento"
                }
              />
              <Select
                selectedValue={actorData.birthDistrict}
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
                  updateActorField("errors", {
                    ...actorData.errors,
                    birthDistrict: "",
                  })
                  updateActorField("birthDistrict", newDistrict);
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

              {"birthDistrict" in actorData.errors && (
                <FormControl.ErrorMessage
                  leftIcon={
                    <Icon name="error-outline" size={16} color={COLORS.red} />
                  }
                  _text={{ fontSize: "xs" }}
                >
                  {actorData.errors?.birthDistrict}
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
          <FormControl my="2" isRequired isInvalid={"docType" in actorData.errors}>
            <InputLabel label="Tipo de Documento" />
            <Select
              selectedValue={actorData.docType}
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
                updateActorField("errors", {
                  ...actorData.errors,
                  docType: "",
                })
                updateActorField("docType", newDocType);
              }}
            >
              {idDocTypes?.map((docType) => (
                <Select.Item key={docType} label={docType} value={docType} />
              ))}
            </Select>
            {"docType" in actorData.errors && (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {actorData.errors?.docType}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        </View>

        <View className="flex-1">
          <FormControl my="2" isInvalid={"docNumber" in actorData.errors}>
            <InputLabel label="Número de Documento" />
            <Input
              autoCapitalize="characters"
              value={actorData.docNumber}
              placeholder="Número do documento"
              onChangeText={(newDocNumber: any) => {
                updateActorField("errors", {
                  ...actorData.errors,
                  docNumber: "",
                })
                updateActorField("docNumber", newDocNumber);
              }}
              className="text-center"
            />

            {"docNumber" in actorData.errors && (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {actorData.errors?.docNumber}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        </View>
      </View>

      <View className="">
        <FormControl isInvalid={"nuit" in actorData.errors}>
          <InputLabel label="NUIT" />
          <Input
            value={actorData.nuit}
            placeholder="NUIT"
            onChangeText={(newNuit: any) => {
              updateActorField("errors", {
                ...actorData.errors,
                docNumber: "",
              })
              updateActorField("nuit", newNuit);
            }}
            className="text-center"
            keyboardType="numeric"
          />

          {"nuit" in actorData.errors && (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {actorData.errors?.nuit}
            </FormControl.ErrorMessage>
          )}
        </FormControl>
      </View>

      <View className="my-3">
        <Text style={styles.formSectionDescription}>Adesão à Cooperativa</Text>
      </View>

      <View className="w-full">
        <FormControl isRequired isInvalid={"isGroupMember" in actorData.errors}>
          <InputLabel label=" É membro de uma cooperativa?" />

          <View className="flex flex-row mx-3 w-full justify-between gap-2">
            <View className="flex-1 justify-start">
              <InputCheckBox
                title="Sim"
                isChecked={actorData.isGroupMember}
                errorProperty={actorData.errors?.isGroupMember}
                onPress={() => {
                  updateActorField("errors", {
                    ...actorData.errors,
                    isGroupMember: "",
                  })
                  updateActorField("isGroupMember", true);
                  updateActorField("isNotGroupMember", false);
                }}
              />
            </View>
            <View className="flex-1 justify-end">
              <InputCheckBox
                title="Não"
                isChecked={actorData.isNotGroupMember}
                errorProperty={actorData.errors.isGroupMember}
                onPress={() => {
                  updateActorField("isNotGroupMember", true);
                  updateActorField("isGroupMember", false);
                  updateActorField("errors", {
                    ...actorData.errors,
                    isGroupMember: "",
                  })
                }}
              />
            </View>
          </View>

          {"isGroupMember" in actorData.errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {actorData.errors?.isGroupMember}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText />
          )}
        </FormControl>
      </View>
    </View>
  );
}
