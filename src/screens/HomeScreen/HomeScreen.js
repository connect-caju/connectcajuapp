/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

import {
  View,
  Text,
  InteractionManager,
  SafeAreaView,
  Image,
  TouchableOpacity,
  // ScrollView,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { Box, Stack, Center } from "native-base";
import { Icon } from "@rneui/themed";
import { useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { responsiveFontSize } from "react-native-responsive-dimensions";
// import { t } from "reac"


import COLORS from "../../consts/colors";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { months } from "../../helpers/dates";
import CustomDivider from "../../components/Divider/CustomDivider";
import UserGoalEdit from "../../components/UserGoalEdit/UserGoalEdit";
import { roles } from "../../consts/roles";
import UserProfile from "../../components/UserProfile/UserProfile";
import { getPercentage, getPercentage2 } from "../../helpers/getPercentage";

import ProvincialManager from "./ProvincialManager";
import UserPerformanceItem from "../../components/UserPerformanceItem/UserPerformanceItem";
import { backgroundStyle } from "../../styles/globals";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
const { useRealm, useQuery } = realmContext;

// sync subscription by this name
const userStats = "userStats";

// realm variable used for manual client reset in the syncConfig
export let realm;

export default function HomeScreen({ route, navigation }) {
  realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;

  const [isPerformanceButtonActive, setIsPerformanceButtonActive] =
    useState(false);
  const [isUserProfileVisible, setIsUserProfileVisible] = useState(false);
  const [isGoalUpdateVisible, setIsGoalUpdateVisible] = useState(false);
  const [isFieldAgent, setIsFieldAgent] = useState(true);

  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);

  const provincialUserStats = useQuery("UserStat").filtered(
    `userProvince == "${customUserData?.userProvince}" && userDistrict != "NA"`,
  );


  // --------------------------------------------------------
  const districts = Array.from(
    new Set(provincialUserStats.map((stat) => stat?.userDistrict)),
  );

  // -------------------------------------------------------------

  // --------------------------------------------------------
  // get extract stats from whole province
  const tWholeProvince = provincialUserStats?.map((stat) => {
    return {
      tFarmers: stat.targetFarmers,
      tFarmlands: stat.targetFarmlands,
    };
  });

  const rWholeProvince = provincialUserStats?.map((stat) => {
    return {
      rFarmers: stat.registeredFarmers,
      rFarmlands: stat.registeredFarmlands,
    };
  });

  // the current user provincial stats (Number of farmers and farmlands that have to be registered
  // until the end of the project execution
  // the current user provincial stats (number of farmers and farmlands that have been registered so far)

  const tpFarmers = tWholeProvince
    .map((stat) => stat.tFarmers)
    .reduce((ac, cur) => ac + cur, 0);
  const rpFarmers = rWholeProvince
    .map((stat) => stat.rFarmers)
    .reduce((ac, cur) => ac + cur, 0);
  const tpFarmlands = tWholeProvince
    .map((stat) => stat.tFarmlands)
    .reduce((ac, cur) => ac + cur, 0);
  const rpFarmlands = rWholeProvince
    .map((stat) => stat.rFarmlands)
    .reduce((ac, cur) => ac + cur, 0);



  // ----------------------------------------------------------------
  //  extract stats from whole district
  const tWholeDistrict = provincialUserStats
    ?.filter(
      (stat) =>
        stat.userDistrict === customUserData?.userDistrict &&
        stat.userDistrict !== "NA",
    )
    ?.map((stat) => {
      return {
        tFarmers: stat.targetFarmers,
        tFarmlands: stat.targetFarmlands,
      };
    });

  const rWholeDistrict = provincialUserStats
    ?.filter(
      (stat) =>
        stat.userDistrict === customUserData?.userDistrict &&
        stat.userDistrict !== "NA",
    )
    ?.map((stat) => {
      return {
        rFarmers: stat.registeredFarmers,
        rFarmlands: stat.registeredFarmlands,
      };
    });

  // the current user district stats in terms of farmers and farmlands that have to be registered
  // within the district and the project execution timeline
  // the current district stats (number of farmers and farmlands that have been registered so far)

  const tdFarmers = tWholeDistrict
    .map((stat) => stat.tFarmers)
    .reduce((ac, cur) => ac + cur, 0);
  const rdFarmers = rWholeDistrict
    .map((stat) => stat.rFarmers)
    .reduce((ac, cur) => ac + cur, 0);
  const tdFarmlands = tWholeDistrict
    .map((stat) => stat.tFarmlands)
    .reduce((ac, cur) => ac + cur, 0);
  const rdFarmlands = rWholeDistrict
    .map((stat) => stat.rFarmlands)
    .reduce((ac, cur) => ac + cur, 0);

  // ---------------------------------------------------------------
  // extract stats of the current user

  const tCurrentUser = provincialUserStats
    ?.filter((stat) => stat.userId === customUserData?.userId)
    ?.map((stat) => {
      return {
        tFarmers: stat.targetFarmers,
        tFarmlands: stat.targetFarmlands,
      };
    });

  const rCurrentUser = provincialUserStats
    ?.filter((stat) => stat.userId === customUserData?.userId)
    ?.map((stat) => {
      return {
        rFarmers: stat.registeredFarmers,
        rFarmlands: stat.registeredFarmlands,
      };
    });

  // the current user stats (target -- gooal in terms of the number of farmers and farmlands)
  //  they must register throughout the project execution
  //  the current user stats (number of farmers and farmlands registered)

  const tuFarmers = tCurrentUser
    .map((stat) => stat.tFarmers)
    .reduce((ac, cur) => ac + cur, 0);
  const ruFarmers = rCurrentUser
    .map((stat) => stat.rFarmers)
    .reduce((ac, cur) => ac + cur, 0);
  const tuFarmlands = tCurrentUser
    .map((stat) => stat.tFarmlands)
    .reduce((ac, cur) => ac + cur, 0);
  const ruFarmlands = rCurrentUser
    .map((stat) => stat.rFarmlands)
    .reduce((ac, cur) => ac + cur, 0);
  //----------------------------------------------------------------------

  // realm subscription to all the resources
  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(userStats);
      mutableSubs.add(
        realm
          .objects("UserStat")
          .filtered(`userProvince == "${user?.customData?.userProvince}"`),
        { name: userStats },
      );
    });

    if (
      customUserData?.role?.includes(roles.provincialManager) ||
      customUserData?.role?.includes(roles.ampcmSupervisor)
    ) {
      setIsFieldAgent(false);
    }
  }, [user, realm]);

  useEffect(() => {
    if (
      customUserData?.role !== roles.provincialManager &&
      customUserData?.role !== roles.ampcmSupervisor
    ) {
      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("Actor")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtSingleFarmers },
        );
      });

      realm.subscriptions.update((mutableSubs) => {
        // mutableSubs.removeByName(districtGroupFarmers)
        mutableSubs.add(
          realm
            .objects("Group")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtGroupFarmers },
        );
      });

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("Institution")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtInstitutionFarmers },
        );
      });


      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("Farmland")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtFarmlands },
        );
      });

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("SprayingServiceProvider")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: serviceProviderSubs },
        );
      });

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(
          realm
            .objects("ActorMembership")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: actorMembershipSubs },
        );
      });
    } else if (
      customUserData?.role === roles.provincialManager ||
      // customUserData?.role === roles.coopManager ||
      customUserData?.role === roles.ampcmSupervisor
    ) {
      realm.subscriptions.update((mutableSubs) => {
        // mutableSubs.removeByName(provincialStats);
        mutableSubs.add(
          realm
            .objects("UserStat")
            .filtered(`userProvince == "${user?.customData?.userProvince}"`),
          // { name: provincialStats },
        );
      });
    }
  }, [realm, user]);

  useFocusEffect(
    useCallback(() => {
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


  const handleUserProfileNavigation = () => {
    navigation.navigate("UserProfile", {
      customUserData: JSON.stringify(customUserData),
    });
  };



  return (
    <SafeAreaView
      className={`${backgroundStyle} flex-1`}
    >
      <View
        className={"w-full light:bg-[#EBEBE4]"}
      >
        <Box
          style={{
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}
        >
          <Stack
            direction="row"
            w="100%"
          >
            <Box w="40%" alignItems={"center"}>
              <Image
                style={{ width: 55, height: 55, borderRadius: 100 }}
                source={require("../../../assets/images/iamLogo2.png")}
              />
              <Text
                className="text-center text-green-600 font-bold text-sm dark:text-gray-600"
              >
                IAM, IP
              </Text>
            </Box>
            <Box w="20%"></Box>
            <Box w="40%" alignItems={"center"}>
              <TouchableOpacity
                onPress={() => {
                  // setIsUserProfileVisible((prev) => !prev);
                  handleUserProfileNavigation();
                }}
                className="-mt-1"
              >
                <Icon
                  name="account-circle"
                  color={COLORS.main}
                  size={60}
                />
                <Text
                  className="text-center text-gray-600 font-normal text-sm -mt-1"
                >
                  {customUserData?.name?.split(" ")[0]}
                </Text>
              </TouchableOpacity>
            </Box>
          </Stack>
        </Box>
      </View>

      {/* Province users and districts */}
      {!isFieldAgent && customUserData?.role === roles.provincialManager && (
        <>
          <Text
            className="text-xl pt-4 text-center text-gray-400"
          >
            {customUserData?.userProvince}
          </Text>
          <ProvincialManager
            customUserData={customUserData}
            isUserProfileVisible={isUserProfileVisible}
            setIsUserProfileVisible={setIsUserProfileVisible}
            provincialUserStats={provincialUserStats}
            pFarmersPercentage={getPercentage(rpFarmers, tpFarmers)}
            pFarmlandsPercentage={getPercentage(rpFarmlands, tpFarmlands)}
            tpFarmers={tpFarmers}
            tpFarmlands={tpFarmlands}

          />
        </>
      )}

      {isFieldAgent && (
        <>
          <View
            className="w-full rounded-t-2xl shadow-md light:bg-neutral-100 px-2 my-6 mx-2 self-center overflow-y-scroll"
          >
            <Box
              className="bg-green-600 dark:bg-gray-800 w-full items-center  rounded-t-2xl"
            >
              <Text
                className="text-gray-600 text-xl py-4 font-bold"
              >
                Desempenho
              </Text>
              <View
                className="w-full flex-row justify-between self-center"
              >
                <TouchableOpacity
                  className={`w-1/2 sm:w-1/3 rounded-t-2xl border-t-2 border-r-2 border-l-2 border-gray-300 dark:border-gray-600 py-2 ${isPerformanceButtonActive ? "dark:bg-gray-900" : "bg-white dark:bg-gray-800"}`}
                  onPress={() => {
                    setIsPerformanceButtonActive((prev) => !prev);
                  }}
                // style={{
                //   backgroundColor: isPerformanceButtonActive
                //     ? COLORS.second
                //     : COLORS.white,
                // }}
                >
                  <Text
                    // style={{
                    //   color: isPerformanceButtonActive
                    //     ? COLORS.white
                    //     : COLORS.lightdanger,
                    // }}
                    className={`text-center font-bold text-sm ${isPerformanceButtonActive ? "text-gray-600" : "text-gray-600"}`}
                  >
                    Produtores
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`w-1/2 sm:w-1/3 rounded-t-2xl border-t-2 border-r-2 border-l-2 border-gray-300 dark:border-gray-600 py-2 ${isPerformanceButtonActive ? "bg-white dark:bg-gray-800" : "dark:bg-gray-900"}`}
                  onPress={() => {
                    setIsPerformanceButtonActive((prev) => !prev);
                  }}
                // style={{
                //   backgroundColor: isPerformanceButtonActive
                //     ? COLORS.white
                //     : COLORS.second,
                // }}
                >
                  <Text
                    // style={{
                    //   color: isPerformanceButtonActive
                    //     ? COLORS.danger
                    //     : COLORS.white,
                    // }}
                    className={`text-center font-bold text-sm ${isPerformanceButtonActive ? "text-gray-600" : "text-gray-600"}`}
                  >
                    Pomares
                  </Text>
                </TouchableOpacity>
              </View>
            </Box>
            {!isPerformanceButtonActive && (
              <Stack direction="column" w="100%" pt="4" className="border-gray-300 border-x-2 border-b-2 bg-white dark:bg-gray-900 dark:border-x-2 dark:border-x-gray-600 dark:border-b-2 dark:border-b-gray-600 pb-2 rounded-b-lg">
                <Stack direction="row">
                  <Box w="50%">
                    <Text
                      className={"font-bold text-sm text-center text-gray-600"}
                    >
                      Realização
                    </Text>
                    <Text
                      className="font-normal text-xs text-center text-slate-600"
                    >
                      Até {months[new Date().getMonth()]}{" "}
                      {new Date().getFullYear()}
                    </Text>
                  </Box>
                  <Box w="50%">
                    <Text
                      className={"font-bold text-sm text-center text-gray-600"}
                    >
                      Meta
                    </Text>
                    <Text
                      className="font-normal text-xs text-center text-gray-600"
                    >
                      Até Dezembro {new Date().getFullYear()}
                    </Text>
                  </Box>
                </Stack>
                {/* <CustomDivider bg={COLORS.lightestgrey} /> */}
                <UserPerformanceItem
                  achieved={rpFarmers}
                  target={tpFarmers}
                  bgColor={COLORS.lightdanger}
                  label={`Provincial (${customUserData?.userProvince})`}
                />
                {/* <CustomDivider bg={COLORS.lightestgrey} /> */}
                <UserPerformanceItem
                  achieved={rdFarmers}
                  target={tdFarmers}
                  bgColor={COLORS.lightdanger}
                  label={`Distrital (${customUserData?.userDistrict})`}

                />

                {/* <CustomDivider bg={COLORS.lightestgrey} /> */}
                <UserPerformanceItem
                  achieved={ruFarmers}
                  target={tuFarmers}
                  bgColor={COLORS.lightdanger}
                  label={`Individual (${customUserData?.name})`}
                />
              </Stack>
            )}

            {isPerformanceButtonActive && (
              <Stack direction="column" w="100%" pt="4" className="border-gray-300 border-x-2 border-b-2 bg-white dark:bg-gray-900 dark:border-x-2 dark:border-x-gray-600 dark:border-b-2 dark:border-b-gray-600 pb-2 rounded-b-lg">
                <Stack direction="row">
                  <Box w="50%">
                    <Text
                      className={"font-bold text-sm text-center text-gray-600"}

                    >
                      Realização
                    </Text>
                    <Text
                      className="font-normal text-xs text-center text-slate-600"
                    >
                      Até {months[new Date().getMonth()]}{" "}
                      {new Date().getFullYear()}
                    </Text>
                  </Box>
                  <Box w="50%">
                    <Text
                      className={"font-bold text-sm text-center text-gray-600"}

                    >
                      Meta
                    </Text>
                    <Text
                      className="font-normal text-xs text-center text-gray-600"

                    >
                      Até Dezembro {new Date().getFullYear()}
                    </Text>
                  </Box>
                </Stack>
                {/* <CustomDivider bg={COLORS.lightestgrey} /> */}
                <UserPerformanceItem
                  achieved={rpFarmlands}
                  target={tpFarmlands}
                  bgColor={COLORS.danger}
                  label={`Provincial (${customUserData?.userProvince})`}
                />

                {/* <CustomDivider bg={COLORS.lightestgrey} /> */}

                <UserPerformanceItem
                  achieved={rdFarmlands}
                  target={tdFarmlands}
                  bgColor={COLORS.danger}
                  label={`Distrital (${customUserData?.userDistrict})`}
                />

                {/* <CustomDivider bg={COLORS.lightestgrey} /> */}
                <UserPerformanceItem
                  achieved={ruFarmlands}
                  target={tuFarmlands}
                  bgColor={COLORS.danger}
                  label={`Individual (${customUserData?.name})`}
                />

              </Stack>
            )}
          </View>
        </>
      )}

      <UserProfile
        user={user}
        setIsGoalUpdateVisible={setIsGoalUpdateVisible}
        isUserProfileVisible={isUserProfileVisible}
        setIsUserProfileVisible={setIsUserProfileVisible}
      />
      {/* <UserGoalEdit
        isGoalUpdateVisible={isGoalUpdateVisible}
        setIsGoalUpdateVisible={setIsGoalUpdateVisible}
      /> */}
    </SafeAreaView>
  );
}
