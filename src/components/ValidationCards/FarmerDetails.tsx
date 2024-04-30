/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, Image, } from "react-native";
import React from "react";
import CustomDivider from "../Divider/CustomDivider";
import COLORS from "../../consts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCake, faHome, faIdCard, faImage, faPhone, faUser, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Box, } from "native-base";
import { generateFormattedDate } from "../../helpers/generateFormattedDate";
import { Icon } from "@rneui/base";

const FarmerDetails = ({
    resource
}: any) => {
    return (
        <View>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 10,
                    paddingHorizontal: 10,
                    // backgroundColor: COLORS.fourth,
                }}
                className="bg-[#EBEBE4] dark:bg-gray-800"
                flex={1}
                onStartShouldSetResponder={() => true}
            >{
                    resource?.image ? (
                        <Image
                            source={{ uri: resource?.image }}
                            style={{
                                width: 200,
                                height: 200,
                                borderRadius: 100,
                            }}
                            alt=""
                            resizeMode="cover"
                        />
                    )
                        :
                        (
                            <FontAwesomeIcon icon={faUserCircle} size={120} color={COLORS.grey} />
                        )
                }
                <View
                    className="flex justify-center items-center h-16"
                >
                    <Text
                        className="text-gray-500 text-lg font-bold"
                    >{resource?.names.otherNames} {resource?.names.surname}</Text>
                </View>
            </View>

            <View className="bg-white dark:bg-gray-800">

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                        paddingVertical: 10,
                    }}

                >
                    <Box w="10%" alignItems={"center"}>
                        <FontAwesomeIcon icon={faHome} size={20} color={COLORS.grey} />
                    </Box>
                    <Box
                        w="90%"
                        alignItems={"center"}
                        // spce={3}

                        // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "90%"; alignItems:... Remove this comment to see the full error message
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}
                    >
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >
                                Distrito:
                            </Text>
                            <Text
                                className="text-gray-500 font-normal text-sm"
                            >{resource?.address?.district}</Text>
                        </Box>
                        <View style={{ width: 10, }} />
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >Posto Administrativo:</Text>
                            <Text
                                className="text-gray-500 font-normal text-sm"
                            >{resource?.address?.adminPost}</Text>
                        </Box>
                    </Box>
                </View>

                <CustomDivider />

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                        paddingVertical: 10,
                    }}
                >
                    <Box w="10%" alignItems={"center"}>
                        <FontAwesomeIcon icon={faCake} size={20} color={COLORS.grey} />
                    </Box>
                    <Box
                        w="90%"
                        alignItems={"center"}
                        // spce={3}

                        // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "90%"; alignItems:... Remove this comment to see the full error message
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}
                    >
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >Data:</Text>
                            <Text
                                className="text-gray-500 font-normal text-sm"
                            >{generateFormattedDate(resource?.birthDate)}</Text>
                        </Box>
                        <View style={{ width: 10, }} />
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >Lugar:</Text>
                            <Text
                                className="text-gray-500 font-normal text-sm"
                            >{resource?.birthPlace?.adminPost ? resource?.birthPlace?.adminPost : resource?.birthPlace?.district ? resource?.birthPlace?.district : resource?.birthPlace?.province}</Text>
                        </Box>
                    </Box>
                </View>
                <CustomDivider />

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                        paddingVertical: 10,
                    }}
                >
                    <Box w="10%" alignItems={"center"}>
                        <FontAwesomeIcon icon={faPhone} size={20} color={COLORS.grey} />
                    </Box>
                    <Box
                        w="90%"
                        alignItems={"center"}
                        // spce={3}

                        // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "90%"; alignItems:... Remove this comment to see the full error message
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}                    >
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >Principal:</Text>
                            <Text
                                style={{
                                    color: resource?.contact?.primaryPhone ? COLORS.grey : COLORS.danger,
                                }}
                            >{resource?.contact?.primaryPhone ? resource?.contact?.primaryPhone : "Nenhum"}</Text>
                        </Box>
                        <View style={{ width: 10, }} />
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >Alternativo:</Text>
                            <Text
                                style={{
                                    color: resource?.contact?.secondaryPhone ? COLORS.grey : COLORS.danger,
                                }}
                            >{resource?.contact?.secondaryPhone ? resource?.contact?.secondaryPhone : "Nenhum"}</Text>
                        </Box>
                    </Box>
                </View>
                <CustomDivider />


                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                        paddingVertical: 10,
                    }}
                >
                    <Box w="10%" alignItems={"center"}>
                        <FontAwesomeIcon icon={faIdCard} size={20} color={COLORS.grey} />
                    </Box>
                    <Box
                        w="90%"
                        alignItems={"center"}
                        // spce={3}

                        // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "90%"; alignItems:... Remove this comment to see the full error message
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}
                    >
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >Documentação:</Text>
                            <Text
                                style={{
                                    color: resource?.idDocument?.docNumber !== "Nenhum" ? COLORS.grey : COLORS.danger,
                                }}
                            >{resource?.idDocument?.docNumber !== "Nenhum" ? `${resource?.idDocument?.docNumber} (${resource?.idDocument?.docType}) ` : "Nenhum"}</Text>
                        </Box>
                        <View style={{ width: 10, }} />
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >NUIT:</Text>
                            <Text
                                style={{
                                    color: resource?.idDocument?.nuit ? COLORS.grey : COLORS.danger,
                                }}
                            >{resource?.idDocument?.nuit ? resource?.idDocument?.nuit : "Nenhum"}</Text>
                        </Box>
                    </Box>
                </View>
                <CustomDivider />

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: "100%",
                        paddingVertical: 10,
                    }}
                >
                    <Box w="10%" alignItems={"center"}>
                        <Icon name={"location-pin"} size={25} color={COLORS.grey} />
                    </Box>
                    <Box
                        w="90%"
                        alignItems={"center"}
                        // spce={3}

                        // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "90%"; alignItems:... Remove this comment to see the full error message
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                        }}
                    >
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >Latitude:</Text>
                            <Text
                                style={{
                                    color: resource?.geolocation?.latitude ? COLORS.grey : COLORS.danger,
                                }}
                            >{resource?.geolocation?.latitude ? resource?.geolocation?.latitude : "Nenhum"}</Text>
                        </Box>
                        <View style={{ width: 10, }} />
                        <Box
                            w="45%"

                            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "45%"; style: { ju... Remove this comment to see the full error message
                            style={{
                                justifyContent: "flex-start",
                            }}
                        >
                            <Text
                                className="text-gray-500 font-semibold text-sm"
                            >Longitude:</Text>
                            <Text
                                style={{
                                    color: resource?.geolocation?.longitude ? COLORS.grey : COLORS.danger,
                                }}
                            >{resource?.geolocation?.longitude ? resource?.geolocation?.longitude : "Nenhum"}</Text>
                        </Box>
                    </Box>
                </View>
                <CustomDivider />
            </View>


        </View>
    );
};

export default FarmerDetails;
