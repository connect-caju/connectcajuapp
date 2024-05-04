
import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { realmContext } from "../../models/realmContext";

import { FlatList } from "react-native";
import COLORS from "../../consts/colors";
import InfoIcon from "../LottieComponents/InfoIcon";
import { customizeItem } from "../../helpers/customizeItem";
import { farmerTypes } from "../../consts/farmerTypes";

import { resourceValidation } from "../../consts/resourceValidation";
import PendingInstitutionItem from "./PendingInstitutionItem";
const { useRealm } = realmContext;

const PendingInstitutions = ({
    route,
    navigation,
    userId
}: any) => {
    let realm = useRealm();
    const fetchedInstitutions = realm.objects("Institution").filtered("status == $0 && userId == $1", resourceValidation.status.pending, userId);

    const institutions = customizeItem(fetchedInstitutions, [], [], {}, farmerTypes.institution); 

    const keyExtractor = (item: any, index: any) => index.toString();

    return <>
        {institutions.length > 0 ?
            <View
                style={{
                    height: "80%",
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
                    data={institutions}
                    keyExtractor={keyExtractor}
                    // onEndReached={handleEndReached}
                    onEndReachedThreshold={0.1}
                    renderItem={({
                        item
                    }: any) => {
                        // add all the IDs to each item to allow swiping between screens...
                        // when the user open any item from the list
                        // if (item.flag === "Grupo") {
                        //     return <GroupItem route={route} item={item} />;
                        // } else if (item.flag === "Indivíduo") {
                            return (
                                <PendingInstitutionItem route={route} navigation={navigation} item={item} />
                            );
                        // } else if (item.flag === "Instituição") {
                        //     return <InstitutionItem route={route} item={item} />;
                        // }
                    }}
                    ListFooterComponent={() => {
                        return null;
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
                <View
                    style={{
                        backgroundColor: COLORS.lightestgrey,
                        padding: 10,
                        borderRadius: 6,
                        width: 220,
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.grey,
                            fontSize: 15,
                            fontFamily: "JosefinSans-Regular",
                            textAlign: "center",
                        }}
                    >
                        Nenhum registo de produtores aguarda deferimento
                    </Text>
                </View>
            </View>
        }
    </>;
};

export default PendingInstitutions;
