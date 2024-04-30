/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */

// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { View, Text, Image, } from "react-native";
import React from "react";
import CustomDivider from "../Divider/CustomDivider";
import COLORS from "../../consts/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCake, faCalculator, faCrop, faDrawPolygon, faHome, faIdCard, faImage, faLocation, faPhone, faTree, faUser } from "@fortawesome/free-solid-svg-icons";
import { Box, InfoIcon, Stack } from "native-base";
import { Icon } from "@rneui/base";
import { generateFormattedDate } from "../../helpers/generateFormattedDate";
import { farmlandOwners } from "../../consts/farmlandOwners";
import { calculateFarmlandUsedArea } from "../../helpers/calculateFarmlandUsedArea";
import { calculateFarmlandBlockTrees } from "../../helpers/calculateFarmlandBlockTrees";
import { faMix } from "@fortawesome/free-brands-svg-icons";
import { normalizeBlockList } from "../../helpers/normalizeBlockList";

const FarmlandDetails = ({
    resource,
    owner
}: any) => {
    return (
        <View
            flex={1}
            onStartShouldSetResponder={() => true}
        >
            <View
                style={{
                    height: 150,
                }}
            >
                <Image
                    style={{
                        height: 150,
                        resizeMode: "cover",
                    }}

                    // @ts-expect-error TS(2591): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
                    source={require("../../../assets/images/plot1.jpg")}
                />
                <View
                    style={{
                        position: "relative",
                        bottom: 90,
                        left: 20,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <View>
                        {
                            owner?.image ? (
                                <Image
                                    source={{ uri: owner?.image }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 100,
                                    }}
                                    alt=""
                                    resizeMethode="center"
                                />
                            )
                                :
                                (
                                    <View
                                        style={{
                                            borderWidth: 1,
                                            borderColor: COLORS.white,
                                            borderRadius: 100,
                                            padding: 7,
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faUser} size={35} color={COLORS.white} />
                                    </View>
                                )
                        }
                    </View>
                    <View>
                        <Text
                            style={{
                                fontSize: 24,
                                color: COLORS.white,
                                paddingLeft: 20,
                                fontFamily: "RobotoCondensed-Bold",
                            }}
                        >
                            {resource?.ownerType === farmlandOwners.farmer ? `${owner?.names.otherNames} ${owner?.names.surname}` : `${owner?.type} ${owner?.name}`}
                        </Text>
                    </View>
                </View>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    paddingVertical: 10,
                    // marginTop: 10,
                }}
            >
                <Box w="10%" alignItems={"center"}>
                    <FontAwesomeIcon icon={faLocation} size={20} color={COLORS.grey} />
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
                        >Descrição da Localização:</Text>
                        <Text>{resource?.description}</Text>
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
                    // marginTop: 10,
                }}
            >
                <Box w="10%" alignItems={"center"}>
                    <FontAwesomeIcon icon={faDrawPolygon} size={20} color={COLORS.grey} />
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
                        >Área Declarada:</Text>
                        <Text>{resource?.totalArea} hectares</Text>
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
                        >Total Aproveitada:</Text>
                        <Text>{calculateFarmlandUsedArea(resource)} hectares</Text>
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
                    // marginTop: 10,
                }}
            >
                <Box w="10%" alignItems={"center"}>
                    <FontAwesomeIcon icon={faDrawPolygon} size={20} color={COLORS.grey} />
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
                        >Área Auditada:</Text>
                        <Text
                            style={{
                                color: !resource?.auditedArea ? COLORS.danger : COLORS.grey,
                            }}
                        >{resource?.auditedArea ? parseFloat(resource?.auditedArea).toFixed(1) : 0} hectares</Text>
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
                        >Anos de Plantio:</Text>
                        <Text>{resource?.blocks?.map((block: any) => block?.plantingYear).join("; ")}</Text>
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
                    // marginTop: 10,
                }}
            >
                <Box w="10%" alignItems={"center"}>
                    <FontAwesomeIcon icon={faTree} size={20} color={COLORS.grey} />
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
                        >Total de Cajueiros:</Text>
                        <Text
                            style={{
                                color: calculateFarmlandBlockTrees(resource) !== resource?.trees ? COLORS.danger : COLORS.grey,
                            }}
                        >{resource?.trees} árvores</Text>
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
                        >Cajueiros Registados:</Text>
                        <Text
                            style={{
                                color: calculateFarmlandBlockTrees(resource) !== resource?.trees ? COLORS.danger : COLORS.grey,
                            }}
                        >{calculateFarmlandBlockTrees(resource)} árvores</Text>
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
                    // marginTop: 10,
                }}
            >
                <Box w="10%" alignItems={"center"}>
                    <FontAwesomeIcon icon={faMix} size={20} color={COLORS.grey} />
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
                        >Culturas consociadas:</Text>
                        <Text>{resource?.consociatedCrops.join("; ")}</Text>
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
                        >Área Aproveitada:</Text>
                        <Text>{calculateFarmlandUsedArea(resource)} hectares</Text>
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

            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: COLORS.dark,
                    // alignItems: "center",
                    width: "100%",
                    padding: 10,
                }}
            >

                <Text
                    style={{
                        fontSize: 18,
                        color: COLORS.white,
                        fontFamily: "RobotoCondensed-Bold",
                    }}
                >
                    Parcelas com Cajueiros
                </Text>
            </View>

            {normalizeBlockList(resource?.blocks)?.length === 0 && (

                <View
                    style={{
                        marginBottom: 40,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <InfoIcon width={60} height={60} />
                    <Text
                        style={{
                            color: COLORS.danger,
                            fontSize: 14,
                            fontFamily: "JosefinSans-Regular",
                            textAlign: "center",
                            backgroundColor: COLORS.lightestgrey,
                            width: 220,
                            padding: 6,
                        }}
                    >
                        Nenhuma percela de cajueiros
                    </Text>
                </View>
            )}

            {normalizeBlockList(resource?.blocks)?.map((block: any, index: any) => (
                <Box
                    key={index}

                    // @ts-expect-error TS(2322): Type '{ children: Element; key: any; style: { marg... Remove this comment to see the full error message
                    style={{
                        margin: 10,
                    }}
                >
                    <Box

                        // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingVerti... Remove this comment to see the full error message
                        style={{
                            paddingVertical: 5,
                        }}
                    >
                        <Stack w="100%" direction="row" space={2}>
                            <Box
                                w="10%"

                                // @ts-expect-error TS(2322): Type '{ children: Element; w: "10%"; style: { alig... Remove this comment to see the full error message
                                style={{
                                    alignItems: "center",
                                    backgroundColor: COLORS.dark,
                                    borderRadius: 100,
                                    padding: 7,
                                }}
                            >

                                <Text
                                    style={{
                                        color: COLORS.ghostwhite,
                                        fontSize: 15,
                                        fontFamily: "JosefinSans-Regular",
                                        textAlign: "center",
                                    }}
                                >
                                    {block?.position + 1}
                                </Text>
                            </Box>
                            <Box w="90%">
                                <Text
                                    style={{
                                        color: COLORS.dark,
                                        fontSize: 15,
                                        fontFamily: "JosefinSans-Bold",
                                    }}
                                >
                                    Ano de Plantio: {block.plantingYear}
                                </Text>
                            </Box>
                        </Stack>
                        {/* <CustomDivider /> */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                                width: "100%",
                                paddingVertical: 10,
                                // marginTop: 10,
                            }}
                        >
                            <Box w="10%" alignItems={"center"}>
                                <FontAwesomeIcon icon={faCrop} size={20} color={COLORS.grey} />
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
                                    >Compasso:</Text>
                                    <Text>
                                        {block?.density?.mode === "Irregular"
                                            ? block?.density?.mode
                                            : block?.density?.mode === "Regular"
                                                ? `${block?.density?.mode} (${block?.density.length} por ${block?.density?.width} metros)`
                                                : ""}{" "}</Text>
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
                                    >Área Aproveitada:</Text>
                                    <Text>{block?.usedArea?.toFixed(1)} hectares</Text>
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
                                // marginTop: 10,
                            }}
                        >
                            <Box w="10%" alignItems={"center"}>
                                <FontAwesomeIcon icon={faTree} size={20} color={COLORS.grey} />
                            </Box>
                            <Box
                                w="90%"
                                alignItems={"center"}
                                // spce={3}

                                // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "90%"; alignItems:... Remove this comment to see the full error message
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "space-around",
                                }}
                            >
                                <Box
                                    w="100%"

                                    // @ts-expect-error TS(2322): Type '{ children: Element; w: "100%"; style: { jus... Remove this comment to see the full error message
                                    style={{
                                        justifyContent: "flex-start",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "JosefinSans-Bold",
                                            color: COLORS.black,
                                        }}
                                    >
                                        Cajueiros: ({block?.trees} árvores)
                                    </Text>
                                </Box>
                                <View style={{ width: 10, }} />
                                <Box
                                    w="100%"

                                    // @ts-expect-error TS(2322): Type '{ children: any; w: "100%"; style: { justify... Remove this comment to see the full error message
                                    style={{
                                        justifyContent: "flex-start",
                                    }}
                                >
                                    {block?.sameTypeTrees?.length > 0 ? (
                                        block?.sameTypeTrees?.map((sameType: any, index: any) => (
                                            <Box key={index}>
                                                <Text
                                                    style={{
                                                        color: COLORS.grey,
                                                        fontSize: 14,
                                                        fontFamily: "JosefinSans-Regular",
                                                    }}
                                                >
                                                    <Icon
                                                        name="arrow-forward"
                                                        color={COLORS.grey}
                                                        size={10}
                                                    />{" "}
                                                    {sameType?.treeType} ({sameType?.trees} árvores)
                                                </Text>
                                            </Box>
                                        ))
                                    ) : (
                                        <Text
                                            style={{
                                                color: COLORS.danger,
                                                fontSize: 16,
                                                fontFamily: "JosefinSans-Regular",
                                                textAlign: "center",
                                                padding: 20,
                                            }}
                                        >
                                            Nenhum
                                        </Text>
                                    )}
                                </Box>
                            </Box>
                        </View>
                        <CustomDivider />
                    </Box>
                </Box>
            ))}



        </View>
    );
};

export default FarmlandDetails;
