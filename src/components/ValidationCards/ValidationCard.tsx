
import { View, Text, Pressable, ScrollView, Dimensions } from "react-native";
import React, { useState, } from "react";
import Modal from "react-native-modal";
import COLORS from "../../consts/colors";
import { Icon } from "@rneui/base";
import tw from "twrnc";

import ValidationOptions from "../ValidationOptions/ValidationOptions";
import { resourceTypes } from "../../consts/resourceTypes";

import InvalidationMessage from "../InvalidationMessage/InvalidationMessage";
import FarmerDetails from "./FarmerDetails";
import InstitutionDetails from "./InstitutionDetails";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import GroupDetails from "./GroupDetails";
import { useEffect } from "react";
import FarmlandDetails from "./FarmlandDetails";
import { farmlandOwners } from "../../consts/farmlandOwners";
import { backgroundStyle } from "../../styles/globals";
const { useRealm } = realmContext;

const ValidationCard = ({
    modalVisible,
    setModalVisible,
    handleModalVisible,
    resourceId,
    resourceType
}: any) => {
    const { width, height } = Dimensions.get("window");
    const realm = useRealm();
    const user = useUser();
    const customUserData = user?.customData;
    let resource;
    let manager;

    if (resourceType === resourceTypes.actor) {
        resource = realm.objectForPrimaryKey(resourceTypes.actor, resourceId);
    }
    else if (resourceType === resourceTypes.group) {
        resource = realm.objectForPrimaryKey(resourceTypes.group, resourceId);
        if (resource?.manager) {
            // this manager refers to the group representative
            manager = realm.objectForPrimaryKey(resourceTypes.actor, resource?.manager);
        }
    }
    else if (resourceType === resourceTypes.institution) {
        resource = realm.objectForPrimaryKey(resourceTypes.institution, resourceId);
    }
    else if (resourceType === resourceTypes.farmland) {
        resource = realm.objectForPrimaryKey(resourceTypes.farmland, resourceId);
        // this manager refers to the owner of the farmland
        if (resource?.ownerType === farmlandOwners.farmer) {
            manager = realm.objectForPrimaryKey(resourceTypes.actor, resource?.farmerId);

        }
        else if (resource?.ownerType === farmlandOwners.group) {
            manager = realm.objectForPrimaryKey(resourceTypes.group, resource?.farmerId);

        }
        else if (resource?.ownerType === farmlandOwners.institution) {
            manager = realm.objectForPrimaryKey(resourceTypes.institution, resource?.farmerId);

        }
    }

    const [alert, setAlert] = useState(false);
    const [isInvalidated, setIsInvalidated] = useState(false);

    /**
     * display/hide TextInput that catches the validation message
     * This displays/hides also the previous validation messages of the current resource
     */
    const handleInvalidationMessage = () => {
        setIsInvalidated(!isInvalidated);
    };


    return (
        <View 
            // className="mx-auto"
        >
            <Modal
                isVisible={modalVisible}
                supportedOrientations={["portrait", "landscape"]}
                propagateSwipe
                animationIn={"zoomIn"}
                animationInTiming={500}
                animationOut={"zoomOut"}
                animationOutTiming={500}
                hideModalContentWhileAnimating={true}
                coverScreen={true}
                hasBackdrop={true}
                deviceHeight={height}
                deviceWidth={width}
                onBackdropPress={handleModalVisible}
                style={tw`m-0 ${backgroundStyle}`}
            >
                <View
                    style={{
                        // backgroundColor: COLORS.fourth,
                        height: 40,
                        padding: 6,
                    }}
                    className="h-20 p-2 bg-[#EBEBE4] dark:bg-gray-800"
                >
                    <Text

                        className="font-semibold text-gray-500 text-lg"
                    >
                        Conferir Registo
                    </Text>
                    <Pressable
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                        }}
                        onPress={() => {
                            handleModalVisible();
                            setIsInvalidated(false);
                        }}
                    >
                        <Icon name="close" size={25} color={COLORS.grey} />
                    </Pressable>
                </View>

                <ScrollView
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{
                        // backgroundColor: COLORS.ghostwhite,
                    }}
                    className="bg-white dark:bg-gray-900"
                >
                    {
                        (resourceType === resourceTypes.actor) &&
                        <FarmerDetails resource={resource} />
                    }
                    {
                        (resourceType === resourceTypes.institution) &&
                        <InstitutionDetails resource={resource} />
                    }
                    {
                        (resourceType === resourceTypes.group) &&
                        <GroupDetails resource={resource} manager={manager} />
                    }
                    {
                        (resourceType === resourceTypes.farmland) &&
                        <FarmlandDetails resource={resource} owner={manager} />
                    }
                    <View>
                        {
                            isInvalidated &&
                            <View
                                style={{

                                    padding: 10,
                                    elevation: 1,
                                    backgroundColor: COLORS.white,
                                }}
                            >
                                <InvalidationMessage
                                    resource={resource}
                                    resourceType={resourceType}
                                />
                            </View>
                        }

                    </View>
                </ScrollView>
                {!isInvalidated &&
                    <ValidationOptions
                        resource={resource}
                        resourceType={resourceType}
                        customUserData={customUserData}
                        realm={realm}
                        alert={alert}
                        setAlert={setAlert}
                        handleModalVisible={handleModalVisible}
                        handleInvalidationMessage={handleInvalidationMessage}

                    />
                }

            </Modal>
        </View>
    );
};

export default ValidationCard;
