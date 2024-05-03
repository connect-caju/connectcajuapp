import {
  View,
  Text,
  InteractionManager,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { Icon } from "@rneui/themed";
import { useFocusEffect } from "@react-navigation/native";
import COLORS from "../../consts/colors";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { months } from "../../helpers/dates";
import { roles } from "../../consts/roles";
import UserProfile from "../../components/UserProfile/UserProfile";
import { getPercentage, getPercentage2 } from "../../helpers/getPercentage";

import ProvincialManager from "./ProvincialManager";
import UserPerformanceItem from "../../components/UserPerformanceItem/UserPerformanceItem";
import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
const { useRealm, useQuery } = realmContext;

// sync subscription by this name
const userStats = "userStats";

// realm variable used for manual client reset in the syncConfig

// @ts-expect-error TS(7005): Variable 'realm' implicitly has an 'any' type.
export let realm;

export default function HomeScreen({ route, navigation }: any) {
  realm = useRealm();
  const user = useUser();
  const customUserData  = user?.customData;

  // terminate session if user has no customUserData
  if (!customUserData) {
    user?.logOut();
    return ;
  }

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
    // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
    new Set(provincialUserStats.map((stat) => stat?.userDistrict)),
  );

  // -------------------------------------------------------------

  // --------------------------------------------------------
  // get extract stats from whole province
  const tWholeProvince = provincialUserStats?.map((stat) => {
    return {
      // @ts-expect-error TS(2339): Property 'targetFarmers' does not exist on type 'O... Remove this comment to see the full error message
      tFarmers: stat.targetFarmers,

      // @ts-expect-error TS(2339): Property 'targetFarmlands' does not exist on type ... Remove this comment to see the full error message
      tFarmlands: stat.targetFarmlands,
    };
  });

  const rWholeProvince = provincialUserStats?.map((stat) => {
    return {
      // @ts-expect-error TS(2339): Property 'registeredFarmers' does not exist on typ... Remove this comment to see the full error message
      rFarmers: stat.registeredFarmers,

      // @ts-expect-error TS(2339): Property 'registeredFarmlands' does not exist on t... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
        stat.userDistrict === customUserData?.userDistrict &&
        // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
        stat.userDistrict !== "NA",
    )
    ?.map((stat) => {
      return {
        // @ts-expect-error TS(2339): Property 'targetFarmers' does not exist on type 'O... Remove this comment to see the full error message
        tFarmers: stat.targetFarmers,

        // @ts-expect-error TS(2339): Property 'targetFarmlands' does not exist on type ... Remove this comment to see the full error message
        tFarmlands: stat.targetFarmlands,
      };
    });

  const rWholeDistrict = provincialUserStats
    ?.filter(
      (stat) =>
        // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
        stat.userDistrict === customUserData?.userDistrict &&
        // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
        stat.userDistrict !== "NA",
    )
    ?.map((stat) => {
      return {
        // @ts-expect-error TS(2339): Property 'registeredFarmers' does not exist on typ... Remove this comment to see the full error message
        rFarmers: stat.registeredFarmers,

        // @ts-expect-error TS(2339): Property 'registeredFarmlands' does not exist on t... Remove this comment to see the full error message
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

    // @ts-expect-error TS(2339): Property 'userId' does not exist on type 'Object<u... Remove this comment to see the full error message
    ?.filter((stat) => stat.userId === customUserData?.userId)
    ?.map((stat) => {
      return {
        // @ts-expect-error TS(2339): Property 'targetFarmers' does not exist on type 'O... Remove this comment to see the full error message
        tFarmers: stat.targetFarmers,

        // @ts-expect-error TS(2339): Property 'targetFarmlands' does not exist on type ... Remove this comment to see the full error message
        tFarmlands: stat.targetFarmlands,
      };
    });

  const rCurrentUser = provincialUserStats

    // @ts-expect-error TS(2339): Property 'userId' does not exist on type 'Object<u... Remove this comment to see the full error message
    ?.filter((stat) => stat.userId === customUserData?.userId)
    ?.map((stat) => {
      return {
        // @ts-expect-error TS(2339): Property 'registeredFarmers' does not exist on typ... Remove this comment to see the full error message
        rFarmers: stat.registeredFarmers,

        // @ts-expect-error TS(2339): Property 'registeredFarmlands' does not exist on t... Remove this comment to see the full error message
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
    realm.subscriptions.update((mutableSubs: any) => {
      mutableSubs.removeByName(userStats);
      mutableSubs.add(
        realm
          .objects("UserStat")
          .filtered(`userProvince == "${user?.customData?.userProvince}"`),
        { name: userStats },
      );
    });

    if (
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      customUserData?.role?.includes(roles.provincialManager) ||
      // @ts-expect-error TS(2571): Object is of type 'unknown'.
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
      realm.subscriptions.update((mutableSubs: any) => {
        mutableSubs.add(
          realm
            .objects("Actor")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtSingleFarmers },
        );
      });

      realm.subscriptions.update((mutableSubs: any) => {
        // mutableSubs.removeByName(districtGroupFarmers)
        mutableSubs.add(
          realm
            .objects("Group")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtGroupFarmers },
        );
      });

      realm.subscriptions.update((mutableSubs: any) => {
        mutableSubs.add(
          realm
            .objects("Institution")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtInstitutionFarmers },
        );
      });

      realm.subscriptions.update((mutableSubs: any) => {
        mutableSubs.add(
          realm
            .objects("Farmland")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: districtFarmlands },
        );
      });

      realm.subscriptions.update((mutableSubs: any) => {
        mutableSubs.add(
          realm
            .objects("SprayingServiceProvider")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          // { name: serviceProviderSubs },
        );
      });

      realm.subscriptions.update((mutableSubs: any) => {
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
      realm.subscriptions.update((mutableSubs: any) => {
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
    <SafeAreaView className="flex-1">

      <View className="flex flex-row justify-between m-3">
        <View w="40%" alignItems={"center"}>
          <Image
            style={{ width: 55, height: 55, borderRadius: 100 }}
            source={require("../../../assets/images/iamLogo2.png")}
          />
          <Text className="text-center text-green-600 font-bold text-sm dark:text-gray-600">
            IAM, IP
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            // setIsUserProfileVisible((prev) => !prev);
            handleUserProfileNavigation();
          }}
          className="-mt-1"
        >
          <Icon name="account-circle" color={COLORS.main} size={60} />
          <Text className="text-center text-gray-600 font-normal text-sm -mt-1">
            {(customUserData?.name as string)?.split(" ")[0]}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Branch office manager */}
      {/* {!isFieldAgent && customUserData?.role === roles.provincialManager && ( */}
        <>
          <Text className="text-xl pt-4 text-center text-gray-400">
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
      {/* )} */}

      {isFieldAgent && false && (
        <>
          <View className="w-full rounded-t-2xl shadow-md light:bg-neutral-100 px-2 my-6 mx-2 self-center overflow-y-scroll">
            <View
              className="bg-green-700 dark:bg-gray-800 w-full items-center  rounded-t-2xl"
            >
              <Text className="text-white text-xl py-4 font-bold">
                Desempenho
              </Text>
              <View className="w-full flex-row justify-between self-center">
                <TouchableOpacity
                  className={`w-1/2 sm:w-1/3 rounded-t-2xl border-t-2 border-r-2 border-l-2 border-gray-300 dark:border-gray-600 py-2 ${
                    !isPerformanceButtonActive
                      ? "dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800"
                  }`}
                  onPress={() => {
                    setIsPerformanceButtonActive((prev) => !prev);
                  }}
                >
                  <Text
                    className={`text-center font-bold text-sm ${
                      !isPerformanceButtonActive
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Produtores
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`w-1/2 sm:w-1/3 rounded-t-2xl border-t-2 border-r-2 border-l-2 border-gray-300 dark:border-gray-600 py-2 ${
                    !isPerformanceButtonActive
                      ? "bg-white dark:bg-gray-800 "
                      : "dark:bg-gray-900 "
                  }`}
                  onPress={() => {
                    setIsPerformanceButtonActive((prev) => !prev);
                  }}
                >
                  <Text
                    className={`text-center font-bold text-sm ${
                      !isPerformanceButtonActive
                        ? "text-black"
                        : "text-white"
                    }`}
                  >
                    Pomares
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


            {!isPerformanceButtonActive && (

              <View
                className="flex flex-col pt-4 border-gray-300 border-x-2 border-b-2 bg-white dark:bg-gray-900 dark:border-x-2 dark:border-x-gray-600 dark:border-b-2 dark:border-b-gray-600 pb-2 rounded-b-lg"
              >
                <View className="flex flex-row">
                  <View className="w-1/2">
                    <Text
                      className={"font-bold text-sm text-center text-gray-600"}
                    >
                      Realização
                    </Text>
                    <Text className="font-normal text-xs text-center text-slate-600">
                      Até {months[new Date().getMonth()]}{" "}
                      {new Date().getFullYear()}
                    </Text>
                  </View>
                  <View className="w-1/2" >
                    <Text
                      className={"font-bold text-sm text-center text-gray-600"}
                    >
                      Meta
                    </Text>
                    <Text className="font-normal text-xs text-center text-gray-600">
                      Até Dezembro {new Date().getFullYear()}
                    </Text>
                  </View>
                </View>

                <UserPerformanceItem
                  achieved={rpFarmers}
                  target={tpFarmers}
                  bgColor={COLORS.lightdanger}
                  label={`Provincial (${customUserData?.userProvince})`}
                />

                <UserPerformanceItem
                  achieved={rdFarmers}
                  target={tdFarmers}
                  bgColor={COLORS.lightdanger}
                  label={`Distrital (${customUserData?.userDistrict})`}
                />

                <UserPerformanceItem
                  achieved={ruFarmers}
                  target={tuFarmers}
                  bgColor={COLORS.lightdanger}
                  label={`Individual (${customUserData?.name})`}
                />
              </View>
            )}

            {isPerformanceButtonActive && (
              <View
                className="flex flex-col pt-4 border-gray-300 border-x-2 border-b-2 bg-white dark:bg-gray-900 dark:border-x-2 dark:border-x-gray-600 dark:border-b-2 dark:border-b-gray-600 pb-2 rounded-b-lg"
              >
                <View className="flex flex-row">
                  <View className="w-1/2" >
                    <Text
                      className={"font-bold text-sm text-center text-gray-600"}
                    >
                      Realização
                    </Text>
                    <Text className="font-normal text-xs text-center text-slate-600">
                      Até {months[new Date().getMonth()]}{" "}
                      {new Date().getFullYear()}
                    </Text>
                  </View>
                  <View className="w-1/2" >
                    <Text
                      className={"font-bold text-sm text-center text-gray-600"}
                    >
                      Meta
                    </Text>
                    <Text className="font-normal text-xs text-center text-gray-600">
                      Até Dezembro {new Date().getFullYear()}
                    </Text>
                  </View>
                </View>

                <UserPerformanceItem
                  achieved={rpFarmlands}
                  target={tpFarmlands}
                  bgColor={COLORS.danger}
                  label={`Provincial (${customUserData?.userProvince})`}
                />

                <UserPerformanceItem
                  achieved={rdFarmlands}
                  target={tdFarmlands}
                  bgColor={COLORS.danger}
                  label={`Distrital (${customUserData?.userDistrict})`}
                />

                <UserPerformanceItem
                  achieved={ruFarmlands}
                  target={tuFarmlands}
                  bgColor={COLORS.danger}
                  label={`Individual (${customUserData?.name})`}
                />
              </View>
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
