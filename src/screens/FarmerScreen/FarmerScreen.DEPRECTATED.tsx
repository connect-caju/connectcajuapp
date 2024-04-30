/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Pressable,
  StyleSheet,
  Animated as NativeAnimated,
  Easing,
  useNativeDriver,
  Platform,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import { Box, Stack, Center } from "native-base";
import { Divider, Icon, Avatar } from "@rneui/base";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { responsiveFontSize } from "react-native-responsive-dimensions";

import PersonalData from "../../components/PersonalData/PersonalData";
import FarmlandData from "../../components/FarmlandData/FarmlandData";
import COLORS from "../../consts/colors";
import PhotoModal from "../../components/Modals/PhotoModal";

import { roles } from "../../consts/roles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Dimensions } from "react-native";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { SuccessLottie } from "../../components/LottieComponents/SuccessLottie";

const { useRealm, useQuery, useObject } = realmContext;

const singleFarmer = "singleFarmer";
const ownFarmlands = "ownFarmlands";

export default function FarmerScreen({
  route,
  navigation
}: any) {
  const ownerId = route.params.ownerId;
  const farmersIDs = route.params?.farmersIDs;
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;
  const farmer = realm.objectForPrimaryKey("Actor", ownerId);
  const farmlands = realm
    .objects("Farmland")
    .filtered("farmerId == $0", ownerId);
  const [isAddPhoto, setIsAddPhoto] = useState(false);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentNode, setCurrentNode] = useState({
    next: null,
    prev: null,
    current: null,
  });
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);

  const [successLottieVisible, setSuccessLottieVisible] = useState(false);
  // ------------------------------------------------------------------------

  // controle EditFarmerData Component animation
  const scale = useRef(new NativeAnimated.Value(0)).current;
  const bottomSheetRef = useRef(null);
  const onScrollToBottomSheet = useCallback(() => {
    // @ts-expect-error TS(2339): Property 'scrollTo' does not exist on type 'never'... Remove this comment to see the full error message
    bottomSheetRef?.current?.scrollTo(-20000);
  }, []);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Animate by resizing EditFarmerData Component
  const resizeBox = (to: any) => {
    to === 1 && setIsOverlayVisible(true);
    NativeAnimated.timing(scale, {
      toValue: to,
      useNativeDriver: true,
      duration: 400,
      easing: Easing.linear,
    }).start(() => to === 0 && setIsOverlayVisible(false));
  };

  // variables
  const bottomSheetModalRef = useRef(null);

  // ----------------------------------------------------------------------

  // SuccesLottie effect
  useEffect(() => {
    if (successLottieVisible) {
      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(() => {
        setSuccessLottieVisible(false);
      }, 3000);
    }
  }, [successLottieVisible]);

  useEffect(() => {
    if (farmersIDs?.length > 0) {
      // @ts-expect-error TS(2304): Cannot find name 'current'.
      current = farmersIDs.find((node: any) => node.current === ownerId);
      // @ts-expect-error TS(2304): Cannot find name 'current'.
      setCurrentNode(current);
    }
  }, [ownerId]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(singleFarmer);
      mutableSubs.add(realm.objects("Actor").filtered(`_id == "${ownerId}"`), {
        name: singleFarmer,
      });
    });

    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(ownFarmlands);
      mutableSubs.add(
        realm.objects("Farmland").filtered(`farmerId == "${ownerId}"`),
        { name: ownFarmlands },
      );
    });
  }, [realm, refresh]);

  // picker a picture from gallery
  const launchNativeImageLibrary = () => {
    let options = {
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    // @ts-expect-error TS(2345): Argument of type '{ includeBase64: boolean; storag... Remove this comment to see the full error message
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
        console.log("ImagePicker Error: ", response.error);
      } else {
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        const source = { uri: response.assets.uri };

        const imageString =
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          "data:image/jpeg;base64," + response.assets[0].base64;

        realm.write(() => {
          // @ts-expect-error TS(2531): Object is possibly 'null'.
          farmer.image = imageString;
          setLoadingActivityIndicator(true);
        });
      }
    });
  };

  return (
    <SafeAreaView
      style={{
        minHeight: "100%",
        backgroundColor: COLORS.ghostwhite,
      }}
    >
      <AwesomeAlert
        show={isAddPhoto}
        showProgress={false}
        title="Fotografia"
        message="Pretendes carregar uma nova fotografia?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="   Não   "
        confirmText="   Sim   "
        confirmButtonColor={COLORS.main}
        cancelButtonColor={COLORS.danger}
        onCancelPressed={() => {
          setIsAddPhoto(false);
        }}
        onConfirmPressed={() => {
          setIsAddPhoto(false);
        }}
      />

      <View
        style={{
          width: "100%",
          paddingHorizontal: 5,
          paddingVertical: hp("1%"),
          backgroundColor: "#EBEBE4",
          borderTopWidth: 0,
          borderColor: "#EBEBE4",
          borderBottomWidth: 3,
          borderLeftWidth: 3,
          borderRightWidth: 3,
          alignItems: "center",
        }}
      >
        <Stack direction="row" w="100%">
          <Box>
            <Pressable
              onPress={() => {
                navigation.navigate("FarmersListLayout", {
                  farmerType: "Indivíduo",
                });
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 4,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="arrow-back" color={COLORS.main} size={wp("8%")} />
            </Pressable>
          </Box>

          <Box w="100%">
            <Center>
              <Text
                style={{
                  fontFamily: "JosefinSans-Bold",
                  fontSize: responsiveFontSize(2),
                  color: COLORS.main,
                }}
              >
                Produtor Singular
              </Text>

              <Stack direction="row" space={2}>
                <Center>
                  <Text
                    style={{ fontFamily: "JosefinSans-Regular", fonSize: 14 }}
                  ></Text>
                </Center>
                <Center>
                  <Text
                    style={{ fontFamily: "JosefinSans-Regular", fonSize: 14 }}
                  ></Text>
                </Center>
              </Stack>
            </Center>
          </Box>
        </Stack>
      </View>

      <Box
        // @ts-expect-error TS(2322): Type '{ children: null; style: { position: string;... Remove this comment to see the full error message
        style={{
          position: "absolute",
          top: Dimensions.get("window").height / 2,
          left: 0,
          zIndex: 10,
        }}
      >
        {currentNode?.prev && (
          <TouchableOpacity
            style={{
              height: 60,
              width: 30,
              backgroundColor: COLORS.fourth,
              opacity: 0.5,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#470000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              elevation: 1,
            }}
            onPress={() => {
              setLoadingActivityIndicator(true);
              navigation.navigate("Farmer", {
                ownerId: currentNode?.prev,
                farmersIDs,
              });
            }}
          >
            <Icon name="arrow-back-ios" size={40} color={COLORS.ghostwhite} />
          </TouchableOpacity>
        )}
      </Box>

      <Box
        // @ts-expect-error TS(2322): Type '{ children: null; style: { position: string;... Remove this comment to see the full error message
        style={{
          position: "absolute",
          top: Dimensions.get("window").height / 2,
          right: 0,
          zIndex: 10,
        }}
      >
        {currentNode?.next && (
          <TouchableOpacity
            style={{
              height: 60,
              width: 30,
              backgroundColor: COLORS.fourth,
              opacity: 0.5,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#470000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              elevation: 1,
            }}
            onPress={() => {
              setLoadingActivityIndicator(true);
              navigation.navigate("Farmer", {
                ownerId: currentNode?.next,
                farmersIDs,
              });
            }}
          >
            <Icon
              name="arrow-forward-ios"
              size={40}
              color={COLORS.ghostwhite}
            />
          </TouchableOpacity>
        )}
      </Box>

      {loadingActivitiyIndicator ? (
        <CustomActivityIndicator
          loadingActivitiyIndicator={loadingActivitiyIndicator}
          setLoadingActivityIndicator={setLoadingActivityIndicator}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 5,
          }}
        >
          <Box
            w="100%"
            // @ts-expect-error TS(2322): Type '{ children: any[]; w: "100%"; style: { justi... Remove this comment to see the full error message
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: hp("10%"),
              borderRadius: 30,
              borderWidth: 3,
              borderColor: COLORS.pantone,
            }}
          >
            <TouchableOpacity
              // onPress={handlePresentModal}
              onPress={() => {
                navigation.navigate("Camera", {
                  ownerType: "Indivíduo",
                  // @ts-expect-error TS(2339): Property '_id' does not exist on type 'Object<unkn... Remove this comment to see the full error message
                  ownerId: farmer?._id,
                  farmersIDs,
                });
              }}
              style={{
                position: "relative",
                top: -50,
              }}
            >
              // @ts-expect-error TS(2339): Property 'image' does not exist on type 'Object<un... Remove this comment to see the full error message
              {farmer?.image ? (
                <Box>
                  <Image
                    // @ts-expect-error TS(2339): Property 'image' does not exist on type 'Object<un... Remove this comment to see the full error message
                    source={{ uri: farmer?.image }}
                    style={{
                      width: 200,
                      height: 200,
                      borderColor: COLORS.main,
                      marginHorizontal: 3,
                      borderRadius: 120,
                    }}
                  />
                </Box>
              ) : (
                <Box>
                  <Icon
                    style={{
                      position: "relative",
                      top: 10,
                    }}
                    name="account-circle"
                    size={wp("60%")}
                    color={COLORS.lightgrey}
                  />
                  <Box
                    // @ts-expect-error TS(2322): Type '{ children: Element; style: { position: stri... Remove this comment to see the full error message
                    style={{
                      position: "relative",
                      bottom: 50,
                      right: -60,
                      zIndex: 10,
                    }}
                  >
                    <Icon name="add-circle" size={30} color={COLORS.main} />
                  </Box>
                </Box>
              )}
            </TouchableOpacity>

            <Text
              style={{
                color: COLORS.main,
                fontSize: responsiveFontSize(2.5),
                fontFamily: "JosefinSans-Bold",
                textAlign: "center",
                position: "relative",
                top: -50,
              }}
            >
              // @ts-expect-error TS(2339): Property 'names' does not exist on type 'Object<un... Remove this comment to see the full error message
              {farmer?.names?.otherNames} {farmer?.names?.surname}
            </Text>
            // @ts-expect-error TS(2339): Property 'assets' does not exist on type 'Object<u... Remove this comment to see the full error message
            {farmer?.assets?.map((asset: any, index: any) => (
              <Text
                key={index}
                style={{
                  color: COLORS.main,
                  fontSize: responsiveFontSize(1.6),
                  fontFamily: "JosefinSans-Bold",
                  textAlign: "center",
                  position: "relative",
                  top: -50,
                }}
              >
                ({asset.category} {asset.subcategory})
              </Text>
            ))}
          </Box>

          {/* 
        Personal Data Child Component
      */}
          <View
            style={{
              marginTop: 40,
            }}
          >
            <Text
              style={{
                color: COLORS.black,
                fontSize: 16,
                fontFamily: "JosefinSans-Bold",
                textAlign: "right",
                padding: 10,
                letterSpacing: 5,
              }}
            >
              // @ts-expect-error TS(2339): Property 'identifier' does not exist on type 'Obje... Remove this comment to see the full error message
              {farmer?.identifier}
            </Text>
            <PersonalData
              setRefresh={setRefresh}
              refresh={refresh}
              farmer={farmer}
              scale={scale}
              resizeBox={resizeBox}
              isOverlayVisible={isOverlayVisible}
              setIsOverlayVisible={setIsOverlayVisible}
              bottomSheetRef={bottomSheetRef}
              onScrollToBottomSheet={onScrollToBottomSheet}
            />
          </View>

          <Box
            alignItems="stretch"
            w="100%"
            // @ts-expect-error TS(2322): Type '{ children: (false | Element | Element[])[];... Remove this comment to see the full error message
            style={{
              flex: 1,
              paddingVertical: 5,
              marginBottom: 100,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: COLORS.black,
                textAlign: "center",
                fontFamily: "JosefinSans-Bold",
                // paddingVertical: 5,
              }}
            >
              Pomares
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.grey,
                textAlign: "center",
                fontFamily: "JosefinSans-Regular",
                paddingBottom: 5,
              }}
            >
              ({farmlands?.length})
            </Text>

            {customUserData?.role !== roles.provincialManager && (
              <Stack direction="row" w="100%" p="4">
                <Box w="50%"></Box>
                <Box
                  w="50%"
                  // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { alig... Remove this comment to see the full error message
                  style={{
                    alignItems: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                    }}
                    onPress={() => {
                      navigation.navigate("FarmlandForm1", {
                        // @ts-expect-error TS(2531): Object is possibly 'null'.
                        ownerId: farmer._id,
                        // @ts-expect-error TS(2339): Property 'names' does not exist on type 'Object<un... Remove this comment to see the full error message
                        ownerName: `${farmer?.names?.otherNames} ${farmer?.names?.surname}`,
                        // @ts-expect-error TS(2339): Property 'image' does not exist on type 'Object<un... Remove this comment to see the full error message
                        ownerImage: farmer?.image || "",
                        // @ts-expect-error TS(2339): Property 'address' does not exist on type 'Object<... Remove this comment to see the full error message
                        ownerAddress: farmer?.address,
                        flag: "Indivíduo",
                      });
                      setRefresh(!refresh);
                    }}
                  >
                    <Box
                      // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { flexDirectio... Remove this comment to see the full error message
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 100,
                        borderWidth: 2,
                        borderColor: COLORS.mediumseagreen,
                        padding: 4,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTree}
                        size={20}
                        color={COLORS.mediumseagreen}
                      />
                      <Text
                        style={{
                          color: COLORS.mediumseagreen,
                          fontSize: 14,
                          fontFamily: "JosefinSans-Bold",
                          paddingLeft: 5,
                        }}
                      >
                        Registar Pomar
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Stack>
            )}

            {farmlands?.map((farmland) => (
              <FarmlandData
                // @ts-expect-error TS(2339): Property '_id' does not exist on type 'Object<unkn... Remove this comment to see the full error message
                key={farmland?._id}
                farmland={farmland}
                setRefresh={setRefresh}
                refresh={refresh}
                successLottieVisible={successLottieVisible}
                setSuccessLottieVisible={setSuccessLottieVisible}
                // @ts-expect-error TS(2339): Property 'image' does not exist on type 'Object<un... Remove this comment to see the full error message
                ownerImage={farmer?.image}
                scale={scale}
                resizeBox={resizeBox}
                isOverlayVisible={isOverlayVisible}
                setIsOverlayVisible={setIsOverlayVisible}
              />
            ))}
          </Box>

          <PhotoModal
            realm={realm}
            photoOwner={farmer}
            photoOwnerType={"Indivíduo"}
            isPhotoModalVisible={isPhotoModalVisible}
            setIsPhotoModalVisible={setIsPhotoModalVisible}
            userRole={customUserData?.role}
            loadingActivitiyIndicator={loadingActivitiyIndicator}
            setLoadingActivityIndicator={setLoadingActivityIndicator}
            launchNativeImageLibrary={launchNativeImageLibrary}
          />
        </ScrollView>
      )}

      {successLottieVisible && (
        <SuccessLottie
          successLottieVisible={successLottieVisible}
          setSuccessLottieVisible={setSuccessLottieVisible}
        />
      )}
    </SafeAreaView>
  );
}
