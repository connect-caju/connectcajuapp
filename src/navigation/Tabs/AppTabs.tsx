import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { responsiveFontSize } from "react-native-responsive-dimensions";

import HomeStackScreen from "../Stacks/HomeStackScreen";
import FarmersStackScreen from "../Stacks/FarmersStackScreen";
import COLORS from "../../consts/colors";

import { useUser } from "@realm/react";
import { roles } from "../../consts/roles";
import UsersStackScreen from "../Stacks/UsersStackScreen";


const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const user = useUser();
  const customUserData = user?.customData;
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeStack"
        shifting={true}
        labeled={false}
        // @ts-expect-error TS(2322): Type '() => { headerShown: false; tabBarStyle: { m... Remove this comment to see the full error message
        screenOptions={() => ({
          headerShown: false,
          tabBarStyle: {
            // minHeight: hp('2%'),
            marginTop: 0,
          },
          tabBarIconStyle: {},
          tabBarActiveBackgroundColor: "#EBEBE4",
          tabBarInactiveBackgroundColor: "#EBEBE4",
          tabBarAllowFontScaling: true,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: "true",
          tabBarLabelStyle: {
            fontSize: responsiveFontSize(16),
            fontFamily: "JosefinSans-Bold",
          },
        })}
      >
        <Tab.Screen
          options={{
            tabBarIcon: (tabInfo) => (
              <Icon
                name="home"
                color={tabInfo.focused ? COLORS.main : COLORS.grey}
                size={wp("10%")}
              />
            ),
            tabBarLabel: "Painel",
          }}
          name="HomeStack"
          component={HomeStackScreen}
        />

        {!roles.haveReadAndValidatePermissions.some(
          (role) => role === customUserData?.role,
        ) ? (
          <Tab.Screen
            options={({ route }) => ({
              tabBarIcon: (tabInfo) => (
                <Icon
                  name="app-registration"
                  color={tabInfo.focused ? COLORS.main : COLORS.grey}
                  size={wp("10%")}
                />
              ),
              tabBarLabel: "Produtores",

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
        ) : (
          <Tab.Screen
            options={({ route }) => ({
              tabBarIcon: (tabInfo) => (
                <Icon
                  name="app-registration"
                  color={tabInfo.focused ? COLORS.main : COLORS.grey}
                  size={wp("10%")}
                />
              ),
              tabBarLabel: "Usuários",

              tabBarStyle: ((route) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? "";

                if (routeName === "FarmersSearch") {
                  return { display: "none" };
                }
                return;
              })(route),
            })}
            name="UsersStack"
            component={UsersStackScreen}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
