/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Pressable,
  ImageBackground,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import { Box, Stack, Center } from "native-base";
import { Icon, Card } from "@rneui/base";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from "react-native-responsive-screen";

import {
  responsiveFontSize,
  responsiveScreenFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenHeight,
  responsiveScreenWidth,
  useDimensionsChange,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";

import Animated, {
  Layout,
  LightSpeedInLeft,
  LightSpeedOutRight,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

import COLORS from "../../consts/colors";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import CustomDivider from "../../components/Divider/CustomDivider";
import { getInitials } from "../../helpers/getInitials";
import { farmerTypes } from "../../consts/farmerTypes";
import { backgroundStyle } from "../../styles/globals";
// import { TextInput } from 'react-native-paper';
const { useRealm, useQuery } = realmContext;

export function MemberItem({
  item,
  isGroupManager
}: any) {
  const navigation = useNavigation();

  return (
    <Animated.View
      exiting={LightSpeedOutRight}
      style={{
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: isGroupManager ? 5 : 0,
        borderColor: isGroupManager ? COLORS.main : "",
        width: "45%",
        height: 150,
        shadowOffset: {
          width: 0,
          height: 3,
        },
      }}
    >
      <TouchableOpacity
        onPress={() => {

          // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
          navigation.navigate("Profile", {
            ownerId: item._id,
            farmerType: farmerTypes.farmer,
            farmersIDs: [],
          });
        }}
      >
        <View
          style={{
            width: "100%",
            height: "70%",
            backgroundColor: COLORS.lightgrey,
          }}
        >
          {item.image && (
            <ImageBackground
              source={{ uri: item.image }}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover"
            ></ImageBackground>
          )}

          {!item.image && (
            <View
              style={{
                padding: 5,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // width: '100%',
                }}
              >
                <FontAwesomeIcon
                  icon={faUserTie}
                  size={90}
                  color={COLORS.grey}
                />
              </View>
            </View>
          )}
        </View>
        <View
          style={{
            height: "30%",
            width: "100%",
            borderTopWidth: 0,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: COLORS.lightgrey,
            paddingHorizontal: 5,
            // marginTop: -5,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: COLORS.black,
              fontFamily: "JosefinSans-Italic",
            }}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {item.names.otherNames} {item.names.surname}
          </Text>

          <Text
            style={{
              fontSize: 10,
              color: COLORS.grey,
              fontFamily: "JosefinSans-Regular",
              textAlign: "right",
            }}
          >
            ({new Date().getFullYear() - new Date(item.birthDate).getFullYear()}{" "}
            anos)
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function GroupMembersScreen({
  navigation,
  route
}: any) {
  const { groupId } = route.params;
  const realm = useRealm();

  const group = realm.objectForPrimaryKey("Group", groupId);

  // @ts-expect-error TS(2339): Property 'members' does not exist on type 'Object<... Remove this comment to see the full error message
  const members = group?.members.map((memberId: any) => {
    return realm.objectForPrimaryKey("Actor", memberId);
  });

  const [membersList, setMembersList] = useState([]);

  const handleMembersList = () => {
    setMembersList(members.map((member: any) => member));
  };

  useEffect(() => {
    handleMembersList();
  }, [realm]);

  const keyExtractor = (item: any, index: any) => index.toString();

  return (
    <SafeAreaView
      className={`min-h-full ${backgroundStyle}`}
    >
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
          <Center w="10%">
            <Pressable
              onPress={() => {
                navigation.navigate("Profile", {
                  ownerId: groupId,
                  farmerType: farmerTypes.group,
                  farmersIDs: [],
                });
              }}
              style={{
                position: "absolute",
                left: 4,
                top: 4,
                flexDirection: "row",
                // justifyContent: 'center',
                alignItems: "center",
              }}
            >
              <Icon name="arrow-back" color={COLORS.black} size={30} />
            </Pressable>
          </Center>

          <Box w="80%">
            <Center>
              <Text
                style={{
                  fontFamily: "JosefinSans-Bold",
                  fontSize: 14,
                  color: COLORS.main,
                }}
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >
                {group?.name}
              </Text>

              <Stack direction="row" space={2} my="1">
                <Center>
                  <Text
                    style={{
                      fontFamily: "JosefinSans-Regular",
                      fonSize: responsiveFontSize(1),
                    }}
                  >
                    [{"Declarados:"} {group?.numberOfMembers.total}]
                  </Text>
                </Center>
                <Center>
                  <Text
                    style={{
                      fontFamily: "JosefinSans-Regular",
                      fonSize: responsiveFontSize(1),
                    }}
                  >
                    [{"Registados:"} {membersList.length}]
                  </Text>
                </Center>
              </Stack>
            </Center>
          </Box>
          <Box
            w="10%"

            // @ts-expect-error TS(2322): Type '{ w: "10%"; style: { justifyContent: string;... Remove this comment to see the full error message
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Box>
        </Stack>
      </View>

      <View
        style={{
          padding: 10,
          // justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        {membersList?.length > 0 ? (
          <FlatList
            numColumns={2}
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
            data={membersList}
            keyExtractor={keyExtractor}
            // onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            renderItem={({
              item
            }: any) => {
              // check if this MemberItem is of the Group Manager

              // @ts-expect-error TS(2531): Object is possibly 'null'.
              const isGroupManager = item._id === group.manager;
              return (
                <MemberItem
                  route={route}
                  isGroupManager={isGroupManager}
                  item={item}
                />
              );
            }}
            ListFooterComponent={() => {
              return (
                <Box

                  // @ts-expect-error TS(2322): Type '{ children: Element; style: { paddingBottom:... Remove this comment to see the full error message
                  style={{
                    paddingBottom: 150,
                  }}
                >
                  <Text></Text>
                </Box>
              );
            }}
          />
        ) : (
          <View
            style={{
              height: "80%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "JosefinSans-Bold",
                fontSize: 16,
                color: COLORS.black,
                textAlign: "center",
              }}
            >
              {group?.name}
            </Text>
            <Text
              style={{
                paddingHorizontal: 30,
                fontSize: 14,
                fontFamily: "JosefinSans-Regular",
                color: COLORS.black,
                textAlign: "center",
                lineHeight: 25,
              }}
            >
              Não tem ainda produtor registado
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
