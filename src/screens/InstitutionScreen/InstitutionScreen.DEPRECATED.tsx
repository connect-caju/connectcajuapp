/* eslint-disable semi */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  TouchableOpacity,
  Dimensions,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native"
import { Box, Stack, Center } from "native-base"
import { Icon } from "@rneui/base"
import AwesomeAlert from "react-native-awesome-alerts"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen"

import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
  responsiveScreenWidth,
  useDimensionsChange,
} from "react-native-responsive-dimensions"

import styles from "./styles"
import FarmlandData from "../../components/FarmlandData/FarmlandData"
import InstitutionData from "../../components/InstitutionData/InstitutionData"
import COLORS from "../../consts/colors"
import PhotoModal from "../../components/Modals/PhotoModal"

import { realmContext } from "../../models/realmContext"
import { useUser } from "@realm/react"
import { roles } from "../../consts/roles"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faTree } from "@fortawesome/free-solid-svg-icons"
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator"
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet"
import PhotoBottomSheet from "../../components/BottomSheet/PhotoBottomSheet"
import { SuccessLottie } from "../../components/LottieComponents/SuccessLottie"
const { useRealm, useQuery, useObject } = realmContext

const institution = "institution"
const institutionFarmlands = "institutionFarmlands"

export default function InstitutionScreen({
  route,
  navigation
}: any) {
  const ownerId = route.params.ownerId
  const farmersIDs = route.params?.farmersIDs
  const realm = useRealm()
  const user = useUser()
  const customUserData = user?.customData
  const farmer = realm.objectForPrimaryKey("Institution", ownerId)
  const [isAddPhoto, setIsAddPhoto] = useState(false)
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false)
  const farmlands = realm
    .objects("Farmland")
    .filtered("farmerId == $0", ownerId)
  const [currentNode, setCurrentNode] = useState({
    next: null,
    prev: null,
    current: null,
  })
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)
  const [successLottieVisible, setSuccessLottieVisible] = useState(false)

  // bottom sheet
  const bottomSheetModalRef = useRef(null)
  const snapPoints = ["25%", "50%", "75%"]

  function handlePresentModal() {

    // @ts-expect-error TS(2339): Property 'present' does not exist on type 'never'.
    bottomSheetModalRef.current?.present()
  }

  const keyExtractor = (item: any, index: any) => index.toString()

  // SuccesLottie effect
  useEffect(() => {
    if (successLottieVisible) {

      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(() => {
        setSuccessLottieVisible(false)
      }, 3000)
    }
  }, [successLottieVisible])

  useEffect(() => {
    if (farmersIDs?.length > 0) {

      // @ts-expect-error TS(2304): Cannot find name 'current'.
      current = farmersIDs.find((node: any) => node.current === ownerId)

      // @ts-expect-error TS(2304): Cannot find name 'current'.
      setCurrentNode(current)
    }
  }, [ownerId])

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(institution)
      mutableSubs.add(
        realm.objects("Institution").filtered(`_id == "${ownerId}"`),
        { name: institution },
      )
    })

    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(institutionFarmlands)
      mutableSubs.add(
        realm.objects("Farmland").filtered(`farmerId == "${ownerId}"`),
        { name: institutionFarmlands },
      )
    })
  }, [realm])

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={{
          minHeight: "100%",
          backgroundColor: COLORS.ghostwhite,
        }}
      >
        <View
          style={{
            width: "100%",
            paddingHorizontal: 5,
            paddingVertical: hp("1%"),
            backgroundColor: "#EBEBE4",
            alignItems: "center",
            justifyContent: "center",
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
              setIsAddPhoto(false)
            }}
            onConfirmPressed={() => {
              setIsAddPhoto(false)
            }}
          />

          <Stack direction="row" w="100%">
            <Box>
              <Pressable
                onPress={() => {
                  navigation.navigate("FarmersListLayout", {
                    farmerType: "Instituição",
                  })
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="arrow-back"
                  color={COLORS.main}
                  size={wp("8%")}
                />
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
                  Produtor Institucional
                </Text>

                <Stack direction="row" space={2}>
                  <Center>
                    <Text
                      style={{
                        fontFamily: "JosefinSans-Regular",
                        fonSize: 14,
                      }}
                    ></Text>
                  </Center>
                  <Center>
                    <Text
                      style={{
                        fontFamily: "JosefinSans-Regular",
                        fonSize: 14,
                      }}
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
                setLoadingActivityIndicator(true)
                navigation.navigate("Institution", {
                  ownerId: currentNode?.prev,
                  farmersIDs,
                })
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
                setLoadingActivityIndicator(true)
                navigation.navigate("Institution", {
                  ownerId: currentNode?.next,
                  farmersIDs,
                })
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

              // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; style: { a... Remove this comment to see the full error message
              style={{
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
                    ownerType: "Instituição",

                    // @ts-expect-error TS(2339): Property '_id' does not exist on type 'Object<unkn... Remove this comment to see the full error message
                    ownerId: farmer?._id,
                    farmersIDs,
                  })
                }}
                style={{
                  position: "relative",
                  top: -50,
                }}
              >
                // @ts-expect-error TS(2339): Property 'un' does not exist on type 'JSX.Intrinsi... Remove this comment to see the full error message
                // @ts-expect-error TS(2339): Property 'image' does not exist on type 'Object<un... Remove this comment to see the full error message
                // @ts-expect-error TS(2339): Property 'image' does not exist on type 'Object<un... Remove this comment to see the full error message
                {farmer?.image ? (
                  <>
                    <Image

                      // @ts-expect-error TS(2339): Property 'image' does not exist on type 'Object<un... Remove this comment to see the full error message
                      source={{ uri: farmer?.image }}
                      style={styles.images}
                    />
                  </>
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
                // @ts-expect-error TS(2339): Property 'manager' does not exist on type 'Object<... Remove this comment to see the full error message
                // @ts-expect-error TS(2339): Property 'manager' does not exist on type 'Object<... Remove this comment to see the full error message
                {farmer?.manager?.fullname}
              </Text>
              <Text
                style={{
                  color: COLORS.main,
                  fontSize: responsiveFontSize(1.6),
                  fontFamily: "JosefinSans-Bold",
                  textAlign: "center",
                  position: "relative",
                  top: -50,
                }}
              >
                (Responsável)
              </Text>
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
                // @ts-expect-error TS(2339): Property 'identifier' does not exist on type 'Obje... Remove this comment to see the full error message
                {farmer?.identifier}
              </Text>

              <InstitutionData farmer={farmer} />
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
                      onPress={() =>
                        navigation.navigate("FarmlandForm1", {

                          // @ts-expect-error TS(2339): Property '_id' does not exist on type 'Object<unkn... Remove this comment to see the full error message
                          ownerId: farmer?._id,

                          // @ts-expect-error TS(2339): Property 'type' does not exist on type 'Object<unk... Remove this comment to see the full error message
                          ownerName: `${farmer?.type} ${farmer?.name}`,

                          // @ts-expect-error TS(2339): Property 'image' does not exist on type 'Object<un... Remove this comment to see the full error message
                          ownerImage: farmer?.image,

                          // @ts-expect-error TS(2339): Property 'address' does not exist on type 'Object<... Remove this comment to see the full error message
                          ownerAddress: farmer?.address,
                          flag: "Instituição",
                        })
                      }
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
                  successLottieVisible={successLottieVisible}
                  setSuccessLottieVisible={setSuccessLottieVisible}

                  // @ts-expect-error TS(2339): Property 'image' does not exist on type 'Object<un... Remove this comment to see the full error message
                  ownerImage={farmer?.image}
                />
              ))}
            </Box>

            {/* <View
          style={{
            flex: 1,
          }}
        >
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            // onDismiss={()=>setIsBottomSheetOpen(false)}
            backgroundStyle={{
              borderRadius: 50,
              backgroundColor: COLORS.fourth,
            }}
          >
            <PhotoBottomSheet 
              ownerType={'Instituição'} 
              ownerId={farmer?._id} 
              farmersIDs={farmersIDs} 
            />
          </BottomSheetModal>
        </View> */}

            <PhotoModal
              realm={realm}
              photoOwner={farmer}
              photoOwnerType={"Instituição"}
              isPhotoModalVisible={isPhotoModalVisible}
              setIsPhotoModalVisible={setIsPhotoModalVisible}
              userRole={customUserData?.role}
              loadingActivitiyIndicator={loadingActivitiyIndicator}
              setLoadingActivityIndicator={setLoadingActivityIndicator}
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
    </BottomSheetModalProvider>
  )
}
