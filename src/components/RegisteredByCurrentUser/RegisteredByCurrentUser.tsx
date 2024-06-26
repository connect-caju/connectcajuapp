
import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { realmContext } from "../../models/realmContext";
import { useUser } from "@realm/react";
import { customizeItem } from "../../helpers/customizeItem";
import GroupItem from "../GroupItem/GroupItem";
import FarmerItem from "../FarmerItem/FarmerItem";
import InstitutionItem from "../InstitutionItem/InstitutionItem";
import InfoIcon from "../LottieComponents/InfoIcon";
import { FlatList } from "react-native-gesture-handler";
import Info from "../Info/Info";
const { useRealm } = realmContext;

const RegisteredByCurrentUser = ({
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
            // .filtered("userDistrict == $0", customUserData?.userDistrict);
            .filtered("userId == $0", customUserData?.userId);
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
            // .filtered("userDistrict == $0", customUserData?.userDistrict);
            .filtered("userId == $0", customUserData?.userId);

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
            // .filtered("userDistrict == $0", customUserData?.userDistrict);
            .filtered("userId == $0", customUserData?.userId);

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

    return <>
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
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
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
                            return (
                                <GroupItem
                                    item={item}
                                    customUserData={customUserData}
                                />
                            );
                        } else if (item.flag === "Indivíduo") {
                            return (
                                <FarmerItem
                                    item={item}
                                    customUserData={customUserData}
                                />
                            );
                        } else if (item.flag === "Instituição") {
                            return (
                                <InstitutionItem
                                    item={item}
                                    customUserData={customUserData}
                                />
                            );
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
    </>;
};

export default RegisteredByCurrentUser;
