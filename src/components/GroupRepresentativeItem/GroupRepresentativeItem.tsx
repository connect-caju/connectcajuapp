import {
  FlatList,
  InteractionManager,
  ScrollView,
  Switch,
  Image,
  SafeAreaView,
  Text,
  View,
  PermissionsAndroid,
  TextInput,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ListItem, Avatar, Icon, SearchBar } from "@rneui/themed";
import { Box, Center, Pressable, Stack } from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import Animated, {
  Layout,
  LightSpeedInLeft,
  LightSpeedOutRight,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

import COLORS from "../../consts/colors";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { farmerTypes } from "../../consts/farmerTypes";

const { useRealm, useQuery } = realmContext;

export default function GroupRepresentativeItem({
  item,
  isSelected,
  setSelectedId,
  selectedId
}: any) {
  const navigation = useNavigation();

  const showAddedGroupManagerToast = () => {
    Toast.show({
      type: "addedGroupManager",
      text1: "Representação da organização",
      props: { message: "Adicionado o Representante." },
    });
  };

  return (
    <View
      exiting={LightSpeedOutRight}
      className="flex flex-1 bg-white mx-2 py-2 my-1 rounded-md"
    >
      <Stack direction="row" w="100%">
        <Box
          w="10%"

          // @ts-expect-error TS(2322): Type '{ children: Element; w: "10%"; style: { heig... Remove this comment to see the full error message
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (selectedId !== item._id) {
                setSelectedId(item._id);
                showAddedGroupManagerToast();
              }
            }}
          >
            {isSelected ? (
              <Icon name="radio-button-on" size={30} color={COLORS.main} />
            ) : (
              <Icon name="radio-button-off" size={30} color={COLORS.grey} />
            )}
          </TouchableOpacity>
        </Box>

        <Box w="80%">
          <TouchableOpacity
            onPress={() => {
              if (selectedId !== item._id) {
                setSelectedId(item._id);
                showAddedGroupManagerToast();
              }
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "JosefinSans-Bold",
                color: COLORS.black,
                paddingLeft: 10,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.names?.otherNames} {item?.names?.surname}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "JosefinSans-Regular",
                color: COLORS.grey,
                paddingLeft: 10,
              }}
            >
              {item?.address?.adminPost}
            </Text>
          </TouchableOpacity>
        </Box>
        <Box
          w="10%"

          // @ts-expect-error TS(2322): Type '{ children: Element; w: "10%"; style: { heig... Remove this comment to see the full error message
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
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
            <Icon
              name="arrow-forward-ios"
              size={20}
              color={isSelected ? COLORS.main : COLORS.lightgrey}
            />
          </TouchableOpacity>
        </Box>
      </Stack>
    </View>
  );
}
