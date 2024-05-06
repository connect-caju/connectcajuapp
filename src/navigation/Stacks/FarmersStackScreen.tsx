import React, { useState, useEffect } from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import FarmersScreen from "../../screens/FarmersScreen/FarmersScreen";
import FarmerRegistration from "../../screens/FarmerRegistrationScreens/FarmerRegistration";
import FarmlandRegistration from "../../screens/FarmlandRegistrationScreens/FarmlandRegistration";
import FarmlandAreaAuditScreen from "../../screens/FarmlandAreaAuditScreen/FarmlandAreaAuditScreen";
import UserStat from "../../screens/UserStatScreen/UserStat";
import GeolocationScreen from "../../screens/GeolocationScreen/GeolocationScreen";
import MembershipScreen from "../../screens/MembershipScreen/MembershipScreen";
import GroupRepresentativeScreen from "../../screens/GroupRepresentantiveScreen/GroupRepresentativeScreen";
import GroupMembersScreen from "../../screens/GroupMembersScreen/GroupMembersScreen";
import FarmerGroupsScreen from "../../screens/FarmerGroupsScreen/FarmerGroupsScreen";
import CameraScreen from "../../screens/CameraScreen/CameraScreen";
import FarmersListLayout from "../../screens/FarmersListLayout/FarmersListLayout";
import FarmersSearchScreen from "../../screens/FarmersSearchScreen/FarmersSearchScreen";
import FormDataPreview from "../../screens/FormDataPreview/FormDataPreview";
import ProfileScreen from "../../screens/ActorScreen/ProfileScreen";

export type FarmersStackParamList = {
  Farmers: undefined;
  Profile: {
    actorId: string;
  };
  FormDataPreview: undefined;
  FarmerForm1: undefined;
  FarmlandForm1: undefined;
  FarmlandAreaAudit: undefined;
  Geolocation: undefined;
  Membership: undefined;
  GroupRepresentative: undefined;
  GroupMembers: undefined;
  FarmerGroups: undefined;
  Camera: undefined;
  UserStat: undefined;
  FarmersListLayout: undefined;
  FarmersSearch: undefined;
};

const FarmersStack = createNativeStackNavigator<FarmersStackParamList>();

export default function FarmersStackScreen({ route, navigation }: any) {
  return (
    <FarmersStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#005000",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        title: "Produtores",
      }}
      initialRouteName={"Farmers"}
    >
      <FarmersStack.Screen name={"Farmers"} component={FarmersScreen} />
      <FarmersStack.Screen name="FarmerForm1" component={FarmerRegistration} />
      <FarmersStack.Screen
        name="FarmlandForm1"
        component={FarmlandRegistration}
      />
      <FarmersStack.Screen
        name="FarmlandAreaAudit"
        component={FarmlandAreaAuditScreen}
      />
      <FarmersStack.Screen name="Geolocation" component={GeolocationScreen} />
      <FarmersStack.Screen name="UserStat" component={UserStat} />
      <FarmersStack.Screen name="Membership" component={MembershipScreen} />
      <FarmersStack.Screen
        name="GroupRepresentative"
        component={GroupRepresentativeScreen}
      />
      <FarmersStack.Screen name="GroupMembers" component={GroupMembersScreen} />
      <FarmersStack.Screen name="FarmerGroups" component={FarmerGroupsScreen} />
      <FarmersStack.Screen
        name="FarmersListLayout"
        component={FarmersListLayout}
      />
      <FarmersStack.Screen name="Camera" component={CameraScreen} />
      <FarmersStack.Screen name="Profile" component={ProfileScreen} />
      <FarmersStack.Screen
        name="FarmersSearch"
        component={FarmersSearchScreen}
      />
      <FarmersStack.Screen name="FormDataPreview" component={FormDataPreview} />
    </FarmersStack.Navigator>
  );
}
