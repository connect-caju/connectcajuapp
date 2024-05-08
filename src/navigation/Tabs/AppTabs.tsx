import React from "react";
import { StatusBar } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Octicons from "react-native-vector-icons/Octicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeStackScreen from "../Stacks/HomeStackScreen";
import FarmersStackScreen from "../Stacks/FarmersStackScreen";
import COLORS from "../../consts/colors";

import { useUser } from "@realm/react";

import UsersStackScreen from "../Stacks/UsersStackScreen";
import { useColorScheme } from "nativewind";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/Avatar";
import UserProfileScreen from "../../screens/UserProfileScreen/UserProfileScreen";
import { cn } from "../../../lib/utils";
import { getInitials } from "../../helpers/getInitials";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const user = useUser();
  const customUserData = user?.customData;
  const { colorScheme } = useColorScheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeStack"
        // shifting={true}
        // labeled={false}
        screenOptions={() => ({
          headerShown: false,
          tabBarStyle: {
            marginTop: 0,
          },
          tabBarIconStyle: {},
          tabBarActiveBackgroundColor:
            colorScheme === "dark" ? "#000000" : "#ffffff",
          tabBarInactiveBackgroundColor:
            colorScheme === "dark" ? "#000000" : "#ffffff",
          tabBarAllowFontScaling: true,
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: {
            color: colorScheme === "dark" ? "#ffffff" : COLORS.grey,
            fontSize: 12,
            fontWeight: "bold",
          },
        })}
      >
        <Tab.Screen
          options={{
            tabBarIcon: (tabInfo) => (
              tabInfo.focused ? <MaterialCommunityIcons
              name="view-grid"
              size={30}
              color={
                tabInfo.focused
                  ? COLORS.main
                  : colorScheme === "dark"
                  ? COLORS.white
                  : COLORS.black
              }
            />
            :
              <MaterialCommunityIcons
                name="view-grid-outline"
                size={30}
                color={
                  tabInfo.focused
                    ? COLORS.main
                    : colorScheme === "dark"
                    ? COLORS.white
                    : COLORS.black
                }
              />
            ),
            tabBarLabel: "Painel",
          }}
          name="HomeStack"
          component={HomeStackScreen}
        />

        <Tab.Screen
          options={({ route }) => ({
            tabBarIcon: (tabInfo) =>
              tabInfo.focused ? (
                <MaterialIcons
                  name="add-box"
                  size={35}
                  color={
                    tabInfo.focused
                      ? COLORS.main
                      : colorScheme === "dark"
                      ? COLORS.white
                      : COLORS.black
                  }
                />
              ) : (
                <Octicons
                  name="diff-added"
                  color={
                    tabInfo.focused
                      ? COLORS.main
                      : colorScheme === "dark"
                      ? COLORS.white
                      : COLORS.black
                  }
                  size={30}
                />
              ),
            tabBarLabel: "Registo",

            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";

              if (routeName === "FarmersSearch") {
                return { display: "none" };
              }
              return;
            })(route),
          })}
          name="FarmersStack"
          component={FarmersStackScreen}
        />

        <Tab.Screen
          options={({ route }) => ({
            tabBarIcon: (tabInfo) => (
              <MaterialIcons
                name="track-changes"
                size={35}
                color={
                  tabInfo.focused
                    ? COLORS.main
                    : colorScheme === "dark"
                    ? COLORS.white
                    : COLORS.black
                }
              />
            ),
            tabBarLabel: "Monitoria",

            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";

              if (routeName === "UserProfile") {
                return { display: "none" };
              }
              return;
            })(route),
          })}
          name="TrackTransactionsStack"
          component={UserProfileScreen}
        />

        <Tab.Screen
          options={({ route }) => ({
            tabBarIcon: (tabInfo) => (
              <Avatar
                className={cn("bg-black w-8 h-8 dark:bg-white", {
                  " bg-[#008000]": tabInfo.focused,
                })}
              >
                <AvatarImage
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/1603610343905058816/PsPEWMOJ_400x400.jpgx",
                  }}
                />
                <AvatarFallback textClassname="text-white dark:text-black">
                  {getInitials(customUserData.name)}
                </AvatarFallback>
              </Avatar>
            ),
            tabBarLabel: "Você",

            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";

              if (routeName === "UserProfile") {
                return { display: "none" };
              }
              return;
            })(route),
          })}
          name="UserProfile"
          component={UserProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
