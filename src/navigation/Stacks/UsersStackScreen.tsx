/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

import React, { useState, useEffect, } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

import UsersListScreen from "../../screens/UsersList.js/UsersListScreen";

const UsersStack = createNativeStackNavigator();


export default function UsersStackScreen({ route, navigation }) {

    return (
        <UsersStack.Navigator
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
            initialRouteName={"UsersList"}
        >
            <UsersStack.Screen name={"UsersList"} component={UsersListScreen} />
            <UsersStack.Screen name="FarmerForm1" component={FarmerRegistration} />
            <UsersStack.Screen
                name="FarmlandForm1"
                component={FarmlandRegistration}
            />
            <UsersStack.Screen
                name="FarmlandAreaAudit"
                component={FarmlandAreaAuditScreen}
            />
            <UsersStack.Screen name="Geolocation" component={GeolocationScreen} />
            <UsersStack.Screen name="UserStat" component={UserStat} />
            <UsersStack.Screen name="Membership" component={MembershipScreen} />
            <UsersStack.Screen
                name="GroupRepresentative"
                component={GroupRepresentativeScreen}
            />
            <UsersStack.Screen name="GroupMembers" component={GroupMembersScreen} />
            <UsersStack.Screen name="FarmerGroups" component={FarmerGroupsScreen} />
            <UsersStack.Screen name="FarmersListLayout" component={FarmersListLayout} />
            <UsersStack.Screen name="Camera" component={CameraScreen} />
            <UsersStack.Screen name="Profile" component={ProfileScreen} />
            <UsersStack.Screen name="FarmersSearch" component={FarmersSearchScreen} />
        </UsersStack.Navigator>
    );
}
