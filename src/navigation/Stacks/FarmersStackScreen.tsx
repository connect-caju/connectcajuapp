/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import React, { useState, useEffect, } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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
import ProfileScreen from "../../screens/ActorScreen/ProfileScreen";
import FarmersListLayout from "../../screens/FarmersListLayout/FarmersListLayout";
import FarmersSearchScreen from "../../screens/FarmersSearchScreen/FarmersSearchScreen";

const FarmersStack = createNativeStackNavigator();


export default function FarmersStackScreen({
  route,
  navigation
}: any) {


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

        // @ts-expect-error TS(2322): Type '({ route, navigation }: any) => Element | un... Remove this comment to see the full error message
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
      <FarmersStack.Screen name="FarmersListLayout" component={FarmersListLayout} />
      <FarmersStack.Screen name="Camera" component={CameraScreen} />
      <FarmersStack.Screen name="Profile" component={ProfileScreen} />
      <FarmersStack.Screen name="FarmersSearch" component={FarmersSearchScreen} />
    </FarmersStack.Navigator>
  );
}
