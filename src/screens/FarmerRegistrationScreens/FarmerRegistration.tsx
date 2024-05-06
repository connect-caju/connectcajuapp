import {
  Text,
  SafeAreaView,
  Pressable,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Box, Stack, Center } from "native-base";
import { Icon, Button } from "@rneui/themed";
import AwesomeAlert from "react-native-awesome-alerts";
import { KeyboardAwareScrollView } from "react-native-keyboard-tools";
import FeatherIcon from "react-native-vector-icons/Feather";

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
import { generateUniqueNumber } from "../../helpers/generateUniqueNumber";
import { dateLimits } from "../../helpers/dates";
import { farmerTypes } from "../../consts/farmerTypes";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { backgroundStyle } from "../../styles/globals";
import { useActorStore } from "../../app/stores/actorStore";

import { realmContext } from "../../models/realmContext";
const { useRealm } = realmContext;

export default function FarmerRegistration({ route, navigation }: any) {
  const customUserData = route.params.customUserData;
  const { actorData, updateActorField, validateActorForm } = useActorStore();
  const exportedFarmerType = route.params?.farmerType || "";

  const realm = useRealm();

  // address
  const [selectedAddressAdminPosts, setSelectedAddressAdminPosts] = useState(
    [],
  );

  // handle modal view
  const [modalVisible, setModalVisible] = useState(false);
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);

  const [errorAlert, setErrorAlert] = useState(false);

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

  
  useEffect(() => {
    if (customUserData && customUserData.userDistrict) {
      const { userDistrict } = customUserData;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      setSelectedAddressAdminPosts(administrativePosts[userDistrict]);
    }
    if (!actorData?.birthPlace.province) {
      updateActorField("birthPlace", {
        ...actorData.birthPlace,
        district: "",
      });
      updateActorField("birthPlace", {
        ...actorData.birthPlace,
        adminPost: "",
      });
    }
    if (!actorData?.birthPlace.district) {
      updateActorField("birthPlace", {
        ...actorData.birthPlace,
        adminPost: "",
      });
    }
  }, [customUserData, actorData?.birthPlace.district, actorData?.birthPlace.province]);

  useEffect(() => {
    setLoadingActivityIndicator(true);
  }, [navigation, farmerType]);

  useEffect(() => {
    updateActorField("address", {
      ...actorData.address,
      province: customUserData?.userProvince
    });
    updateActorField("address", {
      ...actorData.address,
      district: customUserData?.userDistrict
    });
  }, []);

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

        <Box>
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
                <Icon name="arrow-back" color={COLORS.black} size={30} />
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
              }}
            >
              <FeatherIcon name="edit" size={30} color={COLORS.black} />
            </Box>
          </Stack>
        </Box>
      </Box>
      {/* Radio Buttons allowing to choose the farmerType */}
      <FarmerTypeRadioButtons
        farmerType={farmerType}
        setFarmerType={setFarmerType}
      />
      <KeyboardAwareScrollView
        decelerationRate={"normal"}
        fadingEdgeLength={2}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
              selectedAddressAdminPosts={selectedAddressAdminPosts}
              setSelectedAddressAdminPosts={setSelectedAddressAdminPosts}
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
              // addressAdminPost={addressAdminPost}
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
              // addressAdminPost={addressAdminPost}
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

          <Center my="15" w="94%">
            {farmerType !== "" ? (
              <PrimaryButton
                onPress={() => {
                  if (farmerType?.includes(farmerTypes.farmer)) {
                    if (!validateActorForm()) {
                      setErrorAlert(true);
                      return;
                    }
                  }
                  navigation.navigate("FormDataPreview", {
                    farmerData: farmerData,
                    farmerType: farmerType,
                  });
                }}
                title="Pré-visualizar dados"
              />
            ) : (
              <Center mt="45">
                <TickComponent />
                <View
                  style={{
                    backgroundColor: COLORS.lightestgrey,
                    marginTop: 10,
                    width: 250,
                  }}
                >
                  {farmerType.length === 0 && (
                    <Text style={styles.description}>
                      Seleccione o tipo de produtor que pretendes registar
                    </Text>
                  )}
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
                // setSurname={setSurname}
                // setOtherNames={setOtherNames}
                // setIsSprayingAgent={setIsSprayingAgent}
                // setGender={setGender}
                // setFamilySize={setFamilySize}
                // setAddressVillage={setAddressVillage}
                // setAddressAdminPost={setAddressAdminPost}
                // setPrimaryPhone={setPrimaryPhone}
                // setSecondaryPhone={setSecondaryPhone}
                // setBirthProvince={setBirthProvince}
                // setBirthDistrict={setBirthDistrict}
                // setBirthAdminPost={setBirthAdminPost}
                // setBirthDate={setBirthDate}
                // setDocType={setDocType}
                // setDocNumber={setDocNumber}
                // setNuit={setNuit}
                // setIsGroupMember={setIsGroupMember}
                // isGroupMember={isGroupMember}
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
