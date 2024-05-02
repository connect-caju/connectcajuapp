
import {
    View,
    Animated,
    TouchableOpacity,
    Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Icon } from "@rneui/themed";
import {
    faPeopleGroup,
    faInstitution,
    faPerson,
    faCartPlus,
} from "@fortawesome/free-solid-svg-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import COLORS from "../../consts/colors";
import { farmerTypes } from "../../consts/farmerTypes";

const RegistrationButton = ({
    customUserData,
    pop,
    setPop,
    navigation,
    route
}: any) => {
    const [icon_1,] = useState(new Animated.Value(30));
    const [icon_2,] = useState(new Animated.Value(30));
    const [icon_3,] = useState(new Animated.Value(30));

    useEffect(()=>{
        setPop(false);
    }, [ navigation ]);


    const popIn = () => {
        setPop(true);
        Animated.timing(icon_1, {
            toValue: 120,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 180,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 240,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const popOut = () => {
        setPop(false);
        Animated.timing(icon_1, {
            toValue: 30,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_2, {
            toValue: 30,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(icon_3, {
            toValue: 30,
            duration: 500,
            useNativeDriver: false,
        }).start();
    };

    const addFarmer = (farmerType: any) => {
        navigation.navigate("FarmerForm1", { customUserData, farmerType });
        popOut();
    };

    return (
        <View
            style={{
                flex: 1,
            }}
        >

            <Animated.View
                style={[{
                    maxWidth: 160,
                    minWidth: 60,
                    height: 60,
                    position: "absolute",
                    bottom: 100,
                    right: 30,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                }, { bottom: icon_1 }]}
            >
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        // width: pop ? 150 : 0,
                    }}
                    onPress={() => {
                        addFarmer(farmerTypes.farmer);
                    }}
                >
                    {pop && <Text style={{
                        fontSize: 16,
                        marginRight: 10,
                        // fontFamily: "Roboto-Bold",
                        // color: COLORS.grey,
                    }}
                    className="text-gray-600 font-bold"
                    >Produtor</Text>}
                    <FontAwesomeIcon icon={faPerson} size={30} color={COLORS.main} />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View
                style={[{
                    maxWidth: 160,
                    minWidth: 60,
                    height: 60,
                    position: "absolute",
                    bottom: 100,
                    right: 30,
                    justifyContent: "center",
                    alignItems: "center",
                }, { bottom: icon_2 }]}
            >

                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        // width: pop ? 150 : 0,
                    }}
                    onPress={() => {
                        addFarmer(farmerTypes.group);
                    }}
                >
                    {pop && <Text style={{
                        fontSize: 16,
                        marginRight: 10,
                        // color: COLORS.grey,
                        // fontFamily: "Roboto-Bold",
                    }}
                    className="text-gray-600 font-bold"
                    >Comerciante</Text>}
                    <MaterialIcons name={"monetization-on"} size={30} color={COLORS.main} />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View
                style={[{
                    maxWidth: 160,
                    minWidth: 60,
                    height: 60,
                    position: "absolute",
                    bottom: 100,
                    right: 30,
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                }, { bottom: icon_3, }]}
            >
                <TouchableOpacity
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        // width: pop ? 150 : 0,
                    }}
                    onPress={() => {
                        addFarmer(farmerTypes.institution);
                    }}
                >
                    {pop && <Text style={{
                        fontSize: 16,
                        marginRight: 10,
                        // fontFamily: "Roboto-Bold",
                        // color: COLORS.grey,
                    }}
                    className="text-gray-600 font-bold"
                    >Cooperativa</Text>}
                    <FontAwesomeIcon icon={faInstitution} size={30} color={COLORS.main} />
                </TouchableOpacity>
            </Animated.View >
            <View
                style={{
                    zIndex: 10,
                }}
            >
                <View
                    style={{
                        borderRadius: 50,
                        backgroundColor: COLORS.main,
                        padding: 4,
                        elevation: 3,
                        position: "absolute",
                        bottom: 30,
                        right: 30,
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            borderRadius: 50,
                            borderWidth: 3,
                            borderColor: COLORS.lightestgrey,
                            backgroundColor: COLORS.main,
                            padding: 2,
                        }}
                    >
                        <TouchableOpacity onPress={() => {
                            pop === false ? popIn() : popOut();
                        }}>
                            <Icon
                                name="app-registration"
                                color={COLORS.lightestgrey}
                                size={40}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
                <Text
                    style={{
                        position: "absolute",
                        bottom: 10,
                        right: 35,
                        // fontSize: 12,
                        // fontFamily: "JosefinSans-BoldItalic",
                        // color: COLORS.grey,
                    }}
                    className="font-bold italic text-gray-600 text-sm"
                >
                    Registar
                </Text>
            </View>
        </View >
    );
};

export default RegistrationButton;
