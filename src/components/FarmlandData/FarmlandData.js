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
  faArrowDown,
  faArrowTurnDown,
  faChevronDown,
  faChevronUp,
  faCrop,
  faTree,
} from "@fortawesome/free-solid-svg-icons";
import tw from "twrnc";

import { SuccessLottie } from "../LottieComponents/SuccessLottie";
import ValidationOptions from "../ValidationOptions/ValidationOptions";
import InvalidationMessage from "../InvalidationMessage/InvalidationMessage";
import ResourceSignature from "../ResourceSignature/ResourceSignature";
import ResourceStatusIcon from "../ResourceStatusIcon/ResourceStatusIcon";
import LinearGradient from "react-native-linear-gradient";
import InfoIcon from "../LottieComponents/InfoIcon";
import { backgroundStyle } from "../../styles/globals";

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
    <Collapse
      style={tw`my-2 py-2`}

      onToggle={(isExpanded) => {
        setIsCallapseOn(isExpanded);
        setRefresh(!isExpanded);
      }}
      isExpanded={isCollapseOn}
    >
      <CollapseHeader
        style={tw`bg-white shadow-sm px-2 min-h-25 rounded-t-md justify-between`}
      >

        <View
          className="bg-slate-400 -mx-2"
        >
          <Text
            className="text-sm text-white font-bold text-center m-1"
          >
            Anos de Plantio : [{getPlantingYears(farmland?.blocks)}]
          </Text>
        </View>


        {/* Resource Status Icon (Validated, Invalidated, Pendind) */}

        <View
          className="flex flex-row justify-between m-2"
        >
          <View
            className="flex flex-col items-center justify-center"
          >
            <View
              className="rounded-full shadow-md bg-gray-200 p-4"
            >
              <Text
                className="text-sm text-gray-500 font-normal"
              >
                {farmland?.trees}
              </Text>

            </View>
            <Text
              className="text-xs text-gray-500 font-normal"
            >
              árvores
            </Text>
          </View>

          <View
            className="flex flex-col items-center justify-center"
          >
            <View

              className="rounded-full shadow-md bg-gray-200 p-4"
            >
              <Text
                className="text-sm text-gray-500 font-normal"
              >
                {farmland?.totalArea.toFixed(1)}
              </Text>

            </View>
            <Text
              className="text-xs text-gray-500 font-normal"
            >
              hectares
            </Text>
          </View>
        </View>
        <View
          className="flex flex-row justify-between"
        >
          <View
            className="w-20"
          >
            <ResourceStatusIcon
              resource={farmland}
            />
          </View>

          <View
            className="mr-2 justify-center"
          >
            {!isCollapseOn && <FontAwesomeIcon icon={faChevronDown} size={20} color={COLORS.main} />}
            {isCollapseOn && <FontAwesomeIcon icon={faChevronUp} size={20} color={COLORS.main} />}
          </View>
        </View>

      </CollapseHeader>


      <CollapseBody
        style={tw`self-stretch pt-4`}
      >

        <View
          className="w-full self-center"
        >
          <View
            className="bg-white shadow-sm p-2 mb-3 rounded-b-md flex flex-col gap-4"
          >
            <View
              className="flex flex-row justify-between"
            >
              <Text
                className="text-sm font-bold text-gray-500"
              >
                Culturas consociadas
              </Text>

              {customUserData?.role !== roles.provincialManager && (
                <TouchableOpacity
                  disabled={farmland?.status === resourceValidation.status.validated}
                  className=""
                  onPress={() => {
                    setPresentEditFarmland(true);
                    setDataToBeUpdated("farmlandMainData");
                    setBlockId(""); // remove the blockId to avoid confusion in the overlay component
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
                          ? COLORS.danger
                          : COLORS.grey
                    }
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              className="flex flex-row"
            >
              {
                farmland?.consociatedCrops?.map((crop) => (
                  <View
                    key={crop}
                    className="p-2 mb-2 -mt-2 mr-2 bg-gray-200 rounded-full shadow-md"
                  >
                    <Text
                      className="text-sm text-gray-600 font-[400]"
                    >{crop}</Text>
                  </View>
                ))
              }
            </View>

            <View
              className=""
            >
              <CustomDivider />
              <View
                className="flex flex-row justify-between mt-3"
              >
                <Text
                  className="text-sm font-bold text-gray-500"
                >
                  Pontos Extremos do Pomar
                </Text>
                {customUserData?.role !== roles.provincialManager && (
                  <TouchableOpacity
                    disabled={
                      farmland?.status === resourceValidation.status.validated}
                    className=""
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
                            ? COLORS.danger
                            : COLORS.grey
                      }
                    />
                  </TouchableOpacity>
                )}

              </View>

              <View
                className="flex flex-row justify-between mb-1 mt-1"
              >
                <View
                  className="justify-center items-center w-1/3"
                >
                  <Text
                    className="text-sm text-gray-400 font-normal"
                  >Ponto</Text>
                </View>
                <View
                  className="justify-center items-center w-1/3"
                >
                  <Text
                    className="text-sm text-gray-400 font-normal"
                  >Latitude</Text>
                </View>
                <View
                  className="justify-center items-center w-1/3"
                >
                  <Text
                    className="text-sm text-gray-400 font-normal"
                  >Longitude</Text>
                </View>
              </View>

              {farmland?.extremeCoordinates.length > 0 &&
                farmland?.extremeCoordinates?.map((coords) => {
                  return (
                    <View
                      key={coords?.position}
                      className="flex flex-row justify-between mb-1 mt-2"
                    >
                      <View
                        className="justify-center items-center w-1/3 -mt-2"
                      >
                        <Text
                          className="text-sm text-gray-400 font-normal"
                        >{coords?.position}</Text>
                      </View>
                      <View
                        className="justify-center items-center w-1/3 -mt-2"
                      >
                        <Text
                          className="text-lg text-gray-400 font-normal"
                        >{coords?.latitude ? "☑" : "?"}</Text>
                      </View>
                      <View
                        className="justify-center items-center w-1/3 -mt-2"
                      >
                        <Text
                          className="text-lg text-gray-400 font-normal"
                        >{coords?.longitude ? "☑" : "?"}</Text>
                      </View>
                    </View>);
                })}
              {farmland?.extremeCoordinates.length === 0 && (
                <View
                  className="flex flex-row justify-between mb-1 mt-0"
                >
                  <View
                    className="justify-center items-center w-1/3"
                  >
                    <Text
                      className="text-lg text-gray-400 font-normal"
                    >?</Text>
                  </View>
                  <View
                    className="justify-center items-center w-1/3"
                  >
                    <Text
                      className="text-lg text-gray-400 font-normal"
                    >?</Text>
                  </View>
                  <View
                    className="justify-center items-center w-1/3"
                  >
                    <Text
                      className="text-lg text-gray-400 font-normal"
                    >?</Text>
                  </View>
                </View>
              )}
            </View>
            <View>
              <View
                className="flex flex-row justify-between mb-2"
              >
                <Text
                  className="text-sm font-normal text-gray-500"
                >Auditoria da Área</Text>
                <Text
                  className="text-sm text-gray-400 font-normal"
                >{farmland?.auditedArea ? `${new Intl.NumberFormat().format(farmland?.auditedArea?.toFixed(2))} hectares` : "Não realizada"}</Text>
              </View>
              <CustomDivider />
            </View>

            <View
              className="flex flex-row justify-between"
            >
              <Text
                className="text-sm font-bold text-gray-500"
              >
                Geolocalização
              </Text>
              {customUserData?.role !== roles.provincialManager && (
                <TouchableOpacity
                  disabled={
                    farmland?.status === resourceValidation.status.validated}
                  onPress={() => {
                    navigation.navigate("Geolocation", {
                      resourceName: "Farmland",
                      resourceId: farmland._id,
                      ownerType: farmland.ownerType,
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
                          ? COLORS.danger
                          : COLORS.grey
                    }
                  />
                </TouchableOpacity>
              )}
            </View>

            <View
              className="flex flex-row justify-between mb-1"
            >
              <View
                className="justify-center items-center w-1/3"
              >
                <Text
                  className="text-sm text-gray-400 font-normal"
                ></Text>
              </View>
              <View
                className="justify-center items-center w-1/3"
              >
                <Text
                  className="text-sm text-gray-400 font-normal"
                >Latitude</Text>
              </View>
              <View
                className="justify-center items-center w-1/3"
              >
                <Text
                  className="text-sm text-gray-400 font-normal"
                >Longitude</Text>
              </View>
            </View>

            <View
              className="mb-2"
            >
              {farmland?.geolocation?.latitude &&
                farmland?.geolocation?.longitude && (
                  <View
                    className="flex flex-row justify-between mb-1 -mt-2"
                  >
                    <View
                      className="justify-center items-center w-1/3 -mt-9"
                    >
                      <Text
                        className="text-sm text-gray-400 font-normal"
                      ></Text>
                    </View>
                    <View
                      className="justify-center items-center w-1/3 -mt-2"
                    >
                      <Text
                        className="text-lg text-gray-400 font-normal"
                      >{farmland?.geolocation?.latitude ? "☑" : "?"}</Text>
                    </View>
                    <View
                      className="justify-center items-center w-1/3 -mt-2"
                    >
                      <Text
                        className="text-lg text-gray-400 font-normal"
                      >{farmland?.geolocation?.longitude ? "☑" : "?"}</Text>
                    </View>
                  </View>

                )}
              {!farmland?.geolocation && (
                <View
                  className="flex flex-row justify-between mb-1 -mt-2"
                >
                  <View
                    className="justify-center items-center w-1/3 -mt-2"
                  >
                    <Text
                      className="text-xs text-gray-400 font-normal"
                    ></Text>
                  </View>
                  <View
                    className="justify-center items-center w-1/3 -mt-2"
                  >
                    <Text
                      className="text-lg text-gray-400 font-normal"
                    >?</Text>
                  </View>
                  <View
                    className="justify-center items-center w-1/3 -mt-2"
                  >
                    <Text
                      className="text-lg text-gray-400 font-normal"
                    >?</Text>
                  </View>
                </View>
              )}
            </View>
            <CustomDivider />


            <View
              className="flex flex-row justify-between"
            >
              <Text
                className="text-sm font-bold text-gray-500"
              >
                Parcelas com Cajueiros
              </Text>
              {customUserData?.role !== roles.provincialManager && (
                <TouchableOpacity
                  disabled={farmland?.status === resourceValidation.status.validated}
                  onPress={() => {
                    if (farmland) {
                      resizeBlockBox(1);
                    }
                  }}
                  className="p-2 rounded-full bg-green-600"
                >
                  <FontAwesomeIcon icon={faAdd} size={20} color={farmland?.status ===
                    resourceValidation.status.validated
                    ? COLORS.grey
                    : farmland?.status ===
                      resourceValidation.status.invalidated
                      ? COLORS.white
                      : COLORS.white} />
                </TouchableOpacity>
              )}
            </View>

            {normalizeBlockList(farmland?.blocks)?.length === 0 && (

              <View
                className="justify-center items-center self-center mb-5"
              >
                <InfoIcon width={60} height={60} />
                <Text
                  className="text-gray-400 font-normal text-sm text-center px-2 w-[220]"
                >
                  Sem parcelas de cajueiros.
                </Text>
              </View>
            )}

            {normalizeBlockList(farmland?.blocks)?.map((block, index) => (
              <View
                key={index}
                className="my-3 pr-1 border-l-8 border-l-slate-300 shadow-sm shadow-slate-300"
              >
                <View
                  className="flex flex-row gap-4"
                >
                  <View
                    className="border-2 border-slate-400 rounded-full p-2"
                  >

                    <Text
                      className="text-sm text-gray-500 font-normal"
                    >
                      {block?.position + 1}
                    </Text>
                  </View>
                  <View
                    className="justify-center items-center"
                  >
                    <Text
                      style={{
                        color: COLORS.dark,
                        fontSize: responsiveFontSize(2),
                        fontFamily: "JosefinSans-Bold",
                      }}
                      className="text-gray-500 text-sm font-bold text-left"
                    >
                      Ano de Plantio: {block.plantingYear}
                    </Text>
                  </View>
                </View>
                {customUserData?.role !== roles.provincialManager && (
                  <TouchableOpacity
                    disabled={
                      farmland?.status === resourceValidation.status.validated}
                    className="self-end"
                    onPress={() => {
                      setPresentEditFarmland(true);
                      setDataToBeUpdated("blockData");
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
                            ? COLORS.danger
                            : COLORS.grey
                      }
                    />
                  </TouchableOpacity>
                )}

                <View
                  className="flex flex-row gap-2 justify-center items-center mx-0"
                >
                  <View className="w-1/3 justify-center items-center">
                    <View
                      className="bg-gray-200 rounded-full px-4 py-2"
                    >
                      <Text>{block?.usedArea?.toFixed(2)}</Text>
                    </View>
                    <Text
                      className="text-center text-xs font-normal"
                    >hectares</Text>
                  </View>
                  <View className="w-1/3 justify-center items-center">
                    <View
                      className="bg-gray-200 rounded-full px-4 py-2"
                    >
                      <Text>
                        {block?.density?.mode === "Irregular"
                          ? block?.density?.mode
                          : block?.density?.mode === "Regular"
                            ? `${block?.density.length} por ${block?.density?.width}`
                            : ""}
                      </Text>
                    </View>
                    <Text
                      className="text-center text-xs font-normal"
                    >compasso</Text>
                  </View>
                  <View className="w-1/3 justify-center items-center">
                    <View
                      className="bg-gray-200 rounded-full px-4 py-2"
                    >
                      <Text>{block?.trees}</Text>
                    </View>
                    <Text
                      className="text-center text-xs font-normal"
                    >árvores</Text>
                  </View>
                </View>

                <View
                  className="flex flex-row justify-between mt-2 ml-4"
                >
                  <Text
                    className="text-sm font-bold text-gray-500"
                  >
                    Tipos de planta
                  </Text>
                  {customUserData?.role !== roles.provincialManager && (
                    <TouchableOpacity
                      disabled={
                        farmland?.status ===
                        resourceValidation.status.validated}
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
                              ? COLORS.danger
                              : COLORS.grey
                        }
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  key={index}
                  className="flex flex-row justify-between mb-1 mt-2 gap-6"
                >
                  <View
                    className="justify-center items-end w-2/3"
                  >
                    <Text
                      className="text-sm text-gray-400 font-bold"
                    >Tipo</Text>
                  </View>
                  <View
                    className="justify-center items-start w-1/3"
                  >
                    <Text
                      className="text-sm text-gray-400 font-bold"
                    >Árvores</Text>
                  </View>
                </View>


                {block?.sameTypeTrees?.length > 0 ? (
                  block?.sameTypeTrees?.map((sameType, index) => (

                    <View
                      key={index}
                      className="flex flex-row justify-between mb-1 mt-0 gap-6"
                    >
                      <View
                        className="justify-center items-end w-2/3"
                      >
                        <Text
                          className="text-sm text-gray-400 font-normal"
                        >{sameType?.treeType}</Text>
                      </View>
                      <View
                        className="justify-center items-start w-1/3"
                      >
                        <Text
                          className="text-sm text-gray-400 font-normal"
                        >{sameType?.trees}</Text>
                      </View>
                    </View>
                  ))
                ) : (

                  <View
                    className="self-center justify-center items-center w-2/3 py-3"
                  >
                    <Text
                      className="text-red-500 text-center text-sm font-normal"
                    >
                      Tipos de plantas nao actualizados.
                    </Text>
                  </View>
                )}
                <Box
                  style={{
                    paddingTop: 20,
                  }}
                >
                  <CustomDivider />
                </Box>
              </View>
            ))}



            {/* type and send messages (motives) of invalidation */}
            {farmland?.status === resourceValidation.status.invalidated &&
              (
                <View
                  className="w-full self-center"
                >
                  <InvalidationMessage
                    resource={farmland}
                    resourceType={resourceTypes.farmland}
                  />
                </View>
              )}

            {/* Resource signature (registered by, approved by, rejected by, modified by) */}
            <View
              className="w-full self-center"
            >
              <ResourceSignature
                resource={farmland}
                customUserData={customUserData}
              />
            </View>



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
        </View>

      </CollapseBody>
    </Collapse>
  );
};

export default FarmlandData;
