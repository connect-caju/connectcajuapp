import {
  faBirthdayCake,
  faCheck,
  faDeleteLeft,
  faEllipsisVertical,
  faHome,
  faIdCard,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Icon } from "@rneui/base";
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Animated as NativeAnimated,
  Easing,
  useNativeDriverr,
} from "react-native";
import Animated, { BounceIn } from "react-native-reanimated";
import COLORS from "../../consts/colors";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { realmContext } from "../../models/realmContext";
import GroupMemberItem from "../GroupMemberItem/GroupMemberItem";
import { roles } from "../../consts/roles";
const { useRealm, useQuery, useObject } = realmContext;

export default function GroupMembersCard({
  setPresentGroupMemberOptions,
  handlePresentModalPress,
  group,
  customUserData
}: any) {
  const realm = useRealm();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const scale = useRef(new NativeAnimated.Value(0)).current;
  let members = [];
  if (group?.members?.length > 0) {
    const memberIDs = Array.from(group?.members);
    for (let i = 0; i < memberIDs.length; i++) {
      members.push(
        realm.objects("Actor").filtered("_id == $0", memberIDs[i])[0],
      );
    }
  }


  useEffect(() => {
    NativeAnimated.timing(scale, {
      toValue: isFocused ? 1 : 0, // opacity will be 1 when screen is in focus, 0 otherwise
      duration: 1000, // animation duration
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true, // using the native driver improves performance
    }).start();
  }, [isFocused]);

  return (
    <Animated.View
      // entering={BounceIn.duration(1000)}
      style={{
        // padding: 10,
        width: "100%",
        backgroundColor: COLORS.ghostwhite,
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        elevation: 3,
        opacity: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: COLORS.main,
          borderTopStartRadius: 10,
          borderTopEndRadius: 10,
          paddingRight: 10,
        }}
      >
        <View
          style={{
            width: "45%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.ghostwhite,
              padding: 10,
              fontSize: 15,
              fontFamily: "JosefinSans-Bold",
            }}
          >
            Registados: {group?.members.length}
          </Text>
        </View>

        <View
          style={{
            width: "45%",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.ghostwhite,
              padding: 10,
              fontSize: 15,
              fontFamily: "JosefinSans-Bold",
            }}
          >
            Declarados: {group?.numberOfMembers?.total}
          </Text>
        </View>

{ roles.haveReadAndWritePermissions.some((role)=>role === customUserData?.role) &&
         <TouchableOpacity
          onPress={() => {
            handlePresentModalPress();
            setPresentGroupMemberOptions(true);
          }}
          style={{
            paddingTop: 5,
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              padding: 6,
              borderRadius: 100,
              backgroundColor: COLORS.lightgrey,
            }}
          >
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              size={20}
              color={COLORS.black}
            />
          </View>
        </TouchableOpacity>
      }
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          minHeight: 200,
          paddingVertical: 8,
        }}
      >
        {(!group?.members || group?.members?.length) === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              disabled
              style={{
                padding: 5,
                borderWidth: 2,
                borderColor: COLORS.lightgrey,
                backgroundColor: COLORS.lightgrey,
                borderRadius: 120,
              }}
              onPress={() => {

              }}
            >
              <Icon
                name="person-add-alt-1"
                size={35}
                color={COLORS.ghostwhite}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.grey,
                fontFamily: "JosefinSans-Regular",
              }}
            >
              Adicionar Membros
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            {members.filter(member=>member)?.map((member, index) => {

                // @ts-expect-error TS(2339): Property '_id' does not exist on type 'Object<unkn... Remove this comment to see the full error message
                return <GroupMemberItem key={member?._id} member={member} />;
            })}
          </View>
        )}
      </View>
    </Animated.View>
  );
}
