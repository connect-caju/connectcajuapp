import { View, Text, Image, } from "react-native";
import React from "react";
import CustomDivider from "../Divider/CustomDivider";
import COLORS from "../../consts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faIdCard, faImage, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { Box } from "native-base";
import { Icon } from "@rneui/base";

const InstitutionDetails = ({
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
                    backgroundColor: COLORS.fourth,
                }}
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
                            <FontAwesomeIcon icon={faImage} size={200} color={COLORS.grey} />
                        )
                }
                <View
                    style={{
                        alignSelf: "center",
                        paddingBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.black,
                            fontFamily: "JosefinSans-Bold",
                            fontSize: 18,
                        }}
                    >{resource?.type} {resource?.name}</Text>
                </View>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    paddingVertical: 10,
                }}
            >
                <Box w="20%" alignItems={"center"}>
                    <View
                        style={{
                            borderRadius: 50,
                            borderWidth: 1,
                            borderColor: COLORS.lightgrey,
                            backgroundColor: COLORS.lightgrey,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                        }}
                    >
                        <FontAwesomeIcon icon={faUser} size={25} color={COLORS.grey} />
                    </View>
                </Box>
                <Box
                    w="80%"
                    alignItems={"center"}
                    // spce={3}

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "80%"; alignItems:... Remove this comment to see the full error message
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <Box
                        w="100%"

                        // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; style: { j... Remove this comment to see the full error message
                        style={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >Responsável:</Text>
                        <Text>{resource?.manager?.fullname}</Text>
                    </Box>
                    <View style={{ width: 10, }} />
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
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >Distrito:</Text>
                        <Text>{resource?.address?.district}</Text>
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
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >Posto Administrativo:</Text>
                        <Text>{resource?.address?.adminPost}</Text>
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
                    }}
                >
                    <Box
                        w="100%"

                        // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; style: { j... Remove this comment to see the full error message
                        style={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >Contacto:</Text>
                        <Text
                            style={{
                                color: resource?.manager?.phone ? COLORS.grey : COLORS.danger,
                            }}
                        >{resource?.manager?.phone ? resource?.manager?.phone : "Nenhum"}</Text>
                    </Box>
                    <View style={{ width: 10, }} />
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
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >Documentação:</Text>
                        <Text
                            style={{
                                color: resource?.licence ? COLORS.grey : COLORS.danger,
                            }}
                        >{resource?.licence ? resource?.licence : "Nenhum"}</Text>
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
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >NUIT:</Text>
                        <Text
                            style={{
                                color: resource?.nuit ? COLORS.grey : COLORS.danger,
                            }}
                        >{resource?.nuit ? resource?.nuit : "Nenhum"}</Text>
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
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
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
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
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
    );
};

export default InstitutionDetails;
