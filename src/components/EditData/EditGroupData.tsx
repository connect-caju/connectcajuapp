import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Overlay, Icon, Button, CheckBox } from "@rneui/base";
import {
  Box,
  FormControl,
  Stack,
  Select,
  CheckIcon,
  Center,
  Radio,
} from "native-base";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import Modal from "react-native-modal";
import COLORS from "../../consts/colors";

import { CustomInput } from "../Inputs/CustomInput";

import { groupPurposes } from "../../consts/groupPurposes";
import { groups, groups2, institutions } from "../../consts/farmerTypes";
import { groupAffiliationStatus, groupAffiliationStatus2 } from "../../consts/groupAffiliationStatus";

import validateGroupEditedData from "../../helpers/validateGroupEditedData";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { getFullYears, getFullYears2 } from "../../helpers/dates";
const { useRealm } = realmContext;

const EditGroupData = ({
  isOverlayVisible,
  setIsOverlayVisible,
  setIsConfirmDataVisible,
  resourceName,
  dataToBeUpdated,
  setNewDataObject,
  setOldDataObject,
  farmerId
}: any) => {
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;

  const farmer = realm.objectForPrimaryKey("Group", farmerId);

  // // ----------------------------------------------------
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [groupGoals, setGroupGoals] = useState("");

  const [oldGroupName, setOldGroupName] = useState("");
  const [oldGroupType, setOldGroupType] = useState("");
  const [oldGroupGoals, setOldGroupGoals] = useState("");

  // ------------------------------------------------
  const [oldGroupNuit, setOldGroupNuit] = useState("");
  const [oldGroupNuel, setOldGroupNuel] = useState("");
  const [oldGroupAffiliationYear, setOldGroupAffiliationYear] = useState("");
  const [oldGroupCreationYear, setOldGroupCreationYear] = useState("");
  const [oldGroupLegalStatus, setOldGroupLegalStatus] = useState("");
  const [oldGroupOperatingLicence, setOldGroupOperatingLicence] = useState("");

  const [groupNuit, setGroupNuit] = useState("");
  const [groupNuel, setGroupNuel] = useState("");
  const [groupAffiliationYear, setGroupAffiliationYear] = useState("");
  const [groupCreationYear, setGroupCreationYear] = useState("");
  const [groupLegalStatus, setGroupLegalStatus] = useState("");
  const [groupOperatingLicence, setGroupOperatingLicence] = useState("");

  // ----------------------------------------------------------
  const [oldGroupMembersNumber, setOldGroupMembersNumber] = useState("");
  const [oldGroupWomenNumber, setOldGroupWomenNumber] = useState("");

  const [groupMembersNumber, setGroupMembersNumber] = useState("");
  const [groupWomenNumber, setGroupWomenNumber] = useState("");

  // ------------------------------------
  const [isOldGroupActive, setIsOldGroupActive] = useState(false);
  const [isOldGroupInactive, setIsOldGroupInactive] = useState(false);

  const [isGroupActive, setIsGroupActive] = useState(false);
  const [isGroupInactive, setIsGroupInactive] = useState(false);

  const [errors, setErrors] = useState({});
  const [overlayTitle, setOverlayTitle] = useState("");

  // erase dados for affiliationyear, nuit, and licence
  // if legal status is not 'legalizado'
  useEffect(() => {

    // @ts-expect-error TS(2339): Property 'affiliated' does not exist on type 'stri... Remove this comment to see the full error message
    if (groupLegalStatus !== groupAffiliationYear.affiliated) {
      setGroupAffiliationYear("");
      setGroupNuit("");
      setGroupNuel("");
      setGroupOperatingLicence("");
    }
  }, [groupLegalStatus]);

  useEffect(() => {
    if (dataToBeUpdated === "groupType" && resourceName === "Group") {

      // @ts-expect-error TS(2576): Property 'name' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setGroupName(farmer?.name);

      // @ts-expect-error TS(2339): Property 'type' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setGroupType(farmer?.type);

      // @ts-expect-error TS(2339): Property 'assets' does not exist on type 'Object<u... Remove this comment to see the full error message
      setGroupGoals(farmer?.assets?.map((asset: any) => asset.subcategory));
      setOverlayTitle("Actualizar Tipo de Organização");


      // @ts-expect-error TS(2576): Property 'name' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setOldGroupName(farmer?.name);

      // @ts-expect-error TS(2339): Property 'type' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setOldGroupType(farmer?.type);

      // @ts-expect-error TS(2339): Property 'assets' does not exist on type 'Object<u... Remove this comment to see the full error message
      setOldGroupGoals(farmer?.assets?.map((asset: any) => asset.subcategory));
    }

    if (dataToBeUpdated === "groupMembers" && resourceName === "Group") {

      // @ts-expect-error TS(2339): Property 'operationalStatus' does not exist on typ... Remove this comment to see the full error message
      setIsGroupActive(farmer?.operationalStatus ? true : false);

      // @ts-expect-error TS(2339): Property 'operationalStatus' does not exist on typ... Remove this comment to see the full error message
      setIsGroupInactive(!farmer?.operationalStatus ? true : false);
      setOverlayTitle("Actualizar Efectividade.");


      // @ts-expect-error TS(2339): Property 'operationalStatus' does not exist on typ... Remove this comment to see the full error message
      setIsOldGroupActive(farmer?.operationalStatus ? true : false);

      // @ts-expect-error TS(2339): Property 'operationalStatus' does not exist on typ... Remove this comment to see the full error message
      setIsOldGroupInactive(!farmer?.operationalStatus ? true : false);


      // @ts-expect-error TS(2339): Property 'numberOfMembers' does not exist on type ... Remove this comment to see the full error message
      setGroupMembersNumber(farmer?.numberOfMembers.total);

      // @ts-expect-error TS(2339): Property 'numberOfMembers' does not exist on type ... Remove this comment to see the full error message
      setGroupWomenNumber(farmer?.numberOfMembers.women);


      // @ts-expect-error TS(2339): Property 'numberOfMembers' does not exist on type ... Remove this comment to see the full error message
      setOldGroupMembersNumber(farmer?.numberOfMembers.total);

      // @ts-expect-error TS(2339): Property 'numberOfMembers' does not exist on type ... Remove this comment to see the full error message
      setOldGroupWomenNumber(farmer?.numberOfMembers.women);
    }

    if (dataToBeUpdated === "groupIdentity" && resourceName === "Group") {

      // @ts-expect-error TS(2339): Property 'affiliationYear' does not exist on type ... Remove this comment to see the full error message
      setGroupAffiliationYear(farmer?.affiliationYear);

      // @ts-expect-error TS(2339): Property 'licence' does not exist on type 'Object<... Remove this comment to see the full error message
      setGroupOperatingLicence(farmer?.licence);

      // @ts-expect-error TS(2339): Property 'nuit' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setGroupNuit(farmer?.nuit);

      // @ts-expect-error TS(2339): Property 'nuel' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setGroupNuel(farmer?.nuel);

      // @ts-expect-error TS(2339): Property 'creationYear' does not exist on type 'Ob... Remove this comment to see the full error message
      setGroupCreationYear(farmer?.creationYear);

      // @ts-expect-error TS(2339): Property 'legalStatus' does not exist on type 'Obj... Remove this comment to see the full error message
      setGroupLegalStatus(farmer?.legalStatus);

      setOverlayTitle("Actualizar Identidade.");


      // @ts-expect-error TS(2339): Property 'affiliationYear' does not exist on type ... Remove this comment to see the full error message
      setOldGroupAffiliationYear(farmer?.affiliationYear);

      // @ts-expect-error TS(2339): Property 'licence' does not exist on type 'Object<... Remove this comment to see the full error message
      setOldGroupOperatingLicence(farmer?.licence);

      // @ts-expect-error TS(2339): Property 'nuit' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setOldGroupNuit(farmer?.nuit);

      // @ts-expect-error TS(2339): Property 'nuel' does not exist on type 'Object<unk... Remove this comment to see the full error message
      setOldGroupNuel(farmer?.nuel);

      // @ts-expect-error TS(2339): Property 'creationYear' does not exist on type 'Ob... Remove this comment to see the full error message
      setOldGroupCreationYear(farmer?.creationYear);

      // @ts-expect-error TS(2339): Property 'legalStatus' does not exist on type 'Obj... Remove this comment to see the full error message
      setOldGroupLegalStatus(farmer?.legalStatus);
    }
  }, [dataToBeUpdated, resourceName]);

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
        groupNuel,
        oldGroupNuel,

        // user changing group efectivity
        isGroupActive,
        isGroupInactive,
        isOldGroupActive,
        isOldGroupInactive,
        groupMembersNumber,
        oldGroupMembersNumber,
        groupWomenNumber,
        oldGroupWomenNumber,

        // user chaning group contact
        // groupManagerName, oldGroupManagerName,
        // groupManagerPhone, oldGroupManagerPhone,
      },
      errors,
      setErrors,
      dataToBeUpdated,
      resourceName,
    );

    const newData = {};
    const oldData = {};

    if (dataToBeUpdated === "groupType" && resourceName === "Group") {
      // incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["type"] = validatedData?.type ? validatedData?.type?.trim() : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["name"] = validatedData?.name ? validatedData?.name?.trim() : "";
      // normalize the asset object

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["goals"] =

        // @ts-expect-error TS(2339): Property 'goals' does not exist on type 'false | {... Remove this comment to see the full error message
        validatedData?.goals?.length > 0 ? validatedData?.goals : [];

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["type"] = oldGroupType ? oldGroupType : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["name"] = oldGroupName ? oldGroupName : "";
      // normalize the asset object

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["goals"] = oldGroupGoals ? oldGroupGoals : [];

      setNewDataObject(newData);
      setOldDataObject(oldData);
    }

    if (dataToBeUpdated === "groupIdentity" && resourceName === "Group") {
      // new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["legalStatus"] = validatedData?.legalStatus

        // @ts-expect-error TS(2339): Property 'legalStatus' does not exist on type 'fal... Remove this comment to see the full error message
        ? validatedData?.legalStatus?.trim()
        : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["licence"] = validatedData?.licence

        // @ts-expect-error TS(2339): Property 'licence' does not exist on type 'false |... Remove this comment to see the full error message
        ? validatedData?.licence?.trim()
        : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["creationYear"] = validatedData?.creationYear

        // @ts-expect-error TS(2339): Property 'creationYear' does not exist on type 'fa... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.creationYear))
        : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["affiliationYear"] = validatedData?.affiliationYear

        // @ts-expect-error TS(2339): Property 'affiliationYear' does not exist on type ... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.affiliationYear))
        : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["nuit"] = validatedData?.nuit

        // @ts-expect-error TS(2339): Property 'nuit' does not exist on type 'false | { ... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.nuit))
        : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["nuel"] = validatedData?.nuel

        // @ts-expect-error TS(2339): Property 'nuel' does not exist on type 'false | { ... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.nuel))
        : 0;

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["legalStatus"] = oldGroupLegalStatus
        ? oldGroupLegalStatus?.trim()
        : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["licence"] = oldGroupOperatingLicence
        ? oldGroupOperatingLicence?.trim()
        : "";

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["creationYear"] = oldGroupCreationYear
        ? Number(parseInt(oldGroupCreationYear))
        : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["affiliationYear"] = oldGroupAffiliationYear
        ? Number(parseInt(oldGroupAffiliationYear))
        : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["nuit"] = oldGroupNuit ? Number(parseInt(oldGroupNuit)) : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["nuel"] = oldGroupNuel ? Number(parseInt(oldGroupNuel)) : 0;

      setNewDataObject(newData);
      setOldDataObject(oldData);
    }

    if (dataToBeUpdated === "groupMembers" && resourceName === "Group") {
      // new incoming data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["operationalStatus"] = validatedData?.operationalStatus

        // @ts-expect-error TS(2339): Property 'operationalStatus' does not exist on typ... Remove this comment to see the full error message
        ? validatedData?.operationalStatus
        : false;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["total"] = validatedData?.total

        // @ts-expect-error TS(2339): Property 'total' does not exist on type 'false | {... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.total))
        : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newData["women"] = validatedData?.women

        // @ts-expect-error TS(2339): Property 'women' does not exist on type 'false | {... Remove this comment to see the full error message
        ? Number(parseInt(validatedData?.women))
        : 0;

      // old data

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["operationalStatus"] = isOldGroupActive
        ? isOldGroupActive
        : false;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["total"] = oldGroupMembersNumber
        ? Number(parseInt(oldGroupMembersNumber))
        : 0;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      oldData["women"] = oldGroupWomenNumber
        ? Number(parseInt(oldGroupWomenNumber))
        : 0;

      setNewDataObject(newData);
      setOldDataObject(oldData);
    }
  };

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  return (
    <Modal
      isVisible={isOverlayVisible}
      supportedOrientations={["portrait", "landscape"]}
      propagateSwipe
      avoidKeyboard
      animationIn={"zoomIn"}
      animationInTiming={600}
      animationOut={"zoomOut"}
      hideModalContentWhileAnimating={true}
      onBackButtonPress={() => {
        setIsOverlayVisible(false);
      }}
      onBackdropPress={() => {
        setIsOverlayVisible(false);
      }}
      onModalHide={() => {
        setIsOverlayVisible(false);
      }}
      onSwipeComplete={() => {
        setIsOverlayVisible(false);
      }}
      swipeDirection={["left", "right"]}
    >
      <View>
        <View
          style={{
            width: "100%",
            minHeight: 50,
            flexDirection: "row",
            backgroundColor: COLORS.main,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <View style={{ width: "90%" }}>
            <Text
              style={{
                fontFamily: "JosefinSans-Bold",
                fontSize: 16,
                // fontWeigth: 'bold',
                color: COLORS.ghostwhite,
                paddingTop: 15,
                textAlign: "center",
              }}
            >
              {overlayTitle}
            </Text>
          </View>
          <View
            style={{
              width: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name="close"
              size={20}
              color={COLORS.ghostwhite}
              onPress={() => {
                setIsOverlayVisible(false);
              }}
            />
          </View>
        </View>

        <ScrollView>
          <View
            flex={1}
            onStartShouldSetResponder={() => true}
            style={{
              backgroundColor: COLORS.ghostwhite,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              padding: 10,
            }}
          >
            <>
              {dataToBeUpdated === "groupType" && resourceName === "Group" && (
                <Stack direction="column">
                  <FormControl
                    isRequired
                    my="3"
                    isInvalid={"groupType" in errors}
                  >
                    <FormControl.Label>Tipo de organização</FormControl.Label>

                    <SelectList
                      data={groups2}
                      setSelected={(newGroupType: any) => {
                        setErrors((prev) => ({ ...prev, groupType: "" }));
                        setGroupType(newGroupType);
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
                        <Icon name="close" size={15} color={COLORS.grey} />
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

                  <FormControl
                    isRequired
                    my="4"
                    isInvalid={"groupName" in errors}
                  >
                    <FormControl.Label>Nome</FormControl.Label>
                    <CustomInput
                      width="100%"
                      isDisabled={groupType === "" ? true : false}
                      autoCapitalize="words"
                      placeholder="Nome do grupo"
                      value={groupName}
                      onChangeText={(newGroupName: any) => {
                        setErrors((prev) => ({ ...prev, groupName: "" }));
                        setGroupName(newGroupName);
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
                        setErrors((prev) => ({ ...prev, groupGoals: "" }));
                        setGroupGoals(goal);
                      }}
                      data={groupPurposes}
                      notFoundText={"Finalidade não encontrada"}
                      placeholder="Finalidade de grupo"
                      searchPlaceholder="Escolher finalidades"
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
                      closeicon={<Icon name="close" size={15} color="grey" />}
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
            </>

            <>
              {dataToBeUpdated === "groupIdentity" &&
                resourceName === "Group" && (
                  <Stack direction="column">

                    <FormControl
                      isRequired
                      my="1"
                      isInvalid={"groupCreationYear" in errors}
                    >
                      <FormControl.Label>
                        Ano de criação
                      </FormControl.Label>
                      <SelectList

                        // @ts-expect-error TS(2769): No overload matches this call.
                        data={() => getFullYears2(70)}
                        setSelected={(newYear: any) => {
                          setErrors((prev) => ({
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
                            name="arrow-drop-down"
                            color={COLORS.main}
                          />
                        }
                        closeicon={
                          <Icon
                            name="close"
                            size={20}
                            color={COLORS.grey}
                          />
                        }
                        inputStyles={{
                          fontSize: 15,
                          color: groupCreationYear
                            ? COLORS.black
                            : COLORS.grey,
                        }}
                        boxStyles={{
                          minHeight: 55,
                          borderRadius: 5,
                          borderColor: COLORS.lightgrey,
                          marginTop: 5,
                        }}
                      />

                      {"groupCreationYear" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon
                              name="error-outline"
                              size={16}
                              color="red"
                            />
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
                      <FormControl.Label>
                        Situação Legal
                      </FormControl.Label>
                      <SelectList
                        data={groupAffiliationStatus2.map(op=>op.value)}
                        setSelected={(newLegalStatus: any) => {
                          setErrors((prev) => ({
                            ...prev,
                            groupLegalStatus: "",
                          }));
                          setGroupLegalStatus(newLegalStatus);
                        }}
                        save="value"
                        placeholder="Escolher uma opção"
                        searchPlaceholder="Procurar"
                        maxHeight={400}
                        fontFamily="JosefinSans-Regular"
                        notFoundText="Não encontrado"
                        dropdownTextStyles={{
                          fontSize: 16,
                          color: COLORS.black,
                          padding: 5,
                        }}
                        arrowicon={
                          <Icon
                            name="arrow-drop-down"
                            color={COLORS.main}
                          />
                        }
                        closeicon={
                          <Icon
                            name="close"
                            size={20}
                            color={COLORS.grey}
                          />
                        }
                        inputStyles={{
                          fontSize: 15,
                          color: groupLegalStatus
                            ? COLORS.black
                            : COLORS.grey,
                        }}
                        boxStyles={{
                          minHeight: 55,
                          borderRadius: 5,
                          borderColor: COLORS.lightgrey,
                          marginTop: 5,
                        }}
                      />

                      {"groupLegalStatus" in errors ? (
                        <FormControl.ErrorMessage
                          leftIcon={
                            <Icon
                              name="error-outline"
                              size={16}
                              color="red"
                            />
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
                          <FormControl.Label>
                            Ano de legalização
                          </FormControl.Label>
                          <SelectList

                            // @ts-expect-error TS(2769): No overload matches this call.
                            data={() => getFullYears2(70)}
                            setSelected={(newYear: any) => {
                              setErrors((prev) => ({
                                ...prev,
                                groupAffiliationYear: "",
                              }));
                              setGroupAffiliationYear(newYear);
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
                                name="arrow-drop-down"
                                color={COLORS.main}
                              />
                            }
                            closeicon={
                              <Icon
                                name="close"
                                size={20}
                                color={COLORS.grey}
                              />
                            }
                            inputStyles={{
                              fontSize: 15,
                              color: groupAffiliationYear
                                ? COLORS.black
                                : COLORS.grey,
                            }}
                            boxStyles={{
                              minHeight: 55,
                              borderRadius: 5,
                              borderColor: COLORS.lightgrey,
                              marginTop: 5,
                            }}
                          />

                          {"groupAffiliationYear" in errors ? (
                            <FormControl.ErrorMessage
                              leftIcon={
                                <Icon
                                  name="error-outline"
                                  size={16}
                                  color="red"
                                />
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
                              }));
                              setGroupOperatingLicence(newOperatingLicence);
                            }}
                          />
                          {"groupOperatingLicence" in errors ? (
                            <FormControl.ErrorMessage
                              leftIcon={
                                <Icon
                                  name="error-outline"
                                  size={16}
                                  color="red"
                                />
                              }
                              _text={{ fontSize: "xs" }}
                            >
                              {errors?.groupOperatingLicence}
                            </FormControl.ErrorMessage>
                          ) : (
                            <FormControl.HelperText></FormControl.HelperText>
                          )}
                        </FormControl>

                        <FormControl
                          isInvalid={"groupNuit" in errors}
                          isRequired
                        >
                          <FormControl.Label>NUIT</FormControl.Label>
                          <CustomInput
                            width="100%"
                            type="number"
                            placeholder={
                              groupNuit ? groupNuit.toString() : "Nenhum"
                            }
                            value={groupNuit}
                            // isDisabled={groupType === '' ? true : false}
                            keyboardType="numeric"
                            onChangeText={(newNuit: any) => {
                              setErrors((prev) => ({ ...prev, groupNuit: "" }));
                              setGroupNuit(newNuit);
                            }}
                          />
                          {"groupNuit" in errors ? (
                            <FormControl.ErrorMessage
                              leftIcon={
                                <Icon
                                  name="error-outline"
                                  size={16}
                                  color="red"
                                />
                              }
                              _text={{ fontSize: "xs" }}
                            >
                               {errors?.groupNuit}
                            </FormControl.ErrorMessage>
                          ) : (
                            <FormControl.HelperText></FormControl.HelperText>
                          )}
                        </FormControl>


                        <FormControl
                          isInvalid={"groupNuel" in errors}
                          isRequired
                        >
                          <FormControl.Label>NUEL</FormControl.Label>
                          <CustomInput
                            width="100%"
                            type="number"
                            placeholder={
                              groupNuel ? groupNuel.toString() : "Nenhum"
                            }
                            value={groupNuel}
                            // isDisabled={groupType === '' ? true : false}
                            keyboardType="numeric"
                            onChangeText={(newNuel: any) => {
                              setErrors((prev) => ({ ...prev, groupNuel: "" }));
                              setGroupNuel(newNuel);
                            }}
                          />
                          {"groupNuel" in errors ? (
                            <FormControl.ErrorMessage
                              leftIcon={
                                <Icon
                                  name="error-outline"
                                  size={16}
                                  color="red"
                                />
                              }
                              _text={{ fontSize: "xs" }}
                            >
                              {errors?.groupNuel}
                            </FormControl.ErrorMessage>
                          ) : (
                            <FormControl.HelperText></FormControl.HelperText>
                          )}
                        </FormControl>
                      </>
                    )}
                  </Stack>
                )}
            </>

            <>
              {dataToBeUpdated === "groupMembers" &&
                resourceName === "Group" && (
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
                              color: COLORS.main,
                            }}
                            title="Activo"
                            checked={isGroupActive}
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
                                color={COLORS.main}
                                size={30}
                                iconStyle={{ marginRight: 1 }}
                              />
                            }

                            // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
                            onPress={() => {
                              setIsGroupInactive(false);
                              setIsGroupActive(true);
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
                              color: COLORS.main,
                            }}
                            title="Inactivo"
                            checked={isGroupInactive}
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
                                color={COLORS.main}
                                size={30}
                                iconStyle={{ marginRight: 1 }}
                              />
                            }

                            // @ts-expect-error TS(2322): Type '{ center: true; fontFamily: string; containe... Remove this comment to see the full error message
                            onPress={() => {
                              setIsGroupInactive(true);
                              setIsGroupActive(false);
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
                          groupMembersNumber
                            ? groupMembersNumber?.toString()
                            : ""
                        }
                        onChangeText={(groupMembers: any) => {
                          setErrors((prev) => ({
                            ...prev,
                            groupMembersNumber: "",
                          }));
                          setGroupMembersNumber(groupMembers);
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

                    <FormControl
                      isInvalid={"groupWomenNumber" in errors}
                      isRequired
                    >
                      <FormControl.Label>Total de mulheres</FormControl.Label>
                      <CustomInput
                        width="100%"
                        type="number"
                        placeholder="Número de mulheres"
                        textAlign={"center"}
                        isDisabled={groupMembersNumber === "" ? true : false}
                        value={
                          groupWomenNumber ? groupWomenNumber?.toString() : ""
                        }
                        keyboardType="numeric"
                        onChangeText={(womenNumber: any) => {
                          setErrors((prev) => ({
                            ...prev,
                            groupWomenNumber: "",
                          }));
                          setGroupWomenNumber(womenNumber);
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
            </>

            <Button
              title="Confirmar Dados"
              titleStyle={{
                color: COLORS.ghostwhite,
                fontFamily: "JosefinSans-Bold",
              }}
              iconPosition="right"
              containerStyle={{
                backgroundColor: COLORS.main,
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
                      groupNuel,
                      oldGroupNuit,
                      oldGroupNuel,

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
                  return;
                }
                onConfirmUpdate(dataToBeUpdated, resourceName);
                setIsOverlayVisible(false);
                setIsConfirmDataVisible(true);
              }}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EditGroupData;
