import React, { useState, useEffect, useCallback } from "react"
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
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
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list"

import COLORS from "../../consts/colors"
import { CustomInput } from "../Inputs/CustomInput"
import {

  // @ts-expect-error TS(2305): Module '"../../helpers/dates"' has no exported mem... Remove this comment to see the full error message
  fullYears,
  getFullYears,
  localeDateService,
  useDatepickerState,
} from "../../helpers/dates"
import { groupPurposes } from "../../consts/groupPurposes"
import { groups, groups2, institutions } from "../../consts/farmerTypes"
import { groupAffiliationStatus } from "../../consts/groupAffiliationStatus"

import validateGroupEditedData from "../../helpers/validateGroupEditedData"

import { useUser } from "@realm/react"
import { realmContext } from "../../models/realmContext"
const { useRealm } = realmContext

const EditGroupData = ({
  isOverlayVisible,
  setIsOverlayVisible,
  isConfirmDataVisible,
  setIsConfirmDataVisible,
  ownerName,
  resource,
  resourceName,
  dataToBeUpdated,
  newDataObject,
  oldDataObject,
  setNewDataObject,
  setOldDataObject,

  // the group manager personal data
  groupManagerPhone,

  setGroupManagerPhone,
  groupManagerName,
  setGroupManagerName,
  oldGroupManagerPhone,
  setOldGroupManagerPhone,
  oldGroupManagerName,
  setOldGroupManagerName,

  // the group members data
  isGroupActive,

  setIsGroupActive,
  isGroupInactive,
  setIsGroupInactive,
  isOldGroupActive,
  isOldGroupInactive,
  setIsOldGroupActive,
  setIsOldGroupInactive,
  groupMembersNumber,
  setGroupMembersNumber,
  groupWomenNumber,
  setGroupWomenNumber,
  oldGroupMembersNumber,
  setOldGroupMembersNumber,
  oldGroupWomenNumber,
  setOldGroupWomenNumber,
  groupNuit,
  setGroupNuit,
  groupAffiliationYear,
  setGroupAffiliationYear,
  groupCreationYear,
  setGroupCreationYear,
  groupLegalStatus,
  setGroupLegalStatus,
  groupOperatingLicence,
  setGroupOperatingLicence,
  oldGroupNuit,
  setOldGroupNuit,
  oldGroupAffiliationYear,
  setOldGroupAffiliationYear,
  oldGroupCreationYear,
  setOldGroupCreationYear,
  oldGroupLegalStatus,
  setOldGroupLegalStatus,
  oldGroupOperatingLicence,
  setOldGroupOperatingLicence,

  // group type
  groupType,

  setGroupType,
  oldGroupType,
  setOldGroupType,
  groupName,
  setGroupName,
  oldGroupName,
  setOldGroupName,
  groupGoals,
  setGroupGoals,
  oldGroupGoals,
  setOldGroupGoals
}: any) => {
  const realm = useRealm()
  const user = useUser()
  const customUserData = user?.customData

  // // ----------------------------------------------------
  const [errors, setErrors] = useState({})
  const [overlayTitle, setOverlayTitle] = useState("")

  // erase dados for affiliationyear, nuit, and licence
  // if legal status is not 'legalizado'
  useEffect(() => {
    if (groupLegalStatus !== groupAffiliationYear.affiliated) {
      setGroupAffiliationYear("")
      setGroupNuit("")
      setGroupOperatingLicence("")
    }
  }, [groupLegalStatus])

  useEffect(() => {
    if (dataToBeUpdated === "groupType" && resourceName === "Group") {
      setGroupName(resource?.name)
      setGroupType(resource?.type)
      setGroupGoals(resource?.assets?.map((asset: any) => asset.subcategory))
      setOverlayTitle("Actualizar Tipo de Organização")

      setOldGroupName(resource?.name)
      setOldGroupType(resource?.type)
      setOldGroupGoals(resource?.assets?.map((asset: any) => asset.subcategory))
    }

    if (dataToBeUpdated === "groupMembers" && resourceName === "Group") {
      setIsGroupActive(resource?.operationalStatus ? true : false)
      setIsGroupInactive(!resource?.operationalStatus ? true : false)
      setOverlayTitle("Actualizar Efectividade.")

      setIsOldGroupActive(resource?.operationalStatus ? true : false)
      setIsOldGroupInactive(!resource?.operationalStatus ? true : false)

      setGroupMembersNumber(resource?.numberOfMembers.total)
      setGroupWomenNumber(resource?.numberOfMembers.women)

      setOldGroupMembersNumber(resource?.numberOfMembers.total)
      setOldGroupWomenNumber(resource?.numberOfMembers.women)
    }

    if (dataToBeUpdated === "groupIdentity" && resourceName === "Group") {
      setGroupAffiliationYear(resource?.affiliationYear)
      setGroupOperatingLicence(resource?.licence)
      setGroupNuit(resource?.nuit)
      setGroupCreationYear(resource?.creationYear)
      setGroupLegalStatus(resource?.legalStatus)

      setOverlayTitle("Actualizar Identidade.")

      setOldGroupAffiliationYear(resource?.affiliationYear)
      setOldGroupOperatingLicence(resource?.licence)
      setOldGroupNuit(resource?.nuit)
      setOldGroupCreationYear(resource?.creationYear)
      setOldGroupLegalStatus(resource?.legalStatus)
    }
  }, [dataToBeUpdated, resourceName])

  const onConfirmUpdate = (dataToBeUpdated: any, resourceName: any) => {
    // validate the data input by the user
    const validatedData = validateGroupEditedData(
      {
        // user changing group name, type, and goals
        groupName,
        groupType,
        groupGoals,
        oldGroupName,
        oldGroupType,
        oldGroupGoals,

        // user changing group identity
        groupAffiliationYear,
        groupCreationYear,
        groupLegalStatus,
        groupOperatingLicence,
        oldGroupAffiliationYear,
        oldGroupCreationYear,
        oldGroupLegalStatus,
        oldGroupOperatingLicence,
        groupNuit,
        oldGroupNuit,

        // user changing group efectivity
        isGroupActive,
        isGroupInactive,
        isOldGroupActive,
        isOldGroupInactive,
        groupMembersNumber,
        oldGroupMembersNumber,
        groupWomenNumber,
        oldGroupWomenNumber,

      },
      errors,
      setErrors,
      dataToBeUpdated,
      resourceName,
    )

    const newData = {}
    const oldData = {}

    if (dataToBeUpdated === "groupType" && resourceName === "Group") {
      // incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["type"] = validatedData?.type ? validatedData?.type?.trim() : ""

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["name"] = validatedData?.name ? validatedData?.name?.trim() : ""
      // normalize the asset object

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["goals"] =

        // @ts-expect-error TS(2339): Property 'goals' does not exist on type 'false | {... Remove this comment to see the full error message
        validatedData?.goals?.length > 0 ? validatedData?.goals : []

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["type"] = oldGroupType ? oldGroupType : ""

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["name"] = oldGroupName ? oldGroupName : ""
      // normalize the asset object

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["goals"] = oldGroupGoals ? oldGroupGoals : []

      setNewDataObject(newData)
      setOldDataObject(oldData)
    }

    if (dataToBeUpdated === "groupIdentity" && resourceName === "Group") {
      // new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["legalStatus"] = validatedData?.legalStatus

        // @ts-expect-error TS(2339): Property 'legalStatus' does not exist on type 'fal... Remove this comment to see the full error message
        ? validatedData?.legalStatus?.trim()
        : ""

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["licence"] = validatedData?.licence

        // @ts-expect-error TS(2339): Property 'licence' does not exist on type 'false |... Remove this comment to see the full error message
        ? validatedData?.licence?.trim()
        : ""

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["creationYear"] = validatedData?.creationYear

        // @ts-expect-error TS(2339): Property 'creationYear' does not exist on type 'fa... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.creationYear))
        : 0

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["affiliationYear"] = validatedData?.affiliationYear

        // @ts-expect-error TS(2339): Property 'affiliationYear' does not exist on type ... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.affiliationYear))
        : 0

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["nuit"] = validatedData?.nuit

        // @ts-expect-error TS(2339): Property 'nuit' does not exist on type 'false | { ... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.nuit))
        : 0

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["legalStatus"] = oldGroupLegalStatus
        ? oldGroupLegalStatus?.trim()
        : ""

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["licence"] = oldGroupOperatingLicence
        ? oldGroupOperatingLicence?.trim()
        : ""

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["creationYear"] = oldGroupCreationYear
        ? Number(parseInt(oldGroupCreationYear))
        : 0

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["affiliationYear"] = oldGroupAffiliationYear
        ? Number(parseInt(oldGroupAffiliationYear))
        : 0

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["nuit"] = oldGroupNuit ? Number(parseInt(oldGroupNuit)) : 0

      setNewDataObject(newData)
      setOldDataObject(oldData)
    }

    if (dataToBeUpdated === "groupMembers" && resourceName === "Group") {
      // new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["operationalStatus"] = validatedData?.operationalStatus

        // @ts-expect-error TS(2339): Property 'operationalStatus' does not exist on typ... Remove this comment to see the full error message
        ? validatedData?.operationalStatus
        : false

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["total"] = validatedData?.total

        // @ts-expect-error TS(2339): Property 'total' does not exist on type 'false | {... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.total))
        : 0

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["women"] = validatedData?.women

        // @ts-expect-error TS(2339): Property 'women' does not exist on type 'false | {... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.women))
        : 0

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["operationalStatus"] = isOldGroupActive ? isOldGroupActive : false

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["total"] = oldGroupMembersNumber
        ? Number(parseInt(oldGroupMembersNumber))
        : 0

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["women"] = oldGroupWomenNumber
        ? Number(parseInt(oldGroupWomenNumber))
        : 0

      setNewDataObject(newData)
      setOldDataObject(oldData)
    }
  }

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible)
  }

  return (
    <Overlay
      overlayStyle={{
        backgroundColor: COLORS.ghostwhite,
        width: "90%",
        borderRadius: 10,
        // marginBottom: 10,
        maxHeight: "80%",
      }}
      isVisible={isOverlayVisible}
      onBackdropPress={toggleOverlay}
    >
      <View
        style={{
          // minHeight: '80%',
          maxHeight: "100%",
          justifyContent: "center",
          // marginVertical: 10,
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
            right: 0,
            top: 0,
          }}
        >
          <Icon
            onPress={() => {
              setIsOverlayVisible(false)
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
          {dataToBeUpdated === "groupType" && resourceName === "Group" && (
            <Stack direction="column">
              <FormControl isRequired my="3" isInvalid={"groupType" in errors}>
                <FormControl.Label>Tipo de organização</FormControl.Label>

                <SelectList
                  data={groups2}
                  setSelected={(newGroupType: any) => {
                    setErrors((prev) => ({ ...prev, groupType: "" }))
                    setGroupType(newGroupType)
                  }}
                  save="value"
                  placeholder="Escolher organização"
                  searchPlaceholder="Procurar organização"
                  maxHeight={400}
                  fontFamily="JosefinSans-Regular"
                  notFoundText="Organização não encontrada"
                  defaultOption={{ key: 10, value: oldGroupType }}
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
                    color: COLORS.black,
                  }}
                  boxStyles={{
                    minHeight: 55,
                    borderRadius: 5,
                    borderColor: COLORS.lightgrey,
                    marginTop: 5,
                  }}
                />

  
                {"groupType" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupType}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>

              <FormControl isRequired my="4" isInvalid={"groupName" in errors}>
                <FormControl.Label>Nome</FormControl.Label>
                <CustomInput
                  width="100%"
                  isDisabled={groupType === "" ? true : false}
                  autoCapitalize="words"
                  placeholder="Nome do grupo"
                  value={groupName}
                  onChangeText={(newGroupName: any) => {
                    setErrors((prev) => ({ ...prev, groupName: "" }))
                    setGroupName(newGroupName)
                  }}
                />
                {"groupName" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupName}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>

              <FormControl isInvalid={"groupGoals" in errors} isRequired>
                <FormControl.Label>
                  Finalidades de {!groupType ? "Grupo" : groupType}
                </FormControl.Label>
                <MultipleSelectList
                  setSelected={(goal: any) => {
                    setErrors((prev) => ({ ...prev, groupGoals: "" }))
                    setGroupGoals(goal)
                  }}
                  data={groupPurposes}
                  notFoundText={"Finalidade não encontrada"}
                  placeholder="Finalidade de grupo"
                  searchPlaceholder="Escolher finalidades"
                  save="value"
                  label="Finalidade de grupo"
                  badgeStyles={{
                    backgroundColor: COLORS.pantone,
                  }}
                  badgeTextStyles={{
                    fontSize: 16,
                  }}
                  arrowicon={
                    <Icon
                      // size={45}
                      name="arrow-drop-down"
                      color={COLORS.pantone}
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
                    fontSize: 16,
                    color: "#A8A8A8",
                  }}
                  boxStyles={{
                    minHeight: 55,
                    borderRadius: 5,
                    borderColor: COLORS.lightgrey,
                  }}
                />
                {"groupGoals" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupGoals}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>
            </Stack>
          )}

          {dataToBeUpdated === "groupIdentity" && resourceName === "Group" && (
            <Stack direction="column">
              <FormControl
                isRequired
                my="1"
                isInvalid={"groupCreationYear" in errors}
              >
                <FormControl.Label>Ano de criação</FormControl.Label>
                <Select
                  selectedValue={groupCreationYear}

                  // @ts-expect-error TS(2322): Type '{ children: Element[]; selectedValue: any; a... Remove this comment to see the full error message
                  accessibilityLabel="Escolha o ano"
                  placeholder="Escolha o ano"
                  minHeight={55}
                  _selectedItem={{
                    bg: "teal.600",
                    fontSize: "lg",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  dropdownCloseIcon={
                    groupCreationYear ? (
                      <Icon
                        name="close"
                        size={20}
                        color="grey"
                        onPress={() => setGroupCreationYear("")}
                      />
                    ) : (
                      <Icon
                        size={45}
                        name="arrow-drop-down"
                        color={COLORS.pantone}
                      />
                    )
                  }
                  mt={1}
                  onValueChange={(newYear) => {
                    setErrors((prev) => ({ ...prev, groupCreationYear: "" }))
                    setGroupCreationYear(newYear)
                  }}
                >
                  {getFullYears()?.map((year, index) => (
                    <Select.Item key={index} label={`${year}`} value={year} />
                  ))}
                </Select>
                {"groupCreationYear" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupCreationYear}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>

              <FormControl
                isRequired
                my="1"
                isInvalid={"groupLegalStatus" in errors}
              >
                <FormControl.Label>Situação Legal</FormControl.Label>
                <Select
                  selectedValue={groupLegalStatus}

                  // @ts-expect-error TS(2322): Type '{ children: Element[]; selectedValue: any; a... Remove this comment to see the full error message
                  accessibilityLabel="Escolha a situação"
                  placeholder="Escolha a situação"
                  minHeight={55}
                  _selectedItem={{
                    bg: "teal.600",
                    fontSize: "lg",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  dropdownCloseIcon={
                    groupLegalStatus ? (
                      <Icon
                        name="close"
                        size={20}
                        color="grey"
                        onPress={() => setGroupLegalStatus("")}
                      />
                    ) : (
                      <Icon
                        size={45}
                        name="arrow-drop-down"
                        color={COLORS.pantone}
                      />
                    )
                  }
                  mt={1}
                  onValueChange={(status) => {
                    setErrors((prev) => ({
                      ...prev,
                      groupCreationYear: "",
                      groupLegalStatus: "",
                    }))
                    setGroupLegalStatus(status)
                  }}
                >
                  <Select.Item
                    label={groupAffiliationStatus.notAffiliated}
                    value={groupAffiliationStatus.notAffiliated}
                  />
                  <Select.Item
                    label={groupAffiliationStatus.pendingAffiliation}
                    value={groupAffiliationStatus.pendingAffiliation}
                  />
                  <Select.Item
                    label={groupAffiliationStatus.affiliated}
                    value={groupAffiliationStatus.affiliated}
                  />
                </Select>
                {"groupLegalStatus" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupLegalStatus}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>

              {groupLegalStatus === groupAffiliationStatus.affiliated && (
                <>
                  <FormControl
                    isRequired
                    my="1"
                    isInvalid={"groupAffiliationYear" in errors}
                  >
                    <FormControl.Label>Ano de legalização</FormControl.Label>
                    <Select
                      selectedValue={groupAffiliationYear}

                      // @ts-expect-error TS(2322): Type '{ children: Element[]; selectedValue: any; a... Remove this comment to see the full error message
                      accessibilityLabel="Escolha o ano"
                      placeholder="Escolha o ano"
                      minHeight={55}
                      _selectedItem={{
                        bg: "teal.600",
                        fontSize: "lg",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      dropdownCloseIcon={
                        groupAffiliationYear ? (
                          <Icon
                            name="close"
                            size={20}
                            color="grey"
                            onPress={() => setGroupAffiliationYear("")}
                          />
                        ) : (
                          <Icon
                            size={45}
                            name="arrow-drop-down"
                            color={COLORS.pantone}
                          />
                        )
                      }
                      mt={1}
                      onValueChange={(newYear) => {
                        setErrors((prev) => ({
                          ...prev,
                          groupAffiliationYear: "",
                        }))
                        setGroupAffiliationYear(newYear)
                      }}
                    >
                      {getFullYears()?.map((year, index) => (
                        <Select.Item
                          key={index}
                          label={`${year}`}
                          value={year}
                        />
                      ))}
                    </Select>
                    {"groupAffiliationYear" in errors ? (
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

                  <FormControl
                    isInvalid={"groupOperatingLicence" in errors}
                    isRequired
                  >
                    <FormControl.Label>N°. de Alvará</FormControl.Label>
                    <CustomInput
                      width="100%"
                      // type="telephoneNumber"
                      placeholder="Alvará"
                      // keyboardType="numeric"
                      // isDisabled={groupType === '' ? true : false}
                      value={groupOperatingLicence}
                      onChangeText={(newOperatingLicence: any) => {
                        setErrors((prev) => ({
                          ...prev,
                          groupOperatingLicence: "",
                        }))
                        setGroupOperatingLicence(newOperatingLicence)
                      }}
                    />
                    {"groupOperatingLicence" in errors ? (
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

                  <FormControl isInvalid={"groupNuit" in errors} isRequired>
                    <FormControl.Label>NUIT</FormControl.Label>
                    <CustomInput
                      width="100%"
                      type="number"
                      placeholder={groupNuit ? groupNuit.toString() : "Nenhum"}
                      value={groupNuit}
                      // isDisabled={groupType === '' ? true : false}
                      keyboardType="numeric"
                      onChangeText={(newNuit: any) => {
                        setErrors((prev) => ({ ...prev, groupNuit: "" }))
                        setGroupNuit(newNuit)
                      }}
                    />
                    {"groupNuit" in errors ? (
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
                </>
              )}
            </Stack>
          )}

          {dataToBeUpdated === "groupMembers" && resourceName === "Group" && (
            <Stack direction="column">
              <FormControl
                isRequired
                my="1"
                isInvalid={"operationalStatus" in errors}
              >
                <FormControl.Label>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "JosefinSans-Regular",
                      color: COLORS.grey,
                      paddingHorizontal: 15,
                    }}
                  >
                    Este grupo é...
                  </Text>
                </FormControl.Label>
                <Stack direction="row" mx="3" w="100%">
                  <Box w="50%" px="1">
                    <CheckBox
                      center
                      fontFamily="JosefinSans-Italic"
                      containerStyle={{
                        backgroundColor: COLORS.ghostwhite,
                      }}
                      textStyle={{
                        fontWeight: "120",
                        color: COLORS.pantone,
                      }}
                      title="Activo"
                      checked={isGroupActive}
                      checkedIcon={
                        <Icon
                          name="check-box"
                          color={COLORS.pantone}
                          size={30}
                          iconStyle={{ marginRight: 1 }}
                        />
                      }
                      uncheckedIcon={
                        <Icon
                          name="radio-button-unchecked"
                          color={COLORS.pantone}
                          size={30}
                          iconStyle={{ marginRight: 1 }}
                        />
                      }

                      // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
                      onPress={() => {
                        setIsGroupInactive(false)
                        setIsGroupActive(true)
                      }}
                    />
                  </Box>
                  <Box w="50%" px="1">
                    <CheckBox
                      center
                      fontFamily="JosefinSans-Italic"
                      containerStyle={{
                        backgroundColor: COLORS.ghostwhite,
                      }}
                      textStyle={{
                        fontWeight: "120",
                        color: COLORS.pantone,
                      }}
                      title="Inactivo"
                      checked={isGroupInactive}
                      checkedIcon={
                        <Icon
                          name="check-box"
                          color={COLORS.pantone}
                          size={30}
                          iconStyle={{ marginRight: 1 }}
                        />
                      }
                      uncheckedIcon={
                        <Icon
                          name="radio-button-unchecked"
                          color={COLORS.pantone}
                          size={30}
                          iconStyle={{ marginRight: 1 }}
                        />
                      }

                      // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
                      onPress={() => {
                        setIsGroupInactive(true)
                        setIsGroupActive(false)
                      }}
                    />
                  </Box>
                </Stack>
                {"operationalStatus" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.operationalStatus}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>

              <FormControl
                isInvalid={"groupMembersNumber" in errors}
                isRequired
              >
                <FormControl.Label>Total de membros</FormControl.Label>
                <CustomInput
                  width="100%"
                  type="number"
                  placeholder="Número de membros"
                  textAlign={"center"}
                  keyboardType="numeric"
                  value={
                    groupMembersNumber ? groupMembersNumber?.toString() : ""
                  }
                  onChangeText={(groupMembers: any) => {
                    setErrors((prev) => ({ ...prev, groupMembersNumber: "" }))
                    setGroupMembersNumber(groupMembers)
                  }}
                />
                {"groupMembersNumber" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupMembersNumber}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>

              <FormControl isInvalid={"groupWomenNumber" in errors} isRequired>
                <FormControl.Label>Total de mulheres</FormControl.Label>
                <CustomInput
                  width="100%"
                  type="number"
                  placeholder="Número de mulheres"
                  textAlign={"center"}
                  isDisabled={groupMembersNumber === "" ? true : false}
                  value={groupWomenNumber ? groupWomenNumber?.toString() : ""}
                  keyboardType="numeric"
                  onChangeText={(womenNumber: any) => {
                    setErrors((prev) => ({ ...prev, groupWomenNumber: "" }))
                    setGroupWomenNumber(womenNumber)
                  }}
                />
                {"groupWomenNumber" in errors ? (
                  <FormControl.ErrorMessage
                    leftIcon={
                      <Icon name="error-outline" size={16} color="red" />
                    }
                    _text={{ fontSize: "xs" }}
                  >
                    {errors?.groupWomenNumber}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText></FormControl.HelperText>
                )}
              </FormControl>
            </Stack>
          )}

      

          <Button
            title="Confirmar Dados"
            titleStyle={{
              color: COLORS.ghostwhite,
              fontFamily: "JosefinSans-Bold",
            }}
            iconPosition="right"
            containerStyle={{
              backgroundColor: COLORS.pantone,
              borderRadius: 10,
              marginTop: 30,
            }}
            type="outline"

            // @ts-expect-error TS(2322): Type '{ title: string; titleStyle: { color: string... Remove this comment to see the full error message
            onPress={() => {
              if (
                !validateGroupEditedData(
                  {
                    groupName,
                    groupType,
                    groupGoals,
                    oldGroupName,
                    oldGroupType,
                    oldGroupGoals,

                    groupAffiliationYear,
                    groupCreationYear,
                    groupLegalStatus,
                    groupOperatingLicence,
                    oldGroupAffiliationYear,
                    oldGroupCreationYear,
                    oldGroupLegalStatus,
                    oldGroupOperatingLicence,
                    groupNuit,
                    oldGroupNuit,

                    isGroupActive,
                    isGroupInactive,
                    isOldGroupActive,
                    isOldGroupInactive,
                    groupMembersNumber,
                    oldGroupMembersNumber,
                    groupWomenNumber,
                    oldGroupWomenNumber,
                    // groupManagerName, oldGroupManagerName,
                    // groupManagerPhone, oldGroupManagerPhone,
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
              setIsOverlayVisible(false)
              setIsConfirmDataVisible(true)
            }}
          />
        </ScrollView>
      </View>
    </Overlay>
  );
}

export default EditGroupData
