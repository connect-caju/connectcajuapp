
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
import { faEllipsisVertical, } from "@fortawesome/free-solid-svg-icons";
import { resourceTypes } from "../../consts/resourceTypes";



const PendingGroupItem = ({
    item,
    refresh,
    setRefresh
}: any) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleModalVisible = () => {
        setModalVisible(!modalVisible);
        setRefresh(!refresh);
    };


    return (
        <View
            style={{
                paddingHorizontal: 8,
                marginVertical: 5,
                shadowColor: COLORS.main,
            }}
        >
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

                <Box w="75%" pt="3">
                    <TouchableOpacity
                        onLongPress={handleModalVisible}
                        onPress={() => {
                            // take action
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                        >
                            {item?.name}
                        </Text>
                        <Text
                            style={{
                                textAlign: "right",
                                color: COLORS.grey,
                                fontFamily: "JosefinSans-Italic",
                                fontSize: 12,
                            }}
                        >
                            Registo: {item?.createdAt} por {item?.user}
                        </Text>
                    </TouchableOpacity>
                </Box>
                <Center w="10%">
                    <TouchableOpacity
                        onPress={() => {

                            // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                            navigation.navigate("Profile", {
                                ownerId: item._id,
                                farmersIDs: item?.farmersIDs,
                                farmerType: farmerTypes.farmer,
                            });
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faEllipsisVertical}
                            size={15}
                            color={COLORS.grey}
                        />
                    </TouchableOpacity>
                </Center>
            </Stack>
            <ValidationCard
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleModalVisible={handleModalVisible}
                resourceId={item._id}
                resourceType={resourceTypes.group}
            />
        </View>
    );
};

export default PendingGroupItem;
