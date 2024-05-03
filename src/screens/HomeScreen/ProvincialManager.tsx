import React, { useState, } from "react";
import { ScrollView, View, Text } from "react-native";
import COLORS from "../../consts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { Dimensions } from "react-native";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import LinearGradient from "react-native-linear-gradient";
const { useRealm, useQuery } = realmContext;

// sync subscription by this name
const userStats = "userStats";

// export let realm;

const ProvincialManager = ({
    tpFarmers,
    tpFarmlands,
    provincialUserStats,
    pFarmlandsPercentage,
    pFarmersPercentage,
    customUserData,
    setIsUserProfileVisible,
    isUserProfileVisible
}: any) => {

    const width = Dimensions.get("window").width - 15;

    return (
        <ScrollView
            className="flex-1 h-full py-10 px-5"
        >
            <View
                className="rounded-full border-2 border-slate-400 w-fit h-fit p-10 self-center items-center justify-center"
            >
                <View
                    className="w-20 h-12 justify-end items-center bg-slate-400 rounded-t-lg"
                >
                    <View
                        className="absolute -top-9 rounded-full p-2 bg-slate-400  border-2"
                    >
                        <FontAwesomeIcon icon={faUserGroup} color={COLORS.white} size={30} />
                    </View>

                    <Text
                        className="text-2xl py-1 font-normal"
                    >{provincialUserStats?.length}</Text>

                </View>
                <View
                    className="w-20 h-7 justify-center items-center bg-slate-500"
                >
                    <Text
                        className=" text-base font-semibold"
                    >Usuários</Text>
                </View>
            </View>

            <Text
                className="font-semibold  text-lg"
            >Realização</Text>

            <View
                style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 10,
                }}
            >

                <View  style={{
                    flex: 1,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 5,
                    minHeight: 60,
                    width: width / 2,
                    // marginHorizontal: 5,
                }}>
                    <Text
                        className="font-normal text-lg  text-center"
                    >Produtores</Text>
                    <Text
                        className="font-normal text-xltext-center"
                    v>{pFarmersPercentage}</Text>
                </View>
                <View
                    style={{
                        width: 6,
                    }}
                />

                <View style={{
                    flex: 1,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 5,
                    minHeight: 60,
                    width: width / 2,
                }}>
                    <Text
                        className="font-normal text-lg  text-center"
                    >Pomares</Text>
                    <Text
                        className="font-normal text-xl  text-center"
                    >{pFarmlandsPercentage}</Text>
                </View>
            </View>

            <Text
                className="font-semibold  text-lg"
            >Metas</Text>
            <View
                style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 10,
                }}
            >
                <View style={{
                    flex: 1,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 5,
                    minHeight: 60,
                    width: width / 2,
                    // marginHorizontal: 5,
                }}>
                    <Text
                        className="font-normal text-lg text-center"
                    >Produtores</Text>
                    <Text
                        className="font-normal text-xl text-center"
                    >{tpFarmers}</Text>
                </View>
                <View
                    style={{
                        width: 6,
                    }}
                />

                <View  style={{
                    flex: 1,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 5,
                    minHeight: 60,
                    width: width / 2,
                    // marginHorizontal: 5,
                }}>
                    <Text
                        className="font-normal text-lg  text-center"
                    >Pomares</Text>
                    <Text
                        className="font-normal text-xl  text-center"
                    >{tpFarmlands}</Text>
                </View>
            </View>


        </ScrollView>
    );
};

export default ProvincialManager;
