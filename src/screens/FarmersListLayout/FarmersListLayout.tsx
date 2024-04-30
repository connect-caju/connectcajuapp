/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, SafeAreaView, TouchableOpacity, FlatList } from "react-native";
import COLORS from "../../consts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisVertical, faSearch } from "@fortawesome/free-solid-svg-icons";
import CustomDivider from "../../components/Divider/CustomDivider";
import React, { useState, useEffect } from "react";
import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import RegisteredByCurrentUser from "../../components/RegisteredByCurrentUser/RegisteredByCurrentUser";
import InvalidatedFarmers from "../../components/InvalidatedFarmers/InvalidatedFarmers";
import RegisteredByAllUsers from "../../components/RegisteredByAllUsers/RegisteredByAllUsers";
import { farmerTypes } from "../../consts/farmerTypes";
import { backgroundStyle } from "../../styles/globals";


const filterByCriteria = [
    {
        criteriaName: "Meus",
        iconName: "all-inclusive",
        focusedOption: 1,
    },
    {
        criteriaName: "Indeferidos",
        iconName: "all-inclusive",
        focusedOption: 2,
    },
    {
        criteriaName: "Todos",
        iconName: "all-inclusive",
        focusedOption: 3,
    },
];



const FarmersListLayout = ({
    route,
    navigation
}: any) => {

    const farmerType = route.params?.farmerType || farmerTypes.farmer;
    const [focusedOption, setFocusedOption] = useState(1);
    const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(false);

    const handleFocusedOption = (option: any) => {
        setFocusedOption(option);
    };

    const handleNavigationToSearchScreen = () => {
        navigation.navigate("FarmersSearch", {
            farmerType: farmerType,
        });
    };

    useEffect(() => {
        setLoadingActivityIndicator(true);
    }, [focusedOption]);

    const keyExtractor2 = (item: any, index: any) => index.toString();

    return (
        <SafeAreaView
            className={`flex flex-1 ${backgroundStyle}`}
        >
            <View
                className="bg-[#EBEBE4] dark:bg-gray-800 flex flex-row px-2 pt-2 pb-4 items-center justify-between"
            >
                <Text
                    className="text-gray-600 text-xl font-bold"
                >
                    {
                        farmerType === "Grupo" ?
                            "Organizações" :
                            farmerType === "Instituição" ?
                                "Instituições" :
                                "Produtores"
                    }
                </Text>
                {/* </View> */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            // borderRadius: 100,
                            // backgroundColor: COLORS.lightgrey,
                            // padding: 6,
                        }}
                        className="bg-gray-400 dark:bg-gray-700 rounded-full p-2"
                        onPress={() => handleNavigationToSearchScreen()}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            size={20}
                            color={COLORS.lightestgrey}
                        />
                    </TouchableOpacity>
                    <View style={{ width: 16 }} />
                    <TouchableOpacity
                        className="bg-gray-400 dark:bg-gray-700 rounded-full p-2"
                        onPress={() => {
                            // pop === false ? popIn() : popOut();
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faEllipsisVertical}
                            size={20}
                            color={COLORS.lightestgrey}

                            // @ts-expect-error TS(2322): Type '{ icon: IconDefinition; size: number; color:... Remove this comment to see the full error message
                            fade
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View
                className="flex flex-row items-center h-12 justify-around bg-[#EBEBE4] dark:bg-gray-800 mb-2"
            >
                <FlatList
                    data={filterByCriteria}
                    keyExtractor={keyExtractor2}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    // ListHeaderComponent={<View style={{ width: 6, }} />}
                    snapToInterval={86}
                    decelerationRate="fast"
                    renderItem={({
                        item
                    }: any) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    marginRight: 10,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingHorizontal: 10,
                                    paddingBottom: 5,
                                    borderRadius: 100,
                                    elevation: 1,
                                }}
                                className={`${focusedOption === item.focusedOption ? "bg-green-700" : "bg-gray-100 dark:bg-gray-600 shadow-2xl "}`}
                                onPress={() => handleFocusedOption(item.focusedOption)}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color:
                                            focusedOption === item.focusedOption
                                                ? COLORS.white
                                                : COLORS.grey,
                                        fontFamily: "JosefinSans-Regular",
                                        textAlign: "center",
                                    }}
                                >
                                    {item.criteriaName}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            {
                loadingActivitiyIndicator ?
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: "60%",
                        }}
                    >
                        <CustomActivityIndicator
                            loadingActivitiyIndicator={loadingActivitiyIndicator}
                            setLoadingActivityIndicator={setLoadingActivityIndicator}
                        />
                    </View>
                    :
                    <View>
                        {
                            focusedOption === 1 &&
                            <RegisteredByCurrentUser route={route} navigation={navigation} farmerType={farmerType} />
                        }
                        {
                            focusedOption === 2 &&
                            <InvalidatedFarmers route={route} navigation={navigation} farmerType={farmerType} />
                        }
                        {
                            focusedOption === 3 &&
                            <RegisteredByAllUsers route={route} navigation={navigation} farmerType={farmerType} />
                        }
                    </View>
            }

        </SafeAreaView>
    );
};

export default FarmersListLayout;
