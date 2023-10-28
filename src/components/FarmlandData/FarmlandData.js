/* eslint-disable linebreak-style */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import {
  Box,
  Stack,
} from "native-base";
import { Icon, } from "@rneui/base";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  responsiveFontSize,
} from "react-native-responsive-dimensions";

import CustomDivider from "../Divider/CustomDivider";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../consts/colors";

import { resourceValidation } from "../../consts/resourceValidation";
import { resourceTypes } from "../../consts/resourceTypes";
import EditFarmlandData from "../EditData/EditFarmlandData";
import { roles } from "../../consts/roles";
import ConfirmData from "../EditData/ConfirmFarmlandData";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { normalizeBlockList } from "../../helpers/normalizeBlockList";
import NewFarmlandBlock from "../FarmlandBlockRegistration/NewFarmlandBlock";
import { getPlantingYears } from "../../helpers/getPlantingYears";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAdd,
  faCrop,
  faTree,
} from "@fortawesome/free-solid-svg-icons";
import { SuccessLottie } from "../LottieComponents/SuccessLottie";
import ValidationOptions from "../ValidationOptions/ValidationOptions";
import InvalidationMessage from "../InvalidationMessage/InvalidationMessage";
import ResourceSignature from "../ResourceSignature/ResourceSignature";
import ResourceStatusIcon from "../ResourceStatusIcon/ResourceStatusIcon";
import LinearGradient from "react-native-linear-gradient";
import InfoIcon from "../LottieComponents/InfoIcon";
const { useRealm, useQuery, useObject } = realmContext;

const farmlandResourceMessage = "farmlandResourceMessage";

const FarmlandData = ({
  farmland,
  setRefresh,
  refresh,
  ownerImage,
}) => {
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;

  const scaleBlockBox = useRef(new Animated.Value(0)).current;
  const [presentEditFarmland, setPresentEditFarmland] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isCollapseOn, setIsCallapseOn] = useState(false);

  const navigation = useNavigation();

  // ------------------------------------------
  const [alert, setAlert] = useState(false);
  // ---------------------------------------------
  // adding new Block to an existing farmland
  const [isNewBlockVisible, setIsNewBlockVisible] = useState(false);
  const [isAreaNotEnough, setIsAreaNotEnough] = useState(false);
  const [successLottieVisible, setSuccessLottieVisible] = useState(false);

  // -----------------------------------------------

  // ---------------------------------------------
  //  Data editing

  const [dataToBeUpdated, setDataToBeUpdated] = useState("");
  const [isConfirmDataVisible, setIsConfirmDataVisible] = useState(false);
  // const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // update farmland main data
  const [description, setDescription] = useState("");
  const [consociatedCrops, setConsociatedCrops] = useState([]);
  const [totalArea, setTotalArea] = useState("");
  const [trees, setTrees] = useState("");

  const [oldDescription, setOldDescription] = useState("");
  const [oldConsociatedCrops, setOldConsociatedCrops] = useState([]);
  const [oldTotalArea, setOldTotalArea] = useState("");
  const [oldTrees, setOldTrees] = useState("");

  const [newDataObject, setNewDataObject] = useState({});
  const [oldDataObject, setOldDataObject] = useState({});

  // -----------------------------------------------
  //  Block data updating
  const [blockId, setBlockId] = useState("");
  const [plantingYear, setPlantingYear] = useState("");
  const [blockTrees, setBlockTrees] = useState("");
  const [usedArea, setUsedArea] = useState("");
  const [densityWidth, setDensityWidth] = useState("");
  const [densityLength, setDensityLength] = useState("");
  const [plantTypes, setPlantTypes] = useState([]);
  const [clones, setClones] = useState([]);
  const [addedClone, setAddedClone] = useState("");
  const [isDensityModeIrregular, setIsDensityModeIrregular] = useState(false);
  const [isDensityModeRegular, setIsDensityModeRegular] = useState(false);
  const [sameTypeTreesList, setSameTypeTreesList] = useState([]);
  const [remainingArea, setRemainingArea] = useState();
  const [selected, setSelected] = useState([]);

  const [oldBlockId, setOldBlockId] = useState("");
  const [oldPlantingYear, setOldPlantingYear] = useState("");
  const [oldBlockTrees, setOldBlockTrees] = useState("");
  const [oldUsedArea, setOldUsedArea] = useState("");
  const [oldDensityWidth, setOldDensityWidth] = useState("");
  const [oldDensityLength, setOldDensityLength] = useState("");
  const [oldPlantTypes, setOldPlantTypes] = useState([]);
  const [oldClones, setOldClones] = useState([]);
  const [addedOldClone, setAddedOldClone] = useState("");
  const [isOldDensityModeIrregular, setIsOldDensityModeIrregular] =
    useState(false);
  const [isOldDensityModeRegular, setIsOldDensityModeRegular] = useState(false);
  const [oldSameTypeTreesList, setOldSameTypeTreesList] = useState([]);
  const [oldRemainingArea, setOldRemainingArea] = useState();

  const [isEditBlockVisible, setIsEditBlockVisible] = useState(false);
  // const [autoRefresh, setAutoRefresh] = useState(false);

  // -----------------------------------------------

  // check if there is enough area for a new Block to be added in
  // this function prevent adding new cashew trees in a farmland
  // where there is no enough space left
  const checkAreasConformity = (farmland) => {
    const totalArea = farmland?.totalArea;
    const blocksAreas = farmland?.blocks
      ?.map((block) => block?.usedArea)
      .reduce((acc, el) => acc + el, 0);
    if (totalArea - blocksAreas <= 0.02) {
      setIsAreaNotEnough(true);
    }
  };

  useEffect(() => {
    checkAreasConformity(farmland);
  }, [farmland, autoRefresh, refresh]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      // mutableSubs.removeByName(farmlandResourceMessage);
      mutableSubs.add(
        realm
          .objects("InvalidationMotive")
          .filtered(`resourceId == "${farmland._id}"`),
        // { name: farmlandResourceMessage },
      );
    });

    const interval = setInterval(() => {
      setAutoRefresh(!autoRefresh);
    }, 2000);

    clearInterval(interval);
  }, [
    realm,
    user,
    autoRefresh,
    isCollapseOn,
    isNewBlockVisible,
  ]);

  const resizeBlockBox = (to) => {
    to === 1 && setIsNewBlockVisible(true);
    Animated.timing(scaleBlockBox, {
      toValue: to,
      useNativeDriver: true,
      duration: 400,
      easing: Easing.linear,
    }).start(() => to === 0 && setIsNewBlockVisible(false));
  };


  return (
    <View
      style={{
        paddingVertical: hp("1%"),
      }}
    >
      <Collapse
        style={{
          flex: 1,
        }}
      >
        <CollapseHeader
          style={{
            minHeight: 80,
            padding: 8,
            // borderRadius: 8,
            backgroundColor: COLORS.main,
            // paddingHorizontal: 10,
            justifyContent: "space-between",
          }}
          onToggle={(isOn) => {
            setIsCallapseOn(isOn);
            setRefresh(!isOn);
          }}
        >
          <LinearGradient
            colors={["#009900", "#004000", "#009900",]} style={{
              flex: 1,
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 15,
              minHeight: 60,
              borderColor: COLORS.white,
              borderWidth: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  fontFamily: "JosefinSans-Regular",
                }}
              >
                Anos de Plantio : [{getPlantingYears(farmland?.blocks)}]
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50%",
                }}
              >
                <FontAwesomeIcon
                  icon={faTree}
                  size={20}
                  color={COLORS.ghostwhite}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.ghostwhite,
                    fontFamily: "JosefinSans-Bold",
                  }}
                >
                  {"   "}
                  {farmland?.trees} árvores
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50%",
                }}
              >
                <FontAwesomeIcon
                  icon={faCrop}
                  size={20}
                  color={COLORS.ghostwhite}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.ghostwhite,
                    fontFamily: "JosefinSans-Bold",
                  }}
                >
                  {"   "}
                  {farmland?.totalArea.toFixed(1)} hectares
                </Text>
              </View>
            </View>

          </LinearGradient>
        </CollapseHeader>
        <CollapseBody>
          <View
            style={{
              marginBottom: 40,
              padding: 10,
              borderColor: COLORS.pantone,
              shadowColor: COLORS.pantone,
              backgroundColor: COLORS.ghostwhite,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.27,
              shadowRadius: 4.65,
              elevation: 3,
              paddingLeft: 20,
            }}
          >
            {/* Resource Status Icon (Validated, Invalidated, Pendind) */}
            <View
              style={{
                width: 80,
                alignSelf: "flex-end",
              }}
            >
              <ResourceStatusIcon
                resource={farmland}
              />
            </View>

            <Stack w="100%" direction="column" py="4">
              <Stack direction="row" mt="5">
                <Box w="90%">
                </Box>
                <Box w="10%">
                  {customUserData?.role !== roles.provincialManager && (
                    <TouchableOpacity
                      disabled={farmland?.status === resourceValidation.status.validated}
                      style={{
                        borderRadius: 50,
                        backgroundColor: COLORS.lightgrey,
                        padding: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setPresentEditFarmland(true);
                        // resizeBox(1);
                        setDataToBeUpdated("farmlandMainData");
                        setBlockId(""); // remove the blockId to avoid confusion in the overlay component
                      }}
                    >
                      <Icon
                        // name="home"
                        name="edit"
                        size={20}
                        color={
                          farmland?.status ===
                            resourceValidation.status.validated
                            ? COLORS.grey
                            : farmland?.status ===
                              resourceValidation.status.invalidated
                              ? COLORS.red
                              : COLORS.black
                        }
                      />
                    </TouchableOpacity>
                  )}
                </Box>
              </Stack>

              <Stack w="100%" direction="row">
              </Stack>
              <Stack w="100%" direction="row">
                <Box w="40%">
                  <Text
                    style={{
                      color: COLORS.grey,
                      fontSize: responsiveFontSize(1.8),
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    Consociação:
                  </Text>
                </Box>
                <Box w="60%">
                  <Text
                    style={{
                      color: COLORS.grey,
                      fontSize: responsiveFontSize(1.8),
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    [ {farmland?.consociatedCrops.join("; ")} ]
                  </Text>
                </Box>
              </Stack>

              <Stack w="100%" direction="row">
              </Stack>

              <Stack w="100%" direction="row">
              </Stack>
            </Stack>
            <CustomDivider />

            <Stack w="100%" direction="column" py="4">
              <Stack w="100%" direction="row">
                <Box w="90%">
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: responsiveFontSize(2),
                      fontFamily: "JosefinSans-Bold",
                    }}
                  >
                    Pontos Extremos do Pomar
                  </Text>
                </Box>
                <Box w="10%">
                  {customUserData?.role !== roles.provincialManager && (
                    <TouchableOpacity
                      disabled={
                        farmland?.status === resourceValidation.status.validated}
                      style={{
                        borderRadius: 50,
                        backgroundColor: COLORS.lightgrey,
                        padding: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() =>
                        navigation.navigate("FarmlandAreaAudit", {
                          farmlandId: farmland._id,
                        })
                      }
                    >
                      <Icon
                        name="add-location-alt"
                        size={20}
                        color={
                          farmland?.status ===
                            resourceValidation.status.validated
                            ? COLORS.grey
                            : farmland?.status ===
                              resourceValidation.status.invalidated
                              ? COLORS.red
                              : COLORS.black
                        }
                      // color={farmland?.validated === resourceValidation.status.validated ? COLORS.lightgrey : farmland?.validated === resourceValidation.status.invalidated ? COLORS.red : COLORS.main }
                      />
                    </TouchableOpacity>
                  )}
                </Box>
              </Stack>
              {farmland?.extremeCoordinates.length > 0 &&
                farmland?.extremeCoordinates?.map((coords) => {
                  return (
                    <Stack
                      key={coords?.position}
                      w="100%"
                      direction="row"
                      style={{
                        marginVertical: 5,
                      }}
                    >
                      <Box
                        w="40%"
                        style={{
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Ponto {coords?.position}
                        </Text>
                      </Box>
                      <Box w="60%">
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Latitude: {coords?.latitude}
                        </Text>
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Longitude: {coords?.longitude}
                        </Text>
                      </Box>
                    </Stack>
                  );
                })}
              {farmland?.extremeCoordinates.length === 0 && (
                <Stack w="100%" direction="row">
                  <Box w="40%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      {/*  */}
                    </Text>
                  </Box>
                  <Box w="60%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      (Nenhumas)
                    </Text>
                  </Box>
                </Stack>
              )}
            </Stack>

            <CustomDivider />

            <Stack w="100%" direction="column" py="4">
              <Stack w="100%" direction="row">
                <Box w="90%">
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: responsiveFontSize(2),
                      fontFamily: "JosefinSans-Bold",
                    }}
                  >
                    Geolocalização
                  </Text>
                </Box>
                <Box w="10%">
                  {customUserData?.role !== roles.provincialManager && (
                    <TouchableOpacity
                      disabled={
                        farmland?.status === resourceValidation.status.validated}
                      style={{
                        borderRadius: 50,
                        backgroundColor: COLORS.lightgrey,
                        padding: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        navigation.navigate("Geolocation", {
                          resourceName: "Farmland",
                          resourceId: farmland._id,
                          ownerType: farmland.ownerType,
                          //     navigation.navigate('FarmlandAreaAudit', {
                          //     farmlandId: farmland._id,
                        });
                      }}
                    >
                      <Icon
                        name="add-location-alt"
                        size={20}
                        color={
                          farmland?.status ===
                            resourceValidation.status.validated
                            ? COLORS.grey
                            : farmland?.status ===
                              resourceValidation.status.invalidated
                              ? COLORS.red
                              : COLORS.black
                        }
                      />
                    </TouchableOpacity>
                  )}
                </Box>
              </Stack>
              {farmland?.geolocation?.latitude &&
                farmland?.geolocation?.longitude && (
                  <>
                    <Stack w="100%" direction="row">
                      <Box w="40%">
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Latitude
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          {farmland?.geolocation?.latitude}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack w="100%" direction="row">
                      <Box w="40%">
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          Longitude
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: responsiveFontSize(1.8),
                            fontFamily: "JosefinSans-Regular",
                          }}
                        >
                          {farmland?.geolocation?.longitude}
                        </Text>
                      </Box>
                    </Stack>
                  </>
                )}
              {!farmland?.geolocation && (
                <Stack w="100%" direction="row">
                  <Box w="40%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      {/*  */}
                    </Text>
                  </Box>
                  <Box w="60%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: 14,
                        fontFamily: "JosefinSans-Regular",
                      }}
                    >
                      (Nenhuma)
                    </Text>
                  </Box>
                </Stack>
              )}
            </Stack>

            <CustomDivider />

            {
              // !isAreaNotEnough &&
              customUserData?.role !== roles.provincialManager && (
                <Stack w="100%" direction="row" py="4">
                  <Box w="90%">
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: responsiveFontSize(2),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Parcela de Cajueiros
                    </Text>
                  </Box>
                  <Box w="10%">
                    <TouchableOpacity
                      disabled={farmland?.status === resourceValidation.status.validated}
                      style={{
                        borderRadius: 50,
                        backgroundColor: COLORS.lightgrey,
                        padding: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        if (farmland) {
                          resizeBlockBox(1);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faAdd} size={20} color={farmland?.status ===
                        resourceValidation.status.validated
                        ? COLORS.grey
                        : farmland?.status ===
                          resourceValidation.status.invalidated
                          ? COLORS.red
                          : COLORS.black} />
                    </TouchableOpacity>
                  </Box>
                </Stack>
              )
            }

            {/* blocks start here */}
            <Box
              w="100%"
              style={{
                backgroundColor: COLORS.dark,
                paddingVertical: 10,
                paddingHorizontal: 5,
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(2),
                  color: COLORS.ghostwhite,
                  fontFamily: "JosefinSans-Bold",
                }}
              >
                Parcelas com cajueiros
              </Text>
            </Box>
            {normalizeBlockList(farmland?.blocks)?.length === 0 && (

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
                    color: COLORS.grey,
                    fontSize: 14,
                    fontFamily: "JosefinSans-Regular",
                    textAlign: "center",
                    backgroundColor: COLORS.lightestgrey,
                    width: 220,
                    padding: 6,
                  }}
                >
                  Nenhuma percela de cajueiros associada a esta área
                </Text>
              </View>
            )}

            {normalizeBlockList(farmland?.blocks)?.map((block, index) => (
              <Box
                key={index}
                mt="3"
                style={{
                  marginBottom: 15,
                  marginRight: 10,
                }}
              >
                <Box
                  style={{
                    paddingVertical: 20,
                  }}
                >
                  <Stack w="100%" direction="row" space={2}>
                    <Box
                      w="10%"
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <Box
                        style={{
                          backgroundColor: COLORS.dark,
                          borderRadius: 100,
                          width: wp("6%"),
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.ghostwhite,
                            fontSize: responsiveFontSize(2),
                            fontFamily: "JosefinSans-Regular",
                            textAlign: "center",
                          }}
                        >
                          {block?.position + 1}
                        </Text>
                      </Box>
                    </Box>
                    <Box w="80%">
                      <Text
                        style={{
                          color: COLORS.dark,
                          fontSize: responsiveFontSize(2),
                          fontFamily: "JosefinSans-Bold",
                        }}
                      >
                        Ano de Plantio: {block.plantingYear}
                      </Text>
                    </Box>
                    <Box w="10%">
                      {customUserData?.role !== roles.provincialManager && (
                        <TouchableOpacity
                          disabled={
                            farmland?.status === resourceValidation.status.validated}
                          style={{
                            borderRadius: 50,
                            backgroundColor: COLORS.lightgrey,
                            padding: 6,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => {
                            // setIsOverlayVisible(!isOverlayVisible);
                            setPresentEditFarmland(true);
                            // resizeBox(1)
                            setDataToBeUpdated("blockData");
                            setBlockId(block._id);
                            setIsEditBlockVisible(true);
                          }}
                        >
                          <Icon
                            // name="home"
                            name="edit"
                            size={20}
                            color={
                              farmland?.status ===
                                resourceValidation.status.validated
                                ? COLORS.grey
                                : farmland?.status ===
                                  resourceValidation.status.invalidated
                                  ? COLORS.red
                                  : COLORS.black
                            }
                          />
                        </TouchableOpacity>
                      )}
                    </Box>
                  </Stack>

                  <Stack w="100%" direction="row">
                    <Box w="35%" style={{}}>
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        Compasso:
                      </Text>
                    </Box>
                    <Box w="65%">
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {block?.density?.mode === "Irregular"
                          ? block?.density?.mode
                          : block?.density?.mode === "Regular"
                            ? `${block?.density?.mode} (${block?.density.length} por ${block?.density?.width} metros)`
                            : ""}{" "}
                      </Text>
                    </Box>
                  </Stack>

                  <Stack w="100%" direction="row">
                    <Box w="35%" style={{}}>
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        Área:
                      </Text>
                    </Box>
                    <Box w="65%">
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {block?.usedArea?.toFixed(2)} hectares
                      </Text>
                    </Box>
                  </Stack>

                  <Stack w="100%" direction="row">
                    <Box w="35%" style={{}}>
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        Cajueiros:
                      </Text>
                    </Box>
                    <Box w="65%">
                      <Text
                        style={{
                          color: COLORS.grey,
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: "JosefinSans-Regular",
                        }}
                      >
                        {block?.trees} árvores
                      </Text>
                    </Box>
                  </Stack>
                </Box>

                <Stack w="100%" direction="row" space={3}>
                  <Box w="90%">
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: responsiveFontSize(2),
                        fontFamily: "JosefinSans-Bold",
                      }}
                    >
                      Tipos de planta
                    </Text>
                  </Box>
                  <Box w="10%">
                    {customUserData?.role !== roles.provincialManager && (
                      <TouchableOpacity
                        disabled={
                          farmland?.status ===
                          resourceValidation.status.validated}
                        style={{
                          borderRadius: 50,
                          backgroundColor: COLORS.lightgrey,
                          padding: 6,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          setPlantTypes([]);
                          setClones([]);
                          setPresentEditFarmland(true);
                          setDataToBeUpdated("plantType");
                          setBlockTrees(block?.trees);
                          setBlockId(block._id);
                          setIsEditBlockVisible(true);
                        }}
                      >
                        <Icon
                          name="edit"
                          size={20}
                          color={
                            farmland?.status ===
                              resourceValidation.status.validated
                              ? COLORS.grey
                              : farmland?.status ===
                                resourceValidation.status.invalidated
                                ? COLORS.red
                                : COLORS.black
                          }
                        />
                      </TouchableOpacity>
                    )}
                  </Box>
                </Stack>
                {block?.sameTypeTrees?.length > 0 ? (
                  block?.sameTypeTrees?.map((sameType, index) => (
                    <Box key={index}>
                      <Stack
                        w="100%"
                        direction="row"
                      >
                        <Box w="60%" style={{}}>
                          <Text
                            style={{
                              color: COLORS.grey,
                              fontSize: responsiveFontSize(1.8),
                              fontFamily: "JosefinSans-Regular",
                            }}
                          >
                            <Icon
                              name="arrow-forward"
                              color={COLORS.grey}
                              size={10}
                            />{" "}
                            {sameType?.treeType}
                          </Text>
                        </Box>
                        <Box w="40%">
                          <Text
                            style={{
                              color: COLORS.grey,
                              fontSize: responsiveFontSize(1.8),
                              fontFamily: "JosefinSans-Regular",
                            }}
                          >
                            {sameType?.trees} árvores
                          </Text>
                        </Box>
                      </Stack>
                    </Box>
                  ))
                ) : (
                  <Text
                    style={{
                      color: COLORS.red,
                      fontSize: 16,
                      fontFamily: "JosefinSans-Regular",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    Actualizar os tipos de plantas para esta parcela de
                    cajueiros
                  </Text>
                )}
                <Box
                  style={{
                    paddingTop: 20,
                  }}
                >
                  <CustomDivider />
                </Box>
              </Box>
            ))}

            {/* Resource signature (registered by, approved by, rejected by, modified by) */}
            <ResourceSignature
              resource={farmland}
              customUserData={customUserData}
            />

            {/* type and send messages (motives) of invalidation */}
            {farmland?.status === resourceValidation.status.invalidated &&
              (
                <InvalidationMessage
                  resource={farmland}
                  resourceType={resourceTypes.farmland}
                />
              )}

            {/* Validation options: to validate or invalidate resource  */}
            {/* {roles.haveReadAndValidatePermissions.some(role => role === customUserData?.role) &&
              farmland?.status === resourceValidation.status.pending && (
                <ValidationOptions
                  resource={farmland}
                  resourceType={resourceTypes.farmland}
                  customUserData={customUserData}
                  realm={realm}
                  alert={alert}
                  setAlert={setAlert}
                />
              )} */}

          </View>
          <EditFarmlandData
            isOverlayVisible={presentEditFarmland}
            setIsOverlayVisible={setPresentEditFarmland}
            isConfirmDataVisible={isConfirmDataVisible}
            setIsConfirmDataVisible={setIsConfirmDataVisible}
            ownerName={farmland?.description}
            resource={farmland}
            blocks={farmland?.blocks}
            resourceName={"Farmland"}
            dataToBeUpdated={dataToBeUpdated}
            newDataObject={newDataObject}
            oldDataObject={oldDataObject}
            setNewDataObject={setNewDataObject}
            setOldDataObject={setOldDataObject}
            description={description}
            setDescription={setDescription}
            consociatedCrops={consociatedCrops}
            setConsociatedCrops={setConsociatedCrops}
            totalArea={totalArea}
            setTotalArea={setTotalArea}
            trees={trees}
            setTrees={setTrees}
            oldDescription={oldDescription}
            setOldDescription={setOldDescription}
            oldConsociatedCrops={oldConsociatedCrops}
            setOldConsociatedCrops={setOldConsociatedCrops}
            oldTotalArea={oldTotalArea}
            setOldTotalArea={setOldTotalArea}
            oldTrees={oldTrees}
            setOldTrees={setOldTrees}
            setBlockId={setBlockId}
            blockId={blockId}
            plantingYear={plantingYear}
            setPlantingYear={setPlantingYear}
            blockTrees={blockTrees}
            setBlockTrees={setBlockTrees}
            usedArea={usedArea}
            setUsedArea={setUsedArea}
            densityWidth={densityWidth}
            setDensityWidth={setDensityWidth}
            densityLength={densityLength}
            setDensityLength={setDensityLength}
            plantTypes={plantTypes}
            setPlantTypes={setPlantTypes}
            clones={clones}
            setClones={setClones}
            addedClone={addedClone}
            setAddedClone={setAddedClone}
            selected={selected}
            setSelected={setSelected}
            isDensityModeIrregular={isDensityModeIrregular}
            setIsDensityModeIrregular={setIsDensityModeIrregular}
            isDensityModeRegular={isDensityModeRegular}
            setIsDensityModeRegular={setIsDensityModeRegular}
            sameTypeTreesList={sameTypeTreesList}
            setSameTypeTreesList={setSameTypeTreesList}
            remainingArea={remainingArea}
            setRemainingArea={setRemainingArea}
            oldBlockId={oldBlockId}
            setOldBlockId={setOldBlockId}
            oldPlantingYear={oldPlantingYear}
            setOldPlantingYear={setOldPlantingYear}
            oldBlockTrees={oldBlockTrees}
            setOldBlockTrees={setOldBlockTrees}
            oldUsedArea={oldUsedArea}
            setOldUsedArea={setOldUsedArea}
            oldDensityWidth={oldDensityWidth}
            setOldDensityWidth={setOldDensityWidth}
            oldDensityLength={oldDensityLength}
            setOldDensityLength={setOldDensityLength}
            oldPlantTypes={oldPlantTypes}
            setOldPlantTypes={setOldPlantTypes}
            oldClones={oldClones}
            setOldClones={setOldClones}
            addedOldClone={addedOldClone}
            setAddedOldClone={setAddedOldClone}
            isOldDensityModeIrregular={isOldDensityModeIrregular}
            setIsOldDensityModeIrregular={setIsOldDensityModeIrregular}
            isOldDensityModeRegular={isOldDensityModeRegular}
            setIsOldDensityModeRegular={setIsOldDensityModeRegular}
            oldSameTypeTreesList={oldSameTypeTreesList}
            setOldSameTypeTreesList={setOldSameTypeTreesList}
            oldRemainingArea={oldRemainingArea}
            setOldRemainingArea={setOldRemainingArea}
            isEditBlockVisible={isEditBlockVisible}
            setIsEditBlockVisible={setIsEditBlockVisible}
            setAutoRefresh={setAutoRefresh}
            autoRefresh={autoRefresh}
          />

          {isConfirmDataVisible && (
            <ConfirmData
              isConfirmDataVisible={isConfirmDataVisible}
              setIsConfirmDataVisible={setIsConfirmDataVisible}
              ownerName={farmland?.description}
              newDataObject={newDataObject}
              oldDataObject={oldDataObject}
              dataToBeUpdated={dataToBeUpdated}
              resource={farmland}
              resourceName={"Farmland"}
              blockId={blockId}
              setSuccessLottieVisible={setSuccessLottieVisible}
              successLottieVisible={successLottieVisible}
            />
          )}

          {isNewBlockVisible && (
            <NewFarmlandBlock
              isNewBlockVisible={isNewBlockVisible}
              scaleBlockBox={scaleBlockBox}
              resizeBlockBox={resizeBlockBox}
              setIsNewBlockVisible={setIsNewBlockVisible}
              farmland={farmland}
              setAutoRefresh={setAutoRefresh}
              autoRefresh={autoRefresh}
              setSuccessLottieVisible={setSuccessLottieVisible}
              successLottieVisible={successLottieVisible}
              ownerImage={ownerImage ? ownerImage : ""}
            />
          )}

          {successLottieVisible && (
            <SuccessLottie
              successLottieVisible={successLottieVisible}
              setSuccessLottieVisible={setSuccessLottieVisible}
            />
          )}
        </CollapseBody>
      </Collapse>
    </View>
  );
};

export default FarmlandData;
