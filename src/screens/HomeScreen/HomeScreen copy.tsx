import {
  View,
  Text,
  InteractionManager,
  SafeAreaView,
  Image,
  TouchableOpacity,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { Box, Stack, Center } from "native-base";
import COLORS from "../../consts/colors";

import { Icon } from "@rneui/themed";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { useFocusEffect } from "@react-navigation/native";
import { months } from "../../helpers/dates";
import CustomDivider from "../../components/Divider/CustomDivider";

import UserGoalEdit from "../../components/UserGoalEdit/UserGoalEdit";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import UserProfile from "../../components/UserProfile/UserProfile";
import { getPercentage } from "../../helpers/getPercentage";
const { useRealm, useQuery, useObject } = realmContext;

const userStats = "userStats";

export default function HomeScreen() {
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;

  const [isPerformanceButtonActive, setIsPerformanceButtonActive] =
    useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUserProfileVisible, setIsUserProfileVisible] = useState(false);
  const [isGoalUpdateVisible, setIsGoalUpdateVisible] = useState(false);

  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);

  const provincialUserStats = useQuery("UserStat").filtered(
    `userProvince =="${customUserData.userProvince}"`,
  );

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

    // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
    ?.filter((stat) => stat.userDistrict === customUserData?.userDistrict)
    ?.map((stat) => {
      return {

        // @ts-expect-error TS(2339): Property 'targetFarmers' does not exist on type 'O... Remove this comment to see the full error message
        tFarmers: stat.targetFarmers,

        // @ts-expect-error TS(2339): Property 'targetFarmlands' does not exist on type ... Remove this comment to see the full error message
        tFarmlands: stat.targetFarmlands,
      };
    });

  const rWholeDistrict = provincialUserStats

    // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Ob... Remove this comment to see the full error message
    ?.filter((stat) => stat.userDistrict === customUserData?.userDistrict)
    ?.map((stat) => {
      return {

        // @ts-expect-error TS(2339): Property 'registeredFarmers' does not exist on typ... Remove this comment to see the full error message
        rFarmers: stat.registeredFarmers,

        // @ts-expect-error TS(2339): Property 'registeredFarmlands' does not exist on t... Remove this comment to see the full error message
        rFarmlands: stat.registeredFarmlands,
      };
    });
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
  }, [realm, user]);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true);
        // Expensive task
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

  // console.log('Welcome Component: app is shifting from background to foreground and vice-versa');

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "ghostwhite",
        // alignItems: 'center',
      }}
    >
      <View
        style={{
          width: "100%",
          borderBottomWidth: 1,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          borderColor: "#EBEBE4",
          backgroundColor: "#EBEBE4",
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginBottom: 50,

          shadowColor: COLORS.main,
        }}
      >
        <Box

          // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingHoriz... Remove this comment to see the full error message
          style={{
            paddingHorizontal: 15,
          }}
        >
          <Stack direction="row" w="100%" pb="4">
            <Box w="40%" alignItems={"center"}>
              <Image
                style={{ width: 50, height: 50, borderRadius: 100 }}

                // @ts-expect-error TS(2591): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
                source={require("../../../assets/images/iamLogo2.png")}
              />
              <Text
                style={{
                  textAlign: "center",
                  color: COLORS.main,
                  fontSize: 18,
                  fontFamily: "JosefinSans-Bold",
                }}
              >
                IAM, IP
              </Text>
            </Box>
            <Box w="20%"></Box>
            <Box w="40%" alignItems={"center"}>
              <TouchableOpacity
                onPress={() => {
                  setIsUserProfileVisible((prev) => !prev);
                }}
              >
                <Icon name="account-circle" color={COLORS.main} size={50} />
                <Text
                  style={{
                    textAlign: "center",
                    color: COLORS.grey,
                    fontFamily: "JosefinSans-Bold",
                    fontSize: 18,
                  }}
                >
                  // @ts-expect-error TS(2571): Object is of type 'unknown'.
                  // @ts-expect-error TS(2571): Object is of type 'unknown'.
                  {customUserData?.name?.split(" ")[0]}
                </Text>
              </TouchableOpacity>
            </Box>
          </Stack>

          <Stack direction="row" w="100%">
            <Center w="30%"></Center>
            <Box w="70%"></Box>
          </Stack>
        </Box>
      </View>

      {!isOpen && (
        <View
          style={{
            padding: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              shadowColor: COLORS.main,
              shadowOffset: {
                width: 1,
                height: 1,
              },
              shadowOpacity: 1,
              shadowRadius: 0.65,
              elevation: 2,
            }}
          >
            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { backgroundCo... Remove this comment to see the full error message
              style={{
                backgroundColor: COLORS.main,
                width: "100%",
                paddingHorizontal: 5,
                alignItems: "center",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Box pb="2" alignItems={"center"}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontFamily: "JosefinSans-Bold",
                    textAlign: "center",
                  }}
                >
                  Desempenho
                </Text>
              </Box>

              <Stack direction="row" w="90%" space={4}>
                // @ts-expect-error TS(2304): Cannot find name 'children'.
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; alignItems: "... Remove this comment to see the full error message
                // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; alignItems: "... Remove this comment to see the full error message
                <Box w="50%" alignItems={"center"} style={{}}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsPerformanceButtonActive((prev) => !prev);
                    }}
                    style={{
                      backgroundColor: isPerformanceButtonActive
                        ? COLORS.second
                        : COLORS.ghostwhite,
                      width: "100%",
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      borderColor: COLORS.ghostwhite,
                      paddingTop: 5,
                      position: "relative",
                      bottom: isPerformanceButtonActive ? -2 : -2,
                    }}
                  >
                    <Text
                      style={{
                        color: isPerformanceButtonActive
                          ? COLORS.ghostwhite
                          : COLORS.lightdanger,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                        textAlign: "center",
                      }}
                    >
                      Produtores
                    </Text>
                  </TouchableOpacity>
                </Box>
                <Box w="50%" alignItems={"center"}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsPerformanceButtonActive((prev) => !prev);
                    }}
                    style={{
                      backgroundColor: isPerformanceButtonActive
                        ? COLORS.ghostwhite
                        : COLORS.second,
                      width: "100%",
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderTopWidth: 1,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,

                      borderColor: COLORS.ghostwhite,
                      paddingTop: 5,
                      position: "relative",
                      bottom: isPerformanceButtonActive ? -2 : -2,
                    }}
                  >
                    <Text
                      style={{
                        color: isPerformanceButtonActive
                          ? COLORS.danger
                          : COLORS.ghostwhite,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                        textAlign: "center",
                      }}
                    >
                      Pomares
                    </Text>
                  </TouchableOpacity>
                </Box>
              </Stack>
            </Box>
            {!isPerformanceButtonActive && (
              <Stack direction="column" w="100%" pt="4">
                <Stack direction="row">
                  <Box w="50%">
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.black,
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Realização
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.grey,
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      Até {months[new Date().getMonth()]}{" "}
                      {new Date().getFullYear()}
                    </Text>
                  </Box>
                  <Box w="50%">
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.black,
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Meta
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.grey,
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Até Dezembro {new Date().getFullYear()}
                    </Text>
                  </Box>
                </Stack>
                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.ghostwhite
                      : COLORS.lightdanger,
                    fontFamily: "JosefinSans-Bold",
                    paddingTop: 10,
                  }}
                >
                  Provincial ({customUserData?.userProvince})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {getPercentage(rpFarmers, tpFarmers)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {tpFarmers}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>

                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.ghostwhite
                      : COLORS.lightdanger,
                    fontFamily: "JosefinSans-Bold",
                    paddingTop: 10,
                  }}
                >
                  Distrital ({customUserData?.userDistrict})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {getPercentage(rdFarmers, tdFarmers)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {tdFarmers}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>

                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.ghostwhite
                      : COLORS.lightdanger,
                    fontFamily: "JosefinSans-Bold",
                    paddingTop: 10,
                  }}
                >
                  Individual ({customUserData?.name})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                          }}
                        >
                          {getPercentage(ruFarmers, tuFarmers)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.ghostwhite
                            : COLORS.lightdanger,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: isPerformanceButtonActive
                              ? COLORS.lightdanger
                              : COLORS.ghostwhite,
                            // borderWidth: 1,
                            // padding: 5,
                            // borderRadius: 30,
                            // backgroundColor: isPerformanceButtonActive ? COLORS.ghostwhite : COLORS.lightdanger,
                          }}
                        >
                          {tuFarmers}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>
              </Stack>
            )}

            {isPerformanceButtonActive && (
              <Stack direction="column" w="100%" pt="4">
                <Stack direction="row">
                  <Box w="50%">
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.black,
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Realização
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.grey,
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      Até {months[new Date().getMonth()]}{" "}
                      {new Date().getFullYear()}
                    </Text>
                  </Box>
                  <Box w="50%">
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.black,
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Meta
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        color: COLORS.grey,
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Até Dezembro {new Date().getFullYear()}
                    </Text>
                  </Box>
                </Stack>
                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.danger
                      : COLORS.main,
                    fontFamily: "JosefinSans-Bold",
                    paddingTop: 10,
                  }}
                >
                  Provincial ({customUserData?.userProvince})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                          }}
                        >
                          {getPercentage(rpFarmlands, tpFarmlands)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                          }}
                        >
                          {tpFarmlands}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>

                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.danger
                      : COLORS.main,
                    fontFamily: "JosefinSans-Bold",
                    paddingTop: 10,
                  }}
                >
                  Distrital ({customUserData?.userDistrict})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                          }}
                        >
                          {getPercentage(rdFarmlands, tdFarmlands)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                          }}
                        >
                          {tdFarmlands}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>

                <CustomDivider />
                <Text
                  style={{
                    textAlign: "center",
                    color: isPerformanceButtonActive
                      ? COLORS.danger
                      : COLORS.main,
                    fontFamily: "JosefinSans-Bold",
                    paddingTop: 10,
                  }}
                >
                  Individual ({customUserData?.name})
                </Text>

                <Stack w="100%" direction="row" space={4} py="2">
                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                          }}
                        >
                          {getPercentage(ruFarmlands, tuFarmlands)}
                        </Text>
                      </Center>
                    </Center>
                  </Box>

                  <Box w="50%" alignItems={"center"}>
                    <Center w="100%">
                      <Center
                        w="50%"

                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "50%"; style: { back... Remove this comment to see the full error message
                        style={{
                          backgroundColor: isPerformanceButtonActive
                            ? COLORS.danger
                            : COLORS.main,
                          borderRadius: 30,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            color: COLORS.ghostwhite,
                          }}
                        >
                          {tuFarmlands}
                        </Text>
                      </Center>
                    </Center>
                  </Box>
                </Stack>
              </Stack>
            )}
          </View>
        </View>
      )}

      <UserProfile
        user={user}
        setIsGoalUpdateVisible={setIsGoalUpdateVisible}
        isUserProfileVisible={isUserProfileVisible}
        setIsUserProfileVisible={setIsUserProfileVisible}
      />
      <UserGoalEdit
        isGoalUpdateVisible={isGoalUpdateVisible}
        setIsGoalUpdateVisible={setIsGoalUpdateVisible}
      />
    </SafeAreaView>
  );
}
