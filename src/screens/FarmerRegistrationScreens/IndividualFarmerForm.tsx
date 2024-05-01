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
import DatePicker from "react-native-date-picker";
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
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupLabel,
} from "../../../components/RadioGroup";
import { AvatarImage } from "../../../components/Avatar";
import { Camera } from "lucide-react-native";
// const {useRealm} = realmContext;

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

  const onDismissSingle = useCallback(() => {
    setOpenDatePicker(false);
  }, [setOpenDatePicker]);

  const handleBirthDate = (date: any) => {
    setOpenDatePicker(false);
    setBirthDate(date);
    setErrors((prev: any) => ({
      ...prev,
      birthDate: "",
    }));
  };

  const onConfirmSingle = useCallback(
    (params: any) => {
      setOpenDatePicker(false);
      setBirthDate(params?.date);
      setErrors((prev: any) => ({
        ...prev,
        birthDate: "",
      }));
    },
    [setOpenDatePicker, setBirthDate],
  );

  return (
    <View className="px-3 my-3">
      <View className="w-full">
        <FormControl isRequired isInvalid={"isSprayingAgent" in errors}>

          <FormControl.Label>
            <Text
              style={{
                fontSize: 16,
                // fontFamily: "JosefinSans-Regular",
                color: errors?.isSprayingAgent ? COLORS.red : COLORS.black,
                paddingLeft: 15,
              }}
            >
              É Provedor de Serviços de Pulverização?
            </Text>
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

      {/* <View>
        <View className="flex-1">
          <FormControl isRequired isInvalid={"familySize" in errors}>
            <Input
              label="Agregado Familiar"
              onChangeText={(newSize: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  familySize: "",
                }));
                setFamilySize(newSize);
              }}
              value={familySize}
              placeholder="Agregado"
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
      </View> */}

      <Center>
        <Text style={styles.formSectionDescription}>Endereço e Contacto</Text>
      </Center>

      <View className="flex flex-row mx-3 w-full gap-2 justify-center items-center">
        <View className="flex-1">
          <FormControl
            isRequired
            my="3"
            isInvalid={"addressAdminPost" in errors}
          >
            <FormControl.Label>Posto Adm.</FormControl.Label>
            <Picker 
              selectedValue={addressAdminPost}
              onValueChange={(newAdminPost) => {
                setErrors((prev: any) => ({
                  ...prev,
                  addressAdminPost: "",
                }));
                setAddressAdminPost(newAdminPost);
              }}
           

            />
            {/* <Select
              selectedValue={addressAdminPost}
              // @ts-expect-error TS(2322): Type '{ children: any; selectedValue: any; accessi... Remove this comment to see the full error message
              accessibilityLabel="Escolha sua província"
              placeholder="Escolha sua província"
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
                    color="grey"
                    onPress={() => setAddressAdminPost("")}
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
                setErrors((prev: any) => ({
                  ...prev,
                  addressAdminPost: "",
                }));
                setAddressAdminPost(newAdminPost);
              }}
            >
              {selectedAddressAdminPosts?.map((adminPost: any, index: any) => (
                <Select.Item key={index} label={adminPost} value={adminPost} />
              ))}
            </Select> */}
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
        <View className="flex-1">
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
                    color={COLORS.main}
                  />
                )
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
      </View>

      <Stack direction="row" mx="3" w="100%">
        <View w="50%" px="1">
          <FormControl my="1" isInvalid={"primaryPhone" in errors}>
            <FormControl.Label>Telemóvel</FormControl.Label>
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
        <View w="50%" px="1">
          <FormControl my="1" isInvalid={"secondaryPhone" in errors}>
            <FormControl.Label>Tel. Alternativo</FormControl.Label>
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
      </Stack>

      {/* <CustomDivider marginVertical="2" thickness={2} bg={COLORS.main} /> */}

      <Center>
        <Text style={styles.formSectionDescription}>Dados de Nascimento</Text>
      </Center>

      <Stack direction="row" mx="3" my="2" w="100%">
        <View w="50%" px="1" pt="1">
          <FormControl isRequired isInvalid={"birthDate" in errors}>
            <FormControl.Label>Data de Nasc.</FormControl.Label>
            <View>
              <Pressable onPress={() => setOpenDatePicker(true)}>
                <View
                  // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { borderColor:... Remove this comment to see the full error message
                  style={{
                    borderColor: COLORS.lightgrey,
                    borderWidth: 1,
                    borderRadius: 3,
                    height: 55,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "JosefinSans-Regular",
                      fontSize: 14,
                    }}
                  >
                    {birthDate
                      ? `${birthDate.getDate()}/${
                          birthDate.getMonth() + 1
                        }/${birthDate.getFullYear()}`
                      : "Data de nascimento"}
                  </Text>
                  <Icon name="date-range" size={30} color={COLORS.main} />
                </View>
              </Pressable>
            </View>
            <DatePicker
              modal
              // textColor={COLORS.main}
              maximumDate={new Date(dateLimits.maximumDate)}
              minimumDate={new Date(dateLimits.minimumDate)}
              title={"Data de Nascimento"}
              confirmText="Confirmar"
              cancelText="Cancelar"
              mode="date"
              locale="pt-PT"
              open={openDatePicker}
              date={birthDate}
              onDateChange={setBirthDate}
              onConfirm={(date) => {
                handleBirthDate(date);
              }}
              onCancel={() => {
                setOpenDatePicker(false);
              }}
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
            <FormControl.Label>Província</FormControl.Label>

            <Select
              selectedValue={birthProvince}
              // @ts-expect-error TS(2322): Type '{ children: Element[]; selectedValue: any; a... Remove this comment to see the full error message
              accessibilityLabel="Escolha uma província"
              placeholder="Escolha uma província"
              minHeight={55}
              _selectedItem={{
                bg: "teal.600",
                fontSize: "lg",
                endIcon: <CheckIcon size="5" />,
              }}
              dropdownCloseIcon={
                birthProvince ? (
                  <Icon
                    name="close"
                    size={20}
                    color="grey"
                    onPress={() => setBirthProvince("")}
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
      </Stack>

      {!birthProvince?.includes("Cidade") &&
        !birthProvince?.includes("País Estrangeiro") && (
          <Stack direction="row" mx="3" my="2" w="100%">
            <View w="50%" px="1">
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
                  minHeight={55}
                  _selectedItem={{
                    bg: "teal.600",
                    fontSize: "lg",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  dropdownCloseIcon={
                    birthDistrict ? (
                      <Icon
                        name="close"
                        size={20}
                        color="grey"
                        onPress={() => setBirthDistrict("")}
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
            <View w="50%" px="1">
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
                      minHeight={55}
                      _selectedItem={{
                        bg: "teal.600",
                        fontSize: "lg",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      dropdownCloseIcon={
                        birthAdminPost ? (
                          <Icon
                            name="close"
                            size={20}
                            color="grey"
                            onPress={() => setBirthAdminPost("")}
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
          </Stack>
        )}

      {birthProvince?.includes("País Estrangeiro") && (
        <Stack direction="row" mx="3" my="2" w="100%">
          <View w="100%" px="1">
            <FormControl
              isRequired
              my="1"
              isInvalid={"birthDistrict" in errors}
            >
              <FormControl.Label>
                {birthProvince === "País Estrangeiro" ? "País" : "Distrito"}
              </FormControl.Label>
              <SelectList
                setSelected={(newDistrict: any) => {
                  setErrors((prev: any) => ({
                    ...prev,
                    birthDistrict: "",
                  }));
                  setBirthDistrict(newDistrict);
                }}
                data={countries3}
                save="value"
                placeholder="Seleccionar país"
                searchPlaceholder="Procurar país"
                maxHeight={400}
                fontFamily="JosefinSans-Regular"
                notFoundText="País não encontrado"
                dropdownItemStyles={{}}
                dropdownTextStyles={{
                  fontSize: 16,
                  color: COLORS.black,
                  padding: 5,
                }}
                arrowicon={
                  <Icon
                    // size={45}
                    name="arrow-drop-down"
                    color={COLORS.main}
                  />
                }
                closeicon={<Icon name="close" size={20} color={COLORS.grey} />}
                inputStyles={{
                  fontSize: 15,
                  color: birthDistrict ? COLORS.black : COLORS.grey,
                }}
                boxStyles={{
                  minHeight: 55,
                  borderRadius: 5,
                  borderColor: COLORS.lightgrey,
                }}
              />

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
        </Stack>
      )}

      {/* <CustomDivider marginVertical="2" thickness={2} bg={COLORS.main} /> */}

      <Center>
        <Text style={styles.formSectionDescription}>
          Documentos de Identificação
        </Text>
      </Center>

      <Stack direction="row" mx="3" w="100%">
        <View w="50%" px="1">
          <FormControl my="2" isRequired isInvalid={"docType" in errors}>
            <FormControl.Label>Tipo</FormControl.Label>
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
                    color="grey"
                    onPress={() => setDocType("")}
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
        <View w="50%" px="1">
          <FormControl my="3" isInvalid={"docNumber" in errors}>
            <FormControl.Label>Número</FormControl.Label>
            <CustomInput
              width="100%"
              type="text"
              isDisabled={
                docType === "Não tem" || docType === "" ? true : false
              }
              value={docNumber}
              placeholder="Número do Documento"
              onChangeText={(newDocNumber: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  docNumber: "",
                }));
                setDocNumber(newDocNumber);
              }}
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
      </Stack>

      <Stack direction="row" mx="3" w="100%">
        <View w="50%" px="1">
          <FormControl isInvalid={"nuit" in errors}>
            <FormControl.Label>NUIT</FormControl.Label>
            <CustomInput
              width="100%"
              type="number"
              placeholder="NUIT"
              value={nuit}
              keyboardType="numeric"
              onChangeText={(newNuit: any) => {
                setErrors((prev: any) => ({
                  ...prev,
                  nuit: "",
                }));
                setNuit(newNuit);
              }}
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
        <View w="50%" px="1" />
      </Stack>

      {/* Organization */}

      {/* <CustomDivider marginVertical="2" thickness={2} bg={COLORS.main} /> */}

      <Center>
        <Text style={styles.formSectionDescription}>Organização</Text>
      </Center>

      <View w="100%" py="2">
        <FormControl isRequired isInvalid={"isGroupMember" in errors}>
          <FormControl.Label>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Regular",
                color: errors?.isGroupMember ? COLORS.red : COLORS.grey,
                paddingLeft: 15,
                lineHeight: 25,
              }}
            >
              Pertence a alguma organização (Associação, Cooperativa, EMC, ou
              Grupo)?
            </Text>
          </FormControl.Label>

          <Stack direction="row" mx="3" w="100%">
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
          </Stack>
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
