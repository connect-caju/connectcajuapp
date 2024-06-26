
import { View, Text } from "react-native";
import React from "react";
import { customizeItem } from "../../helpers/customizeItem";

import { FlatList } from "react-native";
import GroupItem from "../GroupItem/GroupItem";
import FarmerItem from "../FarmerItem/FarmerItem";
import InstitutionItem from "../InstitutionItem/InstitutionItem";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import InfoIcon from "../LottieComponents/InfoIcon";
import Info from "../Info/Info";


const { useRealm } = realmContext;

const RegisteredByAllUsers = ({
    farmerType,
    route,
    navigation
}: any) => {

    let realm = useRealm();
    let user = useUser();
    let customUserData = user?.customData;
    customUserData = {
        name: customUserData?.name,
        userDistrict: customUserData?.userDistrict,
        userProvince: customUserData?.userProvince,
        userId: customUserData?.userId,
        role: customUserData?.role,
    };

    let farmers;
    let serviceProviders;
    let farmlands;

    if (farmerType === "Indivíduo") {
        farmers = realm
            .objects("Actor")
            .filtered("userDistrict == $0", customUserData?.userDistrict);
        //   .filtered("userId == $0", customUserData?.userId);
        serviceProviders = realm
            .objects("SprayingServiceProvider")
            .filtered("userDistrict == $0", customUserData?.userDistrict);
        farmlands = realm
            .objects("Farmland")
            .filtered("userDistrict == $0", customUserData?.userDistrict);
        farmers = customizeItem(
            farmers,
            farmlands,
            serviceProviders,
            customUserData,
            "Indivíduo",
        );

    } else if (farmerType === "Grupo") {
        farmers = realm
            .objects("Group")
            .filtered("userDistrict == $0", customUserData?.userDistrict);
        //   .filtered("userId == $0", customUserData?.userId);

        serviceProviders = realm
            .objects("SprayingServiceProvider")
            .filtered("userDistrict == $0", customUserData?.userDistrict);
        farmlands = realm
            .objects("Farmland")
            .filtered("userDistrict == $0", customUserData?.userDistrict);
        farmers = customizeItem(
            farmers,
            farmlands,
            serviceProviders,
            customUserData,
            "Grupo",
        );
    } else if (farmerType === "Instituição") {
        farmers = realm
            .objects("Institution")
            .filtered("userDistrict == $0", customUserData?.userDistrict);
        //   .filtered("userId == $0", customUserData?.userId);

        serviceProviders = realm
            .objects("SprayingServiceProvider")
            .filtered("userDistrict == $0", customUserData?.userDistrict);
        farmlands = realm
            .objects("Farmland")
            .filtered("userDistrict == $0", customUserData?.userDistrict);
        farmers = customizeItem(
            farmers,
            farmlands,
            serviceProviders,
            customUserData,
            "Instituição",
        );
    }

    const keyExtractor = (item: any, index: any) => index.toString();

    return (
        <View>
            {farmers.length > 0 ?
                <View
                    style={{
                        marginBottom: 120,
                    }}
                >
                    <FlatList
                        StickyHeaderComponent={() => (
                            <View
                                style={{
                                    //   height: hp("10%"),
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {/* <Text>Hello! Here is the sticky header!</Text> */}
                            </View>
                        )}
                        stickyHeaderHiddenOnScroll={true}
                        data={farmers}
                        keyExtractor={keyExtractor}
                        // onEndReached={handleEndReached}
                        onEndReachedThreshold={0.1}

                        // @ts-expect-error TS(7030): Not all code paths return a value.
                        renderItem={({
                            item
                        }: any) => {
                            // add all the IDs to each item to allow swiping between screens...
                            // when the user open any item from the list
                            if (item.flag === "Grupo") {
                                return <GroupItem route={route} item={item} />;
                            } else if (item.flag === "Indivíduo") {
                                return (
                                    <FarmerItem
                                        route={route}
                                        navigation={navigation}
                                        item={item}
                                    />
                                );
                            } else if (item.flag === "Instituição") {
                                return <InstitutionItem route={route} item={item} />;
                            }
                        }}
                        ListFooterComponent={() => {
                            return (<View
                                style={{
                                    paddingBottom: 30,
                                }}
                            />);
                        }}
                    />

                </View>
                :
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80%",
                        paddingHorizontal: 30,
                    }}
                >
                    <InfoIcon />
                    <Info 
                    info={"Nenhum registo"}
                   />
                </View>
            }
        </View>
    );
};

export default RegisteredByAllUsers;