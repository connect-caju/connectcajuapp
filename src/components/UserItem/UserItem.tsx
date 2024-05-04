import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,

} from "react-native";
import { Icon } from "@rneui/base";
import { CheckIcon, FormControl, Select, Stack } from "native-base";
import { v4 as uuidv4 } from "uuid";

import { CustomInput } from "../Inputs/CustomInput";
import COLORS from "../../consts/colors";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { Input } from "../../../components/Input";

const { useRealm, useQuery, useObject } = realmContext;

export default function UserItem({ userItem }: any) {
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

  const handleUserGoal = () => {
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
  };

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
      <View
      className="flex flex-row justify-between items-center my-1 border px-0.5">
        <View className="w-2/5">
          <Text className="font-normal text-sm text-black dark:text-white leading-4">
            {userItem?.name.split(" ")[0]}
          </Text>
        </View>

        <View className="flex-1 flex-row justify-between items-center">
          <View className="flex justify-center items-center pr-0.5">

          <FormControl isRequired my="1" isInvalid={"errorMessage" in errors}>
            <Input
              keyboardType="numeric"
              textAlign="center"
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
              disabled={!update}
              />
          </FormControl>
              </View>
 <View className="flex justify-center items-center pr-0.5">

          <FormControl isRequired my="1" isInvalid={"errorMessage" in errors}>
            <Input
              keyboardType="numeric"
              textAlign="center"
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
              disabled={!update}
              />
          </FormControl>
              </View>
      <View className="flex justify-center items-center pr-0.5">


        <TouchableOpacity onPress={handleUserGoal}>
          <Icon
            name={!update && !reset ? "mode-edit" : reset ? "restore" : "save"}
            size={20}
            color={COLORS.main}
            />
        </TouchableOpacity>
            </View>
      </View>

      {errors?.errorMessage && (
        <Text className="text-red-400 text-center text-xs">
          {errors?.errorMessage}
        </Text>
      )}
    </View>
  );
}
