/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  FlatList,
  InteractionManager,
  ScrollView,
  Switch,
  Image,
  SafeAreaView,
  Text,
  View,
  PermissionsAndroid,
  TextInput,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  Platform,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ListItem, Avatar, Icon, SearchBar } from "@rneui/themed";
import { Box, Center, Pressable, Stack } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from "uuid";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";

import Toast from "react-native-toast-message";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import COLORS from "../../consts/colors";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { roles } from "../../consts/roles";
import { useCallback } from "react";
import CustomDivider from "../../components/Divider/CustomDivider";
import { getInitials } from "../../helpers/getInitials";
import { farmerTypes } from "../../consts/farmerTypes";
import { backgroundStyle } from "../../styles/globals";
// import { TextInput } from 'react-native-paper';
const { useRealm, useQuery } = realmContext;

function MemberGroupItem({
  item,
  farmerId,
  autoRefresh,
  setAutoRefresh,
  setCountIdOccurrence,
  countIdOccurrence,
  isFarmerAdded,
  setIsFarmerAdded,
  isFarmerRemoved,
  setIsFarmerRemoved,
  farmerName
}: any) {
  const realm = useRealm();
  const user = useUser();
  let customUserData = user.customData;
  const navigation = useNavigation();

  const currentGroup = realm.objectForPrimaryKey("Group", item?._id);
  const membership = realm
    .objects("ActorMembership")
    .filtered(`actorId == "${farmerId}"`);
  let member: any;

  if (membership.length > 0) {
    member = membership[0];
  }

  const [isFarmerAlreadyAdded, setIsFarmerAlreadyAdded] = useState(false);

  const showRemovedFarmerToast = () => {
    Toast.show({
      type: "removedFarmerFromGroup",
      // @ts-expect-error TS(2339): Property 'type' does not exist on type 'Object<unk... Remove this comment to see the full error message
      text1: `Retirada de ${currentGroup?.type}`,
      // @ts-expect-error TS(2339): Property 'type' does not exist on type 'Object<unk... Remove this comment to see the full error message
      props: { message: `Retirado de ${currentGroup?.type}.` },
    });
  };

  const showAddedFarmerToast = () => {
    Toast.show({
      type: "addedFarmerToGroup",
      // @ts-expect-error TS(2339): Property 'type' does not exist on type 'Object<unk... Remove this comment to see the full error message
      text1: `Adesão a ${currentGroup?.type}`,
      // @ts-expect-error TS(2339): Property 'type' does not exist on type 'Object<unk... Remove this comment to see the full error message
      props: { message: `Adicionado a ${currentGroup?.type}.` },
    });
  };
  // remove the farmer from the group
  const removeFarmerFromGroup = (realm: any, farmerId: any, currentGroup: any) => {
    try {
      realm.write(() => {

        // remove the farmer id from the group
        const updatedFarmerIds = currentGroup.members?.filter(
          (id: any) => id !== farmerId,
        );
        currentGroup.members = [];
        for (let i = 0; i < updatedFarmerIds?.length; i++) {
          currentGroup?.members.push(updatedFarmerIds[i]);
        }

        const currentActorMemberships = member?.membership;

        // check if there is any membership of this actor
        if (currentActorMemberships && currentActorMemberships?.length > 0) {
          // find the organization object that the actor want to unsubscribe from
          const membershipToDelete = currentActorMemberships.find(
            (memb: any) => memb.organizationId === currentGroup?._id,
          );
          const index = currentActorMemberships.findIndex(
            (memb: any) => memb.organizationId === membershipToDelete.organizationId,
          );

          // remove that organization object from
          currentActorMemberships.splice(index, 1);
        }

        setAutoRefresh(!autoRefresh);
        setIsFarmerRemoved(true);
      });
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log("The farmer could not be deleted from the group!");
    }
  };

  // add the farmer to the group
  const addFarmerToGroup = (realm: any, farmerId: any, currentGroup: any) => {
    try {
      realm.write(async () => {
        // add the farmer id to the group
        currentGroup?.members.push(farmerId);

        //  update the actor membership
        // in case they membership is already created
        // the the group object to the farmer membership
        if (membership?.length > 0) {
          let member = membership[0];
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          member.membership.push({
            subscriptionYear: new Date().getFullYear(),
            unsubscriptionYear: null,
            organizationId: currentGroup?._id,
          });
        } else {
          // create the actor member from scratch
          const actorMembershipObject = {
            _id: uuidv4(),
            actorId: farmerId,
            actorName: farmerName,
            membership: [
              {
                subscriptionYear: new Date().getFullYear(),
                unsubscriptionYear: null,
                organizationId: currentGroup?._id,
              },
            ],

            userName: customUserData?.name,
            userId: customUserData?.userId,
            userDistrict: customUserData?.userDistrict,
            userProvince: customUserData?.userProvince,
          };

          const actorMembership = await realm.create(
            "ActorMembership",
            actorMembershipObject,
          );
        }
        setAutoRefresh(!autoRefresh);
        setIsFarmerAdded(true);
      });
    } catch (error) {
      // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
      console.log("The farmer could not be added to the group!", {
        cause: error,
      });
    }
  };

  // call this every time the currentGroup object changes
  useEffect(() => {
    // if the farmer is already added to this group
    // then, set the state to true, else set the state to false
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    if (currentGroup.members?.find((id: any) => id === farmerId)) {
      setIsFarmerAlreadyAdded(true);
    } else {
      setIsFarmerAlreadyAdded(false);
    }
  }, [currentGroup]);

  return (
    <View
      className="flex flex-1 bg-white mx-2 my-1 py-2 rounded-md "
    >
      <Stack direction="row" w="100%">
        <Box
          w="10%"
          // @ts-expect-error TS(2322): Type '{ children: Element; w: "10%"; style: { heig... Remove this comment to see the full error message
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // @ts-expect-error TS(2531): Object is possibly 'null'.
              if (!currentGroup.members?.find((id: any) => id === farmerId)) {
                // add the actor as one of member of this group
                addFarmerToGroup(realm, farmerId, currentGroup);

                // show the sucess (for adding farmer to the group) toast message
                showAddedFarmerToast();
              } else {
                removeFarmerFromGroup(realm, farmerId, currentGroup);
                // show the error (for removing farmer from the group) toast message
                showRemovedFarmerToast();
              }
              // reset the counter to zero
              setCountIdOccurrence(0);
            }}
          >
            {isFarmerAlreadyAdded ? (
              <Icon name="check-box" size={30} color={COLORS.main} />
            ) : (
              <Icon name="add-box" size={30} color={COLORS.lightgrey} />
            )}
          </TouchableOpacity>
        </Box>

        <Box w="80%">
          <TouchableOpacity
            onPress={() => {
              // @ts-expect-error TS(2531): Object is possibly 'null'.
              if (!currentGroup.members?.find((id: any) => id === farmerId)) {
                // add the actor as one of member of this group
                addFarmerToGroup(realm, farmerId, currentGroup);

                // show the sucess (for adding farmer to the group) toast message
                showAddedFarmerToast();
              } else {
                removeFarmerFromGroup(realm, farmerId, currentGroup);
                // show the error (for removing farmer from the group) toast message
                showRemovedFarmerToast();
              }
              // reset the counter to zero
              setCountIdOccurrence(0);
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Bold",
                color: isFarmerAlreadyAdded ? COLORS.main : COLORS.black,
                paddingLeft: 10,
              }}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {item?.type}: {item?.name}
            </Text>
            <Stack direction="row" w="100%">
              <Box w="50%">
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                    color: COLORS.grey,
                    paddingLeft: 10,
                  }}
                >
                  Declarados: {item?.numberOfMembers.total}
                </Text>
              </Box>
              <Box w="50%">
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                    color: isFarmerAlreadyAdded ? COLORS.main : COLORS.grey,
                    paddingLeft: 10,
                  }}
                >
                  Registados: {item?.members?.length}
                </Text>
              </Box>
            </Stack>
          </TouchableOpacity>
        </Box>
        <Box
          w="10%"
          // @ts-expect-error TS(2322): Type '{ children: Element; w: "10%"; style: { heig... Remove this comment to see the full error message
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <TouchableOpacity
            disabled={isFarmerAlreadyAdded ? false : true}
            onPress={() => {
              // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
              navigation.navigate("GroupMembers", {
                groupId: item._id,
              });
            }}
          >
            <Icon
              name="arrow-forward-ios"
              size={20}
              color={isFarmerAlreadyAdded ? COLORS.main : COLORS.lightgrey}
            />
          </TouchableOpacity>
        </Box>
      </Stack>
      
    </View>
  );
}

export default function MembershipScreen({
  route,
  navigation
}: any) {
  const realm = useRealm();
  const user = useUser();
  let customUserData = user.customData;
  const farmerId = route?.params?.resourceId; // get the farmer id from the previous screen

  const groups = realm
    .objects("Group")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const farmer = realm.objectForPrimaryKey("Actor", farmerId);
  // const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(false);
  const [groupsList, setGroupsList] = useState([]);
  const [isEndReached, setIsEndReached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isFarmerAdded, setIsFarmerAdded] = useState(false);
  const [isFarmerRemoved, setIsFarmerRemoved] = useState(false);

  // all IDs of farmers whom have already been registered in any of the groups.
  // this array of ids helps check whether the current farmer is already regitered in any of the groups
  const [countIdOccurrence, setCountIdOccurrence] = useState(0);
  // search an organization (group)

  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedId, setSelectedId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // const filtererdItems = groupsList.filter((item)=>{
  //  return ((item.type.toLowerCase().includes(searchQuery.toLowerCase())) || (item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  // });

  const computedItems = useMemo(() => {
    let result = [];
    if (searchQuery) {
      result = groups.filter((item) => {
        return (
          // @ts-expect-error TS(2339): Property 'type' does not exist on type 'Object<unk... Remove this comment to see the full error message
          item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          // @ts-expect-error TS(2576): Property 'name' does not exist on type 'Object<unk... Remove this comment to see the full error message
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    } else {
      // @ts-expect-error TS(2740): Type 'Results<Object<unknown, never>>' is missing ... Remove this comment to see the full error message
      result = groups;
    }
    return result;
  }, [searchQuery]);

  const handleEndReached = () => {
    if (!isEndReached) {
      setIsLoading(true);
      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(() => { }, 2000);

      setIsLoading(false);
    }
  };

  useEffect(() => {

    groups.map((group) => {
      // @ts-expect-error TS(2339): Property 'members' does not exist on type 'Object<... Remove this comment to see the full error message
      if (group.members.indexOf(farmerId) >= 0) {
        setCountIdOccurrence((prev) => prev + 1);
      }
    });
    //  }
  }, [autoRefresh]);

  const keyExtractor = (item: any, index: any) => index.toString();

  return (
    <SafeAreaView
      // style={{
      //   flex: 1,
      //   paddingBottom: 100,
      //   backgroundColor: "COLORS.ghostwhite",
      // }}
      className={`flex flex-1 pb-10 ${backgroundStyle}`}

    >
      <View>
        <View
          style={{
            width: "100%",
            height: 55,
            paddingHorizontal: wp("3%"),
            // paddingTop: 5,
            backgroundColor: "#EBEBE4",
            borderTopWidth: 0,
            borderColor: "#EBEBE4",
            borderBottomWidth: 3,
            borderLeftWidth: 3,
            borderRightWidth: 3,
          }}
        >
          <Stack direction="row" w="100%">
            <Box w="10%">
              <Pressable
                // @ts-expect-error TS(2322): Type '{ children: Element; onPress: () => void; st... Remove this comment to see the full error message
                onPress={() => {
                  if (isSearching) {
                    setIsSearching(false);
                    setSearchQuery("");
                  } else {
                    navigation.navigate("Profile", {
                      ownerId: farmerId,
                      farmerType: farmerTypes.farmer,
                      farmersIDs: [],
                    });
                  }
                }}
                style={{
                  position: "absolute",
                  left: -10,
                  top: 5,
                  flexDirection: "row",
                }}
              >
                <Icon
                  name="arrow-back"
                  color={COLORS.black}
                  size={30}
                />
              </Pressable>
            </Box>

            <Box
              w="90%"
              // @ts-expect-error TS(2322): Type '{ children: Element; w: "90%"; style: { alig... Remove this comment to see the full error message
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSearching ? (
                <TextInput
                  autoFocus={isSearching ? true : false}
                  placeholder="Procurar "
                  placeholderTextColor={COLORS.lightgrey}
                  style={{
                    width: "100%",
                    height: 45,
                    backgroundColor: "white", //COLORS.ghostwhite,
                    borderRadius: 30,
                    color: COLORS.grey,
                    fontFamily: "JosefinSans-Regular",
                    borderWidth: 1,
                    textAlign: "left",
                    paddingLeft: 20,
                    fontSize: 16,
                    borderColor: "white", //COLORS.lightgrey,
                  }}
                  value={searchQuery}
                  onFocus={() => {
                    // setIsFocused(true);
                  }}
                  onEndEditing={() => {
                    // setIsFocused(false);
                  }}
                  onChangeText={(text: any) => setSearchQuery(text)}
                />
              ) : (
                <Box w="100%">
                  <Box
                    w="100%"
                    // @ts-expect-error TS(2322): Type '{ children: Element; w: "100%"; style: { fle... Remove this comment to see the full error message
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Box
                      w="80%"
                      // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "80%"; style: { ju... Remove this comment to see the full error message
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.black,
                          fontSize: 15,
                          fontFamily: "JosefinSans-Bold",
                        }}
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                      >
                        // @ts-expect-error TS(2339): Property 'names' does not exist on type 'Object<un... Remove this comment to see the full error message
                        {`${farmer?.names?.otherNames} ${farmer?.names?.surname}`}
                      </Text>
                      <Text
                        style={{
                          color:
                            countIdOccurrence === 0 ? COLORS.red : COLORS.main,
                          fontSize: 14,
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {countIdOccurrence === 0
                          ? "Marca a organização"
                          : `aderiu a ${countIdOccurrence} ${countIdOccurrence === 1
                            ? "organização"
                            : "organizações"
                          }`}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>


            {!isSearching && (
              <Box
                w="10%"
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "10%"; style: { posi... Remove this comment to see the full error message
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIsSearching(!isSearching);
                  }}
                  style={{
                    backgroundColor: COLORS.lightgrey,
                    borderRadius: 50,
                    padding: 6,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    size={20}
                    color={COLORS.black}
                    // @ts-expect-error TS(2322): Type '{ icon: IconDefinition; size: number; color:... Remove this comment to see the full error message
                    rotation={90}
                  />
                </TouchableOpacity>
              </Box>
            )}
          </Stack>
        </View>
        <View
          style={{
            backgroundColor: COLORS.main,
            height: 10,
          }}
        />

        <Box
          alignItems="stretch"
          w="100%"
          // @ts-expect-error TS(2322): Type '{ children: Element; alignItems: "stretch"; ... Remove this comment to see the full error message
          style={{
            marginBottom: 50,
            marginTop: 20,
          }}
        >
          <FlatList
            StickyHeaderComponent={() => (
              <Box
                // @ts-expect-error TS(2322): Type '{ children: never[]; style: { height: number... Remove this comment to see the full error message
                style={{
                  height: hp("10%"),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <Text>Hello! Here is the sticky header!</Text> */}
              </Box>
            )}
            stickyHeaderHiddenOnScroll={true}
            data={
              // groupsList
              // filtererdItems
              computedItems
            }
            keyExtractor={keyExtractor}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            renderItem={({
              item
            }: any) => {
              return (
                <MemberGroupItem
                  autoRefresh={autoRefresh}
                  setAutoRefresh={setAutoRefresh}
                  item={item}
                  farmerId={farmerId}
                  countIdOccurrence={countIdOccurrence}
                  setCountIdOccurrence={setCountIdOccurrence}
                  isFarmerAdded={isFarmerAdded}
                  setIsFarmerAdded={setIsFarmerAdded}
                  isFarmerRemoved={isFarmerRemoved}
                  setIsFarmerRemoved={setIsFarmerRemoved}
                  // @ts-expect-error TS(2339): Property 'names' does not exist on type 'Object<un... Remove this comment to see the full error message
                  farmerName={`${farmer?.names?.otherNames} ${farmer?.names?.surname}`}
                />
              );
            }}
            ListFooterComponent={() => {
              if (!isEndReached) {
                return (
                  <Box
                    // @ts-expect-error TS(2322): Type '{ children: Element | null; style: { backgro... Remove this comment to see the full error message
                    style={{
                      // height: 10,
                      backgroundColor: COLORS.ghostwhite,
                      // paddingBottom: 45,
                      marginBottom: 180,
                    }}
                  >
                    {isLoading ? <CustomActivityIndicator /> : null}
                  </Box>
                );
              }
              return null;
            }}
          />
        </Box>

        {computedItems.length === 0 &&
          searchQuery.length > 0 &&
          isSearching && (
            <Box
              // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { flex: number... Remove this comment to see the full error message
              style={{
                flex: 1,
                position: "absolute",
                top: 100,
                alignSelf: "center",
              }}
            >
              <Icon name="info-outline" color={COLORS.grey} size={30} />
              <Text
                style={{
                  color: COLORS.grey,
                  fontSize: 14,
                  fontFamily: "JosefinSans-Regular",
                }}
              >
                Não encontrado
              </Text>
            </Box>
          )}
      </View>
    </SafeAreaView>
  );
}
