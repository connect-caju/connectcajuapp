/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { View, Text, Image, } from "react-native";
import React from "react";
import CustomDivider from "../Divider/CustomDivider";
import COLORS from "../../consts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCake, faHome, faIdCard, faImage, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Box, } from "native-base";
import { generateFormattedDate } from "../../helpers/generateFormattedDate";
import { Icon } from "@rneui/base";

const FarmerDetails = ({ resource }) => {
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
                    >{resource?.names.otherNames} {resource?.names.surname}</Text>
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
                <Box w="10%" alignItems={"center"}>
                    <FontAwesomeIcon icon={faHome} size={20} color={COLORS.grey} />
                </Box>
                <Box
                    w="90%"
                    alignItems={"center"}
                    // spce={3}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <Box
                        w="45%"
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
                    <FontAwesomeIcon icon={faCake} size={20} color={COLORS.grey} />
                </Box>
                <Box
                    w="90%"
                    alignItems={"center"}
                    // spce={3}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <Box
                        w="45%"
                        style={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >Data:</Text>
                        <Text>{generateFormattedDate(resource?.birthDate)}</Text>
                    </Box>
                    <View style={{ width: 10, }} />
                    <Box
                        w="45%"
                        style={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >Lugar:</Text>
                        <Text>{resource?.birthPlace?.adminPost ? resource?.birthPlace?.adminPost : resource?.birthPlace?.district ? resource?.birthPlace?.district : resource?.birthPlace?.province}</Text>
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
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <Box
                        w="45%"
                        style={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
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
                        style={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
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
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <Box
                        w="45%"
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
                                color: resource?.idDocument?.docNumber !== "Nenhum" ? COLORS.grey : COLORS.danger,
                            }}
                        >{resource?.idDocument?.docNumber !== "Nenhum" ? `${resource?.idDocument?.docNumber} (${resource?.idDocument?.docType}) ` : "Nenhum"}</Text>
                    </Box>
                    <View style={{ width: 10, }} />
                    <Box
                        w="45%"
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
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <Box
                        w="45%"
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

export default FarmerDetails;
