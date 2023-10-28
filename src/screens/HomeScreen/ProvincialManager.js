/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import React, { useState, Image, SafeAreaView, TouchableOpacity } from "react";
import { View, Text } from "react-native";
import COLORS from "../../consts/colors";
import { Box, Center, Stack } from "native-base";
import { Icon } from "@rneui/base";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { ProgressChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ScrollView } from "react-native";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import LinearGradient from "react-native-linear-gradient";
const { useRealm, useQuery } = realmContext;

// sync subscription by this name
const userStats = "userStats";

// export let realm;

const ProvincialManager = ({ tpFarmers, tpFarmlands, provincialUserStats, pFarmlandsPercentage, pFarmersPercentage, customUserData, setIsUserProfileVisible, isUserProfileVisible }) => {

    const width = Dimensions.get("window").width - 15;

    return (
        <ScrollView
            style={{
                flex: 1,
                paddingVertical: 20,
                paddingHorizontal: 10,
                height: "100%"
            }}
        >
            <View
                style={{
                    borderRadius: 100,
                    backgroundColor: COLORS.lightgrey,
                    width: 150,
                    height: 150,
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: 80,
                        height: 50,
                        alignSelf: "center",
                        borderWidth: 1,
                        borderColor: COLORS.lightestdanger,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.lightestdanger,
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6,

                    }}
                >
                    <View
                        style={{
                            position: "absolute",
                            top: -30,
                            borderRadius: 50,
                            padding: 6,
                            elevation: 3,
                            borderColor: COLORS.lightgrey,
                            backgroundColor: COLORS.lightdanger,

                        }}
                    >
                        <FontAwesomeIcon icon={faUserGroup} color={COLORS.white} size={30} />
                    </View>

                    <Text
                        style={{
                            color: COLORS.white,
                            fontSize: 26,
                            fontFamily: "JosefinSans-Bold",
                        }}
                    >{provincialUserStats?.length}</Text>

                </View>
                <View
                    style={{
                        width: 80,
                        height: 30,
                        alignSelf: "center",
                        borderWidth: 1,
                        borderColor: COLORS.lightdanger,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.lightdanger,
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.white,
                            fontSize: 16,
                            fontFamily: "JosefinSans-Bold",
                        }}
                    >Usuários</Text>
                </View>
            </View>

            <View
                style={{
                    paddingTop: 20,
                }}
            >
                <Text
                    style={{
                        color: COLORS.grey,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                    }}
                >Realização</Text>
            </View>
            <View
                style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 10,
                }}
            >
                <LinearGradient colors={["#009900", "#001200"]} style={{
                    flex: 1,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 5,
                    minHeight: 60,
                    width: width / 2,
                    // marginHorizontal: 5,
                }}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: COLORS.white,
                            fontSize: 16,
                            fontFamily: "JosefinSans-Italic",
                        }}>Produtores</Text>
                    <Text
                        style={{
                            textAlign: "center",
                            color: COLORS.white,
                            fontSize: 20,
                            fontFamily: "JosefinSans-Bold",
                        }}
                    >{pFarmersPercentage}</Text>
                </LinearGradient>
                <View
                    style={{
                        width: 6,
                    }}
                />

                <LinearGradient colors={["#001200", "#00aa00"]} style={{
                    flex: 1,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 5,
                    minHeight: 60,
                    width: width / 2,
                    // marginHorizontal: 5,
                }}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: COLORS.white,
                            fontSize: 16,
                            fontFamily: "JosefinSans-Italic",
                        }}>Pomares</Text>
                    <Text
                        style={{
                            textAlign: "center",
                            color: COLORS.white,
                            fontSize: 20,
                            fontFamily: "JosefinSans-Bold",
                        }}
                    >{pFarmlandsPercentage}</Text>
                </LinearGradient>
            </View>





            <View
                style={{
                    paddingTop: 20,
                }}
            >
                <Text
                    style={{
                        color: COLORS.grey,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                    }}
                >Metas</Text>
            </View>
            <View
                style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 10,
                }}
            >
                <LinearGradient colors={["#009900", "#001200"]} style={{
                    flex: 1,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 5,
                    minHeight: 60,
                    width: width / 2,
                    // marginHorizontal: 5,
                }}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: COLORS.white,
                            fontSize: 16,
                            fontFamily: "JosefinSans-Italic",
                        }}>Produtores</Text>
                    <Text
                        style={{
                            textAlign: "center",
                            color: COLORS.white,
                            fontSize: 20,
                            fontFamily: "JosefinSans-Bold",
                        }}
                    >{tpFarmers}</Text>
                </LinearGradient>
                <View
                    style={{
                        width: 6,
                    }}
                />

                <LinearGradient colors={["#001200", "#00aa00"]} style={{
                    flex: 1,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 5,
                    minHeight: 60,
                    width: width / 2,
                    // marginHorizontal: 5,
                }}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: COLORS.white,
                            fontSize: 16,
                            fontFamily: "JosefinSans-Italic",
                        }}>Pomares</Text>
                    <Text
                        style={{
                            textAlign: "center",
                            color: COLORS.white,
                            fontSize: 20,
                            fontFamily: "JosefinSans-Bold",
                        }}
                    >{tpFarmlands}</Text>
                </LinearGradient>
            </View>


        </ScrollView>
    );
};

export default ProvincialManager;
