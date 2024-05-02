import { View, Text, SafeAreaView, ScrollView, Image, Pressable, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Animated, { Layout, SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from "react-native-reanimated";
import COLORS from "../../consts/colors";
import tailwind from "twrnc";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";


import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";

import CustomDivider from "../../components/Divider/CustomDivider";
import { roles } from "../../consts/roles";
import { errorMessages } from "../../consts/errorMessages";
import { secrets } from "../../secrets";
import AwesomeAlert from "react-native-awesome-alerts";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faBook, faClose, faCog, faEnvelope, faFileEdit, faHome, faMailBulk, faMessage, faPhone, faSignOut, faUser, faUserCircle, faVoicemail } from "@fortawesome/free-solid-svg-icons";
import UserGoalEdit from "../../components/UserGoalEdit/UserGoalEdit";
import AppearanceMode from "../../components/Modals/AppearanceMode";
import { useColorScheme } from "nativewind";
import tw from "twrnc";
const { useRealm, useQuery } = realmContext;

const UserProfileScreen = ({
  route,
  navigation
}: any) => {
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;
  const [isGoalUpdateVisible, setIsGoalUpdateVisible] = useState(false);
  const [isAppearanceModeModalVisible, setIsAppearanceModeModalVisible] = useState(false);
  const bottomSheetRef = useRef(null);


  // const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
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

  const [themeMode, setThemeMode] = useState("");
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const snapPoints = useMemo(() => ["25%", "40%", "60",], []);

  const handlePresentModalPress = useCallback(() => {

    // @ts-expect-error TS(2339): Property 'present' does not exist on type 'never'.
    bottomSheetRef?.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {

    // @ts-expect-error TS(2339): Property 'dismiss' does not exist on type 'never'.
    bottomSheetRef?.current?.dismiss();
    // setPresentGroupMemberOptions(false);
    // setPresentFarmlandMenu(false);
  }, []);

  useEffect(() => {


  }, [themeMode]);

  // console.log("colorscheme:", colorScheme);



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

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        className={"flex flex-1 bg-neutral-100 dark:bg-gray-900"}
      >
        {/* <Text>Hello 1</Text> */}
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
              // setIsPhotoModalVisible(true);
            }
            setAlert(false);
          }}
        />

        <Animated.View
          entering={SlideInRight.duration(700)}
          exiting={SlideOutLeft.duration(600)}
          // layout={Layout}
          style={tailwind`flex-1 p-4`}

        >
          <Pressable onPress={() => navigation.goBack()} >
            <FontAwesomeIcon icon={faArrowLeft} size={20} color={COLORS.grey} />
          </Pressable>

          <View className="mx-auto my-4">
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
                <Image
                  source={{ uri: customUserData?.image }}
                  style={{
                    width: 150,
                    height: 150,
                    borderColor: COLORS.main,
                    borderWidth: 2,
                    marginHorizontal: 3,
                    borderRadius: 120,
                  }}
                />

              )}

              {!customUserData?.image && (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  // name="account-circle"
                  size={100}
                  color={COLORS.lightgrey}
                />
              )}
            </TouchableOpacity>
          </View>
          <View>
            <Text
              className="text-xl font-semibold text-gray-600 text-center"
            >
              {customUserData?.name}
            </Text>
            <Text
              className="text-xs font-normal text-center text-gray-500"
            >
              (
              {customUserData?.role?.includes(roles.coopManager)
                ? roles.coopManager
                : customUserData?.role}
              )
            </Text>
          </View>

          {/* <View className="mx-auto"> */}

          <View className="flex flex-row flex-wrap gap-3 justify-between items-center my-5">
            <View
              className="flex flex-col justify-between my-1 items-center"
            >
              <FontAwesomeIcon
                icon={faHome}
                size={20}
                color={COLORS.grey}
              />
              {roles.haveReadAndWritePermissions.some(role => role.includes(customUserData?.role)) &&
                <Text
                  className="text-xs font-normal text-gray-500 text-center"
                >
                  {customUserData?.userDistrict}
                </Text>
              }

              {!roles.haveReadAndWritePermissions.some(role => role.includes(customUserData?.role)) &&
                <Text
                  className="text-xs font-normal text-gray-500 text-center"
                >
                  {customUserData?.userProvince}
                </Text>
              }
            </View>

            <View
              className="flex flex-col justify-between my-1 items-center"
            >
              <FontAwesomeIcon
                icon={faPhone}
                size={20}
                color={COLORS.grey}
              />

              <Text
                className="text-xs font-normal text-gray-500"
              >{customUserData?.phone}</Text>
            </View>

            <View
              className="flex flex-col justify-between my-1 items-center"
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                size={20}
                color={COLORS.grey}
              />
              <Text
                className="text-xs font-normal text-gray-500"
              >{customUserData?.email}</Text>
            </View>
          </View>
          {/* </View> */}

          <CustomDivider />

          <View
            className="py-6 gap-2"
          >
            <TouchableOpacity disabled onPress={() => { }}
              className="flex flex-row gap-2 disabled:text-gray-300"
            >
              <FontAwesomeIcon icon={faBook} size={20} color={COLORS.lightestgrey} />
              <Text
                className="text-gray-500 text-sm font-normal"
              >
                Manual de usuários
              </Text>
            </TouchableOpacity>


            {(customUserData?.role.includes(roles.provincialManager) ||

              // @ts-expect-error TS(2571): Object is of type 'unknown'.
              customUserData?.email.includes("connectcaju2023")) && (
                <TouchableOpacity
                  onPress={() => {
                    setIsGoalUpdateVisible(true);
                  }}
                  className="rounded-md flex flex-row gap-2 border-gray-500"
                >
                  <FontAwesomeIcon icon={faFileEdit} size={20} color={COLORS.main} />
                  <Text
                    className="text-green-700 text-sm font-normal"
                  >
                    Actualizar metas
                  </Text>
                </TouchableOpacity>
              )}
          </View>
          <View className="flex-1 justify-end pb-2 gap-2">

            <TouchableOpacity
              onPress={() => {
                // user?.logOut();
                handlePresentModalPress();


              }}
              className="rounded-md flex flex-row self-start gap-2"
            >
              <FontAwesomeIcon icon={faCog} size={20} color={COLORS.grey} />
              <Text
                className="text-slate-500 text-md font-normal"
              >
                Definições
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                user?.logOut();
              }}
              className="rounded-md flex flex-row self-start gap-2"
            >

              <FontAwesomeIcon icon={faSignOut} size={20} color={COLORS.grey} />
              <Text
                className="text-slate-500 text-md font-normal rounded-"
              >
                Terminar sessão
              </Text>
            </TouchableOpacity>
          </View>
          <BottomSheetModal
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={() => { }}
            backgroundStyle={tw`bg-neutral-100 flex-1 border-t border-gray-300 rounded-t-md dark:bg-gray-900`}
          >
            <Pressable
              onPress={handleDismissModalPress}
              style={{
                // alignSelf: 'flex-start',
                padding: 10,
                position: "absolute",
                top: -15,
                right: 3,
              }}

            >
              <FontAwesomeIcon icon={faClose} size={20} color={COLORS.grey} />
            </Pressable>

            <View className="p-4">
              <Text className="text-gray-600 text-base font-semibold mb-3">Exibição</Text>

              <TouchableOpacity
                onPress={() => {
                  handleDismissModalPress();
                  setIsAppearanceModeModalVisible(true);
                }}
                className="flex flex-col"
              >
                <View className="flex flex-row items-center">
                  <Text className="text-gray-500 text-lg w-12">☀</Text>
                  <Text className="text-gray-600 text-sm font-normal w-20">Fundo</Text>
                </View>
                <Text className="pl-12 text-xs -mt-1 text-gray-500">Branco (por padrão)</Text>
              </TouchableOpacity>

            </View>


            <Pressable
              onPress={handleDismissModalPress}
              className="justify-end flex-1 items-center pb-4"
            >
              <Text className="text-ms font-normal text-gray-600 underline">Cancelar</Text>
            </Pressable>
          </BottomSheetModal>
        </Animated.View>
        <UserGoalEdit
          isGoalUpdateVisible={isGoalUpdateVisible}
          setIsGoalUpdateVisible={setIsGoalUpdateVisible}
        />
        <AppearanceMode
          isAppearanceModeModalVisible={isAppearanceModeModalVisible}
          setIsAppearanceModeModalVisible={setIsAppearanceModeModalVisible}
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default UserProfileScreen;
