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
import TickComponent from "../../components/LottieComponents/TickComponent";
import GroupModal from "../../components/Modals/GroupModal";
import InstitutionModal from "../../components/Modals/InstitutionModal";
import DuplicatesAlert from "../../components/Alerts/DuplicatesAlert";
import FarmerTypeRadioButtons from "../../components/RadioButton/FarmerTypeRadioButtons";
import SuccessAlert from "../../components/Alerts/SuccessAlert";

import IndividualFarmerForm from "./IndividualFarmerForm";
import InstitutionFarmerForm from "./InstitutionFarmerForm";
import GroupFarmerForm from "./GroupFarmerForm";
import COLORS from "../../consts/colors";
import { farmerTypes } from "../../consts/farmerTypes";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { backgroundStyle } from "../../styles/globals";
import { useActorStore } from "../../app/stores/actorStore";

import { realmContext } from "../../models/realmContext";
import { useInstitutionStore } from "../../app/stores/institutionStore";
import { useCoopStore } from "../../app/stores/coopStore";
const { useRealm } = realmContext;

export default function FarmerRegistration({ route, navigation }: any) {
  const customUserData = route.params.customUserData;
  const { actorData, updateActorField, validateActorForm } = useActorStore();
  const validateInstitutionForm = useInstitutionStore().validateInstitutionForm;
  const { coopData, validateCoopForm } = useCoopStore();
  const exportedFarmerType = route.params?.farmerType;

   // address
  const [selectedAddressAdminPosts, setSelectedAddressAdminPosts] = useState(
    [],
  );

  // handle modal view
  const [modalVisible, setModalVisible] = useState(false);
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);

  const [errorAlert, setErrorAlert] = useState(false);

  const [errors, setErrors] = useState({});

  const [farmerType, setFarmerType] = useState(exportedFarmerType);


  // -------------------------------------------------------------
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);

  // farmers suspected duplicates
  const [suspectedDuplicates, setSuspectedDuplicates] = useState([]);

  const handleSubmitFormData = () => {
    if (farmerType?.includes(farmerTypes.farmer)) {
      if (!validateActorForm()) {
        setErrorAlert(true);
        return;
      }
      navigation.navigate("ActorFormDataPreview");
    } else if (farmerType?.includes(farmerTypes.institution)) {
      if (!validateInstitutionForm()) {
        setErrorAlert(true);
        return;
      }
      navigation.navigate("InstitutionFormDataPreview");
    }
    else if (farmerType?.includes(farmerTypes.group)) {
      if (!validateCoopForm()) {
        setErrorAlert(true);
        return;
      }
      navigation.navigate("CoopFormDataPreview");
    }
    
  };

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
  }, [
    customUserData,
    actorData?.birthPlace.district,
    actorData?.birthPlace.province,
  ]);

  useEffect(() => {
    setLoadingActivityIndicator(true);
  }, [navigation, farmerType]);

  useEffect(() => {
    updateActorField("address", {
      ...actorData.address,
      province: customUserData?.userProvince,
    });
    updateActorField("address", {
      ...actorData.address,
      district: customUserData?.userDistrict,
    });
  }, []);

  return (
    <SafeAreaView className={`flex flex-1 flex-col justify-center`}>
      <View className="border-b-2 border-b-gray-100 px-3 bg-white dark:bg-black min-h-[50px]">
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

        <View>
          <View className="flex flex-row">
            <Pressable
              className="absolute left-1 top-2 flex flex-row items-center"
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" color={COLORS.black} size={30} />
            </Pressable>

            <View className="flex justify-center items-center py-2 w-full">
              <Text className="text-black dark:text-black font-bold text-xl">
                Registo de Produtor
              </Text>
            </View>
          </View>
        </View>
        {/* Radio Buttons allowing to choose the farmerType */}
        <FarmerTypeRadioButtons
          farmerType={farmerType}
          setFarmerType={setFarmerType}
        />
      </View>

      <KeyboardAwareScrollView
        decelerationRate={"normal"}
        fadingEdgeLength={2}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
        className="px-3 pt-10  flex flex-1"
      >
        {loadingActivitiyIndicator && (
          <CustomActivityIndicator
            loadingActivitiyIndicator={loadingActivitiyIndicator}
            setLoadingActivityIndicator={setLoadingActivityIndicator}
          />
        )}

        {/* Data collecting form  */}
        <Box alignItems={"center"}>
          {/* Individual Actor data collecting form */}
          {farmerType === farmerTypes.farmer && (
            <IndividualFarmerForm
              selectedAddressAdminPosts={selectedAddressAdminPosts}
            />
          )}

          {/* Institution data collecting form */}
          {farmerType === farmerTypes.institution && (
            <InstitutionFarmerForm
              selectedAddressAdminPosts={selectedAddressAdminPosts}
            />
          )}

          {/* Cooperative data collecting form */}
          {farmerType === farmerTypes.group && (
            <GroupFarmerForm
              selectedAddressAdminPosts={selectedAddressAdminPosts}
            />
          )}

          <Center my="15" w="94%">
            {farmerType !== "" ? (
              <PrimaryButton
                onPress={handleSubmitFormData}
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
          <Box>

            <DuplicatesAlert
              suspectedDuplicates={suspectedDuplicates}
              setModalVisible={setModalVisible}
              isDuplicateModalVisible={isDuplicateModalVisible}
              setIsDuplicateModalVisible={setIsDuplicateModalVisible}
            />
          </Box>
        </Box>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
