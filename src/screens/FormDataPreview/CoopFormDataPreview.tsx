import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import COLORS from "../../consts/colors";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { FarmersStackParamList } from "../../navigation/Stacks/FarmersStackScreen";
import { CoopFormDataTypes, UserDetails } from "../../lib/types";
import { useCoopStore } from "../../app/stores/coopStore";
import {
  groupAffiliationStatus,
  groupAffiliationStatus2,
} from "../../consts/groupAffiliationStatus";
const { useRealm, useQuery, useObject } = realmContext;

type Props = NativeStackScreenProps<
  FarmersStackParamList,
  "CoopFormDataPreview"
>;

export default function CoopFormDataPreview({ route, navigation }: Props) {
  const realm = useRealm();
  const { coopData, submitCoopForm } = useCoopStore();

  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [coop, setCoop] = useState<Realm.Object>();
  const [coopId, setCoopId] = useState<string>();
  const [formattedData, setFormattedData] = useState<CoopFormDataTypes>();

  const user = useUser();
  const customUserData = user?.customData;
  const userDetails = {
    userName: customUserData?.name,
    userId: customUserData?.userId,
    userDistrict: customUserData?.userDistrict,
    userProvince: customUserData?.userProvince,
  } as UserDetails;

  const handleScrollBeginDrag = () => {
    setShowFloatingButton(false);
  };

  const handleScrollEndDrag = () => {
    setShowFloatingButton(true);
  };

  const currentUserStat: any = useQuery("UserStat").filtered(
    "userId == $0",
    customUserData?.userId,
  )[0];

  // updating user performance statistics
  const updateUserStats = useCallback(
    (realm: Realm) => {
      if (currentUserStat) {
        // if user already has any record of activities (performance)
        realm.write(() => {
          currentUserStat.registeredFarmers =
            currentUserStat.registeredFarmers + 1;
        });
      } else {
        // if this is the user's first time registering actors
        realm.write(() => {
          const newStat = realm.create("UserStat", {
            _id: uuidv4(),
            userName: customUserData?.name,
            userId: customUserData?.userId,
            userDistrict: customUserData?.userDistrict,
            userProvince: customUserData?.userProvince,
            userRole: customUserData?.role,
            registeredFarmers: 1,
          });
        });
      }
    },
    [realm],
  );

  useEffect(() => {
    if (coop) {
      updateUserStats(realm);
      setCoopId(JSON.parse(JSON.stringify(coop))._id);
    }
  }, [realm, coop]);

  useEffect(() => {
    if (coopId) {
      navigation.navigate("CoopDashboard", {
        coopId,
      });
      setCoopId("");
      setCoop(undefined);
    }
  }, [coopId]);

  useEffect(() => {
    setFormattedData(coopData);
  }, []);

  return (
    <SafeAreaProvider>
      <View className="px-3 flex flex-row justify-between items-center py-6 space-x-2 bg-white dark:bg-black min-h-[100px]">
        <View className="flex-1 flex-wrap">
          <Text className="text-2xl text-black dark:text-white font-bold">
            Confirmar Dados
          </Text>
        </View>
      </View>
      <ScrollView
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 15,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="border border-gray-400 bg-white dark:bg-black shadow-md rounded-md  p-2 flex flex-col mt-6 mb-8">
          <View className="flex flex-wrap justify-between items-center space-x-2 w-full">
            <Text className="text-lg text-black font-bold dark:text-white leading-5">
              {formattedData?.type}: {formattedData?.name}
            </Text>
          </View>

          <Text className="text-sm text-black dark:text-white italic leading-5">
            {formattedData?.legalStatus === groupAffiliationStatus.affiliated
              ? "Legalizada"
              : "Não Legalizada"}
          </Text>
        </View>

        <View className="my flex flex-row justify-between items-center space-x-3 flex-wrap gap-2">
          <View className="border border-gray-400 shadow-md rounded-md w-[100px]  p-2">
            <Text className="text-lg text-black font-bold text-center dark:text-white tracking-widest">
              {formattedData?.numberOfMembers.total}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-white italic text-center">
              Membros
            </Text>
          </View>
          <View className="border border-gray-400 shadow-md rounded-md w-[100px]  p-2">
            <Text className="text-lg text-black text-center font-bold dark:text-white tracking-widest">
              {formattedData?.creationYear}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-white italic text-center ">
              Criação
            </Text>
          </View>
          {formattedData?.affiliationYear && (
            <View className="border border-gray-400 shadow-md w-[100px] rounded-md  p-2">
              <Text className="text-lg text-black font-bold text-center dark:text-white tracking-widest">
                {formattedData?.affiliationYear}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-white italic text-center">
                Legalização
              </Text>
            </View>
          )}
        </View>

        <View className="border border-gray-400 shadow-md rounded-md  p-2 my-3">
          <View className="flex flex-col my-2">
            <Text className="text-sm text-gray-500 dark:text-white italic ">
              Finalidade
            </Text>

            <View className="">
              {formattedData?.purposes.map((purpose, index) => (
                <Text
                  className="text-lg text-black dark:text-white text-right"
                  key={index}
                >
                  {purpose}
                </Text>
              ))}
            </View>
          </View>

          {/* <View className="w-full h-0.5 bg-gray-400" /> */}
          <View className="flex flex-row my-2  space-x-2">
            <Text className="text-sm text-gray-500 dark:text-white italic">
              Endereço
            </Text>

            <View className="flex-1 flex-col justify-center items-end">
              <Text className="text-lg text-black dark:text-white">
                {formattedData?.address?.district}
              </Text>
              <Text className="text-lg text-black  dark:text-white">
                {formattedData?.address?.adminPost}
              </Text>
              <Text className="text-lg text-black  dark:text-white">
                {formattedData?.address?.village &&
                  formattedData.address?.village}
              </Text>
            </View>
          </View>
          {/* <View className="w-full h-0.5 bg-gray-400" /> */}

          <View className="flex flex-col my-2  space-y-2">
            <Text className="text-sm text-gray-500 dark:text-white italic">
              Documentação
            </Text>

            <View className="flex flex-col justify-end items-end">
              {formattedData?.nuit ? (
                <Text className="text-lg  text-black  dark:text-white">
                  NUIT: {formattedData.nuit}
                </Text>
              ) : (
                <Text className="text-sm italic text-black  dark:text-white">
                  Não tem NUIT
                </Text>
              )}
              {formattedData?.licence ? (
                <Text className="text-lg  text-black  dark:text-white">
                  Alvará: {formattedData.licence}
                </Text>
              ) : (
                <Text className="text-sm italic text-black  dark:text-white">
                  Não tem Alvará
                </Text>
              )}
              {formattedData?.nuel ? (
                <Text className="text-lg  text-black  dark:text-white">
                  NUEL: {formattedData.nuel}
                </Text>
              ) : (
                <Text className="text-sm italic text-black  dark:text-white">
                  Não tem NUEL
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-3 py-3">
        <PrimaryButton
          onPress={async () => {
            try {
              await submitCoopForm(realm, coopData, userDetails, setCoop);
            } catch (error) {
              throw new Error("Failed to register Institution", {
                cause: error,
              });
            }
          }}
          title="Salvar dados"
        />
      </View>

      <StatusBar backgroundColor="transparent" />
      {showFloatingButton && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute bottom-20 left-5 opacity-80  rounded-full p-3 bg-[#008000] z-[100]"
        >
          <FontAwesomeIcon icon={faArrowLeft} size={25} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </SafeAreaProvider>
  );
}
