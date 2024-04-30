/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import {
  FlatList,
  InteractionManager,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Icon } from "@rneui/themed";
import { Box, Center, Stack } from "native-base";
import { useFocusEffect } from "@react-navigation/native";

import { realmContext } from "../../models/realmContext";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import COLORS from "../../consts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faClose,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import PendingResources from "../../components/PendingResources/PendingResources";
import { resourceTypes } from "../../consts/resourceTypes";
import { backgroundStyle } from "../../styles/globals";

const { useRealm } = realmContext;


const filterByCriteria = [
  {
    criteriaName: "Produtores",
    iconName: "pending",
    focusedOption: 1,
  },
  {
    criteriaName: "Organizações",
    iconName: "pending",
    focusedOption: 2,
  },
  {
    criteriaName: "Instituições",
    iconName: "pending",
    focusedOption: 3,
  },
  {
    criteriaName: "Pomares",
    iconName: "pending",
    focusedOption: 4,
  },
];


export default function UserStat({ route, navigation }) {
  const { userId, userName } = route.params;
  const realm = useRealm();
  const [focusedOption, setFocusedOption] = useState(1);
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);


  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      // mutableSubs.removeByName(farmersItems);
      mutableSubs.add(realm.objects("Actor").filtered("userId == $0", userId),
        // { name: farmersItems,}
      );
    });

    realm.subscriptions.update((mutableSubs) => {
      // mutableSubs.removeByName(groupsItems);
      mutableSubs.add(realm.objects("Group").filtered("userId == $0", userId),
        // {name: groupsItems, }
      );
    });

    realm.subscriptions.update((mutableSubs) => {
      // mutableSubs.removeByName(institutionsItems);
      mutableSubs.add(
        realm.objects("Institution").filtered("userId == $0", userId),
        // { name: institutionsItems },
      );
    });

    realm.subscriptions.update((mutableSubs) => {
      // mutableSubs.removeByName(farmlandsItems);
      mutableSubs.add(
        realm.objects("Farmland").filtered("userId == $0", userId),
        // { name: farmlandsItems },
      );
    });

    realm.subscriptions.update((mutableSubs) => {
      // mutableSubs.removeByName(statsItems);
      mutableSubs.add(
        realm.objects("UserStat").filtered("userId == $0", userId),
        // { name: statsItems },
      );
    });
  }, [
    realm,
    userId,
  ]);


  const keyExtractor = (item, index) => index.toString();

  const handleEndReached = () => {
    if (!isEndReached && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const handleFocusedOption = (option) => {
    setFocusedOption(option);
  };

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true);
      });
      return () => task.cancel();
    }, []),
  );


  return (
    <SafeAreaView
      className={`flex flex-1 ${backgroundStyle}`}
    >
      <View
        // style={{
        //   width: "100%",
        //   paddingHorizontal: 15,
        //   backgroundColor: "#EBEBE4",
        //   borderTopWidth: 0,
        //   borderColor: "#EBEBE4",
        //   borderBottomWidth: 3,
        //   borderLeftWidth: 3,
        //   borderRightWidth: 3,
        // }}
        className="bg-[#EBEBE4] dark:bg-gray-800 p-2"

      >
        <Stack direction="row" w="100%">
          {/* <Box className=""> */}
            <TouchableOpacity 
            className="p-2"
              onPress={() => navigation.goBack()}
            >
              <FontAwesomeIcon icon={faArrowLeft} size={20} color={COLORS.grey} />
              {/* <Icon name="arrow-back" size={35} color={COLORS.grey} /> */}
            </TouchableOpacity>
          {/* </Box> */}
          <Box w="80%">
            <TouchableOpacity
              style={{
                width: "100%",
              }}
              onPress={() => {
                setRefresh(!refresh);
              }}
            >
              <Center>
                <Text
                  style={{
                    fontFamily: "JosefinSans-Bold",
                    fontSize: 18,
                    // color: COLORS.grey,
                  }}
                  className="text-gray-600"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userName}
                </Text>
              </Center>
            </TouchableOpacity>
          </Box>

          <Center w="15%">
            <TouchableOpacity
              onPress={() => { }}
              style={{
                borderRadius: 50,
                backgroundColor: COLORS.lightgrey,
                padding: 6,
              }}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} size={20} color={COLORS.black} />
            </TouchableOpacity>
          </Center>
        </Stack>

        <View
          style={{
            marginTop: 15,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <FlatList
            data={filterByCriteria}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            // ListHeaderComponent={<View style={{ width: 6, }} />}
            snapToInterval={86}
            decelerationRate="fast"
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={{
                    marginRight: 10,
                    // backgroundColor:
                    //   focusedOption === item.focusedOption
                    //     ? COLORS.main
                    //     : COLORS.fourth,
                    // borderColor:
                    //   focusedOption === item.focusedOption
                    //     ? COLORS.main
                    //     : COLORS.lightgrey,
                    // borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    paddingBottom: 5,
                    borderRadius: 100,
                    elevation: 1,
                  }}
                  className={`${focusedOption === item.focusedOption ? "bg-green-700 dark:bg-green-500" : "bg-gray-200 dark:bg-gray-800 dark:border dark:border-gray-900"}`}
                  onPress={() => handleFocusedOption(item.focusedOption)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        focusedOption === item.focusedOption
                          ? COLORS.white
                          : COLORS.grey,
                      fontFamily: "JosefinSans-Regular",
                      textAlign: "center",
                    }}
                  >
                    {item.criteriaName}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
      <View
        style={{
          // height: 10,
          // backgroundColor: COLORS.main,
        }}
        className="bg-green-700 dark:bg-gray-800 h-4"
      />
      {
        loadingActivitiyIndicator ?
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "60%",
            }}
          >
            <CustomActivityIndicator
              loadingActivitiyIndicator={loadingActivitiyIndicator}
              setLoadingActivityIndicator={setLoadingActivityIndicator}
            />
          </View>
          :
          <View>
            {
              (focusedOption === 1) &&
              <PendingResources route={route} navigation={navigation} userId={userId} resourceType={resourceTypes.actor} />
            }
            {
              (focusedOption === 2) &&
              <PendingResources route={route} navigation={navigation} userId={userId} resourceType={resourceTypes.group} />
            }
            {
              (focusedOption === 3) &&
              <PendingResources route={route} navigation={navigation} userId={userId} resourceType={resourceTypes.institution} />
            }
            {
              (focusedOption === 4) &&
              <PendingResources route={route} navigation={navigation} userId={userId} resourceType={resourceTypes.farmland} />
            }
          </View>
      }
    </SafeAreaView>
  );
}
