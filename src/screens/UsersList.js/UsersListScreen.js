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
  SectionList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@rneui/themed";
import { Box, Center, Pressable, Stack } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import {
  faPeopleGroup,
  faInstitution,
  faPerson,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  responsiveFontSize,
} from "react-native-responsive-dimensions";

import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
// import LottieAddButton from '../../components/Buttons/LottieAddButton';
import TickComponent from "../../components/LottieComponents/TickComponent";
import { customizeItem } from "../../helpers/customizeItem";

import COLORS from "../../consts/colors";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { roles } from "../../consts/roles";
import StatItem from "../../components/StatItem/StatItem";
import FarmerTypeCard from "../../components/FarmerTypeCard/FarmerTypeCard";
import CustomDivider from "../../components/Divider/CustomDivider";
import RegistrationButton from "../../components/RegistrationButton/RegistrationButton";
import { Divider } from "react-native-paper";
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

export default function UsersListScreen({ route, navigation }) {
  const realm = useRealm();
  const user = useUser();
  let customUserData = user.customData;


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

  const filteredStats = stats?.filter((stat) => stat.userDistrict !== "NA");
  // ------------------------------------------------------

  // ----------------------------------------------------------------------------
  const listStatsByDistrict = (stats) => {
    // get the array of all the districts in which users are living
    // to create a SectionList where each item has title and data properties
    // excluding the stats whose district value is 'NA'
    const districts = Array.from(
      new Set(stats.map((stat) => stat.userDistrict)),
    )
      .filter((district) => district !== "NA")
      .sort();
    const statsByDistrict = [];
    for (let i = 0; i < districts.length; i++) {
      const district = districts[i];
      let newObject = {};
      const usersStats = stats.filter((stat) => stat.userDistrict === district);
      newObject["title"] = `${district}`;
      newObject["data"] = usersStats;
      statsByDistrict.push(newObject);
    }

    return statsByDistrict;
  };

  const statsByDistrict = listStatsByDistrict(stats);
  //  ---------------------------------------------------------------------------------

  // // merge the three arrays of farmers and sort the items by createdAt
  let farmersList = [];

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
      (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
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

  const keyExtractor = (item, index) => index.toString();


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
      className={`flex flex-1 pb-10 ${backgroundStyle}`}
    >
      {/*
      Show this if the user is a provincial manager
  */}

      <View>
        <View
          style={{
            width: "100%",
            paddingHorizontal: wp("3%"),
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
                    fontSize: 18,
                    color: COLORS.black,
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
            style={{
              marginBottom: 140,
            }}
          >
            <SectionList
              sections={statsByDistrict}
              // horizontal
              keyExtractor={(item, index) => {
                return item.userId;
              }}
              renderItem={({ item }) => (
                <StatItem route={route} navigation={navigation} item={item} />
              )}
              stickySectionHeadersEnabled
              renderSectionHeader={({ section: { title } }) => (
                <View
                  className="bg-green-600 mx-2 mt-4 rounded-t-md shadow-md"
                >
                  <Text
                    className="pl-5 py-2 text-white font-bold text-lg"
                  >
                    {title}
                  </Text>
                </View>
              )}
            />
          </Box>
        )}
      </View>
    </SafeAreaView>
  );
}
