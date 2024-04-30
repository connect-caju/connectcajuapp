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
  Animated,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native"
import React, { useEffect, useRef, useState } from "react"
import { ListItem, Avatar, Icon } from "@rneui/themed"
import { Box, Center, Pressable, Stack } from "native-base"
import { useFocusEffect } from "@react-navigation/native"
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

import FarmerItem from "../../components/FarmerItem/FarmerItem"
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator"
import LottieAddButton from "../../components/Buttons/LottieAddButton"
import TickComponent from "../../components/LottieComponents/TickComponent"
import { customizeItem } from "../../helpers/customizeItem"
import GroupItem from "../../components/GroupItem/GroupItem"
import InstitutionItem from "../../components/InstitutionItem/InstitutionItem"
import COLORS from "../../consts/colors"
// import { user } from '../../consts/user';
// import { getCustomUserData } from '../../helpers/getCustomUserData';

import { realmContext } from "../../models/realmContext"
import { useUser } from "@realm/react"
import { roles } from "../../consts/roles"
import StatItem from "../../components/StatItem/StatItem"
const { useRealm, useQuery } = realmContext

const userSingleFarmers = "userSingleFarmers"
const userGroupFarmers = "userGroupFarmers"
const userInstitutionFarmers = "userInstitutionFarmers"
const userFarmlands = "userFarmlands"

const districtSingleFarmers = "districtSingleFarmers"
const districtGroupFarmers = "districtGroupFarmers"
const districtInstitutionFarmers = "districtInstitutionFarmers"
const districtFarmlands = "districtFarmlands"
const serviceProviderSubs = "serviceProviderSubs"
const actorMembershipSubs = "actorMembershipSubs"

const provincialStats = "provincialStats"

export default function FarmersScreen({
  route,
  navigation
}: any) {
  const realm = useRealm()
  const user = useUser()
  let customUserData = user.customData

  const farmers = realm
    .objects("Actor")
    .filtered("userDistrict == $0", customUserData?.userDistrict)
  const serviceProviders = realm
    .objects("SprayingServiceProvider")
    .filtered("userDistrict == $0", customUserData?.userDistrict)
  const groups = realm
    .objects("Group")
    .filtered("userDistrict == $0", customUserData?.userDistrict)
  const institutions = realm
    .objects("Institution")
    .filtered("userDistrict == $0", customUserData?.userDistrict)
  const farmlands = realm
    .objects("Farmland")
    .filtered("userDistrict == $0", customUserData?.userDistrict)
  const stats = realm
    .objects("UserStat")
    .filtered("userProvince == $0", customUserData?.userProvince)

  const [fetchedFarmers, setFetchedFarmers] = useState([])
  const [fetchedGroups, setFetchedGroups] = useState([])
  const [fetchedInstitutions, setFetchedInstitutions] = useState([])
  const [fetchedFarmlands, setFetchedFarmlands] = useState([])

  const districts = Array.from(
    // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
    new Set(stats.map((stat) => stat?.userDistrict)),
  ).filter((district) => district !== "NA")

  customUserData = {
    name: customUserData?.name,
    userDistrict: customUserData?.userDistrict,
    userProvince: customUserData?.userProvince,
    userId: customUserData?.userId,
    role: customUserData?.role,
  }

  // const individualsList = customizeItem(farmers, farmlands, serviceProviders, customUserData, 'Indivíduo')
  // const groupsList = customizeItem(groups, farmlands, serviceProviders, customUserData, 'Grupo')
  // const institutionsList = customizeItem(institutions, farmlands, serviceProviders, customUserData, 'Instituição');

  const individualsList = customizeItem(
    fetchedFarmers,
    farmlands,
    serviceProviders,
    customUserData,
    "Indivíduo",
  )
  const groupsList = customizeItem(
    fetchedGroups,
    farmlands,
    serviceProviders,
    customUserData,
    "Grupo",
  )
  const institutionsList = customizeItem(
    fetchedInstitutions,
    farmlands,
    serviceProviders,
    customUserData,
    "Instituição",
  )

  // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
  const filteredStats = stats?.filter((stat) => stat.userDistrict !== "NA")
  // ------------------------------------------------------

  const [isLoading, setIsLoading] = useState(false)
  const [isEndReached, setIsEndReached] = useState(false)

  // // ----------------------------------------------------------------------------
  const listStatsByDistrict = (stats: any) => {
    // get the array of all the districts in which users are living
    // to create a SectionList where each item has title and data properties
    // excluding the stats whose district value is 'NA'
    const districts = Array.from(
      new Set(stats.map((stat: any) => stat.userDistrict)),
    )
      .filter((district) => district !== "NA")
      .sort()
    const statsByDistrict = []
    for (let i = 0; i < districts.length; i++) {
      const district = districts[i]
      let newObject = {}
      const usersStats = stats.filter((stat: any) => stat.userDistrict === district)
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newObject["title"] = `${district}`
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newObject["data"] = usersStats
      statsByDistrict.push(newObject)
    }

    return statsByDistrict
  }

  const statsByDistrict = listStatsByDistrict(stats)
  // //  ---------------------------------------------------------------------------------

  // // This state will be used to toggle between showing all items and only showing the current user's items
  // // This is initialized based on which subscription is already active
  const [showAll, setShowAll] = useState(
    realm.subscriptions.findByName(districtSingleFarmers) ||
      realm.subscriptions.findByName(districtGroupFarmers) ||
      realm.subscriptions.findByName(districtInstitutionFarmers) ||
      realm.subscriptions.findByName(districtFarmlands),
  )

  // // merge the three arrays of farmers and sort the items by createdAt
  let farmersList: any = []

  if (individualsList.length > 0) {
    farmersList = farmersList.concat(individualsList)
  }
  if (groupsList.length > 0) {
    farmersList = farmersList.concat(groupsList)
  }
  if (institutionsList.length > 0) {
    farmersList = farmersList.concat(institutionsList)
  }
  if (farmersList.length > 0) {
    farmersList = farmersList?.sort(
      // @ts-expect-error TS(7006): Parameter 'a' implicitly has an 'any' type.
      (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
    )
  }

  const handleEndReached = () => {
    if (!isEndReached && !isLoading) {
      setIsLoading(true)
      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }
  }

  useEffect(() => {
    if (customUserData.role !== roles.provincialManager) {
      if (!showAll) {
        // this is a bug! it should: showAll should set to true for it to setAll
        // @ts-expect-error TS(2345): Argument of type 'Results<Object<unknown, never>>'... Remove this comment to see the full error message
        setFetchedFarmers(farmers)
        // @ts-expect-error TS(2345): Argument of type 'Results<Object<unknown, never>>'... Remove this comment to see the full error message
        setFetchedGroups(groups)
        // @ts-expect-error TS(2345): Argument of type 'Results<Object<unknown, never>>'... Remove this comment to see the full error message
        setFetchedInstitutions(institutions)
        // @ts-expect-error TS(2345): Argument of type 'Results<Object<unknown, never>>'... Remove this comment to see the full error message
        setFetchedFarmlands(farmlands)
      } else {
        setFetchedFarmers(
          // @ts-expect-error TS(2345): Argument of type 'Object<unknown, never>[]' is not... Remove this comment to see the full error message
          farmers.filter((farmer) => farmer?.userId === customUserData.userId),
        )
        setFetchedGroups(
          // @ts-expect-error TS(2345): Argument of type 'Object<unknown, never>[]' is not... Remove this comment to see the full error message
          groups.filter((group) => group?.userId === customUserData.userId),
        )
        setFetchedInstitutions(
          // @ts-expect-error TS(2345): Argument of type 'Object<unknown, never>[]' is not... Remove this comment to see the full error message
          institutions.filter(
            // @ts-expect-error TS(2339): Property 'userId' does not exist on type 'Object<u... Remove this comment to see the full error message
            (institution) => institution?.userId === customUserData.userId,
          ),
        )
        setFetchedFarmlands(
          // @ts-expect-error TS(2345): Argument of type 'Object<unknown, never>[]' is not... Remove this comment to see the full error message
          farmlands.filter(
            // @ts-expect-error TS(2339): Property 'userId' does not exist on type 'Object<u... Remove this comment to see the full error message
            (farmland) => farmland?.userId === customUserData.userId,
          ),
        )
      }
    }
  }, [showAll, realm])

  useEffect(() => {
    // if (
    //   !realm.isClosed && !farmers?.isInvalidated
    //   && !farmlands?.isInvalidated && !groups?.isInvalidated
    //   && !institutions?.isInvalidated && !serviceProviders?.isInvalidated
    //   && !stats?.isInvalidated
    //   ){

    if (customUserData?.role !== roles.provincialManager) {
      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(districtSingleFarmers)
        mutableSubs.add(
          realm
            .objects("Actor")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: districtSingleFarmers },
        )
      })

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(districtGroupFarmers)
        mutableSubs.add(
          realm
            .objects("Group")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: districtGroupFarmers },
        )
      })

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(districtInstitutionFarmers)
        mutableSubs.add(
          realm
            .objects("Institution")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: districtInstitutionFarmers },
        )
      })

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(districtFarmlands)
        mutableSubs.add(
          realm
            .objects("Farmland")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: districtFarmlands },
        )
      })

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(serviceProviderSubs)
        mutableSubs.add(
          realm
            .objects("SprayingServiceProvider")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: serviceProviderSubs },
        )
      })

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(actorMembershipSubs)
        mutableSubs.add(
          realm
            .objects("ActorMembership")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: actorMembershipSubs },
        )
      })
    }

    // if (showAll && (customUserData?.role !== roles.provincialManager)) {

    //   realm.subscriptions.update(mutableSubs => {
    //     mutableSubs.removeByName(userSingleFarmers);
    //     mutableSubs.add(
    //       realm.objects('Actor').filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
    //       {name: districtSingleFarmers},
    //     );
    //   });

    //   realm.subscriptions.update(mutableSubs => {
    //     mutableSubs.removeByName(userGroupFarmers);
    //     mutableSubs.add(
    //       realm.objects('Group').filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
    //       {name: districtGroupFarmers},
    //     );
    //   });

    //   realm.subscriptions.update(mutableSubs => {
    //     mutableSubs.removeByName(userInstitutionFarmers);
    //     mutableSubs.add(
    //       realm.objects('Institution').filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
    //       {name: districtInstitutionFarmers},
    //     );
    //   });

    //   realm.subscriptions.update(mutableSubs => {
    //     mutableSubs.removeByName(userFarmlands);
    //     mutableSubs.add(
    //       realm.objects('Farmland').filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
    //       {name: districtFarmlands},
    //     );
    //   });

    // }
    //   else if (!showAll && (customUserData?.role !== roles.provincialManager)) {

    //     realm.subscriptions.update(mutableSubs => {
    //       mutableSubs.removeByName(districtSingleFarmers);
    //       mutableSubs.add(
    //         realm.objects('Actor').filtered(`userId == "${user?.customData?.userId}"`),
    //         {name: userSingleFarmers},
    //       );
    //     });

    //     realm.subscriptions.update(mutableSubs => {
    //       mutableSubs.removeByName(districtGroupFarmers);
    //       mutableSubs.add(
    //         realm.objects('Group').filtered(`userId == "${user?.customData?.userId}"`),
    //         {name: userGroupFarmers},
    //       );
    //     });

    //     realm.subscriptions.update(mutableSubs => {
    //       mutableSubs.removeByName(districtInstitutionFarmers);
    //       mutableSubs.add(
    //         realm.objects('Institution').filtered(`userId == "${user?.customData?.userId}"`),
    //         {name: userInstitutionFarmers},
    //       );
    //     });

    //     realm.subscriptions.update(mutableSubs => {
    //       mutableSubs.removeByName(districtFarmlands);
    //       mutableSubs.add(
    //         realm.objects('Farmland').filtered(`userId == "${user?.customData?.userId}"`),
    //         {name: userFarmlands},
    //       );
    //     });

    // }
    else if (customUserData?.role === roles.provincialManager) {
      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(provincialStats)
        mutableSubs.add(
          realm
            .objects("UserStat")
            .filtered(`userProvince == "${user?.customData?.userProvince}"`),
          { name: provincialStats },
        )
      })
    }
    // }
  }, [realm, user, showAll])

  const keyExtractor = (item: any, index: any) => index.toString()

  const addFarmer = () => {
    navigation.navigate("FarmerForm1", { customUserData })
  }

  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false)

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true)
      })
      return () => task.cancel()
    }, []),
  )

  if (loadingActivitiyIndicator) {
    return (
      <CustomActivityIndicator
        loadingActivitiyIndicator={loadingActivitiyIndicator}
        setLoadingActivityIndicator={setLoadingActivityIndicator}
      />
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: 100,
        backgroundColor: "ghostwhite",
      }}
    >
      {/* 
    Show this if the user is a provincial manager
*/}

      {customUserData?.role === roles.provincialManager && (
        <View>
          <View
            style={{
              width: "100%",
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
              <Center w="15%"></Center>

              <Box w="70%">
                <Center>
                  <Text
                    style={{
                      fontFamily: "JosefinSans-Bold",
                      fontSize: responsiveFontSize(2),
                      color: COLORS.main,
                    }}
                  >
                    {customUserData?.userProvince}
                  </Text>

                  <Stack direction="row" space={2} my="1">
                    <Center>
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          fonSize: responsiveFontSize(1.5),
                        }}
                      >
                        [{"Usuários:"} {filteredStats.length}]
                      </Text>
                    </Center>
                    <Center>
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          fonSize: responsiveFontSize(1.5),
                        }}
                      >
                        [{"Distritos:"} {districts.length}]
                      </Text>
                    </Center>
                  </Stack>
                </Center>
              </Box>
              <Box w="15%"></Box>
            </Stack>
          </View>

          {stats?.length === 0 ? (
            <Box>
              <Center
                // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { margin: numb... Remove this comment to see the full error message
                style={{
                  margin: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "JosefinSans-Regular",
                    fontSize: responsiveFontSize(2.5),
                    textAlign: "center",
                    lineHeight: 30,
                    color: COLORS.red,
                  }}
                >
                  A província de {customUserData?.userProvince} ainda não possui
                  usuários activos!
                </Text>
                <TickComponent />
              </Center>
            </Box>
          ) : (
            <Box
              alignItems="stretch"
              w="100%"
              // @ts-expect-error TS(2322): Type '{ children: Element; alignItems: "stretch"; ... Remove this comment to see the full error message
              style={{
                marginBottom: 140,
              }}
            >
              <SectionList
                sections={statsByDistrict}
                keyExtractor={(item: any, index: any) => {
                  return item.userId
                }}
                renderItem={({
                  item
                }: any) => (
                  <StatItem route={route} navigation={navigation} item={item} />
                )}
                renderSectionHeader={({
                  section: { title }
                }: any) => (
                  <Text
                    style={{
                      paddingLeft: 10,
                      fontWeight: "bold",
                      color: COLORS.danger,
                    }}
                  >
                    {title}
                  </Text>
                )}
              />
            </Box>
          )}
        </View>
      )}

      {/* 
   Show this if the user is a field agent only
*/}

      {customUserData?.role !== roles.provincialManager && (
        <Box>
          <View
            style={{
              // minHeight: "15%",
              width: "100%",
              paddingHorizontal: 5,
              paddingVertical: 10,
              backgroundColor: "#EBEBE4",
              borderTopWidth: 0,
              borderColor: "#EBEBE4",
              borderBottomWidth: 3,
              borderLeftWidth: 3,
              borderRightWidth: 3,
            }}
          >
            <Stack direction="row" w="100%">
              <Center w="15%">
                <Switch
                  trackColor={{ true: COLORS.main, false: COLORS.grey }}
                  thumbColor={showAll ? COLORS.grey : COLORS.main}
                  onValueChange={() => {
                    // @ts-expect-error TS(2345): Argument of type 'boolean' is not assignable to pa... Remove this comment to see the full error message
                    setShowAll(!showAll)
                    setLoadingActivityIndicator(true)
                  }}
                  value={showAll}
                />
              </Center>

              <Box w="65%">
                <Center>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={{
                      fontFamily: "JosefinSans-Bold",
                      fontSize: responsiveFontSize(2),
                      color: COLORS.main,
                      // numberOfLines: 1,
                      // ellipsizeMode: 'tail',
                    }}
                  >
                    {!showAll
                      ? customUserData?.userDistrict
                      : customUserData?.name}
                  </Text>

                  <Stack direction="row" space={2} my="1">
                    <Center>
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          fonSize: responsiveFontSize(1),
                        }}
                      >
                        [{"Produtores:"} {farmersList.length}]
                      </Text>
                    </Center>
                    <Center>
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          fonSize: responsiveFontSize(1),
                        }}
                      >
                        [{"Pomares:"} {fetchedFarmlands.length}]
                      </Text>
                    </Center>
                  </Stack>
                </Center>
              </Box>
              <Box
                w="20%"
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "20%"; style: { just... Remove this comment to see the full error message
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // borderRadius: 100,
                  // borderWidth: 1,
                  // borderColor: COLORS.main,
                  // backgroundColor: COLORS.main,
                  // marginHorizontal: 5,
                }}
              >
                <Box
                  // @ts-expect-error TS(2322): Type '{ children: Element; style: { justifyContent... Remove this comment to see the full error message
                  style={{
                    // width: '80%',
                    // height: '80%',
                    justifyContent: "center",
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: COLORS.main,
                    backgroundColor: COLORS.main,
                    // marginHorizontal: 5,
                  }}
                >
                  <TouchableOpacity onPress={addFarmer}>
                    <Icon
                      name="person-add"
                      color={COLORS.ghostwhite}
                      size={wp("12%")}
                    />
                  </TouchableOpacity>
                </Box>
              </Box>
            </Stack>
          </View>

          {farmers?.length === 0 &&
          groups.length === 0 &&
          institutions.length === 0 ? (
            <Box>
              <Center
                // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { margin: numb... Remove this comment to see the full error message
                style={{
                  margin: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "JosefinSans-Regular",
                    fontSize: responsiveFontSize(2.5),
                    textAlign: "center",
                    lineHeight: 30,
                  }}
                >
                  {/* Serás o primeiro a iniciar o registo de produtores 
            de caju neste distrito! */}
                </Text>
                <TickComponent />
              </Center>
            </Box>
          ) : (
            <Box
              alignItems="stretch"
              w="100%"
              // @ts-expect-error TS(2322): Type '{ children: Element; alignItems: "stretch"; ... Remove this comment to see the full error message
              style={{
                marginBottom: 15,
                // marginTop: 10,
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
                data={farmersList}
                keyExtractor={keyExtractor}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                // @ts-expect-error TS(7030): Not all code paths return a value.
                renderItem={({
                  item
                }: any) => {
                  if (item.flag === "Grupo") {
                    return <GroupItem route={route} item={item} />
                  } else if (item.flag === "Indivíduo") {
                    return (
                      <FarmerItem
                        route={route}
                        navigation={navigation}
                        item={item}
                      />
                    )
                  } else if (item.flag === "Instituição") {
                    return <InstitutionItem route={route} item={item} />
                  }
                }}
                ListFooterComponent={() => {
                  if (!isEndReached) {
                    return (
                      <Box
                        // @ts-expect-error TS(2322): Type '{ children: never[]; style: { backgroundColo... Remove this comment to see the full error message
                        style={{
                          // height: 10,
                          backgroundColor: COLORS.ghostwhite,
                          paddingBottom: 15,
                          marginBottom: 100,
                        }}
                      >
                        {/* { isLoading ? (<CustomActivityIndicator />) : null } */}
                      </Box>
                    )
                  }
                  return null
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </SafeAreaView>
  );
}
