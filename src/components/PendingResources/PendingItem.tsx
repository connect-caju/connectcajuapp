import { TouchableOpacity, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Icon, Avatar } from "@rneui/themed";
import {
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { Box, Center, Stack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../consts/colors";
import { farmerTypes } from "../../consts/farmerTypes";
import ValidationCard from "../ValidationCards/ValidationCard";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisVertical, faEye, } from "@fortawesome/free-solid-svg-icons";
import { resourceTypes } from "../../consts/resourceTypes";
import CustomDivider from "../Divider/CustomDivider";
import { farmlandOwners } from "../../consts/farmlandOwners";


const PendingItem = ({
    item,
    refresh,
    setRefresh
}: any) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [resourceType, setResourceType] = useState("");

    /**
     * display/hide the Modal containing resource details that need validation
     *  ValidationCard Modal
     */
    const handleModalVisible = () => {
        setModalVisible(!modalVisible);
        setRefresh(!refresh);
    };

    /**
     * update the resourceType anytime them item changes
     * the resourceType is either Individuo || Grupo || Instituicao.
     * Each item from customizedItem comes with a flag that is either
     * a Individuo or Grupo or Instituicao
     */
    const handleResourceType = () => {
        if (item?.flag === farmerTypes.farmer) {
            setResourceType(resourceTypes.actor);
        }
        else if (item?.flag === farmerTypes.group) {
            setResourceType(resourceTypes.group);
        }
        else if (item?.flag === farmerTypes.institution) {
            setResourceType(resourceTypes.institution);
        }
        else if (item?.flag === resourceTypes.farmland) {
            setResourceType(resourceTypes.farmland);
        }
    };

    useEffect(() => {
        handleResourceType();
    }, [item]);

    return (
        <View
            className="bg-white dark:bg-gray-800 mx-2 my-1 rounded-md "
        >
            {
                (item.flag === resourceTypes.farmland) &&
                <Stack direction="row" w="100%">

                    <TouchableOpacity
                        onLongPress={handleModalVisible}
                        onPress={() => {
                            // take action
                        }}
                        style={{
                            width: "85%",
                            marginVertical: 5,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <View>
                                <Text
                                    className="text-gray-500 font-semibold text-sm"
                                >Cajueiros:</Text>
                                <Text
                                    className="text-gray-500 font-normal text-xs"
                                >{item?.trees} árvores</Text>
                            </View>
                            <View>
                                <Text
                                    className="text-gray-500 font-semibold text-sm"
                                >
                                    Área:
                                </Text>
                                <Text
                                    className="text-gray-500 font-normal text-xs"
                                >{item?.totalArea} hectares</Text>
                            </View>
                            <View>
                                <Text
                                    className="text-gray-500 font-semibold text-sm"
                                >Parcelas:</Text>
                                <Text
                                    className="text-gray-500 font-normal text-xs"
                                >{item?.blocks ? item?.blocks?.length : 0}</Text>
                            </View>
                        </View>
                        <Text
                            className="text-gray-500 font-normal text-xs text-right pt-1"
                        >
                            Registo: {item?.createdAt} por {item?.user}
                        </Text>
                    </TouchableOpacity>

                    <Center w="15%">
                        <TouchableOpacity
                            onPress={() => {

                                // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                                navigation.navigate("Profile", {
                                    ownerId: item.farmerId,
                                    farmersIDs: item?.farmersIDs,
                                    farmerType: item?.ownerType === farmlandOwners.farmer ? farmerTypes.farmer : item?.ownerType === farmlandOwners.farmer ? farmerTypes.institution : farmerTypes.group,
                                });
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faEye}
                                size={15}
                                color={COLORS.grey}
                            />
                        </TouchableOpacity>
                    </Center>
                </Stack>
            }


            {
                (item.flag === farmerTypes.farmer || item.flag === farmerTypes.group || item.flag === farmerTypes.institution) &&
                <Stack direction="row" w="100%">
                    <Center w="15%" m="2">
                        <Avatar
                            size={wp("16%")}
                            rounded
                            title={item?.imageAlt}
                            containerStyle={{ backgroundColor: COLORS.grey }}
                            source={{
                                uri: item?.image,
                            }}
                        />
                    </Center>

                    <Box w="70%" pt="3">
                        <TouchableOpacity
                            onLongPress={handleModalVisible}
                            onPress={() => {
                                // take action
                            }}
                        >
                            <Text
                                className="text-gray-500 ml-2 font-semibold text-lg"
                                numberOfLines={1}
                                ellipsizeMode={"tail"}
                            >
                                {item?.name}
                            </Text>
                            <Text
                                className="text-gray-500 font-normal text-xs text-right pt-1"
                            >
                                Registo: {item?.createdAt} por {item?.user}
                            </Text>
                        </TouchableOpacity>
                    </Box>
                    <Center w="15%">
                        <TouchableOpacity
                            onPress={() => {

                                // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                                navigation.navigate("Profile", {
                                    ownerId: item._id,
                                    farmersIDs: item?.farmersIDs,
                                    farmerType: item?.flag,
                                });
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faEye}
                                size={15}
                                color={COLORS.grey}
                            />
                        </TouchableOpacity>
                    </Center>
                </Stack>
            }
            <ValidationCard
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleModalVisible={handleModalVisible}
                resourceId={item?._id}
                resourceType={resourceType}
            />
            <CustomDivider />
        </View>
    );
};

export default PendingItem;
