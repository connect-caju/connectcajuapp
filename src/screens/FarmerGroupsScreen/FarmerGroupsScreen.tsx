/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  ImageBackground,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import { Box, Stack, Center } from "native-base";
import { Icon } from "@rneui/base";

import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";

import Animated, { LightSpeedOutRight } from "react-native-reanimated";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

import COLORS from "../../consts/colors";

import { realmContext } from "../../models/realmContext";

const { useRealm, useQuery } = realmContext;

export function FarmerGroupItem({
  item
}: any) {
  const navigation = useNavigation();

  return (
    <Animated.View
      exiting={LightSpeedOutRight}
      style={{
        // borderWidth: 1,
        marginHorizontal: 10,
        marginVertical: 10,
        //  width: '90%',
        height: 300,
        shadowOffset: {
          width: 0,
          height: 3,
        },
      }}
    >
      <TouchableOpacity
        style={
          {
            // width: '100%',
          }
        }
        onPress={() => {

          // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
          navigation.navigate("Group", { ownerId: item?._id });
        }}
      >
        <View
          style={{
            width: "100%",
            height: "70%",
            backgroundColor: COLORS.lightgrey,
          }}
        >
          {item?.image && (
            <ImageBackground
              source={{ uri: item?.image }}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover"
            ></ImageBackground>
          )}

          {!item?.image && (
            <View
              style={{
                padding: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faPeopleGroup}
                  size={120}
                  color={COLORS.grey}
                />
              </View>
            </View>
          )}

          <View
            style={{
              minHeight: "30%",
              width: "100%",
              borderWidth: 1,
              borderColor: COLORS.lightgrey,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: COLORS.black,
                fontFamily: "JosefinSans-Bold",
              }}
            >
              {item?.name}{" "}
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.grey,
                  fontFamily: "JosefinSans-Regular",
                  // textAlign: 'right',
                }}
              >
                ({item?.type})
              </Text>
            </Text>

            <Stack
              direction="row"

              // @ts-expect-error TS(2322): Type '{ children: Element[]; direction: "row"; sty... Remove this comment to see the full error message
              style={{
                // paddingHorizontal: 10,
                paddingTop: 4,
              }}
            >
              <Box w="50%">
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.grey,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Declarados: {item?.numberOfMembers?.total}
                </Text>
              </Box>
              <Box w="50%">
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.grey,
                    fontFamily: "JosefinSans-Regular",
                    textAlign: "right",
                  }}
                >
                  Registados:{" "}
                  {item?.members?.length > 0 ? item?.members?.length : 0}
                </Text>
              </Box>
            </Stack>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function FarmerGroupsScreen({
  navigation,
  route
}: any) {
  const { farmerId } = route.params;
  const realm = useRealm();

  let farmerMembership = realm
    .objects("ActorMembership")
    .filtered("actorId == $0", farmerId);
  const [groupsList, setGroupsList] = useState([]);
  const [actorName, setActorName] = useState("");

  let groups: any = [];
  let actor = realm.objectForPrimaryKey("Actor", farmerId);
  if (farmerMembership.length > 0) {

    // @ts-expect-error TS(2322): Type 'Object<unknown, never> | undefined' is not a... Remove this comment to see the full error message
    farmerMembership = farmerMembership[0];

    // @ts-expect-error TS(2339): Property 'membership' does not exist on type 'Resu... Remove this comment to see the full error message
    groups = farmerMembership?.membership.map((membership: any) => {
      return realm.objectForPrimaryKey("Group", membership.organizationId);
    });
  }

  const handleGroupsList = () => {
    if (groups.length > 0) {

      setGroupsList(groups?.map((group: any) => group));
    }
  };

  useEffect(() => {
    handleGroupsList();

    // @ts-expect-error TS(2339): Property 'names' does not exist on type 'Object<un... Remove this comment to see the full error message
    setActorName(`${actor?.names.otherNames} ${actor?.names.surname}`);
  }, [realm]);

  const keyExtractor = (item: any, index: any) => index.toString();

  return (
    <SafeAreaView
      style={{
        minHeight: "100%",
        width: "100%",
        backgroundColor: COLORS.ghostwhite,
        // margin: 20,
      }}
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
          marginBottom: 30,
        }}
      >
        <Stack direction="row" w="100%">
          <Center w="10%">
            <Pressable
              onPress={() => {
                navigation.navigate("Farmer", {
                  ownerId: farmerId,
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
                {actorName}
              </Text>
              <Text
                style={{
                  fontFamily: "JosefinSans-Regular",
                  fonSize: responsiveFontSize(1),
                }}
              >
                [
                // @ts-expect-error TS(2339): Property 'membership' does not exist on type 'Resu... Remove this comment to see the full error message
                // @ts-expect-error TS(2339): Property 'membership' does not exist on type 'Resu... Remove this comment to see the full error message
                {`Organizações de Produtores: ${farmerMembership?.membership?.length > 0

                    // @ts-expect-error TS(2339): Property 'membership' does not exist on type 'Resu... Remove this comment to see the full error message
                    ? farmerMembership?.membership?.length
                    : 0
                  }`}
                ]
              </Text>
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

      {groupsList?.length > 0 ? (
        <FlatList

          // @ts-expect-error TS(2322): Type '{ style: {}; }' is not assignable to type 'I... Remove this comment to see the full error message
          StickyHeaderComponent={() => <Box style={{}}></Box>}
          stickyHeaderHiddenOnScroll={true}
          data={groupsList}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.1}
          renderItem={({
            item
          }: any) => {
            return <FarmerGroupItem route={route} item={item} />;
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
            {actorName}
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
            Não pertence a nenhuma organização de produtores!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
