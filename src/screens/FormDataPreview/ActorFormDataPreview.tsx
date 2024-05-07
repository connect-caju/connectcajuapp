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
import { ActorFormDataTypes, useActorStore } from "../../app/stores/actorStore";
import { Switch } from "../../../components/Switch";
import COLORS from "../../consts/colors";
import { capitalize } from "../../helpers/capitalize";
import { calculateAge2 } from "../../helpers/dates";
import { Button } from "../../../components/Button";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBell,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { FarmersStackParamList } from "../../navigation/Stacks/FarmersStackScreen";
import { buildActorObject } from "../../helpers/buildActorObject";
import { UserDetails } from "../../lib/types";
const { useRealm, useQuery, useObject } = realmContext;

type Props = NativeStackScreenProps<FarmersStackParamList, "ActorFormDataPreview">;

export default function ActorFormDataPreview({ route, navigation }: Props) {
  const realm = useRealm();
  const { actorData, submitActorForm } = useActorStore();

  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [actor, setActor] = useState<Realm.Object>();
  const [actorId, setActorId] = useState<string>();

  const user = useUser();
  const customUserData = user?.customData;
  const userDetails = {
    userName: customUserData?.name,
    userId: customUserData?.userId,
    userDistrict: customUserData?.userDistrict,
    userProvince: customUserData?.userProvince,
  } as UserDetails;
  const builtActorData = buildActorObject(actorData, userDetails);

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

  // in case this new actor is a spraying services provider
  const addSprayingServiceProvider = useCallback(
    (actor: any, realm: Realm) => {
      // create the spraying agent object according to the model
      const sprayingProviderObject = {
        _id: uuidv4(),
        actorId: actor?._id,
        actorName: actor?.names?.otherNames + " " + actor?.names?.surname,

        userName: customUserData?.name,
        userId: customUserData?.userId,
        userDistrict: customUserData?.userDistrict,
        userProvince: customUserData?.userProvince,
      };

      // saving the actor as a spraying service provider
      realm.write(async () => {
        const serviceProvider = await realm.create(
          "SprayingServiceProvider",
          sprayingProviderObject,
        );
      });
    },
    [realm, actor],
  );

  // in case this actor belongs to any actor's organization (cooperative, association, etc.)
  const addActorMembership = useCallback(
    (actor: any, realm: Realm) => {
      // creating a actor membership object according to the model
      const actorMembershipObject = {
        _id: uuidv4(),
        actorId: actor?._id,
        actorName: actor?.names?.otherNames + " " + actor?.names?.surname,

        userName: customUserData?.name,
        userId: customUserData?.userId,
        userDistrict: customUserData?.userDistrict,
        userProvince: customUserData?.userProvince,
      };

      // saving the actor's membership information
      realm.write(async () => {
        const actorMembership = await realm.create(
          "ActorMembership",
          actorMembershipObject,
        );
      });
    },
    [realm, actor],
  );

  useEffect(() => {
    if (actor) {
      if (actorData?.isSprayingAgent) {
        try {
          addSprayingServiceProvider(actor, realm);
        } catch (error) {
          console.log("Could not save actor as spraying service provider:", {
            cause: error,
          });
        }
      }

      if (actorData?.isGroupMember) {
        try {
          addActorMembership(actor, realm);
        } catch (error) {
          console.log("Could not save actor as member of an organization:", {
            cause: error,
          });
        }
      }

      updateUserStats(realm);
      setActorId(JSON.parse(JSON.stringify(actor))._id);
    }
  }, [realm, actor]);

  useEffect(() => {
    if (actorId) {
      navigation.navigate("ActorDashboard", {
        actorId,
      });
      setActorId("");
      setActor(undefined);
    }
  }, [actorId]);

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
          <View className="flex flex-row justify-between items-center space-x-2 w-full">
            <View className="flex-1 justify-start">
              <Text className="text-sm text-gray-500 dark:text-white italic">
                Apelido
              </Text>
            </View>
            <View className="flex-1 justify-start">
              <Text className="text-sm text-gray-500 dark:text-white italic">
                Outros Nomes
              </Text>
            </View>
          </View>

          <View className="flex flex-row justify-between items-center space-x-2 w-full">
            <View className="flex-1 justify-start ">
              <Text className="text-lg text-black font-bold dark:text-white leading-5">
                {builtActorData?.names?.surname}
              </Text>
            </View>
            <View className="flex-1 justify-start">
              <Text className="text-lg text-black font-bold dark:text-white leading-5">
                {builtActorData?.names?.otherNames}
              </Text>
            </View>
          </View>
        </View>

        {/* <View className="flex flex-row items-center space-x-2 my-2 ">
          <View className="">
            <Switch
              disabled={true}
              thumbColor={
                validatedActorFormData?.isSprayingAgent
                  ? COLORS.main
                  : COLORS.grey
              }
              trackColor={{ false: COLORS.grey, true: COLORS.main }}
              value={validatedActorFormData?.isSprayingAgent}
            />
          </View>
          <View className="flex-1 flex-wrap items-center">
            <Text className="text-sm text-black dark:text-white italic leading-5">
              {validatedActorFormData?.isSprayingAgent
                ? "É Provedor de Serviços de Pulverização"
                : "Não é Provedor de Serviços de Pulverização"}
            </Text>
          </View>
        </View> */}

        {/* <View className="flex flex-row items-center space-x-2 my-2">
          <View>
            <Switch
              className=""
              disabled={true}
              thumbColor={
                validatedActorFormData?.isGroupMember
                  ? COLORS.main
                  : COLORS.grey
              }
              trackColor={{ false: COLORS.grey, true: COLORS.main }}
              value={validatedActorFormData?.isGroupMember}
            />
          </View>
          <View className="flex-1 flex-wrap items-center">
            <Text className="text-sm text-black dark:text-white italic leading-5">
              {validatedActorFormData?.isGroupMember
                ? "É membro de organização"
                : "Não é membro de organização"}
            </Text>
          </View>
        </View> */}

        <View className="flex flex-row justify-between my-2 space-x-3">
          <View className="flex-1 p-3 border rounded-md border-gray-400 items-center justify-center space-y-2">
            <Text className="text-sm text-gray-500 dark:text-white italic">
              Idade
            </Text>

            <Text className="text-lg font-bold text-black dark:text-white">
              {calculateAge2(builtActorData?.birthDate)} anos
            </Text>
          </View>

          <View className="flex-1 p-3 border rounded-md border-gray-400 items-center justify-center  space-y-2">
            <Text className="text-sm text-gray-500 dark:text-white italic">
              Género
            </Text>

            <Text className="text-lg font-bold text-black dark:text-white">
              {builtActorData.gender === "Masculino"
                ? "Homem"
                : builtActorData.gender === "Feminino"
                ? "Mulher"
                : "Outro"}
            </Text>
          </View>

          <View className="flex-1 p-3 border rounded-md border-gray-400 items-center justify-center  space-y-2">
            <Text className="text-sm text-gray-500 dark:text-white italic">
              Agregado
            </Text>
            <Text className="text-lg font-bold text-black dark:text-white">
              {builtActorData?.familySize}
            </Text>
          </View>
        </View>

        <View className="flex flex-col my-2">
          <Text className="text-sm text-gray-500 dark:text-white italic ">
            Contatos
          </Text>
          <View>
            {builtActorData?.contact?.primaryPhone &&
            builtActorData?.contact?.secondaryPhone ? (
              <View className="flex flex-row justify-between items-center space-x-2 flex-wrap">
                <Text className="text-lg text-black font-bold dark:text-white tracking-widest">
                  {builtActorData?.contact?.primaryPhone}
                </Text>
                <Text className="text-lg text-black font-bold dark:text-white tracking-widest">
                  {builtActorData?.contact?.secondaryPhone}
                </Text>
              </View>
            ) : builtActorData?.contact?.primaryPhone ? (
              <View className="flex flex-row justify-start">
                <Text className="text-lg text-black font-bold dark:text-white tracking-widest">
                  {builtActorData?.contact?.primaryPhone}
                </Text>
              </View>
            ) : builtActorData?.contact?.secondaryPhone ? (
              <View className="flex flex-row justify-end">
                <Text className="text-lg text-black font-bold dark:text-white tracking-widest">
                  {builtActorData?.contact?.secondaryPhone}
                </Text>
              </View>
            ) : (
              <View className="flex flex-row justify-start">
                <Text className="text-lg text-black font-bold dark:text-white">
                  Nenhum
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="w-full h-0.5 bg-gray-400" />
        <View className="flex flex-row my-2 items-center space-x-2">
          <Text className="text-sm text-gray-500 dark:text-white italic">
            Residência
          </Text>

          <View className="flex-1 flex-col justify-center items-end">
            <Text className="text-lg text-black dark:text-white">
              {builtActorData?.address?.district}
            </Text>
            <Text className="text-lg text-black  dark:text-white">
              {builtActorData?.address?.adminPost}
            </Text>
            <Text className="text-lg text-black  dark:text-white">
              {builtActorData.address?.village &&
                builtActorData.address?.village}
            </Text>
          </View>
        </View>
        <View className="w-full h-0.5 bg-gray-400" />

        <View className="flex flex-row my-2 items-center space-x-2">
          <Text className="text-sm text-gray-500 dark:text-white italic">
            Local de Nascimento
          </Text>

          <View className="flex-1 flex-col justify-center items-end">
            {!builtActorData.birthPlace?.province?.includes("Estrangeiro") &&
              !builtActorData.birthPlace?.province?.includes("Cidade") && (
                <View className="flex flex-col items-end justify-center">
                  <Text className="text-lg text-black  dark:text-white">
                    {builtActorData.birthPlace?.province}
                  </Text>
                  <Text className="text-lg text-black  dark:text-white">
                    {builtActorData.birthPlace?.district}
                  </Text>
                  <Text className="text-lg text-black  dark:text-white">
                    {builtActorData.birthPlace?.adminPost}
                  </Text>
                </View>
              )}
            {builtActorData.birthPlace?.province?.includes("Estrangeiro") && (
              <View className="flex flex-col items-end justify-center">
                <Text className="text-lg text-black  dark:text-white">
                  {builtActorData.birthPlace?.province}
                </Text>
                <Text className="text-lg text-black  dark:text-white">
                  {builtActorData.birthPlace?.district}
                </Text>
              </View>
            )}

            {builtActorData.birthPlace?.province?.includes("Cidade") && (
              <View className="flex flex-col items-end justify-center">
                <Text className="text-lg text-black  dark:text-white">
                  {builtActorData.birthPlace?.province}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="w-full h-0.5 bg-gray-400" />

        <View className="flex flex-col my-4  space-y-2">
          <Text className="text-sm text-gray-500 dark:text-white italic">
            Documentos de Identificação
          </Text>

          <View className="flex flex-col justify-end items-end">
            {builtActorData.idDocument?.docType &&
            !builtActorData.idDocument?.docType.includes("Não") ? (
              <Text className="text-sm italic text-black  dark:text-white">
                {builtActorData.idDocument?.docType}:{" "}
                {builtActorData.idDocument?.docNumber}
              </Text>
            ) : builtActorData.idDocument?.docType &&
              builtActorData.idDocument?.docType.includes("Não") ? (
              <Text className="text-sm italic text-black  dark:text-white">
                Não tem documento de identificação
              </Text>
            ) : (
              <Text className="text-sm italic text-black  dark:text-white">
                Não tem documento de identificação
              </Text>
            )}
            {builtActorData.idDocument?.nuit ? (
              <Text className="text-sm italic text-black  dark:text-white">
                NUIT: {builtActorData.idDocument?.nuit}
              </Text>
            ) : (
              <Text className="text-sm italic text-black  dark:text-white">
                Não tem NUIT
              </Text>
            )}
          </View>
        </View>

        <View>
          <PrimaryButton
            onPress={async () => {
              try {
                await submitActorForm(realm, actorData, userDetails, setActor);
              } catch (error) {
                throw new Error("Failed to register IndividualFarmer", {
                  cause: error,
                });
              }
            }}
            title="Salvar dados"
          />
        </View>

        <StatusBar backgroundColor="transparent" />
      </ScrollView>
      {showFloatingButton && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute bottom-20 right-5 opacity-80  rounded-full p-3 bg-[#008000] z-[100]"
        >
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            size={25}
            color={COLORS.white}
          />
        </TouchableOpacity>
      )}
    </SafeAreaProvider>
  );
}
