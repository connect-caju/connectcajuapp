/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import {
  FlatList,
  InteractionManager,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "@rneui/themed";
import { Box, Pressable } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import {
  faPeopleGroup,
  faInstitution,
  faPerson,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import {
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { customizeItem } from "../../helpers/customizeItem";

import COLORS from "../../consts/colors";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { roles } from "../../consts/roles";
import FarmerTypeCard from "../../components/FarmerTypeCard/FarmerTypeCard";
import CustomDivider from "../../components/Divider/CustomDivider";
import RegistrationButton from "../../components/RegistrationButton/RegistrationButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { backgroundStyle } from "../../styles/globals";
const { useRealm, useQuery } = realmContext;

const provincialStats = "provincialStats";

const farmersTypes = [
  {
    farmerType: "Indivíduo",
    icon: faPerson,
    description:
      "Produtores singulares categorizados em familiares e comerciais.",
    title: "Produtores Singulares",
    iconColor: COLORS.main,
    borderColor: COLORS.darkyGreen,
    color: COLORS.main,
  },
  {
    farmerType: "Grupo",
    icon: faPeopleGroup,
    description: "Cooperativas, Associações, Grupos de produtores e EMC.",
    title: "Organizações de Produtores",
    iconColor: COLORS.main,
    borderColor: COLORS.darkyGreen,
    color: COLORS.main,
  },
  {
    farmerType: "Instituição",
    icon: faInstitution,
    description: "Instituições (públicas e privadas) produtoras de caju.",
    title: "Produtores Institucionais",
    iconColor: COLORS.main,
    borderColor: COLORS.darkyGreen,
    color: COLORS.main,
  },

];

export default function FarmersScreen({
  route,
  navigation
}: any) {
  const realm = useRealm();
  const user = useUser();
  let customUserData = user.customData;

  // controlling farmers regristration button animations
  const [pop, setPop] = useState(false);


  const farmers = realm
    .objects("Actor")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const serviceProviders = realm
    .objects("SprayingServiceProvider")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const groups = realm
    .objects("Group")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const institutions = realm
    .objects("Institution")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const farmlands = realm
    .objects("Farmland")
    .filtered("userDistrict == $0", customUserData?.userDistrict);
  const stats = realm
    .objects("UserStat")
    .filtered("userProvince == $0", customUserData?.userProvince);

  const [fetchedFarmers, setFetchedFarmers] = useState([]);
  const [fetchedGroups, setFetchedGroups] = useState([]);
  const [fetchedInstitutions, setFetchedInstitutions] = useState([]);
  const [refresh, setRefresh] = useState(false);


  const districts = Array.from(

    // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
    new Set(stats.map((stat) => stat?.userDistrict)),
  ).filter((district) => district !== "NA");

  customUserData = {
    name: customUserData?.name,
    userDistrict: customUserData?.userDistrict,
    userProvince: customUserData?.userProvince,
    userId: customUserData?.userId,
    role: customUserData?.role,
  };

  const individualsList = customizeItem(
    fetchedFarmers,
    farmlands,
    serviceProviders,
    customUserData,
    "Indivíduo",
  );
  const groupsList = customizeItem(
    fetchedGroups,
    farmlands,
    serviceProviders,
    customUserData,
    "Grupo",
  );
  const institutionsList = customizeItem(
    fetchedInstitutions,
    farmlands,
    serviceProviders,
    customUserData,
    "Instituição",
  );


  // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
  const filteredStats = stats?.filter((stat) => stat.userDistrict !== "NA");
  // ------------------------------------------------------

  // ----------------------------------------------------------------------------
  const listStatsByDistrict = (stats: any) => {
    // get the array of all the districts in which users are living
    // to create a SectionList where each item has title and data properties
    // excluding the stats whose district value is 'NA'
    const districts = Array.from(
      new Set(stats.map((stat: any) => stat.userDistrict)),
    )
      .filter((district) => district !== "NA")
      .sort();
    const statsByDistrict = [];
    for (let i = 0; i < districts.length; i++) {
      const district = districts[i];
      let newObject = {};
      const usersStats = stats.filter((stat: any) => stat.userDistrict === district);

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newObject["title"] = `${district}`;

      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newObject["data"] = usersStats;
      statsByDistrict.push(newObject);
    }

    return statsByDistrict;
  };

  const statsByDistrict = listStatsByDistrict(stats);
  //  ---------------------------------------------------------------------------------

  // // merge the three arrays of farmers and sort the items by createdAt
  let farmersList: any = [];

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

      // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
      (a: any, b: any) => new Date(b?.createdAt) - new Date(a?.createdAt),
    );
  }

  useEffect(() => { }, [refresh]);

  useEffect(() => {
    if (
      customUserData?.role === roles.provincialManager ||
      customUserData?.role === roles.ampcmSupervisor
    ) {
      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(provincialStats);
        mutableSubs.add(
          realm
            .objects("UserStat")
            .filtered(`userProvince == "${user?.customData?.userProvince}"`),
          { name: provincialStats },
        );
      });
    }
  }, [
    realm,
    user,
    // showAll
  ]);

  const keyExtractor = (item: any, index: any) => index.toString();

  const addFarmer = () => {
    navigation.navigate("FarmerForm1", { customUserData });
  };

  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true);
      });
      return () => task.cancel();
    }, []),
  );

  if (loadingActivitiyIndicator) {
    return (
      <CustomActivityIndicator
        loadingActivitiyIndicator={loadingActivitiyIndicator}
        setLoadingActivityIndicator={setLoadingActivityIndicator}
      />
    );
  }


  return (
    <SafeAreaView
      className={`flex flex-1 pb-40 ${backgroundStyle}`}
    >
      {/*
      Show this if the user is a field agent only
    */}

      {customUserData?.role !== roles.provincialManager &&
        customUserData?.role !== roles.ampcmSupervisor && (
          <View
            style={{
              opacity: pop ? 0.2 : 1,

            }}
          >
            <View
              className={"bg-[#EBEBE4] dark:bg-gray-800 p-2 h-20 justify-center"}
            >
              <View
                style={{
                  width: "80%"
                }}
              >
                <Pressable

                  // @ts-expect-error TS(2322): Type '{ children: Element; onPress: () => void; }'... Remove this comment to see the full error message
                  onPress={() => {
                    setRefresh(!refresh);
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    // style={{
                    //   fontFamily: "JosefinSans-Bold",
                    //   fontSize: 24,
                    //   color: COLORS.black,
                    // }}
                    className="font-bold text-gray-600 text-xl"
                  >
                    {customUserData?.userDistrict}
                  </Text>
                </Pressable>
              </View>
              <View
                style={{
                  borderRadius: 100,
                  elevation: 8,
                  position: "absolute",
                  right: 25,
                  top: 20,
                }}
              >
                {!pop &&
                  <View
                    className="justify-center rounded-full bg-gray-400 dark:bg-gray-500 p-2"
                  >
                    <TouchableOpacity disabled={pop} onPress={() => { }}>
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: COLORS.danger,
                          borderRadius: 50,
                          position: "absolute",
                          right: 4,
                          top: 0,
                          zIndex: 1,
                        }}
                      />
                      <FontAwesomeIcon icon={faBell} size={20} color={COLORS.lightestgrey} />
                    </TouchableOpacity>
                  </View>
                }
              </View>
            </View>

            {
              <Box

                // @ts-expect-error TS(2322): Type '{ children: Element; style: { justifyContent... Remove this comment to see the full error message
                style={{
                  // display: pop ? "none" : "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <FlatList
                  numColumns={1}
                  horizontal={false}
                  StickyHeaderComponent={() => (
                    <Box

                      // @ts-expect-error TS(2322): Type '{ style: { height: number; justifyContent: s... Remove this comment to see the full error message
                      style={{
                        height: hp("10%"),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></Box>
                  )}
                  stickyHeaderHiddenOnScroll={true}
                  data={farmersTypes}
                  keyExtractor={keyExtractor}
                  // onEndReached={handleEndReached}
                  onEndReachedThreshold={0.1}
                  ItemSeparatorComponent={() => <CustomDivider thickness={1} bg={COLORS.lightestgrey} />}
                  renderItem={({
                    item
                  }: any) => {
                    if (item?.farmerType === "Grupo") {
                      item["total"] = groups?.length;
                    } else if (item?.farmerType === "Indivíduo") {
                      item["total"] = farmers?.length;
                    } else if (item?.farmerType === "Instituição") {
                      item["total"] = institutions?.length;
                    }
                    return <FarmerTypeCard route={route} item={item} pop={pop} />;
                  }}
                  ListFooterComponent={() => {
                    return (
                      <Box

                        // @ts-expect-error TS(2322): Type '{ children: Element; style: { paddingBottom:... Remove this comment to see the full error message
                        style={{
                          paddingBottom: 100,
                        }}
                      >
                        <Text></Text>
                      </Box>
                    );
                  }}
                />
              </Box>
            }
          </View>
        )}

      {
        customUserData?.role !== roles.provincialManager &&
        customUserData?.role !== roles.ampcmSupervisor &&
        (

          <RegistrationButton
            customUserData={customUserData}
            pop={pop}
            setPop={setPop}
            navigation={navigation} route={route} />

        )
      }

    </SafeAreaView>
  );
}
