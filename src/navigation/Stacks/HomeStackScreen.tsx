
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import UserProfileScreen from "../../screens/UserProfileScreen/UserProfileScreen";
import UserRecordsScreen from "../../screens/UserRecord/UserRecordsScreen";

const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen() {

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#EBEBE4",
        },
        headerTitleAlign: "center",
        headerTintColor: "#005000",
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: "bold",
          fontFamily: "JosefinSans-Italic",
        },
      }}
      initialRouteName="Home"
    >
      <HomeStack.Screen
        options={{ title: "Painel do Extensionista" }}
        name="Home"
        component={HomeScreen}
      />
      <HomeStack.Screen
          name="UserProfile"
          component={UserProfileScreen}
        />
      <HomeStack.Screen 
        name="UserRecords"
        component={UserRecordsScreen}
      />
    </HomeStack.Navigator>
  );
}
