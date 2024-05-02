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
// import {
//   SelectDragIndicator,
//   SelectIcon,
//   SelectInput,
//   SelectItem,
//   SelectTrigger,
// } from "@gluestack-ui/themed";
import { Icon, CheckBox } from "@rneui/themed";
// import DatePicker from "react-native-date-picker";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { pt, registerTranslation } from "react-native-paper-dates";
registerTranslation("pt", pt);

import { SelectList } from "react-native-dropdown-select-list";
import { CustomInput } from "../../components/Inputs/CustomInput";
import administrativePosts from "../../consts/administrativePosts";
import provinces from "../../consts/provinces";

import districts from "../../consts/districts";
import villages from "../../consts/villages";
import idDocTypes from "../../consts/idDocTypes";
import styles from "./styles";

import COLORS from "../../consts/colors";

// import {realmContext} from '../../models/realmContext';
import countries3 from "../../consts/countries3";
import { dateLimits } from "../../helpers/dates";
import { Input } from "../../../components/Input";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "../../components/DatePicker/DatePicker";
import countries2 from "../../consts/countries2";

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




  return (
    <View className="px-3 pt-6">
      <View className="w-full">
        <FormControl isRequired isInvalid={"isSprayingAgent" in errors}>
          <FormControl.Label>
              É Provedor de Serviços de Pulverização?
          </FormControl.Label>
          <View className="flex flex-row mx-3 w-full justify-between gap-2 ">
            <View className="flex-1 justify-start">
              <CheckBox
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: "transparent",
                }}
                textStyle={{
                  fontWeight: "100",
                  fontSize: 18,
                  color: isSprayingAgent
                    ? COLORS.grey
                    : errors?.isSprayingAgent
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Sim"
                checked={isSprayingAgent}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.grey}
                    size={35}
                    iconStyle={{}}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="crop-square"
                    color={errors?.isSprayingAgent ? COLORS.red : COLORS.grey}
                    size={35}
                    iconStyle={{}}
                  />
                }
                // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
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
              <CheckBox
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: "transparent",
                }}
                textStyle={{
                  fontWeight: "100",
                  fontSize: 18,
                  color: isNotSprayingAgent
                    ? COLORS.grey
                    : errors?.isSprayingAgent
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Não"
                checked={isNotSprayingAgent}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.grey}
                    size={35}
                    iconStyle={{}}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="crop-square"
                    color={errors?.isSprayingAgent ? COLORS.red : COLORS.grey}
                    size={35}
                    iconStyle={{}}
                  />
                }
                // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
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
          {/* <FormControl.Label>Apelido</FormControl.Label> */}
          <Input
            label="Apelido"
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
          <Input
            label="Outros Nomes"
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
            <FormControl.Label>Género</FormControl.Label>

            <View className="flex flex-row justify-between ">
              <View className="flex flex-row">
                <CheckBox
                  checked={isMan}
                  onPress={() => {
                    setIsMan(true);
                    setIsWoman(false);
                    setIsTransgender(false);
                    setGender("Masculino");
                  }}
                  fontFamily="JosefinSans-Regular"
                  containerStyle={{
                    backgroundColor: "transparent",
                  }}
                  textStyle={{
                    fontWeight: "100",
                    fontSize: 18,
                    color: isSprayingAgent
                      ? COLORS.grey
                      : errors?.isSprayingAgent
                      ? COLORS.red
                      : COLORS.grey,
                  }}
                  checkedColor="grey"
                  checkedIcon={
                    <Icon
                      name="check-box"
                      color={COLORS.grey}
                      size={30}
                      iconStyle={{}}
                    />
                  }
                  uncheckedIcon={
                    <Icon
                      name="crop-square"
                      color={errors?.gender ? COLORS.red : COLORS.grey}
                      size={30}
                      iconStyle={{}}
                    />
                  }
                />
                <View className="flex flex-col items-center -ml-4">
                  <FontAwesomeIcon name="male" size={30} />
                  <Text className="text-xs">Homem</Text>
                </View>
              </View>
              <View className="flex flex-row">
                <CheckBox
                  checked={isWoman}
                  fontFamily="JosefinSans-Regular"
                  containerStyle={{
                    backgroundColor: "transparent",
                  }}
                  textStyle={{
                    fontWeight: "100",
                    fontSize: 18,
                    color: isSprayingAgent
                      ? COLORS.grey
                      : errors?.isSprayingAgent
                      ? COLORS.red
                      : COLORS.grey,
                  }}
                  onPress={() => {
                    setIsWoman(true);
                    setIsTransgender(false);
                    setIsMan(false);
                    setGender("Feminino");
                  }}
                  checkedColor="grey"
                  checkedIcon={
                    <Icon
                      name="check-box"
                      color={COLORS.grey}
                      size={30}
                      iconStyle={{}}
                    />
                  }
                  uncheckedIcon={
                    <Icon
                      name="crop-square"
                      color={errors?.gender ? COLORS.red : COLORS.grey}
                      size={30}
                      iconStyle={{}}
                    />
                  }
                />
                <View className="flex flex-col items-center -ml-4">
                  <FontAwesomeIcon name="female" size={30} />
                  <Text className="text-xs">Mulher</Text>
                </View>
              </View>
              <View className="flex flex-row">
                <CheckBox
                  checked={isTransgender}
                  fontFamily="JosefinSans-Regular"
                  containerStyle={{
                    backgroundColor: "transparent",
                  }}
                  textStyle={{
                    fontWeight: "100",
                    fontSize: 18,
                    color: isSprayingAgent
                      ? COLORS.grey
                      : errors?.isSprayingAgent
                      ? COLORS.red
                      : COLORS.grey,
                  }}
                  onPress={() => {
                    setIsTransgender(true);
                    setIsWoman(false);
                    setIsMan(false);
                    setGender("Outro");
                  }}
                  checkedColor="grey"
                  checkedIcon={
                    <Icon
                      name="check-box"
                      color={COLORS.grey}
                      size={30}
                      iconStyle={{}}
                    />
                  }
                  uncheckedIcon={
                    <Icon
                      name="crop-square"
                      color={errors?.gender ? COLORS.red : COLORS.grey}
                      size={30}
                      iconStyle={{}}
                    />
                  }
                />
                <View className="flex flex-col items-center -ml-4">
                  <FontAwesomeIcon name="transgender-alt" size={30} />
                  <Text className="text-xs">Outro</Text>
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
            <FormControl.Label>Agregado Familiar</FormControl.Label>
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
          <FormControl.Label>Posto Adm.</FormControl.Label>
          <Select
            selectedValue={addressAdminPost}
            accessibilityLabel="posto administrativo"
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
              // addressAdminPost ? (
              // ) : (
              //   <Icon
              //     // size={45}
              //     name="arrow-drop-down"
              //     color="#005000"
              //   />
              // )
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
          <FormControl.Label>Localidade</FormControl.Label>

          <Select
            selectedValue={addressVillage}
            accessibilityLabel="Escolha uma localidade"
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
              // addressVillage ? (
              //   <Icon
              //     name="close"
              //     size={15}
              //     color="grey"
              //     onPress={() => setAddressVillage("")}
              //   />
              // ) : (
              //   <Icon
              //     // size={45}
              //     name="arrow-drop-down"
              //     color={COLORS.main}
              //   />
              // )
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

      <View className="flex flex-row mx-3 w-full gap-2">
        <View className="flex-1">
          <FormControl my="1" isInvalid={"primaryPhone" in errors}>
            <FormControl.Label>Telemóvel</FormControl.Label>
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
            {/* <FormControl.Label>Telemóvel</FormControl.Label>
            <CustomInput
              width="100%"
              type="telephoneNumber"
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
              InputLeftElement={
                <Icon name="phone" color="grey" size={20} type="material" />
              }
            /> */}
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
            <FormControl.Label>Telemóvel Alternativo</FormControl.Label>
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
            {/* <FormControl.Label>Tel. Alternativo</FormControl.Label>
            <CustomInput
              width="100%"
              type="telephoneNumber"
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
              InputLeftElement={
                <Icon name="phone" color="grey" size={20} type="material" />
              }
            /> */}
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

      {/* <CustomDivider marginVertical="2" thickness={2} bg={COLORS.main} /> */}

      <View className="py-3">
        <Text style={styles.formSectionDescription}>Dados de Nascimento</Text>
      </View>

      <View className="py-3 mx-3 ">
        <FormControl isRequired isInvalid={"birthDate" in errors}>
          <FormControl.Label>Data de Nascimento</FormControl.Label>
          <Pressable
            onPress={() => setOpenDatePicker(true)}
            className="flex flex-row gap-2 mt-1 items-center max-w-[200px] shadow-md border border-gray-300 rounded-md p-1 "
          >
            <FontAwesomeIcon name="calendar" size={30} color={COLORS.grey} />
            <Text className="text-center text-[16px] ">
              {birthDate
                ? `${birthDate.getDate()}/${
                    birthDate.getMonth() + 1
                  }/${birthDate.getFullYear()}`
                : "Data de Nascimento"}
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
          <FormControl.Label>Província/País de Nascimento</FormControl.Label>

          <Select
            selectedValue={birthProvince}
            // @ts-expect-error TS(2322): Type '{ children: Element[]; selectedValue: any; a... Remove this comment to see the full error message
            accessibilityLabel="Escolha uma província"
            placeholder="Escolha uma província"
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
              // birthProvince ? (
              //   <Icon
              //     name="close"
              //     size={20}
              //     color="grey"
              //     onPress={() => setBirthProvince("")}
              //   />
              // ) : (
              //   <Icon
              //     // size={45}
              //     name="arrow-drop-down"
              //     color={COLORS.main}
              //   />
              // )
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
                  <FormControl.Label>
                    {birthProvince === "País Estrangeiro" ? "País" : "Distrito"}
                  </FormControl.Label>
                  <Select
                    selectedValue={birthDistrict}
                    // @ts-expect-error TS(2322): Type '{ children: any; selectedValue: any; accessi... Remove this comment to see the full error message
                    accessibilityLabel="Escolha um distrito"
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
                      // birthDistrict ? (
                      //   <Icon
                      //     name="close"
                      //     size={20}
                      //     color="grey"
                      //     onPress={() => setBirthDistrict("")}
                      //   />
                      // ) : (
                      //   <Icon
                      //     // size={45}
                      //     name="arrow-drop-down"
                      //     color={COLORS.main}
                      //   />
                      // )
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
                      <FormControl.Label>Posto Adm.</FormControl.Label>
                      <Select
                        selectedValue={birthProvince ? birthAdminPost : ""}
                        // @ts-expect-error TS(2322): Type '{ children: any[]; selectedValue: any; acces... Remove this comment to see the full error message
                        accessibilityLabel="Escolha um posto administrativo"
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
                          // birthAdminPost ? (
                          //   <Icon
                          //     name="close"
                          //     size={20}
                          //     color="grey"
                          //     onPress={() => setBirthAdminPost("")}
                          //   />
                          // ) : (
                          //   <Icon
                          //     // size={45}
                          //     name="arrow-drop-down"
                          //     color={COLORS.main}
                          //   />
                          // )
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
              <FormControl.Label>
                {birthProvince === "País Estrangeiro"
                  ? "País de Nascimento"
                  : "Distrito de Nascimento"}
              </FormControl.Label>
              <Select
                selectedValue={birthDistrict}
                // @ts-expect-error TS(2322): Type '{ children: any[]; selectedValue: any; acces... Remove this comment to see the full error message
                accessibilityLabel="Seleccionar país"
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
                  // birthAdminPost ? (
                  //   <Icon
                  //     name="close"
                  //     size={20}
                  //     color="grey"
                  //     onPress={() => setBirthAdminPost("")}
                  //   />
                  // ) : (
                  //   <Icon
                  //     // size={45}
                  //     name="arrow-drop-down"
                  //     color={COLORS.main}
                  //   />
                  // )
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

      {/* <CustomDivider marginVertical="2" thickness={2} bg={COLORS.main} /> */}

      <View className="my-3">
        <Text style={styles.formSectionDescription}>
          Documentos de Identificação
        </Text>
      </View>

     
        <View className="flex flex-row gap-2 justify-center items-center">
          <View className="flex-1">

          <FormControl my="2" isRequired isInvalid={"docType" in errors}>
            <FormControl.Label>Tipo</FormControl.Label>
            <Select
              selectedValue={docType}
              // @ts-expect-error TS(2322): Type '{ children: Element[]; selectedValue: any; a... Remove this comment to see the full error message
              accessibilityLabel="Tipo de doc."
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
                // docType ? (
                //   <Icon
                //     name="close"
                //     size={20}
                //     color="grey"
                //     onPress={() => setDocType("")}
                //   />
                // ) : (
                  //   <Icon
                //     // size={45}
                //     name="arrow-drop-down"
                //     color={COLORS.main}
                //   />
                // )
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
        
        <View className="flex-1" >
          <FormControl my="2" isInvalid={"docNumber" in errors}>
            <FormControl.Label>Número</FormControl.Label>
            <Input 
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
    
        <View className="" >
          <FormControl isInvalid={"nuit" in errors}>
            <FormControl.Label>NUIT</FormControl.Label>
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

      <View className="w-full" >
        <FormControl isRequired isInvalid={"isGroupMember" in errors}>
          <FormControl.Label>
              É membro de uma cooperativa?
          </FormControl.Label>





          

          {/* <Stack direction="row" mx="3" w="100%">
            <View w="50%">
              <CheckBox
                center
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: "transparent",
                }}
                textStyle={{
                  fontWeight: "100",
                  color: isGroupMember
                    ? COLORS.main
                    : errors?.isGroupMember
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Sim"
                checked={isGroupMember}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.main}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="radio-button-unchecked"
                    color={errors?.isGroupMember ? COLORS.red : COLORS.grey}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
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
            
            <View w="50%">
              <CheckBox
                center
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: "transparent",
                }}
                textStyle={{
                  fontWeight: "100",
                  color: isNotGroupMember
                    ? COLORS.main
                    : errors?.isGroupMember
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Não"
                checked={isNotGroupMember}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.main}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="radio-button-unchecked"
                    color={errors?.isGroupMember ? COLORS.red : COLORS.grey}
                    size={30}
                    iconStyle={{ marginRight: 1 }}
                  />
                }
                // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
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
          </Stack> */}


<View className="flex flex-row mx-3 w-full justify-between gap-2">
            <View className="flex-1 justify-start">
              <CheckBox
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: "transparent",
                }}
                textStyle={{
                  fontWeight: "100",
                  fontSize: 18,
                  color: isGroupMember
                    ? COLORS.grey
                    : errors?.isGroupMember
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Sim"
                checked={isGroupMember}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.grey}
                    size={35}
                    iconStyle={{}}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="crop-square"
                    color={errors?.isGroupMember ? COLORS.red : COLORS.grey}
                    size={35}
                    iconStyle={{}}
                  />
                }
                // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
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
              <CheckBox
                fontFamily="JosefinSans-Regular"
                containerStyle={{
                  backgroundColor: "transparent",
                }}
                textStyle={{
                  fontWeight: "100",
                  fontSize: 18,
                  color: isNotGroupMember
                    ? COLORS.grey
                    : errors?.isGroupMember
                    ? COLORS.red
                    : COLORS.grey,
                }}
                title="Não"
                checked={isNotGroupMember}
                checkedIcon={
                  <Icon
                    name="check-box"
                    color={COLORS.grey}
                    size={35}
                    iconStyle={{}}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="crop-square"
                    color={errors?.isGroupMember ? COLORS.red : COLORS.grey}
                    size={35}
                    iconStyle={{}}
                  />
                }
                // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
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
