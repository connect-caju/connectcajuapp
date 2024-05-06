import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  Dimensions,
  Easing,
  Animated as NativeAnimated,
} from "react-native";
import { FarmersStackParamList } from "../../navigation/Stacks/FarmersStackScreen";
import { useActorStore } from "../../app/stores/actorStore";


import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
const { useRealm, useQuery, useObject } = realmContext;


type Props = NativeStackScreenProps<FarmersStackParamList, "Profile">;

export default function ProfileScreen({ route, navigation }: Props){
  const { actorId } = route.params;
  const realm = useRealm();
  const actor = realm.objectForPrimaryKey("Actor", actorId);
  console.log("actor", actor)


  return (
    <View>
      <Text>Hello Profile</Text>
    </View>
  )
  
};

