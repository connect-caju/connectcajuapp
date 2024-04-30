/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
} from "react-native";
import { Overlay, Icon, Button } from "@rneui/base";
import { Box, CheckIcon, FormControl, Select, Stack } from "native-base";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from "uuid";

import { CustomInput } from "../Inputs/CustomInput";
import COLORS from "../../consts/colors";
// import CustomDivider from "../Divider/CustomDivider";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
const { useRealm, useQuery, useObject } = realmContext;

export default function UserItem({
  userItem
}: any) {
  const [targetFarmers, setTargetFarmers] = useState("");
  const [targetFarmlands, setTargetFarmlands] = useState("");
  const [userStats, setUserStats] = useState({});
  const [update, setUpdate] = useState(false);
  const [reset, setReset] = useState(false);
  const [errors, setErrors] = useState({});

  const user = useUser();
  const customUserData = user?.customData;
  const realm = useRealm();

  const userStat = useQuery("UserStat").filtered(
    "userId == $0",
    userItem?.userId,
  )[0];

  // updating user goal
  const updateUserGoal = useCallback(
    (newTargetFarmers: any, newTargetFarmlands: any) => {
      if (
        Number.isInteger(parseInt(newTargetFarmers)) &&
        Number.isInteger(parseInt(newTargetFarmlands))
      ) {
        const tFarmers = parseInt(newTargetFarmers);
        const tFarmlands = parseInt(newTargetFarmlands);

        if (userStat) {
          realm.write(() => {
            // @ts-expect-error TS(2339): Property 'targetFarmers' does not exist on type 'O... Remove this comment to see the full error message
            userStat.targetFarmers = tFarmers;
            // @ts-expect-error TS(2339): Property 'targetFarmlands' does not exist on type ... Remove this comment to see the full error message
            userStat.targetFarmlands = tFarmlands;
            // @ts-expect-error TS(2339): Property 'modifiedAt' does not exist on type 'Obje... Remove this comment to see the full error message
            userStat.modifiedAt = new Date();
            // @ts-expect-error TS(2339): Property 'modifiedBy' does not exist on type 'Obje... Remove this comment to see the full error message
            userStat.modifiedBy = customUserData?.name;
          });
        } else {
          realm.write(() => {
            const newStat = realm.create("UserStat", {
              _id: uuidv4(),
              userName: userItem.name,
              userId: userItem.userId,
              userDistrict: userItem.userDistrict,
              userProvince: userItem.userProvince,
              targetFarmers: tFarmers,
              targetFarmlands: tFarmlands,
              modifiedBy: customUserData?.name,
            });
          });
        }
      } else {
        setErrors({
          errorMessage: "Número inválido!",
        });
      }
    },
    [realm, userItem],
  );

  useEffect(() => {
    if (!userStat) {
      // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      setTargetFarmers(0);
      // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      setTargetFarmlands(0);
    } else {
      // @ts-expect-error TS(2339): Property 'targetFarmers' does not exist on type 'O... Remove this comment to see the full error message
      setTargetFarmers(userStat.targetFarmers);
      // @ts-expect-error TS(2339): Property 'targetFarmlands' does not exist on type ... Remove this comment to see the full error message
      setTargetFarmlands(userStat.targetFarmlands);
    }
  }, [userStat]);

  useEffect(() => {
    if (
      parseInt(targetFarmers) > 0 &&
      (parseInt(targetFarmlands) <= parseInt(targetFarmers) ||
        !parseInt(targetFarmlands))
    ) {
      setTargetFarmlands(targetFarmers);
    }
  }, [targetFarmers]);

  return (
    <Box
      // @ts-expect-error TS(2322): Type '{ children: any[]; className: string; }' is ... Remove this comment to see the full error message
      className="flex flex-1 bg-white shadow-md shadow-slate-200 my-1 h-16 items-center justify-center"
    >
      <Stack w="100%" direction="row" space={1} >
        <Box
          w="40%"
          // @ts-expect-error TS(2322): Type '{ children: Element; w: "40%"; className: st... Remove this comment to see the full error message
          className="justify-center "
        >
          <Text
            className="font-normal text-sm text-gray-600 pl-1"
          >
            {userItem?.name}
          </Text>
        </Box>
        <Box
          w="20%"
          // @ts-expect-error TS(2322): Type '{ children: Element; w: "20%"; className: st... Remove this comment to see the full error message
          className="justify-center items-center"
        >
          <FormControl isRequired my="1" isInvalid={"errorMessage" in errors}>
            <CustomInput
              width="90%"
              keyboardType="numeric"
              textAlign="center"
              isDisabled={!update}
              placeholder={`${targetFarmers}`}
              value={targetFarmers}
              onChangeText={(newNumber: any) => {
                setErrors((prev) => ({
                  ...prev,
                  errorMessage: "",
                }));
                setTargetFarmers(newNumber);
                setReset(false);
                setUpdate(true);
              }}
            />
          </FormControl>
        </Box>

        <Box
          w="20%"
          // @ts-expect-error TS(2322): Type '{ children: Element; w: "20%"; className: st... Remove this comment to see the full error message
          className="justify-center items-center"
        >
          <FormControl isRequired my="1" isInvalid={"errorMessage" in errors}>
            <CustomInput
              width="90%"
              keyboardType="numeric"
              textAlign="center"
              isDisabled={!update}
              placeholder={`${targetFarmlands}`}
              value={targetFarmlands}
              onChangeText={(newNumber: any) => {
                setErrors((prev) => ({
                  ...prev,
                  errorMessage: "",
                }));
                setTargetFarmlands(newNumber);
                setReset(false);
                setUpdate(true);
              }}
            />
          </FormControl>
        </Box>

        <Box
          w="20%"
          // @ts-expect-error TS(2322): Type '{ children: Element; w: "20%"; className: st... Remove this comment to see the full error message
          className="justify-center"
        >
          <TouchableOpacity
            onPress={() => {
              if (!update && !reset) {
                setUpdate(!update);
                setReset(true);
                setTargetFarmers("");
                setTargetFarmlands("");
              } else if (reset) {
                setUpdate(false);
                setReset(false);
                setTargetFarmers(
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  userStat.targetFarmers ? userStat.targetFarmers : 0,
                );
                setTargetFarmlands(
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  userStat.targetFarmlands ? userStat.targetFarmlands : 0,
                );
              } else {
                updateUserGoal(targetFarmers, targetFarmlands);
                setUpdate(!update);
              }
            }}
          >
            <Icon
              name={
                !update && !reset ? "mode-edit" : reset ? "restore" : "save"
              }
              size={20}
              color={COLORS.main}
            />
          </TouchableOpacity>
        </Box>
      </Stack>
      // @ts-expect-error TS(2339): Property 'errorMessage' does not exist on type '{}... Remove this comment to see the full error message
      {errors.errorMessage && (
        <Text
          className="text-red-400 text-center text-xs"
        >
          // @ts-expect-error TS(2339): Property 'errorMessage' does not exist on type '{}... Remove this comment to see the full error message
          {errors.errorMessage}
        </Text>
      )}
    </Box>
  );
}
