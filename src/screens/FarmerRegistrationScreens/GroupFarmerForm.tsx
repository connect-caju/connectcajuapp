import { Text, View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { FormControl, Select, CheckIcon } from "native-base";
import { Icon } from "@rneui/themed";

import villages from "../../consts/villages";

import { getFullYears, getFullYears2 } from "../../helpers/dates";
import { groups } from "../../consts/farmerTypes";
import { groupPurposes, groupPurposes2 } from "../../consts/groupPurposes";

import { realmContext } from "../../models/realmContext";
import COLORS from "../../consts/colors";
import {
  groupAffiliationStatus,
  groupAffiliationStatus2,
  groupAffiliationStatus3,
} from "../../consts/groupAffiliationStatus";
import InputLabel from "../../components/InputLabel/InputLabel";
import InputCheckBox from "../../components/InputCheckBox/InputCheckBox";
import { Input } from "../../../components/Input";
import { useCoopStore } from "../../app/stores/coopStore";
import styles from "./styles";

const { useRealm } = realmContext;

interface Props {
  selectedAddressAdminPosts: string[];
}

export default function GroupFarmerForm({ selectedAddressAdminPosts }: Props) {
  const { coopData, updateCoopField, resetCoopForm } = useCoopStore();
  const [isCoopPurpose1, setIsCoopPurpose1] = useState(false);
  const [isCoopPurpose2, setIsCoopPurpose2] = useState(false);
  const [isCoopPurpose3, setIsCoopPurpose3] = useState(false);

  useEffect(() => {
    resetCoopForm();
  }, []);

  return (
    <View className="px-3 pt-6">
      <View className="w-full">
        <FormControl isRequired isInvalid={"isActive" in coopData.errors}>
          <InputLabel label="Esta organização está..." />
          <View className="flex flex-row mx-3 w-full justify-between gap-2 ">
            <View className="flex-1 justify-start">
              <InputCheckBox
                title="Activa"
                isChecked={coopData.isActive === "Sim" ? true : false}
                onPress={() => {
                  updateCoopField("isActive", "Sim");
                  updateCoopField("errors", {
                    ...coopData?.errors,
                    isActive: "",
                  });
                }}
                errorProperty={coopData.errors?.isActive}
              />
            </View>
            <View className="flex-1 justify-end">
              <InputCheckBox
                title="Inactiva"
                isChecked={coopData.isActive === "Não" ? true : false}
                onPress={() => {
                  updateCoopField("isActive", "Não");
                  updateCoopField("errors", {
                    ...coopData?.errors,
                    isActive: "",
                  });
                }}
                errorProperty={coopData.errors?.isActive}
              />
            </View>
          </View>
          {"isActive" in coopData.errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {coopData.errors.isActive}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText></FormControl.HelperText>
          )}
        </FormControl>
      </View>

      <View className="">
        <FormControl isRequired my="1" isInvalid={"type" in coopData.errors}>
          <InputLabel label="Tipo de organização" />
          <Select
            selectedValue={coopData.type}
            placeholder="Tipo de grupo "
            minHeight={50}
            _selectedItem={{
              bg: "gray.200",
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
              updateCoopField("type", newGroupType);
              updateCoopField("errors", {
                ...coopData?.errors,
                type: "",
              });
            }}
          >
            {groups?.map((group, index) => (
              <Select.Item key={index} label={group} value={group} />
            ))}
          </Select>
          {"type" in coopData.errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {coopData.errors?.type}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText></FormControl.HelperText>
          )}
        </FormControl>
      </View>

      <View className="">
        <FormControl isRequired my="1" isInvalid={"name" in coopData.errors}>
          <InputLabel label="Designação da organização" />

          <Input
            placeholder="Nome da organização"
            value={coopData.name}
            autoCapitalize="words"
            onChangeText={(newGroupName: any) => {
              updateCoopField("name", newGroupName);
              updateCoopField("errors", {
                ...coopData?.errors,
                name: "",
              });
            }}
          />
          {"name" in coopData.errors ? (
            <FormControl.ErrorMessage
              leftIcon={<Icon name="error-outline" size={16} color="red" />}
              _text={{ fontSize: "xs" }}
            >
              {coopData.errors?.name}
            </FormControl.ErrorMessage>
          ) : (
            <FormControl.HelperText></FormControl.HelperText>
          )}
        </FormControl>
      </View>

      <View className="flex flex-row w-full space-x-2">
        <View className="flex-1">
          <FormControl my="1" isInvalid={"total" in coopData.errors} isRequired>
            <InputLabel label="Membros" />
            <View className="">
              <View className="mr-1">
                <Input
                  value={coopData.numberOfMembers.total}
                  onChangeText={(groupMembers: number) => {
                    updateCoopField("numberOfMembers", {
                      ...coopData.numberOfMembers,
                      total: groupMembers,
                    });
                    updateCoopField("errors", {
                      ...coopData?.errors,
                      total: "",
                      women: "",
                    });
                  }}
                  keyboardType="numeric"
                  placeholder="Total"
                  className="text-center"
                />
                {"total" in coopData.errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {coopData?.errors.total}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </View>
            </View>
          </FormControl>
        </View>
        <View className="flex-1">
          <FormControl my="1" isInvalid={"women" in coopData.errors} isRequired>
            <InputLabel label="Mulheres" />
            <View className="">
              <View className=" ml-1">
                <Input
                  value={coopData.numberOfMembers.women}
                  keyboardType="numeric"
                  placeholder="Mulheres"
                  className="text-center"
                  onChangeText={(womenNumber: number) => {
                    updateCoopField("numberOfMembers", {
                      ...coopData.numberOfMembers,
                      women: womenNumber,
                    });
                    updateCoopField("errors", {
                      ...coopData?.errors,
                      women: "",
                      total: "",
                    });
                  }}
                />
                {"women" in coopData.errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {coopData.errors?.women}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </View>
            </View>
          </FormControl>
        </View>
      </View>

      <View direction="row" mx="3" w="100%">
        <View w="100%" px="1">
          <FormControl
            my="2"
            isInvalid={"purposes" in coopData.errors}
            isRequired
          >
            <InputLabel
              label={`Finalidades da ${
                !coopData.type ? "organização" : coopData.type
              }`}
            />

            <View className="-mb-4">
              <InputCheckBox
                title={groupPurposes[0]}
                onPress={() => {
                  if (
                    isCoopPurpose1 &&
                    coopData?.purposes.includes(groupPurposes[0]!)
                  ) {
                    let newPurposes = coopData.purposes.filter(
                      (purpose) => purpose !== groupPurposes[0]!,
                    );
                    updateCoopField("purposes", newPurposes);
                    setIsCoopPurpose1(false);
                  } else {
                    updateCoopField("purposes", [
                      ...coopData.purposes,
                      groupPurposes[0]!,
                    ]);
                    setIsCoopPurpose1(true);
                  }

                  updateCoopField("errors", {
                    ...coopData?.errors,
                    purposes: "",
                  });
                }}
                errorProperty={coopData.errors?.purposes}
                isChecked={
                  coopData.purposes.includes(groupPurposes[0]!) ? true : false
                }
              />
            </View>
            <View className="-mb-4">
              <InputCheckBox
                title={groupPurposes[1]}
                onPress={() => {
                  if (
                    isCoopPurpose1 &&
                    coopData?.purposes.includes(groupPurposes[1]!)
                  ) {
                    let newPurposes = coopData.purposes.filter(
                      (purpose) => purpose !== groupPurposes[1]!,
                    );
                    updateCoopField("purposes", newPurposes);
                    setIsCoopPurpose2(false);
                  } else {
                    updateCoopField("purposes", [
                      ...coopData.purposes,
                      groupPurposes[1]!,
                    ]);
                    setIsCoopPurpose2(true);
                  }

                  updateCoopField("errors", {
                    ...coopData?.errors,
                    purposes: "",
                  });
                }}
                errorProperty={coopData.errors?.purposes}
                isChecked={
                  coopData.purposes.includes(groupPurposes[1]!) ? true : false
                }
              />
            </View>
            <View className="-mb-4">
              <InputCheckBox
                title={groupPurposes[2]}
                onPress={() => {
                  if (
                    isCoopPurpose3 &&
                    coopData?.purposes.includes(groupPurposes[2]!)
                  ) {
                    let newPurposes = coopData.purposes.filter(
                      (purpose) => purpose !== groupPurposes[2]!,
                    );
                    updateCoopField("purposes", newPurposes);
                    setIsCoopPurpose3(false);
                  } else {
                    updateCoopField("purposes", [
                      ...coopData.purposes,
                      groupPurposes[2]!,
                    ]);
                    setIsCoopPurpose3(true);
                  }

                  updateCoopField("errors", {
                    ...coopData?.errors,
                    purposes: "",
                  });
                }}
                errorProperty={coopData.errors?.purposes}
                isChecked={
                  coopData.purposes.includes(groupPurposes[2]!) ? true : false
                }
              />
            </View>

            {"purposes" in coopData.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {coopData.errors?.purposes}
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
            isInvalid={"creationYear" in coopData.errors}
          >
            <InputLabel label="Ano de criação" />

            <Select
              selectedValue={coopData.creationYear?.toString()}
              placeholder="Escolher ano"
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
              onValueChange={(newYear: string) => {
                updateCoopField("creationYear", newYear);
                updateCoopField("errors", {
                  ...coopData?.errors,
                  creationYear: "",
                  affiliationYear: "",
                });
              }}
            >
              {getFullYears(50)?.map((year: any) => (
                <Select.Item key={year} label={year} value={year} />
              ))}
            </Select>

            {/* <SelectList
              data={getFullYears(50)}
              setSelected={(newYear: number) => {
                updateCoopField("creationYear", newYear);
                updateCoopField("errors", {
                  ...coopData?.errors,
                  creationYear: "",
                  affiliationYear: "",
                });
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
                color: coopData.creationYear ? COLORS.black : COLORS.grey,
              }}
              boxStyles={{
                minHeight: 50,
                borderRadius: 5,
                borderColor: COLORS.lightgrey,
                marginTop: 5,
              }}
            /> */}

            {"creationYear" in coopData.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {coopData.errors?.creationYear}
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
            isInvalid={"legalStatus" in coopData.errors}
          >
            <InputLabel label="Situação legal" />

            <Select
              selectedValue={coopData.legalStatus}
              placeholder="Escolher situação"
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
              onValueChange={(status: string) => {
                updateCoopField("legalStatus", status);
                updateCoopField("errors", {
                  ...coopData?.errors,
                  creationYear: "",
                  nuel: "",
                  nuit: "",
                  licence: "",
                  affiliationYear: "",
                  legalStatus: "",
                });
              }}
            >
              {groupAffiliationStatus3?.map((status: any) => (
                <Select.Item key={status} label={status} value={status} />
              ))}
            </Select>

            {/* <SelectList
              data={groupAffiliationStatus2}
              setSelected={(status: string) => {
                updateCoopField("legalStatus", status);
                updateCoopField("errors", {
                  ...coopData?.errors,
                  creationYear: "",
                  nuel: "",
                  nuit: "",
                  licence: "",
                  affiliationYear: "",
                  legalStatus: "",
                });
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
                color: coopData.legalStatus ? COLORS.black : COLORS.grey,
              }}
              boxStyles={{
                minHeight: 50,
                borderRadius: 5,
                borderColor: COLORS.lightgrey,
                marginTop: 5,
              }}
            /> */}

            {"legalStatus" in coopData.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {coopData.errors.legalStatus}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>
      </View>

      {coopData.legalStatus === groupAffiliationStatus.affiliated && (
        <>
          <View direction="row" mx="3" w="100%">
            <View w="50%" px="1">
              <FormControl
                isRequired
                my="1"
                isInvalid={
                  coopData.legalStatus === groupAffiliationStatus.affiliated &&
                  "affiliationYear" in coopData.errors
                }
              >
                <InputLabel label="Ano de legalização" />

                <Select
                  selectedValue={coopData.affiliationYear?.toString()}
                  placeholder="Escolher ano"
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
                  onValueChange={(newYear: string) => {
                    updateCoopField("affiliationYear", Number(newYear));
                    updateCoopField("errors", {
                      ...coopData?.errors,
                      affiliationYear: "",
                      creationYear: "",
                    });
                  }}
                >
                  {getFullYears(50)?.map((year: any) => (
                    <Select.Item key={year} label={year} value={year} />
                  ))}
                </Select>

                {/* <SelectList
                  data={getFullYears2(50)}
                  setSelected={(newYear: number) => {
                    updateCoopField("affiliationYear", newYear);
                    updateCoopField("errors", {
                      ...coopData?.errors,
                      affiliationYear: "",
                      creationYear: "",
                    });
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
                    color: coopData.affiliationYear ? COLORS.black : COLORS.grey,
                  }}
                  boxStyles={{
                    minHeight: 50,
                    borderRadius: 5,
                    borderColor: COLORS.lightgrey,
                    marginTop: 5,
                  }}
                /> */}

                {coopData.legalStatus === groupAffiliationStatus.affiliated &&
                "affiliationYear" in coopData.errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {coopData.errors?.affiliationYear}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>
            </View>

            <View className="my-3">
              <Text style={styles.formSectionDescription}>Documentação</Text>
            </View>

            <View>
              <FormControl
                my="1"
                isInvalid={
                  coopData.legalStatus === groupAffiliationStatus.affiliated &&
                  "licence" in coopData.errors
                }
                isRequired
              >
                <InputLabel label="Licença de operação" />
                <Input
                  autoCapitalize="characters"
                  placeholder="Licença de Operação"
                  value={coopData.licence}
                  onChangeText={(newOperatingLicence: string) => {
                    updateCoopField("licence", newOperatingLicence);
                    updateCoopField("errors", {
                      ...coopData?.errors,
                      licence: "",
                    });
                  }}
                />

                {coopData.legalStatus === groupAffiliationStatus.affiliated &&
                "licence" in coopData.errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {coopData.errors?.licence}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>
            </View>
          </View>

          <View className="flex flex-row w-full space-x-2 justify-center ">
            <View className="w-1/2">
              <FormControl
                my="1"
                isInvalid={
                  coopData.legalStatus === groupAffiliationStatus.affiliated &&
                  "nuit" in coopData.errors
                }
                isRequired
              >
                <InputLabel label="NUIT" />
                <Input
                  value={coopData.nuit}
                  onChangeText={(newNuit: number) => {
                    updateCoopField("nuit", newNuit);
                    updateCoopField("errors", {
                      ...coopData?.errors,
                      nuit: "",
                    });
                  }}
                  keyboardType="numeric"
                  placeholder="NUIT"
                  className="text-center"
                />
                {coopData.legalStatus === groupAffiliationStatus.affiliated &&
                "nuit" in coopData.errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {coopData.errors?.nuit}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>
            </View>

            <View className="w-1/2">
              <FormControl
                my="1"
                isInvalid={
                  coopData.legalStatus === groupAffiliationStatus.affiliated &&
                  "nuel" in coopData.errors
                }
                isRequired
              >
                <InputLabel label="NUEL" />
                <Input
                  keyboardType="numeric"
                  value={coopData.nuel}
                  onChangeText={(newNuel: number) => {
                    updateCoopField("nuel", newNuel);
                    updateCoopField("errors", {
                      ...coopData?.errors,
                      nuel: "",
                    });
                  }}
                  placeholder="NUEL"
                  className="text-center"
                />

                {coopData.legalStatus === groupAffiliationStatus.affiliated &&
                "nuel" in coopData.errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {coopData.errors?.nuel}
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
        <Text style={styles.formSectionDescription}>Endereço</Text>
      </View>

      <View className="flex flex-row w-full justify-center space-x-2">
        <View className="w-1/2">
          <FormControl
            isRequired
            my="1"
            isInvalid={"adminPost" in coopData.errors}
          >
            <InputLabel label="Posto Administrativo" />
            <Select
              selectedValue={coopData.address.adminPost}
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
              onValueChange={(newAdminPost: string) => {
                updateCoopField("address", {
                  ...coopData.address,
                  adminPost: newAdminPost,
                });
                updateCoopField("errors", {
                  ...coopData?.errors,
                  adminPost: "",
                });
              }}
            >
              {selectedAddressAdminPosts?.map((adminPost: any, index: any) => (
                <Select.Item key={index} label={adminPost} value={adminPost} />
              ))}
            </Select>
            {"adminPost" in coopData.errors ? (
              <FormControl.ErrorMessage
                leftIcon={<Icon name="error-outline" size={16} color="red" />}
                _text={{ fontSize: "xs" }}
              >
                {coopData.errors.adminPost}
              </FormControl.ErrorMessage>
            ) : (
              <FormControl.HelperText></FormControl.HelperText>
            )}
          </FormControl>
        </View>

        <View className="w-1/2">
          <FormControl isRequired my="1">
            <InputLabel label="Localidade" />
            <Select
              selectedValue={coopData.address.village}
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
              onValueChange={(newVillage: string) => {
                updateCoopField("address", {
                  ...coopData.address,
                  village: newVillage,
                });
              }}
            >
              {coopData.address.adminPost &&
                villages[coopData.address.adminPost]?.map(
                  (village: any, index: any) => (
                    <Select.Item key={index} label={village} value={village} />
                  ),
                )}
            </Select>
            <FormControl.ErrorMessage>{""}</FormControl.ErrorMessage>
          </FormControl>
        </View>
      </View>
    </View>
  );
}
