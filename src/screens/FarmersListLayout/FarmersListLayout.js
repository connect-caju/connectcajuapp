/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
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



const FarmersListLayout = ({ route, navigation }) => {

    const farmerType = route.params?.farmerType || farmerTypes.farmer;
    const [focusedOption, setFocusedOption] = useState(1);
    const [loadingActivitiyIndicator, setLoadingActivityIndicator] = useState(false);

    const handleFocusedOption = (option) => {
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

    const keyExtractor2 = (item, index) => index.toString();

    return (
        <SafeAreaView
            className={`flex flex-1 ${backgroundStyle}`}
        >
            <View
                style={{
                    width: "100%",
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                    backgroundColor: COLORS.fourth,
                    borderTopWidth: 0,
                    borderColor: COLORS.fourth,
                    borderBottomWidth: 3,
                    borderLeftWidth: 3,
                    borderRightWidth: 3,
                }}
            >
                <>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingBottom: 5,
                            alignItems: "center",
                        }}
                    >
                        <View>
                            {farmerType === "Grupo" &&
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "JosefinSans-Bold",
                                            color: COLORS.black,
                                            fontSize: 25,
                                        }}
                                    >
                                        Organizações
                                        {/* {farmersRegisteredByUser?.length} */}
                                    </Text>
                                </View>
                            }
                            {farmerType === "Instituição" &&
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "JosefinSans-Bold",
                                            color: COLORS.black,
                                            fontSize: 25,
                                        }}
                                    >
                                        Instituições
                                        {/* {farmersRegisteredByUser?.length} */}
                                    </Text>
                                </View>
                            }

                            {farmerType === "Indivíduo" &&
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "JosefinSans-Bold",
                                            color: COLORS.black,
                                            fontSize: 25,
                                        }}
                                    >
                                        Produtores
                                        {/* {farmersRegisteredByUser?.length} */}
                                    </Text>
                                </View>
                            }
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    borderRadius: 100,
                                    backgroundColor: COLORS.lightgrey,
                                    padding: 6,
                                }}
                                onPress={() => handleNavigationToSearchScreen()}
                            >
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    size={20}
                                    color={COLORS.black}
                                />
                            </TouchableOpacity>
                            <View style={{ width: 16 }} />
                            <TouchableOpacity
                                // disabled
                                style={{
                                    borderRadius: 100,
                                    backgroundColor: COLORS.lightgrey,
                                    padding: 6,
                                }}
                                onPress={() => {
                                    // pop === false ? popIn() : popOut();
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faEllipsisVertical}
                                    size={20}
                                    color={COLORS.black}
                                    fade
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <CustomDivider thickness={1} color={COLORS.lightgrey} />
                </>
                <View
                    style={{
                        marginTop: 5,
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <FlatList
                        data={filterByCriteria}
                        keyExtractor={keyExtractor2}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        // ListHeaderComponent={<View style={{ width: 6, }} />}
                        snapToInterval={86}
                        decelerationRate="fast"
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        marginRight: 10,
                                        backgroundColor:
                                            focusedOption === item.focusedOption
                                                ? COLORS.main
                                                : COLORS.fourth,
                                        borderColor:
                                            focusedOption === item.focusedOption
                                                ? COLORS.main
                                                : COLORS.lightgrey,
                                        borderWidth: 1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        paddingHorizontal: 10,
                                        paddingBottom: 5,
                                        borderRadius: 100,
                                        elevation: 1,
                                    }}
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
            </View>
            <View
                style={{
                    height: 10,
                    backgroundColor: COLORS.main,
                }}
            />
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
