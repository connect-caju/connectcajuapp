import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { customizeItem } from "../../helpers/customizeItem";
import GroupItem from "../../components/GroupItem/GroupItem";
import FarmerItem from "../../components/FarmerItem/FarmerItem";
import InstitutionItem from "../../components/InstitutionItem/InstitutionItem";
import COLORS from "../../consts/colors";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import { roles } from "../../consts/roles";
import { Icon } from "@rneui/base";
import {
  faEllipsisVertical,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { extractIDs } from "../../helpers/extractIDs";
import CustomDivider from "../../components/Divider/CustomDivider";
import { farmerTypes } from "../../consts/farmerTypes";

const { useRealm } = realmContext;

const districtSingleFarmers = "districtSingleFarmers";
const districtGroupFarmers = "districtGroupFarmers";

const districtInstitutionFarmers = "districtInstitutionFarmers";

const districtFarmlands = "districtFarmlands";
const serviceProviderSubs = "serviceProviderSubs";
const actorMembershipSubs = "actorMembershipSubs";
const invalidatedSingleFarmers = "invalidatedSingleFarmers";
const invalidatedGroupFarmers = "invalidatedGroupFarmers";
const invalidatedInstitutionFarmers = "invalidatedInstitutionFarmers";

const provincialStats = "provincialStats";

const filterByCriteria = [
  {
    criteriaType: "Meus",
    iconName: "all-inclusive",
    focusedOption: 1,
  },
  {
    criteriaType: "Devolvidos",
    iconName: "all-inclusive",
    focusedOption: 2,
  },
  {
    criteriaType: "Todos",
    iconName: "all-inclusive",
    focusedOption: 3,
  },
];

const FarmersListScreen = ({ route, navigation }: any) => {
  const realm = useRealm();
  const user = useUser();
  let customUserData = user.customData;
  customUserData = {
    name: customUserData?.name,
    userDistrict: customUserData?.userDistrict,
    userProvince: customUserData?.userProvince,
    userId: customUserData?.userId,
    role: customUserData?.role,
  };

  const [focusedOption, setFocusedOption] = useState(1);

  const handleFocusedOption = (option: any) => {
    setFocusedOption(option);
  };

  const farmerType = route.params?.farmerType || farmerTypes.farmer;
  let farmersRegisteredByUser: any;
  // let farmersRegisteredByAllDistrictUsers;
  let farmlands;
  let serviceProviders;
  let farmersIDs: any; // IDs to be used for swiping between farmersRegisteredByUser' screen

  if (farmerType === farmerTypes.farmer) {
    farmersRegisteredByUser = realm
      .objects("Actor")
      // .filtered("userDistrict == $0", customUserData?.userDistrict)
      .filtered("userId == $0", customUserData?.userId);
    serviceProviders = realm
      .objects("SprayingServiceProvider")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmlands = realm
      .objects("Farmland")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmersRegisteredByUser = customizeItem(
      farmersRegisteredByUser,
      farmlands,
      serviceProviders,
      customUserData,
      farmerTypes.farmer,
    );
    farmersIDs = extractIDs(farmersRegisteredByUser);
  } else if (farmerType === farmerTypes.group) {
    farmersRegisteredByUser = realm
      .objects("Group")
      // .filtered("userDistrict == $0", customUserData?.userDistrict)
      .filtered("userId == $0", customUserData?.userId);

    serviceProviders = realm
      .objects("SprayingServiceProvider")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmlands = realm
      .objects("Farmland")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmersRegisteredByUser = customizeItem(
      farmersRegisteredByUser,
      farmlands,
      serviceProviders,
      customUserData,
      farmerTypes.group,
    );
    farmersIDs = extractIDs(farmersRegisteredByUser);
  } else if (farmerType === farmerTypes.institution) {
    farmersRegisteredByUser = realm
      .objects("Institution")
      // .filtered("userDistrict == $0", customUserData?.userDistrict)
      .filtered("userId == $0", customUserData?.userId);

    serviceProviders = realm
      .objects("SprayingServiceProvider")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmlands = realm
      .objects("Farmland")
      .filtered("userDistrict == $0", customUserData?.userDistrict);
    farmersRegisteredByUser = customizeItem(
      farmersRegisteredByUser,
      farmlands,
      serviceProviders,
      customUserData,
      farmerTypes.institution,
    );
    farmersIDs = extractIDs(farmersRegisteredByUser);
  }

  const [isEndReached, setIsEndReached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundFarmersList, setFoundFarmersList] = useState([]);

  // // This state will be used to toggle between showing all items and only showing the current user's items
  // // This is initialized based on which subscription is already active

  useEffect(() => {
    if (
      customUserData?.role !== roles.provincialManager &&
      customUserData?.role !== roles.ampcmSupervisor
    ) {
      if (farmerType === farmerTypes.farmer && focusedOption === 1) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtSingleFarmers);
          mutableSubs.add(
            realm
              .objects("Actor")
              .filtered(`userId == "${user?.customData?.userId}"`),
            { name: districtSingleFarmers },
          );
        });
      } else if (farmerType === farmerTypes.farmer && focusedOption === 2) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(invalidatedSingleFarmers);
          mutableSubs.add(
            realm.objects("Actor").filtered('status == "invalidated"'),
            { name: invalidatedSingleFarmers },
          );
        });
      } else if (farmerType === farmerTypes.farmer && focusedOption === 3) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtSingleFarmers);
          mutableSubs.add(
            realm
              .objects("Actor")
              .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
            { name: districtSingleFarmers },
          );
        });
      }

      if (farmerType === farmerTypes.group && focusedOption === 1) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtGroupFarmers);
          mutableSubs.add(
            realm
              .objects("Group")
              .filtered(`userId == "${user?.customData?.userId}"`),
            { name: districtGroupFarmers },
          );
        });
      } else if (farmerType === farmerTypes.group && focusedOption === 2) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtGroupFarmers);
          mutableSubs.add(
            realm
              .objects("Group")
              .filtered(`userId == "${user?.customData?.userId}"`),
            { name: districtGroupFarmers },
          );
        });
      } else if (farmerType === farmerTypes.group && focusedOption === 3) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(invalidatedGroupFarmers);
          mutableSubs.add(
            realm.objects("Group").filtered('status == "invalidated"'),
            { name: invalidatedGroupFarmers },
          );
        });
      }

      if (farmerType === farmerTypes.institution && focusedOption === 1) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtInstitutionFarmers);
          mutableSubs.add(
            realm
              .objects("Institution")
              .filtered(`userId == "${user?.customData?.userId}"`),
            { name: districtInstitutionFarmers },
          );
        });
      } else if (
        farmerType === farmerTypes.institution &&
        focusedOption === 2
      ) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(invalidatedInstitutionFarmers);
          mutableSubs.add(
            realm.objects("Institution").filtered('status == "invalidated"'),
            { name: invalidatedInstitutionFarmers },
          );
        });
      } else if (
        farmerType === farmerTypes.institution &&
        focusedOption === 3
      ) {
        realm.subscriptions.update((mutableSubs) => {
          mutableSubs.removeByName(districtInstitutionFarmers);
          mutableSubs.add(
            realm
              .objects("Institution")
              .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
            { name: districtInstitutionFarmers },
          );
        });
      }

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(districtFarmlands);
        mutableSubs.add(
          realm
            .objects("Farmland")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: districtFarmlands },
        );
      });

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(serviceProviderSubs);
        mutableSubs.add(
          realm
            .objects("SprayingServiceProvider")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: serviceProviderSubs },
        );
      });

      realm.subscriptions.update((mutableSubs) => {
        mutableSubs.removeByName(actorMembershipSubs);
        mutableSubs.add(
          realm
            .objects("ActorMembership")
            .filtered(`userDistrict == "${user?.customData?.userDistrict}"`),
          { name: actorMembershipSubs },
        );
      });
    } else if (customUserData?.role === roles.provincialManager) {
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
  }, [realm, user, focusedOption]);

  useEffect(() => {
    if (isSearching && searchQuery.length > 0) {
      setFoundFarmersList(
        farmersRegisteredByUser.filter((item: any) => {
          if (farmerType?.includes(farmerTypes.farmer)) {
            return item.name
              ?.toLowerCase()
              ?.includes(searchQuery.toLowerCase());
          } else if (farmerType?.includes(farmerTypes.group)) {
            return (
              item.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
              item.type?.toLowerCase()?.includes(searchQuery.toLowerCase())
            );
          } else if (farmerType?.includes(farmerTypes.institution)) {
            return (
              item.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
              item.manager?.toLowerCase()?.includes(searchQuery.toLowerCase())
            );
          }
        }),
      );
    }
  }, [isSearching, searchQuery]);

  const keyExtractor = (item: any, index: any) => index.toString();
  const keyExtractor2 = (item: any, index: any) => index.toString();

  const handleEndReached = () => {
    if (!isEndReached && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

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
      style={{
        backgroundColor: COLORS.ghostwhite,
        flex: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: 10,
          paddingBottom: 10,
          backgroundColor: COLORS.fourth,
          borderTopWidth: 0,
          borderColor: COLORS.fourth,
          borderBottomWidth: 3,
          borderLeftWidth: 3,
          borderRightWidth: 3,
        }}
      >
        {!isSearching ? (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 5,
                alignItems: "center",
              }}
            >
              <View style={{}}>
                <Text
                  style={{
                    fontFamily: "JosefinSans-Bold",
                    color: COLORS.black,
                    fontSize: 30,
                  }}
                >
                  {farmerType === farmerTypes.group
                    ? "Organizações"
                    : farmerType === farmerTypes.farmer
                    ? "Produtores"
                    : "Instituições"}{" "}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: COLORS.lightgrey,
                    backgroundColor: COLORS.lightgrey,
                    padding: 6,
                  }}
                  onPress={() => setIsSearching(true)}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    size={25}
                    color={COLORS.black}
                     />
                </TouchableOpacity>
                <View style={{ width: 6 }} />
                <TouchableOpacity
                  style={{
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: COLORS.lightgrey,
                    backgroundColor: COLORS.lightgrey,
                    padding: 6,
                  }}
                  onPress={() => {}}
                >
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    size={25}
                    color={COLORS.black}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <CustomDivider thickness={1} color={COLORS.lightgrey} />
          </>
        ) : (
          <View className="w-full">
            <View >
              <Pressable

                onPress={() => {
                  if (isSearching) {
                    setIsSearching(false);
                    setSearchQuery("");
                    setFoundFarmersList([]);
                  }
                }}
                style={{
                  position: "absolute",
                  left: -2,
                  top: 5,
                  flexDirection: "row",
                }}
              >
                <Icon
                  name="arrow-back-ios"
                  color={COLORS.main}
                  size={wp("8%")}
                />
              </Pressable>
            </View>
            <View
              className="flex flex-1 justify-center items-center"
            >
              <TextInput
                autoFocus={isSearching ? true : false}
                placeholder="Procurar"
                placeholderTextColor={COLORS.lightgrey}
                style={{
                  width: "100%",
                  backgroundColor: COLORS.white,
                  borderRadius: 30,
                  color: COLORS.grey,
                  fontFamily: "JosefinSans-Regular",
                  borderWidth: 1,
                  textAlign: "left",
                  paddingLeft: 20,
                  fontSize: 16,
                  borderColor: COLORS.white,
                }}
                value={searchQuery}
                onFocus={() => {}}
                onEndEditing={() => {}}
                onChangeText={(text: any) => setSearchQuery(text)}
              />
            </View>
          </View>
        )}

        {!isSearching && (
          <View
            style={{
              marginTop: 5,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <FlatList
              data={filterByCriteria}
              keyExtractor={keyExtractor2}
              horizontal
              showsHorizontalScrollIndicator={false}
              // ListHeaderComponent={<View style={{ width: 6, }} />}
              snapToInterval={86}
              decelerationRate="fast"
              renderItem={({ item }: any) => {
                return (
                  <TouchableOpacity
                    style={{
                      marginRight: 10,
                      backgroundColor:
                        focusedOption === item.focusedOption
                          ? COLORS.main
                          : COLORS.fourth,
                      borderColor:
                        focusedOption === item.focusedOption
                          ? COLORS.main
                          : COLORS.lightgrey,
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 10,
                      paddingBottom: 5,
                      borderRadius: 100,
                      elevation: 1,
                    }}
                    onPress={() => handleFocusedOption(item.focusedOption)}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        color:
                          focusedOption === item.focusedOption
                            ? COLORS.white
                            : COLORS.grey,
                        fontFamily: "JosefinSans-Regular",
                        textAlign: "center",
                      }}
                    >
                      {item.criteriaType}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </View>

      {farmersRegisteredByUser?.length > 0 && searchQuery.length === 0 ? (
        <View className="my-6">
          <FlatList
            StickyHeaderComponent={() => (
              <View
                style={{
                  height: hp("10%"),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            )}
            stickyHeaderHiddenOnScroll={true}
            data={farmersRegisteredByUser}
            keyExtractor={keyExtractor}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            // @ts-expect-error TS(7030): Not all code paths return a value.
            renderItem={({ item }: any) => {
              // add all the IDs to each item to allow swiping between screens...
              // when the user open any item from the list
              item.farmersIDs = farmersIDs;

              if (item.flag === farmerTypes.group) {
                return <GroupItem route={route} item={item} />;
              } else if (item.flag === farmerTypes.farmer) {
                return (
                  <FarmerItem
                    route={route}
                    navigation={navigation}
                    item={item}
                  />
                );
              } else if (item.flag === farmerTypes.institution) {
                return <InstitutionItem route={route} item={item} />;
              }
            }}
            ListFooterComponent={() => {
              if (!isEndReached) {
                return (
                  <View
                    style={{
                      // height: 10,
                      backgroundColor: COLORS.ghostwhite,
                      paddingBottom: 15,
                      marginBottom: 100,
                    }}
                  />
                );
              }
              return null;
            }}
          />
        </View>
      ) : isSearching && searchQuery.length > 0 ? (
        <View
          alignItems="stretch"
          w="100%"
          style={{
            marginVertical: 7,
            // marginTop: 10,
          }}
        >
          <FlatList
            StickyHeaderComponent={() => (
              <View
                style={{
                  height: hp("10%"),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
              </View>
            )}
            stickyHeaderHiddenOnScroll={true}
            data={foundFarmersList}
            keyExtractor={keyExtractor}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            // @ts-expect-error TS(7030): Not all code paths return a value.
            renderItem={({ item }: any) => {
              if (item.flag === farmerTypes.group) {
                return <GroupItem route={route} item={item} />;
              } else if (item.flag === farmerTypes.farmer) {
                return (
                  <FarmerItem
                    route={route}
                    navigation={navigation}
                    item={item}
                  />
                );
              } else if (item.flag === farmerTypes.institution) {
                return <InstitutionItem route={route} item={item} />;
              }
            }}
            ListFooterComponent={() => {
              if (!isEndReached) {
                return (
                  <View
                    style={{
                      // height: 10,
                      backgroundColor: COLORS.ghostwhite,
                      paddingBottom: 15,
                      marginBottom: 100,
                    }}
                  ></View>
                );
              }
              return null;
            }}
          />
        </View>
      ) : (
        <View className="flex justify-center items-center h-full">
          <Text className="text-black text-center leading-6 mx-10 text-xl">
            Nenhum registo de
            {farmerType === farmerTypes.group
              ? " organizações"
              : farmerType === farmerTypes.farmer
              ? " produtores"
              : " instituições"}{" "}
            foi encontrado!
          </Text>
        </View>
      )}

      {foundFarmersList.length === 0 && searchQuery.length > 0 && (
        <View className="flex justify-center items-center h-full">
          <Text
            style={{
              color: COLORS.grey,
              fontSize: 16,
              fontFamily: "JosefinSans-Bold",
              marginHorizontal: 40,
              lineHeight: 22,
              textAlign: "center",
            }}
          >
            Nenhum registo de
            {farmerType === farmerTypes.group
              ? " organizações"
              : farmerType === farmerTypes.farmer
              ? " produtores"
              : " instituições"}{" "}
            foi encontrado!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FarmersListScreen;
