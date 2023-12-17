/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { View, Text, TextInput } from "react-native";
import React, { useEffect, useCallback, useMemo, useRef, } from "react";
import { FlatList } from "react-native";
import COLORS from "../../consts/colors";
import InfoIcon from "../LottieComponents/InfoIcon";
import { customizeItem } from "../../helpers/customizeItem";
import { farmerTypes } from "../../consts/farmerTypes";
import PendingFarmerItem from "./PendingItem";
import { resourceValidation } from "../../consts/resourceValidation";

import { realmContext } from "../../models/realmContext";
import { useState } from "react";
import { resourceTypes } from "../../consts/resourceTypes";
import PendingItem from "./PendingItem";
import Info from "../Info/Info";
const { useRealm } = realmContext;

const PendingResources = ({ route, navigation, userId, resourceType, }) => {
    let realm = useRealm();
    let resources = [];


    if (resourceType === resourceTypes.actor) {
        resources = realm.objects(resourceTypes.actor).filtered("status == $0 && userId == $1", resourceValidation.status.pending, userId);
        resources = customizeItem(resources, [], [], {}, farmerTypes.farmer);
    }
    else if (resourceType === resourceTypes.group) {
        resources = realm.objects(resourceTypes.group).filtered("status == $0 && userId == $1", resourceValidation.status.pending, userId);
        resources = customizeItem(resources, [], [], {}, farmerTypes.group);
    }
    else if (resourceType === resourceTypes.institution) {
        resources = realm.objects(resourceTypes.institution).filtered("status == $0 && userId == $1", resourceValidation.status.pending, userId);
        resources = customizeItem(resources, [], [], {}, farmerTypes.institution);
    }
    else if (resourceType === resourceTypes.farmland) {
        resources = realm.objects(resourceTypes.farmland).filtered("status == $0 && userId == $1", resourceValidation.status.pending, userId);
        resources = customizeItem(resources, [], [], {}, resourceTypes.farmland);
    }

    const [refresh, setRefresh] = useState(false);

    const keyExtractor = (item, index) => index.toString();

    return (
        <View>
            {resources.length > 0 ?
                <View
                    style={{
                        paddingBottom: 80,
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
                        data={resources}
                        keyExtractor={keyExtractor}
                        // onEndReached={handleEndReached}
                        onEndReachedThreshold={0.1}
                        renderItem={({ item }) => {
                            // when the user open any item from the list
                            if (resourceType === resourceTypes.group || resourceType === resourceTypes.actor || resourceType === resourceTypes.institution) {
                                return (<PendingItem item={item} refresh={refresh} setRefresh={setRefresh} />);
                            } else if (resourceType === resourceTypes.farmland) {
                                return (<PendingItem item={item} refresh={refresh} setRefresh={setRefresh} />);
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
                    <Info info={"Nenhum registo aguarda deferimento"} />
                </View>
            }
        </View>

    );
};

export default PendingResources;
