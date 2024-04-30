/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  Dimensions,
  Easing,
  Animated as NativeAnimated,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import COLORS from "../../consts/colors";
import Animated, {
  FlipOutYLeft,
} from "react-native-reanimated";
import { Icon, } from "@rneui/base";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faCircleUser,
  faEllipsisVertical,
  faHome,
  faIdCard,
  faInstitution,
  faPeopleGroup,
  faTree,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { bottomSheetFlags } from "../../consts/bottomSheetFlags";
import FarmerDetailsCard from "../../components/FarmerDetailsCard/FarmerDetailsCard";
import FarmlandDetailsCard from "../../components/FarmlandDetailsCard/FarmlandDetailsCard";
import { farmerTypes } from "../../consts/farmerTypes";
import GroupDetailsCard from "../../components/GroupDetailsCard/GroupDetailsCard";
import InstitutionDetailsCard from "../../components/InstitutionDetailsCard/InstitutionDetailsCard";
import { useMemo } from "react";
import EditFarmerData from "../../components/EditData/EditFarmerData";
import ConfirmData from "../../components/EditData/ConfirmData";
import EditInstitutionData from "../../components/EditData/EditInstitutionData";
import EditGroupData from "../../components/EditData/EditGroupData";
import GroupMembersCard from "../../components/GroupMembersCard/GroupMembersCard";
import { groupTypes } from "../../consts/groupTypes";
import FarmlandData from "../../components/FarmlandData/FarmlandData";
import { roles } from "../../consts/roles";
import { backgroundStyle } from "../../styles/globals";
import { calculateAge } from "../../helpers/dates";
import tailwind from "twrnc";
const { useRealm, useQuery, useObject } = realmContext;

const singleFarmer = "singleFarmer";
const ownFarmlands = "ownFarmlands";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ProfileScreen = ({
  route,
  navigation
}: any) => {
  const {
    ownerId,
    farmerType,
    // farmersIDs
  } = route.params;
  const [presentFarmlandMenu, setPresentFarmlandMenu] = useState(false);
  const [presentGroupMenu, setPresentGroupMenu] = useState(false);
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;
  let farmer: any;
  let manager = "";
  let ownerName = "";

  if (farmerType === farmerTypes.farmer) {
    farmer = realm.objectForPrimaryKey("Actor", ownerId);
    ownerName = farmer?.names?.otherNames + " " + farmer?.names?.surname;
  } else if (farmerType === farmerTypes.group) {
    farmer = realm.objectForPrimaryKey("Group", ownerId);
    if (farmer?.manager) {
      // @ts-expect-error TS(2322): Type '(string & Object<unknown, never>) | null' is... Remove this comment to see the full error message
      manager = realm.objectForPrimaryKey("Actor", farmer?.manager);
    }
    ownerName = farmer?.name;
  } else if (farmerType === farmerTypes.institution) {
    farmer = realm.objectForPrimaryKey("Institution", ownerId);
    ownerName = farmer?.name;
  }

  const farmlands = realm
    .objects("Farmland")
    .filtered("farmerId == $0", ownerId);
  const [profileType, setProfileType] = useState("");
  const [refresh, setRefresh] = useState(false);
  const scale = useRef(new NativeAnimated.Value(0)).current;
  const [presentGroupMemberOptions, setPresentGroupMemberOptions] =
    useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  //  bottom sheet code block
  const [bottomSheetFlag, setBottomSheetFlag] = useState("");
  const [flag, setFlag] = useState({
    flagType: "",
    resourceName: "",
  });
  const ref = useRef(null);
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["25%", "40%", "60", "80%"], []);

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

  const handlePresentModalPress = useCallback(() => {
    // @ts-expect-error TS(2339): Property 'present' does not exist on type 'never'.
    bottomSheetRef?.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    // @ts-expect-error TS(2339): Property 'dismiss' does not exist on type 'never'.
    bottomSheetRef?.current?.dismiss();
    setPresentGroupMemberOptions(false);
    setPresentFarmlandMenu(false);
  }, []);

  const onPressEditData = useCallback((bottomSheetFlag: any) => {
    // @ts-expect-error TS(2339): Property 'isActive' does not exist on type 'never'... Remove this comment to see the full error message
    const isActive = ref?.current?.isActive();
    if (isActive) {
      // @ts-expect-error TS(2339): Property 'scrollTo' does not exist on type 'never'... Remove this comment to see the full error message
      ref?.current?.scrollTo(0);
      setBottomSheetFlag("");
    } else {
      // @ts-expect-error TS(2339): Property 'scrollTo' does not exist on type 'never'... Remove this comment to see the full error message
      ref?.current?.scrollTo(-300);
      setBottomSheetFlag(bottomSheetFlag);
    }
  }, []);

  const [dataToBeUpdated, setDataToBeUpdated] = useState("");
  const [newDataObject, setNewDataObject] = useState({});
  const [oldDataObject, setOldDataObject] = useState({});
  const [isFarmerOverlayVisible, setIsFarmerOverlayVisible] = useState(false);
  const [isInstitutionOverlayVisible, setIsInstitutionOverlayVisible] =
    useState(false);
  const [isGroupOverlayVisible, setIsGroupOverlayVisible] = useState(false);
  // const [isGroupMembersOverlayVisible, setIsGroupMembersOverlayVisible] =
  //   useState(false);

  const [isConfirmDataVisible, setIsConfirmDataVisible] = useState(false);

  useEffect(() => {
    if (farmerType === farmerTypes.farmer) {
      setProfileType("Produtor Singular");
      setFlag({
        flagType: bottomSheetFlags.farmerDetails,
        resourceName: "Farmer",
      });
    } else if (farmerType === farmerTypes.group) {
      setProfileType(farmer?.type);
      setFlag({
        flagType: bottomSheetFlags.groupDetails,
        resourceName: "Group",
      });
    } else if (farmerType === farmerTypes.institution) {
      setProfileType("Produtor Institucional");
      setFlag({
        flagType: bottomSheetFlags.institutionDetails,
        resourceName: "Institution",
      });
    } else {
      navigation.pop();
    }

    if (presentFarmlandMenu) {
      setProfileType("Pomar");
      setFlag({
        flagType: bottomSheetFlags.farmlandDetails,
        resourceName: "Farmland",
      });
      handlePresentModalPress();
    }
  }, [farmerType, presentFarmlandMenu]);

  return (
    <BottomSheetModalProvider>
      <Animated.ScrollView
        exiting={FlipOutYLeft}
        className={`flex flex-1 ${backgroundStyle}`}
      >
        <View
          style={[
            styles.profileContainer,
            // { backgroundColor: farmer?.image ? COLORS.dark : COLORS.dark },
          ]}
          className="bg-neutral-50 dark:bg-gray-800"
        >
          <View
            style={{
              position: "relative",
              top: 0,
              flexDirection: "row",
              width: "100%",
              paddingTop: 10,
              zIndex: 10,
            }}
          >
            {/* <View
              style={{
                width: "10%",
              }}
            > */}
              <Pressable onPress={() => {
                if (customUserData?.role !== roles.provincialManager) {
                  navigation.navigate("FarmersListLayout", {
                    farmerType: farmerType,
                  });
                }
                else {
                  navigation.goBack();
                }
              }} 
              className="ml-2 mt-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} size={20} color={COLORS.grey} />
              </Pressable>

            <View
              style={{
                width: "80%",
              }}

            >
              <Text
                className="text-center text-gray-600 font-bold text-[16px] pt-2"
              >
                {profileType}
              </Text>
            </View>

            <View
              style={{
                width: "10%",
              }}
            ></View>
          </View>
          <View style={styles.photoContainer}>
            <TouchableOpacity
              onPress={() => {
                if (roles.haveReadAndWritePermissions.some(role => role === customUserData?.role)) {
                  navigation.navigate("Camera", {
                    ownerType: farmerType,
                    ownerId: farmer?._id,
                  });

                }
              }}
            >
              {farmer?.image ? (
                <View>
                  <Image
                    source={{ uri: farmer?.image }}
                    style={{
                      width: 180,
                      height: 180,
                      borderColor: COLORS.main,
                      margin: 18,
                      borderRadius: 120,
                    }}
                  />
                </View>
              ) : (
                <View>
                  <Icon
                    name="account-circle"
                    size={200}
                    color={COLORS.lightgrey}
                  />
                </View>
              )}

              <View
                className="flex flex-row items-center justify-center gap-2 "
              >
                <Text
                  className="text-gray-500 font-bold text-lg"
                >
                  {farmerType === farmerTypes.farmer
                    ? `${farmer?.names?.otherNames} ${farmer?.names?.surname}`
                    : `${farmer?.name}`}
                </Text>
                {farmerType === farmerTypes.farmer && <Text className="text-gray-500 font-light text-xs">
                  ({calculateAge(farmer?.birthDate)}, {farmer?.gender === "Masculino" ? "H" : farmer?.gender === "Feminino" ? "M" : "NA"})
                </Text>}
              </View>

              {farmerType === farmerTypes.farmer && (
                <>
                  {farmer?.assets?.map((asset: any, index: any) => (
                    <Text
                      key={index}
                      className="text-gray-500 text-xs font-light text-center"
                    >
                      ({asset.category} {asset.subcategory})
                    </Text>
                  ))}
                </>
              )}

              {farmerType === farmerTypes.institution && (
                <Text
                  className="text-gray-500 text-xs font-light text-center"
                >
                  ({farmer?.private ? "Privada" : "Pública"})
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text
          className="text-gray-500 text-lg font-normal pl-2 pt-2 tracking-[4px]"
        >
          {farmer?.identifier}
        </Text>

        {farmerType === farmerTypes.farmer ? (
          <FarmerDetailsCard
            farmer={farmer}
            customUserData={customUserData}
            onPressEditData={onPressEditData}
            handlePresentModalPress={handlePresentModalPress}
            realm={realm}
          />
        ) : farmerType === farmerTypes.group ? (
          <GroupDetailsCard
            farmer={farmer}
            customUserData={customUserData}
            onPressEditData={onPressEditData}
            groupManager={manager}
            handlePresentModalPress={handlePresentModalPress}
            realm={realm}
          />
        ) : (
          <InstitutionDetailsCard
            farmer={farmer}
            customUserData={customUserData}
            onPressEditData={onPressEditData}
            handlePresentModalPress={handlePresentModalPress}
            realm={realm}
          />
        )}

        {(farmerType === farmerTypes.farmer ||
          farmerType === farmerTypes.institution ||
          (farmerType === farmerTypes.group && farmlands?.length > 0)) && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                className="text-gray-500 text-lg font-normal pl-2 pt-2"
              >
                Pomares{" "}
                <Text style={{ fontSize: 12, color: COLORS.grey }}>
                  ({farmlands?.length})
                </Text>
              </Text>
              {roles.haveReadAndWritePermissions.some(role => role === customUserData?.role)
                && <TouchableOpacity
                  onPress={() => {
                    setPresentFarmlandMenu(true);
                  }}
                  style={{
                    alignSelf: "flex-end",
                    paddingTop: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  <View>
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      size={20}
                      color={COLORS.grey}
                    />
                  </View>
                </TouchableOpacity>}
            </View>
          )}

        {farmlands?.length > 0 &&
          farmlands?.map((farmland) => (
            <FarmlandData
              // @ts-expect-error TS(2339): Property '_id' does not exist on type 'Object<unkn... Remove this comment to see the full error message
              key={farmland?._id}
              farmland={farmland}
              refresh={refresh}
              setRefresh={setRefresh}
              isOverlayVisible={isOverlayVisible}
              setIsOverlayVisible={setIsOverlayVisible}
              ownerImage={farmer?.image}
            />
          ))}

        {(farmerType === farmerTypes.farmer ||
          farmerType === farmerTypes.institution) &&
          farmlands?.length === 0 && (
            <FarmlandDetailsCard
              farmer={farmer}
              customUserData={customUserData}
              onPressEditData={onPressEditData}
              setRefresh={setRefresh}
              refresh={refresh}
              farmerType={farmerType}
            />
          )}

        {farmerType === farmerTypes.group && (
          <Text
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontFamily: "JosefinSans-Bold",
              paddingLeft: 10,
              paddingVertical: 10,
              alignSelf: "flex-start",
            }}
          >
            Membros{" "}
            {farmerType === farmerTypes.group &&
              farmer?.type === groupTypes.association
              ? "desta Associação"
              : farmerType === farmerTypes.group &&
                farmer?.type === groupTypes.cooperative
                ? "desta Cooperativa"
                : farmerType === farmerTypes.group &&
                  farmer?.type === groupTypes.farmerGroup
                  ? "deste Grupo"
                  : farmerType === farmerTypes.group &&
                    // @ts-expect-error TS(2339): Property 'faBirthdayCake' does not exist on type '... Remove this comment to see the full error message
                    farmer?.type === groupTypes.faBirthdayCake
                    ? "desta Escola"
                    : "deste Grupo"}
          </Text>
        )}

        {farmerType === farmerTypes.group && (
          <GroupMembersCard
            group={farmer}
            handlePresentModalPress={handlePresentModalPress}
            setPresentGroupMemberOptions={setPresentGroupMemberOptions}
            customUserData={customUserData}
          />
        )}
      </Animated.ScrollView>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={() => { }}
        backgroundStyle={tailwind`bg-neutral-100`}
        style={{
          // borderTopColor: COLORS.lightgrey,
          // borderTopWidth: 2,
          // borderTopLeftRadius: 18,
          // borderTopRightRadius: 18,
          // elevation: 5,
          // opacity: 1,
        }}
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
          <Icon name="close" size={20} color={COLORS.grey} />
        </Pressable>
        <View
          style={{
            padding: 8,
            justifyContent: "center",
          }}
        >
          {/* Single farmers */}
          {flag?.flagType === bottomSheetFlags.farmerDetails && (
            <View
              style={{
                width: "100%",
                // justifyContent: 'center',
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "JosefinSans-Bold",
                  color: COLORS.grey,
                  marginBottom: 10,
                  alignSelf: "center",
                }}
              >
                Produtor Singular
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                  justifyContent: "center",
                  alignSelf: "center",
                  paddingBottom: 16,
                }}
              >
                <View
                  style={{
                    marginHorizontal: 10,
                    alignSelf: "center",
                    width: "40%",
                    paddingVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleDismissModalPress();
                      setDataToBeUpdated("address");
                      // onPressEditData(bottomSheetFlags.farmerDetails)
                      setIsFarmerOverlayVisible(true);
                      // onPressEditData('farmerDetails');
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.fourth,
                        borderRadius: 50,
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                        padding: 6,
                      }}
                    >
                      <FontAwesomeIcon
                        style={{
                          alignSelf: "center",
                        }}
                        icon={faHome}
                        size={25}
                        color={COLORS.main}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "JosefinSans-Regular",
                        color: COLORS.grey,
                        textAlign: "center",
                      }}
                    >
                      Endereço
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginHorizontal: 10,
                    alignSelf: "center",
                    width: "40%",
                    paddingVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleDismissModalPress();
                      setDataToBeUpdated("contact");
                      // onPressEditData(bottomSheetFlags.farmerDetails)
                      setIsFarmerOverlayVisible(true);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.fourth,
                        borderRadius: 50,
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                        padding: 6,
                      }}
                    >
                      <Icon name="phone-in-talk" size={30} color={COLORS.main} />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "JosefinSans-Regular",
                        color: COLORS.grey,
                        textAlign: "center",
                      }}
                    >
                      Contacto
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginHorizontal: 10,
                    alignSelf: "center",
                    width: "40%",
                    paddingVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleDismissModalPress();
                      setDataToBeUpdated("idDocument");
                      // onPressEditData(bottomSheetFlags.farmerDetails)
                      setIsFarmerOverlayVisible(true);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.fourth,
                        borderRadius: 50,
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                        padding: 6,
                      }}
                    >
                      <FontAwesomeIcon
                        style={{
                          alignSelf: "center",
                        }}
                        icon={faIdCard}
                        size={25}
                        color={COLORS.main}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "JosefinSans-Regular",
                        color: COLORS.grey,
                        textAlign: "center",
                      }}
                    >
                      Documentação
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginHorizontal: 10,
                    alignSelf: "center",
                    width: "40%",
                    paddingVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleDismissModalPress();
                      navigation.navigate("Geolocation", {
                        resourceName: flag?.resourceName,
                        resourceId: farmer._id,
                        // farmersIDs,
                      });
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.fourth,
                        borderRadius: 50,
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                        padding: 6,
                      }}
                    >
                      <Icon
                        name="add-location-alt"
                        size={30}
                        color={COLORS.main}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "JosefinSans-Regular",
                        color: COLORS.grey,
                        textAlign: "center",
                      }}
                    >
                      Geolocalização
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginHorizontal: 10,
                    alignSelf: "center",
                    width: "40%",
                    paddingVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleDismissModalPress();
                      navigation.navigate("Membership", {
                        // resourceName: 'Farmer',
                        resourceId: farmer._id,
                      });
                    }}
                  >

                    <View
                      style={{
                        backgroundColor: COLORS.fourth,
                        borderRadius: 50,
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                        padding: 6,
                      }}
                    >

                      <FontAwesomeIcon
                        style={{
                          alignSelf: "center",
                        }}
                        icon={faPeopleGroup}
                        size={25}
                        color={COLORS.main}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "JosefinSans-Regular",
                        color: COLORS.grey,
                        textAlign: "center",
                      }}
                    >
                      Adesão a Organização
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* groups */}
          {flag?.flagType === bottomSheetFlags.groupDetails &&
            !presentGroupMemberOptions && (
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "JosefinSans-Bold",
                    color: COLORS.grey,
                    marginBottom: 20,
                    alignSelf: "center",
                  }}
                >
                  Produtor Agrupado
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                    justifyContent: "center",
                    alignSelf: "center",
                    paddingBottom: 16,
                  }}
                >
                  <View
                    style={{
                      marginHorizontal: 10,
                      alignSelf: "center",
                      width: "40%",
                      paddingVertical: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        handleDismissModalPress();
                        setDataToBeUpdated("groupType");
                        setIsGroupOverlayVisible(true);
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.fourth,
                          borderRadius: 50,
                          width: 50,
                          height: 50,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          elevation: 2,
                          padding: 6,
                        }}
                      >
                        <FontAwesomeIcon
                          style={{
                            alignSelf: "center",
                          }}
                          icon={faInstitution}
                          size={25}
                          color={COLORS.main}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "JosefinSans-Regular",
                          color: COLORS.grey,
                          textAlign: "center",
                        }}
                      >
                        Tipo de Organização
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginHorizontal: 10,
                      alignSelf: "center",
                      width: "40%",
                      paddingVertical: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        handleDismissModalPress();
                        setDataToBeUpdated("groupMembers");
                        setIsGroupOverlayVisible(true);
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.fourth,
                          borderRadius: 50,
                          width: 50,
                          height: 50,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          elevation: 2,
                          padding: 6,
                        }}
                      >
                        <FontAwesomeIcon
                          style={{
                            alignSelf: "center",
                          }}
                          icon={faPeopleGroup}
                          size={25}
                          color={COLORS.main}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "JosefinSans-Regular",
                          color: COLORS.grey,
                          textAlign: "center",
                        }}
                      >
                        Efectividade
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginHorizontal: 10,
                      alignSelf: "center",
                      width: "40%",
                      paddingVertical: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        handleDismissModalPress();
                        setDataToBeUpdated("groupIdentity");
                        setIsGroupOverlayVisible(true);
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.fourth,
                          borderRadius: 50,
                          width: 50,
                          height: 50,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          elevation: 2,
                          padding: 6,
                        }}
                      >
                        <FontAwesomeIcon
                          style={{
                            alignSelf: "center",
                          }}
                          icon={faIdCard}
                          size={25}
                          color={COLORS.main}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "JosefinSans-Regular",
                          color: COLORS.grey,
                          textAlign: "center",
                        }}
                      >
                        Documentação
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginHorizontal: 10,
                      alignSelf: "center",
                      width: "40%",
                      paddingVertical: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        handleDismissModalPress();
                        navigation.navigate("Geolocation", {
                          resourceName: flag?.resourceName,
                          resourceId: farmer._id,
                          // farmersIDs,
                        });
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.fourth,
                          borderRadius: 50,
                          width: 50,
                          height: 50,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          elevation: 2,
                          padding: 6,
                        }}
                      >
                        <Icon
                          name="add-location-alt"
                          size={30}
                          color={COLORS.main}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "JosefinSans-Regular",
                          color: COLORS.grey,
                          textAlign: "center",
                        }}
                      >
                        Geolocalização
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

          {/* groups */}
          {flag?.flagType === bottomSheetFlags.groupDetails &&
            presentGroupMemberOptions && (
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "JosefinSans-Bold",
                    color: COLORS.grey,
                    marginBottom: 20,
                    alignSelf: "center",
                  }}
                >
                  Produtor Agrupado
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: "100%",
                    justifyContent: "center",
                    alignSelf: "center",
                    paddingBottom: 16,
                  }}
                >
                  <View
                    style={{
                      marginHorizontal: 10,
                      alignSelf: "center",
                      width: "40%",
                      paddingVertical: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        handleDismissModalPress();
                        navigation.navigate("GroupRepresentative", {
                          groupId: farmer?._id,
                          district: farmer?.address?.district,
                        });
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.fourth,
                          borderRadius: 50,
                          width: 50,
                          height: 50,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          elevation: 2,
                          padding: 6,
                        }}
                      >
                        <FontAwesomeIcon
                          style={{
                            alignSelf: "center",
                          }}
                          icon={faUser}
                          size={25}
                          color={COLORS.main}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "JosefinSans-Regular",
                          color: COLORS.grey,
                          textAlign: "center",
                        }}
                      >
                        Representação
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginHorizontal: 10,
                      alignSelf: "center",
                      width: "40%",
                      paddingVertical: 20,
                    }}
                  >
                    <TouchableOpacity
                      disabled
                      onPress={() => {
                        handleDismissModalPress();
                        setDataToBeUpdated("groupMembers");
                        // setIsGroupOverlayVisible(true);
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.fourth,
                          borderRadius: 50,
                          width: 50,
                          height: 50,
                          alignSelf: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          elevation: 2,
                          padding: 6,
                        }}
                      >
                        <FontAwesomeIcon
                          style={{
                            alignSelf: "center",
                          }}
                          icon={faPeopleGroup}
                          size={25}
                          color={COLORS.main}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "JosefinSans-Regular",
                          color: COLORS.grey,
                          textAlign: "center",
                        }}
                      >
                        Adesão de Membros
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

          {/* Institutions */}
          {flag?.flagType === bottomSheetFlags.institutionDetails && (
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "JosefinSans-Bold",
                  color: COLORS.grey,
                  marginBottom: 20,
                  alignSelf: "center",
                }}
              >
                Produtor Institucional
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                  justifyContent: "center",
                  alignSelf: "center",
                  paddingBottom: 16,
                }}
              >
                <View
                  style={{
                    marginHorizontal: 10,
                    alignSelf: "center",
                    width: "40%",
                    paddingVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleDismissModalPress();
                      setDataToBeUpdated("institutionManager");
                      setIsInstitutionOverlayVisible(true);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.fourth,
                        borderRadius: 50,
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                        padding: 6,
                      }}
                    >
                      <FontAwesomeIcon
                        style={{
                          alignSelf: "center",
                        }}
                        icon={faUser}
                        size={25}
                        color={COLORS.main}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "JosefinSans-Regular",
                        color: COLORS.grey,
                        textAlign: "center",
                      }}
                    >
                      Representação
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginHorizontal: 10,
                    alignSelf: "center",
                    width: "40%",
                    paddingVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleDismissModalPress();
                      setDataToBeUpdated("institutionDocument");
                      setIsInstitutionOverlayVisible(true);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.fourth,
                        borderRadius: 50,
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                        padding: 6,
                      }}
                    >
                      <FontAwesomeIcon
                        style={{
                          alignSelf: "center",
                        }}
                        icon={faIdCard}
                        size={25}
                        color={COLORS.main}
                      />

                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "JosefinSans-Regular",
                        color: COLORS.grey,
                        textAlign: "center",
                      }}
                    >
                      Documentação
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginHorizontal: 10,
                    alignSelf: "center",
                    width: "40%",
                    paddingVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleDismissModalPress();
                      navigation.navigate("Geolocation", {
                        resourceName: flag?.resourceName,
                        resourceId: farmer._id,
                        // farmersIDs,
                      });
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.fourth,
                        borderRadius: 50,
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                        padding: 6,
                      }}
                    >
                      <Icon
                        name="add-location-alt"
                        size={30}
                        color={COLORS.main}
                      />

                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "JosefinSans-Regular",
                        color: COLORS.grey,
                        textAlign: "center",
                      }}
                    >
                      Geolocalização
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* farmland's menu */}
          {presentFarmlandMenu && (
            <View
              style={{
                width: "100%",
                alignSelf: "center",
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "JosefinSans-Bold",
                  color: COLORS.grey,
                  marginBottom: 20,
                  alignSelf: "center",
                }}
              >
                Pomares
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                  justifyContent: "center",
                  alignSelf: "center",
                  paddingBottom: 16,
                }}
              >
                <View
                  style={{
                    marginHorizontal: 10,
                    alignSelf: "center",
                    width: "40%",
                    paddingVertical: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleDismissModalPress();
                      navigation.navigate("FarmlandForm1", {
                        ownerId: farmer._id,
                        ownerName:
                          farmerType === farmerTypes.farmer
                            ? `${farmer?.names?.otherNames} ${farmer?.names?.surname}`
                            : `${farmer?.name}`,
                        ownerImage: farmer?.image || "",
                        ownerAddress: farmer?.address,
                        flag: farmerType,
                      });
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.fourth,
                        borderRadius: 50,
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                        padding: 6,
                      }}
                    >
                      <FontAwesomeIcon
                        style={{
                          alignSelf: "center",
                        }}
                        icon={faTree}
                        size={25}
                        color={COLORS.main}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "JosefinSans-Regular",
                        color: COLORS.grey,
                        textAlign: "center",
                      }}
                    >
                      Registo de Pomar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </BottomSheetModal>

      {isFarmerOverlayVisible && (
        <EditFarmerData
          isOverlayVisible={isFarmerOverlayVisible}
          setIsOverlayVisible={setIsFarmerOverlayVisible}
          farmerId={farmer?._id}
          isConfirmDataVisible={isConfirmDataVisible}
          setIsConfirmDataVisible={setIsConfirmDataVisible}
          // ownerName={ownerName}
          resourceName={flag.resourceName}
          dataToBeUpdated={dataToBeUpdated}
          setNewDataObject={setNewDataObject}
          setOldDataObject={setOldDataObject}
        />
      )}

      {isInstitutionOverlayVisible && (
        <EditInstitutionData
          isOverlayVisible={isInstitutionOverlayVisible}
          setIsOverlayVisible={setIsInstitutionOverlayVisible}
          farmerId={farmer?._id}
          setIsConfirmDataVisible={setIsConfirmDataVisible}
          resourceName={flag.resourceName}
          dataToBeUpdated={dataToBeUpdated}
          setNewDataObject={setNewDataObject}
          setOldDataObject={setOldDataObject}
        // ownerName={ownerName}
        />
      )}

      {isGroupOverlayVisible && (
        <EditGroupData
          isOverlayVisible={isGroupOverlayVisible}
          setIsOverlayVisible={setIsGroupOverlayVisible}
          farmerId={farmer?._id}
          setIsConfirmDataVisible={setIsConfirmDataVisible}
          resourceName={flag.resourceName}
          dataToBeUpdated={dataToBeUpdated}
          setNewDataObject={setNewDataObject}
          setOldDataObject={setOldDataObject}
        />
      )}

      {isConfirmDataVisible && (
        <ConfirmData
          isConfirmDataVisible={isConfirmDataVisible}
          setIsConfirmDataVisible={setIsConfirmDataVisible}
          ownerName={ownerName}
          newDataObject={newDataObject}
          oldDataObject={oldDataObject}
          dataToBeUpdated={dataToBeUpdated}
          resource={farmer}
          resourceName={flag.resourceName}
        />
      )}
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileTypeText: {
    color: COLORS.ghostwhite,
    fontSize: 18,
    fontFamily: "JosefinSans-Bold",
    textAlign: "center",
  },
  profileContainer: {
    width: "100%",
    minHeight: SCREEN_HEIGHT / 2,
    borderRadius: 7,
    alignSelf: "center",
    elevation: 20,
  },
  detailsContainer: {
    minHeight: SCREEN_HEIGHT / 2,
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
    //  minHeight: '100%',
  },
  detailsStyle: {
    width: "100%",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 8,
    borderColor: COLORS.dark,
    backgroundColor: COLORS.ghostwhite,
    marginVertical: 20,
    elevation: 3,
    opacity: 1,
  },
  bottomStyle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderColor: COLORS.dark,
    backgroundColor: COLORS.ghostwhite,
    elevation: 3,
    opacity: 1,
  },
});

export default ProfileScreen;
