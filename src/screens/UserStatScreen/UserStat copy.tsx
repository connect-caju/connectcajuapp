/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
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
  Animated,
  TouchableOpacity,
  SectionList,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ListItem, Avatar, Icon } from "@rneui/themed";
import { Box, Center, Pressable, Stack } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";


import { roles } from "../../consts/roles";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import COLORS from "../../consts/colors";
import { resourceValidation } from "../../consts/resourceValidation";
import { customizeItem } from "../../helpers/customizeItem";
import GroupItem from "../../components/GroupItem/GroupItem";
import FarmerItem from "../../components/FarmerItem/FarmerItem";
import InstitutionItem from "../../components/InstitutionItem/InstitutionItem";
import FarmlandItem from "../../components/FarmlandItem/FarmlandItem";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

const { useRealm, useQuery } = realmContext;

const farmersItems = "farmersItems";
const groupsItems = "groupsItems";
const institutionsItems = "institutionsItems";
const farmlandsItems = "farmlandsItems";
const statsItems = "statsItems";

export default function UserStat({
  route,
  navigation
}: any) {
  // const userId = route?.params?.ownerId;
  const { userId, userName } = route.params;

  const realm = useRealm();

  const [refresh, setRefresh] = useState(false);

  // ---------------------------------------------------------------
  const [pendingFarmers, setPendingFarmers] = useState(false);
  const [invalidatedFarmers, setInvalidatedFarmers] = useState(false);
  const [pendingFarmlands, setPendingFarmlands] = useState(false);
  const [invalidatedFarmlands, setInvalidatedFarmlands] = useState(false);
  //-----------------------------------------------------------------

  const [farmlandList, setFarmlandList] = useState([]);

  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);

  const farmers = realm.objects("Actor").filtered("userId == $0", userId);
  // const serviceProviders = realm.objects('SprayingServiceProvider').filtered("userProvince == $0", customUserData?.userProvince);
  const groups = realm.objects("Group").filtered("userId == $0", userId);
  const institutions = realm
    .objects("Institution")
    .filtered("userId == $0", userId);
  const farmlands = realm.objects("Farmland").filtered("userId == $0", userId);
  const stats = realm.objects("UserStat").filtered("userId == $0", userId);

  const individualsList = customizeItem(farmers, farmlands, [], {}, "Indivíduo");
  const groupsList = customizeItem(groups, farmlands, [], {}, "Grupo");
  const institutionsList = customizeItem(
    institutions,
    farmlands,
    [],
    {},
    "Instituição",
  );

  // merge the three arrays of farmers and sort the items by createdAt
  let farmersList: any = [];
  // let farmlandsList = [];

  if (individualsList.length > 0) {
    farmersList = farmersList.concat(individualsList);
  }
  if (groupsList.length > 0) {
    farmersList = farmersList.concat(groupsList);
  }
  if (institutionsList.length > 0) {
    farmersList = farmersList.concat(institutionsList);
  }
  if (farmersList.length > 0) {
    farmersList = farmersList?.sort(
      // @ts-expect-error TS(7006): Parameter 'a' implicitly has an 'any' type.
      (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
    );
  }

  const filteredResources = (list: any, flag: any) => {
    let newResourcesList = [];
    if (flag === "pendingFarmers") {
      newResourcesList = list?.filter(
        (resource: any) => resource?.status === resourceValidation.status.pending,
      );
    } else if (flag === "pendingFarmlands") {
      newResourcesList = list?.filter(
        (resource: any) => resource?.status === resourceValidation.status.pending,
      );
    } else if (flag === "invalidatedFarmers") {
      newResourcesList = list?.filter(
        (resource: any) => resource?.status === resourceValidation.status.invalidated,
      );
    } else if (flag === "invalidatedFarmlands") {
      newResourcesList = list?.filter(
        (resource: any) => resource?.status === resourceValidation.status.invalidated,
      );
    }
    return newResourcesList;
  };


  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(farmersItems);
      mutableSubs.add(realm.objects("Actor").filtered("userId == $0", userId), {
        name: farmersItems,
      });
    });

    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(groupsItems);
      mutableSubs.add(realm.objects("Group").filtered("userId == $0", userId), {
        name: groupsItems,
      });
    });

    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(institutionsItems);
      mutableSubs.add(
        realm.objects("Institution").filtered("userId == $0", userId),
        { name: institutionsItems },
      );
    });

    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(farmlandsItems);
      mutableSubs.add(
        realm.objects("Farmland").filtered("userId == $0", userId),
        { name: farmlandsItems },
      );
    });

    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(statsItems);
      mutableSubs.add(
        realm.objects("UserStat").filtered("userId == $0", userId),
        { name: statsItems },
      );
    });
  }, [
    realm,
    userId,
    refresh,
    invalidatedFarmers,
    invalidatedFarmlands,
    pendingFarmers,
    pendingFarmlands,
  ]);

  useEffect(() => {
    // @ts-expect-error TS(2345): Argument of type 'Object<unknown, never>[]' is not... Remove this comment to see the full error message
    setFarmlandList(farmlands.map((f) => f));
    setLoadingActivityIndicator(true);
  }, [
    refresh,
    invalidatedFarmers,
    invalidatedFarmlands,
    pendingFarmers,
    pendingFarmlands,
  ]);

  const keyExtractor = (item: any, index: any) => index.toString();

  const handleEndReached = () => {
    if (!isEndReached && !isLoading) {
      setIsLoading(true);
      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true);
      });
      return () => task.cancel();
    }, [ ]),
  );


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "ghostwhite",
      }}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: 15,
          backgroundColor: "#EBEBE4",
          borderTopWidth: 0,
          borderColor: "#EBEBE4",
          borderBottomWidth: 3,
          borderLeftWidth: 3,
          borderRightWidth: 3,
        }}
      >
        <Stack direction="row" w="100%">
          <Box>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={35} color={COLORS.black} />
            </TouchableOpacity>
          </Box>
          <Box w="80%">
            <TouchableOpacity
              style={{
                width: "100%",
              }}
              onPress={() => {
                setRefresh(!refresh);
                setPendingFarmers(false);
                setPendingFarmlands(false);
                setInvalidatedFarmers(false);
                setInvalidatedFarmlands(false);
              }}
            >
              <Center>
                <Text
                  style={{
                    fontFamily: "JosefinSans-Bold",
                    fontSize: 18,
                    color: COLORS.black,
                  }}
                >
                  {userName}
                </Text>
              </Center>
            </TouchableOpacity>
          </Box>

          <Center w="15%">
            <TouchableOpacity
              onPress={() => {
                setRefresh(!refresh);
                setPendingFarmers(false);
                setPendingFarmlands(false);
                setInvalidatedFarmers(false);
                setInvalidatedFarmlands(false);
              }}
              style={{
                borderRadius: 50,
                backgroundColor: COLORS.lightgrey,
                padding: 6,
              }}
            >
              <FontAwesomeIcon icon={faRefresh} size={20} color={COLORS.black} />
            </TouchableOpacity>
          </Center>
        </Stack>
      </View>

      {/* pending and invalidated buttons  */}

      <Box w="100%" alignItems={"center"}>
        <Box
          w="100%"
          alignItems={"center"}
          // @ts-expect-error TS(2322): Type '{ children: Element; w: "100%"; alignItems: ... Remove this comment to see the full error message
          style={{
            backgroundColor: COLORS.fourth,
            paddingLeft: 5,
            paddingRight: 10,
          }}
        >
          <Stack w="100%" direction="row" space={1} pt="1" mb="2.5">
            <Box
              w="50%"
              // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { alig... Remove this comment to see the full error message
              style={{
                alignItems: "center",
              }}
            >
              <Box
                w="100%"
                // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; style: { a... Remove this comment to see the full error message
                style={{
                  alignItems: "center",
                  borderTopColor: COLORS.ghostwhite,
                  borderLeftColor: COLORS.ghostwhite,
                  borderRightColor: COLORS.ghostwhite,
                  borderTopWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderTopEndRadius: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: COLORS.main,
                    fontSize: 14,
                    fontFamily: "JosefinSans-Bold",
                  }}
                >
                  Produtores
                </Text>

                {/* <Stack w="100%" direction="row"> */}
                  <Box
                    w="50%"
                    // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { posi... Remove this comment to see the full error message
                    style={{
                      position: "relative",
                      bottom: -10,

                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setPendingFarmers(true);
                        setPendingFarmlands(false);
                        setInvalidatedFarmers(false);
                        setInvalidatedFarmlands(false);
                      }}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 2,
                        paddingVertical: 5,
                        backgroundColor: pendingFarmers
                          ? COLORS.ghostwhite
                          : COLORS.fourth,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: pendingFarmers ? COLORS.main : COLORS.main,
                          fontSize: 10,
                          fontFamily: "JosefinSans-Bold",
                        }}
                      >
                        Pendentes
                      </Text>
                    </TouchableOpacity>
                  </Box>
                  {/* <Box
                    w="50%"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      bottom: -10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setPendingFarmers(false);
                        setPendingFarmlands(false);
                        setInvalidatedFarmers(true);
                        setInvalidatedFarmlands(false);
                      }}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 2,
                        paddingVertical: 5,
                        backgroundColor: invalidatedFarmers
                          ? COLORS.ghostwhite
                          : COLORS.fourth,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: invalidatedFarmers
                            ? COLORS.main
                            : COLORS.main,
                          fontSize: 10,
                          fontFamily: "JosefinSans-Bold",
                          marginRight: 5,
                        }}
                      >
                        Indeferidos
                      </Text>
                    </TouchableOpacity>
                  </Box> */}
                {/* </Stack> */}
              </Box>
            </Box>

            <Box
              w="50%"
              // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { alig... Remove this comment to see the full error message
              style={{
                alignItems: "center",
              }}
            >
              <Box
                w="100%"
                // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; style: { a... Remove this comment to see the full error message
                style={{
                  alignItems: "center",
                  borderTopColor: COLORS.ghostwhite,
                  borderLeftColor: COLORS.ghostwhite,
                  borderRightColor: COLORS.ghostwhite,
                  borderTopWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderTopEndRadius: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: COLORS.main,
                    fontSize: 14,
                    fontFamily: "JosefinSans-Bold",
                  }}
                >
                  Pomares
                </Text>
                {/* <Stack w="100%" direction="row"> */}
                  <Box
                    w="50%"
                    // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { just... Remove this comment to see the full error message
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      bottom: -10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setPendingFarmers(false);
                        setPendingFarmlands(true);
                        setInvalidatedFarmers(false);
                        setInvalidatedFarmlands(false);
                      }}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 2,
                        paddingVertical: 5,
                        backgroundColor: pendingFarmlands
                          ? COLORS.ghostwhite
                          : COLORS.fourth,
                      }}
                    >
                      <Text
                        style={{
                          textAling: "center",
                          color: pendingFarmlands
                            ? COLORS.main
                            : COLORS.main,
                          fontSize: 10,
                          fontFamily: "JosefinSans-Bold",
                        }}
                      >
                        Pendentes
                      </Text>
                    </TouchableOpacity>
                  </Box>
                  {/* <Box
                    w="50%"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      bottom: -10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setPendingFarmers(false);
                        setPendingFarmlands(false);
                        setInvalidatedFarmers(false);
                        setInvalidatedFarmlands(true);
                      }}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 2,
                        paddingVertical: 5,
                        backgroundColor: invalidatedFarmlands
                          ? COLORS.ghostwhite
                          : COLORS.fourth,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: invalidatedFarmlands
                            ? COLORS.main
                            : COLORS.main,
                          fontSize: 10,
                          fontFamily: "JosefinSans-Bold",
                          marginRight: 4,
                        }}
                      >
                        Indeferidos
                      </Text>
                    </TouchableOpacity>
                  </Box> */}
                {/* </Stack> */}
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          alignItems="stretch"
          w="100%"
          // @ts-expect-error TS(2322): Type '{ children: Element; alignItems: "stretch"; ... Remove this comment to see the full error message
          style={{
            marginBottom: 40,
            marginTop: 10,
          }}
        >
          {loadingActivitiyIndicator ? (
            <Box
              // @ts-expect-error TS(2322): Type '{ children: Element; style: { alignItems: st... Remove this comment to see the full error message
              style={{
                alignItems: "center",
                height: "100%",
              }}
            >
              <CustomActivityIndicator
                loadingActivitiyIndicator={loadingActivitiyIndicator}
                setLoadingActivityIndicator={setLoadingActivityIndicator}
              />
            </Box>
          ) : (
            <>
              {!(
                pendingFarmers ||
                invalidatedFarmers ||
                pendingFarmlands ||
                invalidatedFarmlands
              ) && (
                  <FlatList
                    StickyHeaderComponent={() => (
                      <Box
                        // @ts-expect-error TS(2322): Type '{ children: never[]; style: { height: number... Remove this comment to see the full error message
                        style={{
                          height: 100,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* <Text>Hello! Here is the sticky header!</Text> */}
                      </Box>
                    )}
                    stickyHeaderHiddenOnScroll={true}
                    data={farmersList}
                    keyExtractor={keyExtractor}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.1}
                    // @ts-expect-error TS(7030): Not all code paths return a value.
                    renderItem={({
                      item
                    }: any) => {
                      if (item.flag === "Grupo") {
                        return <GroupItem route={route} item={item} />;
                      } else if (item.flag === "Indivíduo") {
                        return (
                          <FarmerItem
                            route={route}
                            navigation={navigation}
                            item={item}
                          />
                        );
                      } else if (item.flag === "Instituição") {
                        return <InstitutionItem route={route} item={item} />;
                      }
                    }}
                    ListFooterComponent={() => {
                      if (!isEndReached) {
                        return (
                          <Box
                            // @ts-expect-error TS(2322): Type '{ children: Element | null; style: { height:... Remove this comment to see the full error message
                            style={{
                              height: hp("20%"),
                              backgroundColor: COLORS.ghostwhite,
                              // paddingBottom: 10,
                            }}
                          >
                            {isLoading ? <CustomActivityIndicator /> : null}
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                )}
              {pendingFarmers && (
                <FlatList
                  StickyHeaderComponent={() => (
                    <Box
                      // @ts-expect-error TS(2322): Type '{ children: never[]; style: { height: number... Remove this comment to see the full error message
                      style={{
                        height: 100,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <Text>Hello! Here is the sticky header!</Text> */}
                    </Box>
                  )}
                  stickyHeaderHiddenOnScroll={true}
                  data={filteredResources(farmersList, "pendingFarmers")}
                  keyExtractor={keyExtractor}
                  // @ts-expect-error TS(7030): Not all code paths return a value.
                  renderItem={({
                    item
                  }: any) => {
                    if (item.flag === "Grupo") {
                      return <GroupItem route={route} item={item} />;
                    } else if (item.flag === "Indivíduo") {
                      return (
                        <FarmerItem
                          route={route}
                          navigation={navigation}
                          item={item}
                        />
                      );
                    } else if (item.flag === "Instituição") {
                      return <InstitutionItem route={route} item={item} />;
                    }
                  }}
                  ListFooterComponent={() => (
                    <Box
                      // @ts-expect-error TS(2322): Type '{ style: { height: number; backgroundColor: ... Remove this comment to see the full error message
                      style={{
                        height: 100,
                        backgroundColor: COLORS.ghostwhite,
                      }}
                    ></Box>
                  )}
                />
              )}

              {invalidatedFarmers && (
                <FlatList
                  StickyHeaderComponent={() => (
                    <Box
                      // @ts-expect-error TS(2322): Type '{ children: never[]; style: { height: number... Remove this comment to see the full error message
                      style={{
                        height: 100,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <Text>Hello! Here is the sticky header!</Text> */}
                    </Box>
                  )}
                  stickyHeaderHiddenOnScroll={true}
                  data={filteredResources(farmersList, "invalidatedFarmers")}
                  keyExtractor={keyExtractor}
                  // @ts-expect-error TS(7030): Not all code paths return a value.
                  renderItem={({
                    item
                  }: any) => {
                    if (item.flag === "Grupo") {
                      return <GroupItem route={route} item={item} />;
                    } else if (item.flag === "Indivíduo") {
                      return (
                        <FarmerItem
                          route={route}
                          navigation={navigation}
                          item={item}
                        />
                      );
                    } else if (item.flag === "Instituição") {
                      return <InstitutionItem route={route} item={item} />;
                    }
                  }}
                  ListFooterComponent={() => (
                    <Box
                      // @ts-expect-error TS(2322): Type '{ style: { height: number; backgroundColor: ... Remove this comment to see the full error message
                      style={{
                        height: 100,
                        backgroundColor: COLORS.ghostwhite,
                      }}
                    ></Box>
                  )}
                />
              )}

              {pendingFarmlands && (
                <FlatList
                  StickyHeaderComponent={() => (
                    <Box
                      // @ts-expect-error TS(2322): Type '{ children: never[]; style: { height: number... Remove this comment to see the full error message
                      style={{
                        height: 100,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <Text>Hello! Here is the sticky header!</Text> */}
                    </Box>
                  )}
                  stickyHeaderHiddenOnScroll={true}
                  data={filteredResources(farmlandList, "pendingFarmlands")}
                  keyExtractor={keyExtractor}
                  renderItem={({
                    item
                  }: any) => {
                    return <FarmlandItem route={route} item={item} />;
                  }}
                  ListFooterComponent={() => (
                    <Box
                      // @ts-expect-error TS(2322): Type '{ style: { height: number; backgroundColor: ... Remove this comment to see the full error message
                      style={{
                        height: 100,
                        backgroundColor: COLORS.ghostwhite,
                      }}
                    ></Box>
                  )}
                />
              )}

              {invalidatedFarmlands && (
                <FlatList
                  StickyHeaderComponent={() => (
                    <Box
                      // @ts-expect-error TS(2322): Type '{ children: never[]; style: { height: number... Remove this comment to see the full error message
                      style={{
                        height: 100,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <Text>Hello! Here is the sticky header!</Text> */}
                    </Box>
                  )}
                  stickyHeaderHiddenOnScroll={true}
                  data={filteredResources(farmlandList, "invalidatedFarmlands")}
                  keyExtractor={keyExtractor}
                  renderItem={({
                    item
                  }: any) => {
                    return <FarmlandItem route={route} item={item} />;
                  }}
                  ListFooterComponent={() => (
                    <Box
                      // @ts-expect-error TS(2322): Type '{ style: { height: number; backgroundColor: ... Remove this comment to see the full error message
                      style={{
                        height: 100,
                        backgroundColor: COLORS.ghostwhite,
                      }}
                    ></Box>
                  )}
                />
              )}

              {pendingFarmers &&
                filteredResources(farmersList, "pendingFarmers").length ===
                0 && (
                  <Box
                    // @ts-expect-error TS(2322): Type '{ children: Element; style: { justifyContent... Remove this comment to see the full error message
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      width: 250,
                      alignSelf: "center",
                      backgroundColor: COLORS.lightestgrey,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "JosefinSans-Regular",
                        textAlign: "center",
                        color: COLORS.grey,
                      }}
                    >
                      Nenhum registo de produtor aguarda deferimento.
                    </Text>
                  </Box>
                )}

              {invalidatedFarmers &&
                filteredResources(farmersList, "invalidatedFarmers").length ===
                0 && (
                  <Box
                    // @ts-expect-error TS(2322): Type '{ children: Element; style: { justifyContent... Remove this comment to see the full error message
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      width: 250,
                      alignSelf: "center",
                      backgroundColor: COLORS.lightestgrey,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "JosefinSans-Regular",
                        textAlign: "center",
                        color: COLORS.grey,
                      }}
                    >
                      Nenhum registo de produtor encontra-se indeferido.
                    </Text>
                  </Box>
                )}

              {invalidatedFarmlands &&
                filteredResources(farmlandList, "invalidatedFarmlands")
                  .length === 0 && (
                  <Box
                    // @ts-expect-error TS(2322): Type '{ children: Element; style: { justifyContent... Remove this comment to see the full error message
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      width: 250,
                      alignSelf: "center",
                      backgroundColor: COLORS.lightestgrey,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "JosefinSans-Regular",
                        textAlign: "center",
                        // lineHeight: 30,
                        color: COLORS.grey,
                      }}
                    >
                      Nenhum registo de pomar encontra-se indeferido.
                    </Text>
                    {/* <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                        textAlign: "center",
                        lineHeight: 30,
                        color: COLORS.grey,
                      }}
                    >
                      (Usuário: {userName})
                    </Text> */}
                  </Box>
                )}
              {pendingFarmlands &&
                filteredResources(farmlandList, "pendingFarmlands").length ===
                0 && (
                  <Box
                    // @ts-expect-error TS(2322): Type '{ children: Element; style: { justifyContent... Remove this comment to see the full error message
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 10,
                      width: 250,
                      alignSelf: "center",
                      backgroundColor: COLORS.lightestgrey,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "JosefinSans-Regular",
                        textAlign: "center",
                        // lineHeight: 30,
                        color: COLORS.grey,
                      }}
                    >
                      Nenhum registo de pomar aguarda deferimento.
                    </Text>
                    {/* <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                        textAlign: "center",
                        lineHeight: 30,
                        color: COLORS.grey,
                      }}
                    >
                      (Usuário: {userName})
                    </Text> */}
                  </Box>
                )}
            </>
          )}
        </Box>
      </View>
    </SafeAreaView>
  );
}
