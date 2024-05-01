import { Text, SafeAreaView, Pressable, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Box, Stack, Center } from "native-base";
import { Icon, Button } from "@rneui/themed";
import AwesomeAlert from "react-native-awesome-alerts";
import { KeyboardAwareScrollView } from "react-native-keyboard-tools";
import administrativePosts from "../../consts/administrativePosts";
import styles from "./styles";
import IndividualModal from "../../components/Modals/IndividualModal";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import validateIndividualFarmerData from "../../helpers/validateIndividualFarmerData";
import validateInstitutionFarmerData from "../../helpers/validateInstitutionFarmerData";
import validateGroupFarmerData from "../../helpers/validateGroupFarmerData";
import TickComponent from "../../components/LottieComponents/TickComponent";
import GroupModal from "../../components/Modals/GroupModal";
import InstitutionModal from "../../components/Modals/InstitutionModal";

import { generateUAID } from "../../helpers/generateUAID";
import DuplicatesAlert from "../../components/Alerts/DuplicatesAlert";
import { detectDuplicates } from "../../helpers/detectDuplicates";
import FarmerTypeRadioButtons from "../../components/RadioButton/FarmerTypeRadioButtons";
import SuccessAlert from "../../components/Alerts/SuccessAlert";

import IndividualFarmerForm from "./IndividualFarmerForm";
import InstitutionFarmerForm from "./InstitutionFarmerForm";
import GroupFarmerForm from "./GroupFarmerForm";
import COLORS from "../../consts/colors";

import { realmContext } from "../../models/realmContext";
import { generateUniqueNumber } from "../../helpers/generateUniqueNumber";
import { dateLimits } from "../../helpers/dates";
import { farmerTypes } from "../../consts/farmerTypes";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { backgroundStyle } from "../../styles/globals";
const { useRealm } = realmContext;

export default function FarmerRegistration({
  route,
  navigation
}: any) {

  const customUserData = route.params.customUserData;
  const exportedFarmerType = route.params?.farmerType || "";

  const realm = useRealm();
  const [gender, setGender] = useState<{ label: string; value: string }>();
  const [familySize, setFamilySize] = useState("");

  // address
  const [selectedAddressAdminPosts, setSelectedAddressAdminPosts] = useState([]);
  const [addressAdminPost, setAddressAdminPost] = useState("");
  const [addressVillage, setAddressVillage] = useState("");

  // birth place
  const [birthProvince, setBirthProvince] = useState("");
  const [birthDistrict, setBirthDistrict] = useState("");
  const [birthAdminPost, setBirthAdminPost] = useState("");

  // handle modal view
  const [modalVisible, setModalVisible] = useState(false);
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);

  const [errorAlert, setErrorAlert] = useState(false);

  const [birthDate, setBirthDate] = useState(new Date(dateLimits.maximumDate));

  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");

  const [isSprayingAgent, setIsSprayingAgent] = useState(false);
  const [isNotSprayingAgent, setIsNotSprayingAgent] = useState(false);
  const [surname, setSurname] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState(null);
  const [secondaryPhone, setSecondaryPhone] = useState(null);
  const [nuit, setNuit] = useState(null);
  const [isGroupMember, setIsGroupMember] = useState(false);
  const [isNotGroupMember, setIsNotGroupMember] = useState(false);

  const [errors, setErrors] = useState({});
  const [farmerData, setFarmerData] = useState({});

  const [farmerType, setFarmerType] = useState(exportedFarmerType);

  // Group states
  const [groupType, setGroupType] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupAdminPost, setGroupAdminPost] = useState("");
  const [groupVillage, setGroupVillage] = useState("");
  const [groupOperatingLicence, setGroupOperatingLicence] = useState("");
  const [groupNuit, setGroupNuit] = useState("");
  const [groupNuel, setGroupNuel] = useState("");
  const [groupAffiliationYear, setGroupAffiliationYear] = useState("");
  const [groupMembersNumber, setGroupMembersNumber] = useState("");
  const [groupWomenNumber, setGroupWomenNumber] = useState("");
  const [groupGoals, setGroupGoals] = useState([]);
  const [groupCreationYear, setGroupCreationYear] = useState("");
  const [groupLegalStatus, setGroupLegalStatus] = useState("");
  const [isGroupActive, setIsGroupActive] = useState(false);
  const [isGroupInactive, setIsGroupInactive] = useState(false);

  // Instution states
  const [institutionType, setInstitutionType] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionManagerName, setInstitutionManagerName] = useState("");
  const [institutionManagerPhone, setInstitutionManagerPhone] = useState("");
  const [institutionAdminPost, setInstitutionAdminPost] = useState("");
  const [institutionVillage, setInstitutionVillage] = useState("");
  const [institutionNuit, setInstitutionNuit] = useState("");
  const [isPrivateInstitution, setIsPrivateInstitution] = useState(false);
  const [institutionLicence, setInstitutionLicence] = useState("");
  const [isInstitutionPublic, setIsInstitutionPublic] = useState(false);
  const [isInstitutionPrivate, setIsInstitutionPrivate] = useState(false);

  // -------------------------------------------------------------
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);
  const [isCoordinatesModalVisible, setIsCoordinatesModalVisible] =
    useState(false);

  // farmers suspected duplicates
  const [suspectedDuplicates, setSuspectedDuplicates] = useState([]);

  const [farmerItem, setFarmerItem] = useState({});


  const [actor, setActor] = useState();
  const [actorCategory, setActorCategory] = useState();

  const addFarmer = (farmerType: any, realm: any, isAllowed = false) => {
    let farmerData;
    let retrievedFarmerData;

    if (farmerType === farmerTypes.farmer) {
      farmerData = {
        isSprayingAgent,
        isNotSprayingAgent,
        surname,
        otherNames,
        gender,
        familySize,
        birthDate,
        birthProvince,
        birthDistrict,
        birthAdminPost,
        addressProvince: customUserData?.userProvince,
        addressDistrict: customUserData?.userDistrict,
        addressAdminPost,
        addressVillage,
        primaryPhone,
        secondaryPhone,
        docType,
        docNumber,
        nuit,
        isGroupMember,
        isNotGroupMember,
      };
      if (!validateIndividualFarmerData(farmerData, errors, setErrors)) {
        setErrorAlert(true);
        return;
      }
      retrievedFarmerData = validateIndividualFarmerData(
        farmerData,
        errors,
        setErrors,
      );

      // generate actor identifier
      let identifier = generateUniqueNumber(

        // @ts-expect-error TS(2339): Property 'address' does not exist on type 'boolean... Remove this comment to see the full error message
        retrievedFarmerData.address,
        farmerTypes.farmer,
      );
      let foundIdentierMatches = realm
        .objects("Actor")
        .filtered("identifier == $0", identifier);

      // keep checking until no match is found
      while (foundIdentierMatches?.length > 0) {
        identifier = generateUniqueNumber(

          // @ts-expect-error TS(2339): Property 'address' does not exist on type 'boolean... Remove this comment to see the full error message
          retrievedFarmerData.address,
          farmerTypes.farmer,
        );
        foundIdentierMatches = realm
          .objects("Actor")
          .filtered("identifier == $0", identifier);
      }


      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      retrievedFarmerData["identifier"] = identifier;

      setFarmerData(retrievedFarmerData);

      // not allowed if the user decided to proceed
      // on with registration after the alert on suspecious duplicates
      if (!isAllowed) {
        const uaidData = {

          // @ts-expect-error TS(2339): Property 'names' does not exist on type 'boolean |... Remove this comment to see the full error message
          names: retrievedFarmerData.names,

          // @ts-expect-error TS(2339): Property 'birthDate' does not exist on type 'boole... Remove this comment to see the full error message
          birthDate: retrievedFarmerData.birthDate,

          // @ts-expect-error TS(2339): Property 'birthPlace' does not exist on type 'bool... Remove this comment to see the full error message
          birthPlace: retrievedFarmerData.birthPlace,

          // @ts-expect-error TS(2339): Property 'address' does not exist on type 'boolean... Remove this comment to see the full error message
          address: retrievedFarmerData.address,
        };


        const uaid = generateUAID(uaidData);
        let suspected = realm.objects("Actor").filtered("uaid == $0", uaid);
        // let foundSuspects = realm.objects('Actor').filtered(`otherNames`)

        // get more evidence on the duplication attempt
        suspected = detectDuplicates(retrievedFarmerData, suspected);
        if (suspected.length > 0) {
          setSuspectedDuplicates(suspected);
          // setDuplicatesAlert(true);
          setIsDuplicateModalVisible(true);
          return;
        }
      }
    } else if (farmerType === farmerTypes.institution) {
      farmerData = {
        isInstitutionPrivate,
        isInstitutionPublic,
        institutionType,
        institutionName,
        institutionAdminPost,
        institutionProvince: customUserData?.userProvince,
        institutionDistrict: customUserData?.userDistrict,
        institutionVillage,
        institutionManagerName,
        institutionManagerPhone,
        institutionNuit,
        isPrivateInstitution,
        institutionLicence,
      };
      if (!validateInstitutionFarmerData(farmerData, errors, setErrors)) {
        setErrorAlert(true);
        return;
      }
      retrievedFarmerData = validateInstitutionFarmerData(
        farmerData,
        errors,
        setErrors,
      );

      // generate actor identifier
      let identifier = generateUniqueNumber(

        // @ts-expect-error TS(2339): Property 'address' does not exist on type 'boolean... Remove this comment to see the full error message
        retrievedFarmerData.address,
        farmerTypes.institution,
      );
      let foundIdentierMatches = realm
        .objects("Institution")
        .filtered("identifier == $0", identifier);

      // keep checking until no match is found
      while (foundIdentierMatches?.length > 0) {
        identifier = generateUniqueNumber(

          // @ts-expect-error TS(2339): Property 'address' does not exist on type 'boolean... Remove this comment to see the full error message
          retrievedFarmerData.address,
          farmerTypes.institution,
        );
        foundIdentierMatches = realm
          .objects("Institution")
          .filtered("identifier == $0", identifier);
      }


      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      retrievedFarmerData["identifier"] = identifier;

      setFarmerData(retrievedFarmerData);

      setFarmerData(retrievedFarmerData);
    } else if (farmerType === farmerTypes.group) {
      farmerData = {
        isGroupActive,
        isGroupInactive,
        groupType,
        groupName,
        groupGoals,
        groupMembersNumber,
        groupWomenNumber,
        groupLegalStatus,
        groupCreationYear,
        groupAffiliationYear,
        groupOperatingLicence,
        groupNuel,
        groupNuit,
        groupProvince: customUserData?.userProvince,
        groupDistrict: customUserData?.userDistrict,
        groupAdminPost,
        groupVillage,

      };

      // @ts-expect-error TS(2554): Expected 3 arguments, but got 4.
      if (!validateGroupFarmerData(farmerData, errors, setErrors, farmerType)) {
        setErrorAlert(true);
        return;
      }
      retrievedFarmerData = validateGroupFarmerData(
        farmerData,
        errors,
        setErrors,

        // @ts-expect-error TS(2554): Expected 3 arguments, but got 4.
        farmerType,
      );

      // generate actor identifier
      let identifier = generateUniqueNumber(

        // @ts-expect-error TS(2339): Property 'address' does not exist on type 'boolean... Remove this comment to see the full error message
        retrievedFarmerData.address,
        farmerTypes.group,
      );
      let foundIdentierMatches = realm
        .objects("Group")
        .filtered("identifier == $0", identifier);

      // keep checking until no match is found
      while (foundIdentierMatches?.length > 0) {

        // @ts-expect-error TS(2339): Property 'address' does not exist on type 'boolean... Remove this comment to see the full error message
        identifier = generateUniqueNumber(retrievedFarmerData.address, farmerTypes.group);
        foundIdentierMatches = realm
          .objects("Group")
          .filtered("identifier == $0", identifier);
      }

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      retrievedFarmerData["identifier"] = identifier;

      setFarmerData(retrievedFarmerData);
    }
    setModalVisible(true);
  };

  useEffect(() => {
    if (customUserData && customUserData.userDistrict) {
      const { userDistrict } = customUserData;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      setSelectedAddressAdminPosts(administrativePosts[userDistrict]);
    }
    if (!birthProvince) {
      setBirthDistrict("");
      setBirthAdminPost("");
    }
    if (!birthDistrict) {
      setBirthAdminPost("");
    }
  }, [customUserData, birthProvince, birthDistrict, birthAdminPost]);

  useEffect(() => {
    setLoadingActivityIndicator(true);

  }, [navigation, farmerType]);


  return (
    <SafeAreaView
      className={`flex flex-1 flex-col justify-center mb-10 ${backgroundStyle}`}
    >
      <Box
        bg={COLORS.fourth}
        w="100%"
        px="3"

        // @ts-expect-error TS(2322): Type '{ children: Element[]; bg: string; w: "100%"... Remove this comment to see the full error message
        style={{
          borderBottomWidth: 2,
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderColor: COLORS.fourth,
        }}
      >
        <AwesomeAlert
          show={errorAlert}
          showProgress={false}
          title="Dados Obrigatórios"
          message="Os campos obrigatórios devem ser BEM preenchidos!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="   OK   "
          confirmButtonColor="#DD6B55"
          onConfirmPressed={() => {
            setErrorAlert(false);
          }}
        />

        <Box >
          <Stack direction="row">
            <Box>
              <Pressable
                style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => navigation.goBack()}
              >
                <Icon
                  name="arrow-back"
                  color={COLORS.black}
                  size={30}
                />
              </Pressable>
            </Box>
            <Box w="100%" alignItems={"center"} pt="1" pb="3">
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "JosefinSans-Bold",
                  fontSize: 24,
                  color: COLORS.black,
                }}
              >
                Registo
              </Text>
            </Box>
            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element; style: { position: stri... Remove this comment to see the full error message
              style={{
                position: "absolute",
                right: 0,
                top: 4,
              }}>
              <Icon name="app-registration" size={40} color={COLORS.grey} />
            </Box>
          </Stack>
        </Box>
      </Box>
      <KeyboardAwareScrollView
        decelerationRate={"normal"}
        fadingEdgeLength={2}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        {/* Data collecting form description */}
        <View
          style={{
            elevation: 1,
            borderWidth: 1,
            borderColor: COLORS.lightgrey,
            backgroundColor: "transparent",

          }}
        >

          {/* Radio Buttons allowing to choose the farmerType */}
          <FarmerTypeRadioButtons
            farmerType={farmerType}
            setFarmerType={setFarmerType}
          />
        </View>
        {/* Data collecting form  */}
        {loadingActivitiyIndicator && (
          <CustomActivityIndicator
            loadingActivitiyIndicator={loadingActivitiyIndicator}
            setLoadingActivityIndicator={setLoadingActivityIndicator}
          />
        )}

        <Box alignItems={"center"}>
          {farmerType === farmerTypes.farmer && (
            <IndividualFarmerForm
              gender={gender}
              setGender={setGender}
              familySize={familySize}
              setFamilySize={setFamilySize}
              selectedAddressAdminPosts={selectedAddressAdminPosts}
              setSelectedAddressAdminPosts={setSelectedAddressAdminPosts}
              addressVillage={addressVillage}
              setAddressVillage={setAddressVillage}
              addressAdminPost={addressAdminPost}
              setAddressAdminPost={setAddressAdminPost}
              birthProvince={birthProvince}
              setBirthProvince={setBirthProvince}
              birthDistrict={birthDistrict}
              setBirthDistrict={setBirthDistrict}
              birthAdminPost={birthAdminPost}
              setBirthAdminPost={setBirthAdminPost}
              birthDate={birthDate}
              setBirthDate={setBirthDate}
              errorAlert={errorAlert}
              setErrorAlert={setErrorAlert}
              setModalVisible={setModalVisible}
              // setDuplicatesAlert={setDuplicatesAlert}
              docType={docType}
              setDocType={setDocType}
              docNumber={docNumber}
              setDocNumber={setDocNumber}
              isSprayingAgent={isSprayingAgent}
              isNotSprayingAgent={isNotSprayingAgent}
              setIsSprayingAgent={setIsSprayingAgent}
              setIsNotSprayingAgent={setIsNotSprayingAgent}
              surname={surname}
              setSurname={setSurname}
              otherNames={otherNames}
              setOtherNames={setOtherNames}
              primaryPhone={primaryPhone}
              setPrimaryPhone={setPrimaryPhone}
              secondaryPhone={secondaryPhone}
              setSecondaryPhone={setSecondaryPhone}
              nuit={nuit}
              setNuit={setNuit}
              isGroupMember={isGroupMember}
              isNotGroupMember={isNotGroupMember}
              setIsGroupMember={setIsGroupMember}
              setIsNotGroupMember={setIsNotGroupMember}
              errors={errors}
              setErrors={setErrors}
            />
          )}

          {/* Group data collecting form */}

          {farmerType === farmerTypes.institution && (
            <InstitutionFarmerForm
              institutionType={institutionType}
              setInstitutionType={setInstitutionType}
              institutionName={institutionName}
              setInstitutionName={setInstitutionName}
              institutionManagerName={institutionManagerName}
              setInstitutionManagerName={setInstitutionManagerName}
              institutionManagerPhone={institutionManagerPhone}
              setInstitutionManagerPhone={setInstitutionManagerPhone}
              institutionAdminPost={institutionAdminPost}
              setInstitutionAdminPost={setInstitutionAdminPost}
              institutionVillage={institutionVillage}
              setInstitutionVillage={setInstitutionVillage}
              institutionNuit={institutionNuit}
              setInstitutionNuit={setInstitutionNuit}
              isPrivateInstitution={isPrivateInstitution}
              setIsPrivateInstitution={setIsPrivateInstitution}
              institutionLicence={institutionLicence}
              setInstitutionLicence={setInstitutionLicence}
              errors={errors}
              setErrors={setErrors}
              // setAddressAdminPosts={setAddressAdminPosts}
              addressAdminPost={addressAdminPost}
              selectedAddressAdminPosts={selectedAddressAdminPosts}
              setSelectedAddressAdminPosts={setSelectedAddressAdminPosts}
              isInstitutionPrivate={isInstitutionPrivate}
              isInstitutionPublic={isInstitutionPublic}
              setIsInstitutionPrivate={setIsInstitutionPrivate}
              setIsInstitutionPublic={setIsInstitutionPublic}
            />
          )}

          {farmerType === farmerTypes.group && (
            <GroupFarmerForm
              groupType={groupType}
              setGroupType={setGroupType}
              groupName={groupName}
              setGroupName={setGroupName}
              groupAdminPost={groupAdminPost}
              setGroupAdminPost={setGroupAdminPost}
              groupVillage={groupVillage}
              setGroupVillage={setGroupVillage}
              groupOperatingLicence={groupOperatingLicence}
              setGroupOperatingLicence={setGroupOperatingLicence}
              groupNuel={groupNuel}
              setGroupNuel={setGroupNuel}
              groupNuit={groupNuit}
              setGroupNuit={setGroupNuit}
              groupAffiliationYear={groupAffiliationYear}
              setGroupAffiliationYear={setGroupAffiliationYear}
              groupMembersNumber={groupMembersNumber}
              setGroupMembersNumber={setGroupMembersNumber}
              groupWomenNumber={groupWomenNumber}
              setGroupWomenNumber={setGroupWomenNumber}
              errors={errors}
              setErrors={setErrors}
              selectedAddressAdminPosts={selectedAddressAdminPosts}
              setSelectedAddressAdminPosts={setSelectedAddressAdminPosts}
              addressAdminPost={addressAdminPost}
              groupGoals={groupGoals}
              setGroupGoals={setGroupGoals}
              groupCreationYear={groupCreationYear}
              setGroupCreationYear={setGroupCreationYear}
              setGroupLegalStatus={setGroupLegalStatus}
              groupLegalStatus={groupLegalStatus}
              isGroupActive={isGroupActive}
              setIsGroupActive={setIsGroupActive}
              isGroupInactive={isGroupInactive}
              setIsGroupInactive={setIsGroupInactive}
            />
          )}

          <Center
            mb="15"
            w="94%"
          >
            {farmerType !== "" ? (
              <PrimaryButton
                onPress={() => addFarmer(farmerType, realm)}
                title="Pré-visualizar dados"
              />
            ) : (
              <Center
                mt="45"
              >
                <TickComponent />
                <View
                  style={{
                    backgroundColor: COLORS.lightestgrey,
                    marginTop: 10,
                    width: 250,
                  }}
                >
                  {farmerType.length === 0 && <Text style={styles.description}>
                    Seleccione o tipo de produtor que pretendes registar
                  </Text>}

                </View>
              </Center>
            )}
          </Center>

          <Center flex={1} px="3">
            {farmerType?.includes(farmerTypes.farmer) && (
              <IndividualModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                farmerData={farmerData}
                farmerType={farmerType}
                setFarmerType={setFarmerType}
                setSurname={setSurname}
                setOtherNames={setOtherNames}
                setIsSprayingAgent={setIsSprayingAgent}
                setGender={setGender}
                setFamilySize={setFamilySize}
                setAddressVillage={setAddressVillage}
                setAddressAdminPost={setAddressAdminPost}
                setPrimaryPhone={setPrimaryPhone}
                setSecondaryPhone={setSecondaryPhone}
                setBirthProvince={setBirthProvince}
                setBirthDistrict={setBirthDistrict}
                setBirthAdminPost={setBirthAdminPost}
                setBirthDate={setBirthDate}
                setDocType={setDocType}
                setDocNumber={setDocNumber}
                setNuit={setNuit}
                setIsGroupMember={setIsGroupMember}
                isGroupMember={isGroupMember}
                setFarmerItem={setFarmerItem}
                farmerItem={farmerItem}
                setIsCoordinatesModalVisible={setIsCoordinatesModalVisible}
                customUserData={customUserData}
                setActor={setActor}
                actor={actor}
                actorCategory={actorCategory}
                setActorCategory={setActorCategory}
              />
            )}
            {farmerType?.includes(farmerTypes.group) && (
              <GroupModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                farmerData={farmerData}
                farmerType={farmerType}
                setFarmerType={setFarmerType}
                setGroupType={setGroupType}
                setGroupName={setGroupName}
                setGroupAffiliationYear={setGroupAffiliationYear}
                setGroupAdminPost={setGroupAdminPost}
                setGroupVillage={setGroupVillage}
                setGroupOperatingLicence={setGroupOperatingLicence}
                setGroupNuit={setGroupNuit}
                setGroupMembersNumber={setGroupMembersNumber}
                setGroupWomenNumber={setGroupWomenNumber}
                setFarmerItem={setFarmerItem}
                farmerItem={farmerItem}
                setIsCoordinatesModalVisible={setIsCoordinatesModalVisible}
                customUserData={customUserData}
              />
            )}
            {farmerType?.includes(farmerTypes.institution) && (
              <InstitutionModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                farmerData={farmerData}
                farmerType={farmerType}
                setFarmerType={setFarmerType}
                setInstitutionType={setInstitutionType}
                setInstitutionName={setInstitutionName}
                setInstitutionAdminPost={setInstitutionAdminPost}
                setInstitutionVillage={setInstitutionVillage}
                setInstitutionManagerName={setInstitutionManagerName}
                setInstitutionManagerPhone={setInstitutionManagerPhone}
                setInstitutionNuit={setInstitutionNuit}
                setIsPrivateInstitution={setIsPrivateInstitution}
                setFarmerItem={setFarmerItem}
                farmerItem={farmerItem}
                setIsCoordinatesModalVisible={setIsCoordinatesModalVisible}
                customUserData={customUserData}
              />
            )}
          </Center>
          <Box>
            <SuccessAlert
              isCoordinatesModalVisible={isCoordinatesModalVisible}
              setIsCoordinatesModalVisible={setIsCoordinatesModalVisible}
              farmerItem={farmerItem}
              flag={"farmer"}
            />
            <DuplicatesAlert
              suspectedDuplicates={suspectedDuplicates}
              setModalVisible={setModalVisible}
              isDuplicateModalVisible={isDuplicateModalVisible}
              setIsDuplicateModalVisible={setIsDuplicateModalVisible}
            />
          </Box>
        </Box>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
