/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import {
  View,
  Text,
  // InteractionManager,
  // SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { Box, Stack, Center } from "native-base";
import { Icon, Overlay } from "@rneui/themed";
// import { useFocusEffect } from "@react-navigation/native";
// import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import COLORS from "../../consts/colors";
// import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
// import { months } from "../../helpers/dates";
import CustomDivider from "../../components/Divider/CustomDivider";
import PhotoModal from "../Modals/PhotoModal";
import { roles } from "../../consts/roles";
import styles from "./styles";
import { secrets } from "../../secrets";
import { errorMessages } from "../../consts/errorMessages";

// import { useUser, useApp } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import AwesomeAlert from "react-native-awesome-alerts";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faMessage, faPhone } from "@fortawesome/free-solid-svg-icons";
const { useRealm, useQuery, useObject } = realmContext;

export default function UserProfile({
  user,
  setIsGoalUpdateVisible,
  isUserProfileVisible,
  setIsUserProfileVisible
}: any) {
  // const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const realm = useRealm();
  const customUserData = user?.customData;
  // const currentUserData = useQuery('User').filtered(`userId =="${customUserData.userId}"`)[0];

  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [isAddPhoto, setIsAddPhoto] = useState(false);

  //-----------------------------------------------------
  const [titleAlert, setTitleAlert] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showConfirmButton, setShowConfirmButtom] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [cancelText, setCancelText] = useState("");
  const [alert, setAlert] = useState(false);
  // ----------------------------------------------------

  // on user registration
  const updateUserImage = async (userId: any, imageString: any) => {
    // try to register new user
    try {
      const mongo = user.mongoClient(secrets.serviceName);
      const collection = mongo
        .db(secrets.databaseName)
        .collection(secrets.userCollectionName);

      // save custom user data
      const result = await collection.updateOne(
        {
          userId: userId,
        },
        {
          $set: { image: imageString },
        },
      );
      const customUserData = await user.refreshCustomData();
    } catch (error) {
      // console.log('Failed to save image: ', { cause: error })
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      if (error.includes(errorMessages.network.logFlag)) {
        // Alert message
        setTitleAlert(errorMessages.network.title);
        setMessageAlert(errorMessages.network.message);
        setShowCancelButton(errorMessages.network.showCancelButton);
        setShowConfirmButtom(errorMessages.network.showCancelButton);
        setConfirmText(errorMessages.network.confirmText);
        setCancelText(errorMessages.network.cancelText);
        setAlert(true);
      } else {
        // Alert message
        setTitleAlert(errorMessages.server.title);
        setMessageAlert(errorMessages.server.message);
        setShowCancelButton(errorMessages.server.showCancelButton);
        // @ts-expect-error TS(2339): Property 'service' does not exist on type '{ autom... Remove this comment to see the full error message
        setShowConfirmButtom(errorMessages.service.showConfirmButton);
        setConfirmText(errorMessages.server.confirmText);
        setCancelText(errorMessages.server.cancelText);
        setAlert(true);
      }
      return;
    }
  };


  const toggleOverlay = () => {
    setIsUserProfileVisible(!isUserProfileVisible);
  };

  return (
    <Overlay
      overlayStyle={styles.container}
      isVisible={isUserProfileVisible}
      onBackdropPress={toggleOverlay}
    >
      <AwesomeAlert
        show={alert}
        showProgress={false}
        title={titleAlert}
        message={messageAlert}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={showCancelButton}
        showConfirmButton={showConfirmButton}
        cancelText={cancelText}
        confirmText={confirmText}
        confirmButtonColor={COLORS.main}
        cancelButtonColor={COLORS.grey}
        onCancelPressed={() => {
          if (isAddPhoto) {
            setIsAddPhoto(false);
          }
          setAlert(false);
        }}
        onConfirmPressed={() => {
          if (isAddPhoto) {
            setIsAddPhoto(false);
            setIsPhotoModalVisible(true);
          }
          setAlert(false);
        }}
      />

      // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; style: { f... Remove this comment to see the full error message
      <Box w="100%" style={{ flex: 1 }}>
        <Stack w="100%" direction="row">
          <Box w="10%">
            <Icon
              name="arrow-back"
              color={COLORS.grey}
              size={25}
              onPress={() => {
                setIsUserProfileVisible(false);
              }}
            />
          </Box>
        </Stack>

        <TouchableOpacity
          disabled={true}
          onPress={() => {
            setIsAddPhoto(true);
            setTitleAlert(errorMessages.addPhoto.title);
            setMessageAlert(errorMessages.addPhoto.message);
            setShowCancelButton(errorMessages.addPhoto.showCancelButton);
            setShowConfirmButtom(
              errorMessages.addPhoto.showConfirmButton,
            );
            setCancelText(errorMessages.addPhoto.cancelText);
            setConfirmText(errorMessages.addPhoto.confirmText);
            setAlert(true);
          }}
        >
          {customUserData?.image && (
            <Box>
              <Image
                source={{ uri: customUserData?.image }}
                style={styles.images}
              />
            </Box>
          )}

          {!customUserData?.image && (
            <Box>
              <Icon
                name="account-circle"
                size={200}
                color={COLORS.lightgrey}
              />
            </Box>
          )}
        </TouchableOpacity>

        <Box>
          <Text
            className="text-xl font-semibold text-gray-600 text-center"
          >
            {customUserData?.name}
          </Text>
          <Text
            className="text-md font-normal text-center text-gray-400"
          >
            (
            {customUserData?.role?.includes(roles.coopManager)
              ? roles.coopManager
              : customUserData?.role}
            )
          </Text>
        </Box>

        <View
          className="mx-2 py-4 flex flex-row justify-between flex-wrap gap-4"
        >
          <View
            className="flex flex-col justify-between my-1"
          >
            <Icon
              name="home"
              size={20}
              color={COLORS.grey}
            />

            <Text
              className="text-xs font-normal text-gray-400 text-center"
            >
              {customUserData?.userProvince}
            </Text>
            {roles.haveReadAndWritePermissions.some(role => role.includes(customUserData?.role)) &&
              <Text
                className="text-xs font-normal text-gray-400 text-center -mb-3"
              >
                {customUserData?.userDistrict}
              </Text>
            }
          </View>
          <View
            className="flex flex-col justify-between my-1"
          >
            <Icon
              name="phone"
              size={20}
              color={COLORS.grey}
            />

            <Text
              className="text-xs font-normal text-gray-400"
            >{customUserData?.phone}</Text>
          </View>
          <View
            className="flex flex-col justify-between my-1"
          >
            <Icon
              name="email"
              size={20}
              color={COLORS.grey}
            />
            <Text
              className="text-xs font-normal text-gray-400"
            >{customUserData?.email}</Text>
          </View>
        </View>

        <CustomDivider />
        <View
          className="w-full mx-2 flex flex-col gap-4 mt-2 "
        >

          {(customUserData?.role.includes(roles.provincialManager) ||
            customUserData?.email.includes("connectcaju2023")) && (
              <TouchableOpacity
                onPress={() => {
                  setIsGoalUpdateVisible(true);
                }}
                className="rounded-md flex flex-row gap-4 border-gray-400"
              >
                <Icon name="update" size={25} color={COLORS.main} />
                <Text
                  className="text-green-700 text-md font-normal"
                >
                  Actualizar metas
                </Text>
              </TouchableOpacity>
            )}


          <TouchableOpacity disabled onPress={() => { }}
            className="rounded-md flex flex-row gap-4 border-gray-400"
          >
            <Icon
              name="integration-instructions"
              size={25}
              color={COLORS.main}
            />
            <Text
              className="text-green-700 text-md font-normal"
            >
              Manual de usuários
            </Text>
          </TouchableOpacity>
        </View>
      </Box>

      <View className="flex flex-col gap-1 mb-4 ml-1">
        <TouchableOpacity
          onPress={() => {
            // user?.logOut();
          }}
          className="rounded-md flex flex-row self-start gap-2"
        >

          <Icon name="settings" size={25} color={COLORS.grey} />
          <Text
            className="text-slate-400 text-md font-normal"
          >
            Configurações
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            user?.logOut();
          }}
          className="rounded-md flex flex-row self-start gap-2"
        >

          <Icon name="logout" size={25} color={COLORS.grey} />
          <Text
            className="text-slate-400 text-md font-normal"
          >
            Terminar sessão
          </Text>
        </TouchableOpacity>
      </View>


      <PhotoModal
        realm={realm}
        photoOwner={customUserData}
        photoOwnerType={"Usuário"}
        updateUserImage={updateUserImage}
        isPhotoModalVisible={isPhotoModalVisible}
        setIsPhotoModalVisible={setIsPhotoModalVisible}
      />
    </Overlay>
  );
}
