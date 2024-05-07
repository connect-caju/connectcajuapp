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
import {
  faArrowLeft,
  faArrowRight,
  faBell,
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { FarmersStackParamList } from "../../navigation/Stacks/FarmersStackScreen";
import {
  InstitutionFormDataTypes,
  UserDetails,
} from "../../lib/types";
import { useInstitutionStore } from "../../app/stores/institutionStore";
const { useRealm, useQuery, useObject } = realmContext;

type Props = NativeStackScreenProps<
  FarmersStackParamList,
  "InstitutionFormDataPreview"
>;

export default function InstitutionFormDataPreview({
  route,
  navigation,
}: Props) {
  const realm = useRealm();
  const { institutionData, submitInstitutionForm } = useInstitutionStore();

  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [institution, setInstitution] = useState<Realm.Object>();
  const [institutionId, setInstitutionId] = useState<string>();
  const [formattedData, setFormattedData] =
    useState<InstitutionFormDataTypes>();

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
    if (institution) {
      updateUserStats(realm);
      setInstitutionId(JSON.parse(JSON.stringify(institution))._id);
    }
  }, [realm, institution]);

  useEffect(() => {
    if (institutionId) {
      navigation.navigate("InstitutionDashboard", {
        institutionId,
      });
      setInstitutionId("");
      setInstitution(undefined);
    }
  }, [institutionId]);

  useEffect(() => {
    setFormattedData(institutionData);
  }, []);

  return (
    <SafeAreaProvider>
      <ScrollView
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 15,
          paddingVertical: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-row justify-between items-center py-6 space-x-2 ">
          <View className="flex-1 flex-wrap">
            <Text className="text-2xl text-black dark:text-white font-bold">
              Confirmar Dados
            </Text>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <View className="relative min-w-[50px] flex justify-center items-center">
              <View className="animate animate-pulse transition-all duration-300 absolute z-10 min-w-[20px] -top-5 right-3 bg-red-600 rounded-full px-2 justify-center items-center ">
                <Text className="text-white text-lg ">2</Text>
              </View>
              <FontAwesomeIcon icon={faBell} size={24} color={COLORS.grey} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="border border-gray-400 shadow-md rounded-md  p-2 flex flex-col my-2">
          <View className="flex flex-wrap justify-between items-center space-x-2 w-full">
            <Text className="text-lg text-black font-bold dark:text-white leading-5">
              {formattedData?.type}: {formattedData?.name}
            </Text>
          </View>

          <Text className="text-sm text-black dark:text-white italic leading-5">
            {institutionData?.isPrivate === "Sim"
              ? "Instituição Privada"
              : "Instituição Pública"}
          </Text>
        </View>

        <View className="border border-gray-400 shadow-md rounded-md  p-2 my-3">

        <View className="flex flex-col my-2">
          <Text className="text-sm text-gray-500 dark:text-white italic ">
            Contatos
          </Text>

          <View className="">
            <Text className="text-lg text-black text-right dark:text-white tracking-widest">
              {formattedData?.manager?.fullname}
            </Text>
            <Text className="text-lg text-black text-right  dark:text-white tracking-widest">
              {formattedData?.manager?.phone}
            </Text>
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
              <Text className="text-lg italic text-black  dark:text-white">
                NUIT: {formattedData.nuit}
              </Text>
            ) : (
              <Text className="text-sm italic text-black  dark:text-white">
                Não tem NUIT
              </Text>
            )}
            {formattedData?.licence ? (
              <Text className="text-lg italic text-black  dark:text-white">
                Alvará: {formattedData.licence}
              </Text>
            ) : (
              <Text className="text-sm italic text-black  dark:text-white">
                Não tem Alvará
              </Text>
            )}
          </View>
        </View>
        </View>

      </ScrollView>

        <View  className="px-3 py-3">
          <PrimaryButton
            onPress={async () => {
              try {
                await submitInstitutionForm(
                  realm,
                  institutionData,
                  userDetails,
                  setInstitution,
                );
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
          <FontAwesomeIcon
            icon={faChevronCircleLeft}
            size={25}
            color={COLORS.white}
          />
        </TouchableOpacity>
      )}
    </SafeAreaProvider>
  );
}
