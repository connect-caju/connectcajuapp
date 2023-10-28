/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { View, Text, Image, } from "react-native";
import React from "react";
import CustomDivider from "../Divider/CustomDivider";
import COLORS from "../../consts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCake, faHome, faIdCard, faImage, faLegal, faObjectGroup, faPeopleGroup, faPerson, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { Box } from "native-base";
import { Icon } from "@rneui/base";
import { groupTypes } from "../../consts/groupTypes";


const GroupDetails = ({ resource, manager }) => {

    console.log("resourceManager: ", manager);
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
                    {manager?.image ? (
                        <Image
                            source={{ uri: manager?.image }}
                            style={{
                                width: 50,
                                height: 50,
                                borderColor: COLORS.main,
                                marginHorizontal: 3,
                                borderRadius: 120,
                            }}
                        />
                    ) : (
                        // <Icon name="account-circle" size={60} color={COLORS.grey} />
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
                    )}
                </Box>
                <Box
                    w="80%"
                    alignItems={"center"}
                    // spce={3}
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <Box
                        w="100%"
                        style={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >{resource.type === groupTypes.cooperative ? "Presidente" : "Representante"}:</Text>
                        <Text
                            style={{
                                color: resource?.manager ? COLORS.grey : COLORS.danger,
                            }}
                        >{resource?.manager ? `${manager?.names?.otherNames} ${manager?.names.surname}` : "Nenhum"}</Text>
                    </Box>
                    <View style={{ width: 10, }} />
                    {/* <Box
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
                    </Box> */}
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
                                color: manager?.contact?.primaryPhone ? COLORS.grey : COLORS.danger,
                            }}
                        >{manager?.contact?.primaryPhone ? manager?.contact?.primaryPhone : "Nenhum"}</Text>
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
                                color: manager?.contact?.secondaryPhone ? COLORS.grey : COLORS.danger,
                            }}
                        >{manager?.contact?.secondaryPhone ? manager?.contact?.secondaryPhone : "Nenhum"}</Text>
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
                    <FontAwesomeIcon icon={faLegal} size={20} color={COLORS.grey} />
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
                        >Ano de Criação:</Text>
                        <Text
                            style={{
                                color: resource?.creationYear ? COLORS.grey : COLORS.danger,
                            }}
                        >{resource?.creationYear ? resource?.creationYear : "Nenhum"}</Text>
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
                        >Ano de Legalização:</Text>
                        <Text
                            style={{
                                color: COLORS.grey,
                            }}
                        >{resource?.affiliationYear ? resource?.affiliationYear : "Não Aplicável"}</Text>
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
                    <FontAwesomeIcon icon={faObjectGroup} size={20} color={COLORS.grey} />
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
                        w="100%"
                        style={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "JosefinSans-Bold",
                                color: COLORS.black,
                            }}
                        >Finalidade:</Text>
                        <Text
                            style={{
                                color: resource?.idDocument?.docNumber !== "Nenhum" ? COLORS.grey : COLORS.danger,
                            }}
                        >
                            {resource?.assets?.length > 0
                                ? resource?.assets
                                    ?.map((asset) => asset.subcategory)
                                    ?.join("; ")
                                : "Não específica"
                            }
                        </Text>
                    </Box>
                    <View style={{ width: 10, }} />
                    {/* <Box
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
                    </Box> */}
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
                    <FontAwesomeIcon icon={faPeopleGroup} size={20} color={COLORS.grey} />
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
                        >Membros Declarados:</Text>
                        <Text
                            style={{
                                // color: resource?.idDocument?.docNumber !== "Nenhum" ? COLORS.grey : COLORS.danger,
                            }}
                        >{resource?.numberOfMembers?.total}</Text>
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
                        >Membros Registados:</Text>
                        <Text
                            style={{
                                // color: resource?.idDocument?.nuit ? COLORS.grey : COLORS.danger,
                            }}
                        >{resource?.members?.length}</Text>
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
                        >Alvará:</Text>
                        <Text
                            style={{
                                color: resource?.licence ? COLORS.grey : COLORS.danger,
                            }}
                        >{resource?.licence ? resource?.licence : "Nenhum"}</Text>
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

export default GroupDetails;
