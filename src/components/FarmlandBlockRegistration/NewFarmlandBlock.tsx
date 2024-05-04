import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Animated,
  Modal,
  SafeAreaView,
  TouchableOpacity ,
  Center,
  FormControl,
  Stack,
} from "react-native";
;
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";

import { Overlay, Icon, Button,} from "@rneui/base";
import COLORS from "../../consts/colors";
import { getFullYears2 } from "../../helpers/dates";
import { plantingTypes } from "../../consts/plantingTypes";
import cloneList from "../../consts/clones";
import { CustomInput } from "../Inputs/CustomInput";
import { v4 as uuidv4 } from "uuid";
import validateBlockData from "../../helpers/validateBlockData";
import AwesomeAlert from "react-native-awesome-alerts";
import { errorMessages } from "../../consts/errorMessages";
import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { resourceValidation } from "../../consts/resourceValidation";
import PrimaryButton from "../Buttons/PrimaryButton";
const { useRealm, useQuery, useObject } = realmContext;

export default function NewFarmlandBlock({
  isNewBlockVisible,
  setIsNewBlockVisible,
  farmland,
  setAutoRefresh,
  autoRefresh,
  successLottieVisible,
  setSuccessLottieVisible,
  scaleBlockView,
  resizeBlockView,
  ownerImage
}: any) {
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;
  const [addedClone, setAddedClone] = useState("");

  const [addBlockIsOn, setAddBlockIsOn] = useState(false);

  // ------------------------------------------
  const [alert, setAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [titleAlert, setTitleAlert] = useState("");
  const [cancelText, setCancelText] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const [errors, setErrors] = useState({});

  // ---------------------------------------------

  const [remainingArea, setRemainingArea] = useState();

  const [plantingYear, setPlantingYear] = useState("");

  const [usedArea, setUsedArea] = useState("");
  const [blockTrees, setBlockTrees] = useState("");
  const [densityWidth, setDensityWidth] = useState("");
  const [densityLength, setDensityLength] = useState("");
  const [plantTypes, setPlantTypes] = useState([]);
  const [clones, setClones] = useState([]);
  const [isDensityModeIrregular, setIsDensityModeIrregular] = useState(false);
  const [isDensityModeRegular, setIsDensityModeRegular] = useState(false);
  const [sameTypeTreesList, setSameTypeTreesList] = useState([]);

  // ----------------------------------------------

  const toggleOverlay = () => {
    setIsNewBlockVisible(!isNewBlockVisible);
  };

  const addBlockData = () => {
    let blockData = {
      plantingYear,
      usedArea,
      densityWidth,
      densityLength,
      blockTrees,
      plantTypes,
      clones,
      isDensityModeIrregular,
      isDensityModeRegular,
      sameTypeTreesList,
      remainingArea,
    };

    // if any required data is not validated
    // a alert message is sent to the user
    if (!validateBlockData(blockData, errors, setErrors)) {
      setAlert(true);

      setTitleAlert(errorMessages.farmlandError.title);
      setMessageAlert(errorMessages.farmlandError.message);
      setShowCancelButton(errorMessages.farmlandError.showCancelButton);
      setShowConfirmButton(errorMessages.farmlandError.showConfirmButton);
      setCancelText(errorMessages.farmlandError.cancelText);
      setConfirmText(errorMessages.farmlandError.confirmText);

      return;
    }

    // created the validated data object to be passed to the FarmlandModal component
    let retrievedBlockData = validateBlockData(blockData, errors, setErrors);

    const block = {
      _id: uuidv4(),

      // @ts-expect-error TS(2339): Property 'plantingYear' does not exist on type 'fa... Remove this comment to see the full error message
      plantingYear: retrievedBlockData?.plantingYear,

      // @ts-expect-error TS(2339): Property 'density' does not exist on type 'false |... Remove this comment to see the full error message
      density: retrievedBlockData?.density,

      // @ts-expect-error TS(2339): Property 'trees' does not exist on type 'false | {... Remove this comment to see the full error message
      trees: retrievedBlockData?.trees,

      // @ts-expect-error TS(2339): Property 'usedArea' does not exist on type 'false ... Remove this comment to see the full error message
      usedArea: retrievedBlockData?.usedArea,

      // @ts-expect-error TS(2339): Property 'sameTypeTrees' does not exist on type 'f... Remove this comment to see the full error message
      sameTypeTrees: retrievedBlockData?.sameTypeTrees,

      // @ts-expect-error TS(2339): Property 'plantTypes' does not exist on type 'fals... Remove this comment to see the full error message
      plantTypes: retrievedBlockData?.plantTypes,
      userName: customUserData?.name,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    onAddBlock(block, farmland, realm);

    // setIsNewBlockVisible(false);
    resizeBlockView(0);
  };

  const onAddBlock = useCallback(
    (block: any, farmland: any, realm: any) => {
      // update the sum of the blocks trees
      let blocksTrees = farmland?.blocks
        ?.map((block: any) => block?.trees)
        .reduce((acc: any, el: any) => acc + el, 0);
      blocksTrees = block?.trees + blocksTrees;
      let updatedTotalTrees: any;
      if (farmland?.trees < blocksTrees) {
        // update only if the number of the block trees are greater that the total's
        updatedTotalTrees = farmland?.trees + (blocksTrees - farmland?.trees);
      } else {
        updatedTotalTrees = farmland?.trees;
      }

      realm.write(() => {
        farmland?.blocks?.push(block);

        // only update the resource status to 'pending' only when blocksTrees == updatedTotalTrees
        if (blocksTrees === updatedTotalTrees) {
          farmland.status = resourceValidation.status.pending;
        }
        farmland.trees = updatedTotalTrees;
      });

      setAutoRefresh(!autoRefresh);
      setSuccessLottieVisible(true);
    },
    [realm, farmland],
  );


  useEffect(() => {
    // save the block if everything is fine
    if (addBlockIsOn) {
      // add the block
      addBlockData();
      setAddBlockIsOn(false);
    }

    // find out the remaing area
    if (isNewBlockVisible) {
      const totalArea = farmland?.totalArea;
      const blocksAreas = farmland?.blocks
        ?.map((block: any) => block?.usedArea)
        ?.reduce((acc: any, el: any) => acc + el, 0);
      const remainingArea = totalArea - blocksAreas;

      // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      setRemainingArea(remainingArea);
    }
  }, [addBlockIsOn, isNewBlockVisible, farmland]);

  useEffect(() => {
    let selectedClones = [];
    let mergedSameTypeTrees = [];
    const filteredPlantTypes = plantTypes.filter(

      // @ts-expect-error TS(2339): Property 'includes' does not exist on type 'never'... Remove this comment to see the full error message
      (plantType) => !plantType.includes("enxer"),
    );
    if (

      // @ts-expect-error TS(2339): Property 'includes' does not exist on type 'never'... Remove this comment to see the full error message
      plantTypes.filter((plantType) => plantType.includes("enxer")).length > 0
    ) {
      selectedClones = clones
        ?.filter((clone) => clone !== "Outro")
        ?.map((clone) => `Clone: ${clone}`);

      // @ts-expect-error TS(2769): No overload matches this call.
      mergedSameTypeTrees = filteredPlantTypes.concat(selectedClones);
    } else {
      mergedSameTypeTrees = filteredPlantTypes;
      if (clones?.length > 0) {
        setClones([]);
      }
    }
    let normalizedSameTypeTrees = mergedSameTypeTrees?.map((treeType) => ({
      treeType,
      trees: "",
    }));

    // @ts-expect-error TS(2345): Argument of type '{ treeType: never; trees: string... Remove this comment to see the full error message
    setSameTypeTreesList(normalizedSameTypeTrees);
  }, [clones, plantTypes]);

  return   <>
   
    {
      
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      remainingArea <= 0.1 ? (
        <Overlay
        overlayStyle={{
          backgroundColor: COLORS.ghostwhite,
          borderTopLeftRadius: 7,
          borderTopRightRadius: 7,
          borderBottomLeftRadius: 7,
          borderBottomRightRadius: 7,
        }}
        
        isVisible={isNewBlockVisible}
        onBackdropPress={() => {
            resizeBlockView(0);
          }}
          >
          <Animated.View
            style={{
              maxWidth: "80%",
              minHeight: 200,
              backgroundColor: COLORS.white,
              borderRadius: 8,
              padding: 7,
              opacity: scaleBlockView?.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
              transform: [{ scale: scaleBlockView }],
            }}
            >
            <Text
              style={{
                textAlign: "center",
                color: COLORS.black,
                fontSize: 16,
                fontFamily: "JosefinSans-Bold",
              }}
              >
              Insuficiência da área
            </Text>

            <Text
              style={{
                color: COLORS.grey,
                fontSize: 15,
                fontFamily: "JosefinSans-Regular",
                textAlign: "center",
                lineHeight: 20,
                paddingTop: 10,
              }}
              >
              Este pomar não tem área suficiente para uma nova parcela de
              cajueiros.
            </Text>

            <Text
              style={{
                color: COLORS.danger,
                fontSize: 15,
                fontFamily: "JosefinSans-Regular",
                textAlign: "center",
                lineHeight: 25,
                paddingVertical: 10,
                // height: '30%',
              }}
              >
              ({remainingArea?.toFixed(1)} hectares disponíveis)
            </Text>

            <TouchableOpacity
              onPress={() => {
                resizeBlockView(0);
                // setIsNewBlockVisible(false);
              }}
              style={{
                backgroundColor: COLORS.danger,
                padding: 5,
                paddingHorizontal: 10,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.ghostwhite,
                  fontSize: 15,
                  fontFamily: "JosefinSans-Bold",
                }}
                >
                OK
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Overlay>
      ) : (
        <Modal visible={isNewBlockVisible}
        >
          <SafeAreaView
            onTouchCancel={() => { }}
            className={"flex flex-1 bg-neutral-100 min-h-full px-2"}
            >
            <Animated.View
              style={{
                opacity: scaleBlockView?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                transform: [{ scale: scaleBlockView }],
              }}
              >
              {remainingArea && remainingArea > 0.1 && (
                <>
                  <AwesomeAlert
                    show={alert}
                    titleStyle={{
                      fontSize: 20,
                      paddingVertical: 10,
                      fontWeight: "bold",
                      marginBottom: 20,
                      width: "100%",
                      textAlign: "center",
                    }}
                    messageStyle={{
                      fontSize: 18,
                      color: COLORS.grey,
                      fontFamily: "JosefinSans-Regular",
                      lineHeight: 25,
                      textAlign: "center",
                    }}
                    alertContainerStyle={
                      {
                        // width: 300,
                      }
                    }
                    overlayStyle={
                      {
                        // width: 100,
                      }
                    }
                    contentContainerStyle={{
                      width: "90%",
                      minHeight: "30%",
                    }}
                    contentStyle={{
                      // flex: 1,
                      paddingVertical: 1,
                    }}
                    cancelButtonStyle={{
                      width: 120,
                      marginRight: 15,
                    }}
                    cancelButtonTextStyle={{
                      fontSize: 18,
                      textAlign: "center",
                      //   fontWeight: 'bold',
                      fontFamily: "JosefinSans-Bold",
                    }}
                    confirmButtonStyle={{
                      width: 120,
                      marginLeft: 15,
                    }}
                    confirmButtonTextStyle={{
                      fontSize: 18,
                      textAlign: "center",
                      //   fontWeight: 'bold',
                      fontFamily: "JosefinSans-Bold",
                    }}
                    showProgress={false}
                    title={titleAlert}
                    message={messageAlert}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={showCancelButton}
                    showConfirmButton={showConfirmButton}
                    cancelText={cancelText}
                    confirmText={confirmText}
                    cancelButtonColor="#DD6B55"
                    confirmButtonColor={COLORS.danger}
                    onCancelPressed={() => {
                      setAlert(false);
                    }}
                    onConfirmPressed={() => {
                      setAlert(false);
                    }}
                    />

                  <View
                    style={{
                      width: "100%",
                      marginBottom: 10,
                      flexDirection: "row",
                    }}
                    >
                    <View w="100%">
                      {/* { remainingArea > 0.1 &&  */}
                      <Text
                        style={{
                          textAlign: "center",
                          color: COLORS.black,
                          fontSize: 24,
                          fontFamily: "JosefinSans-Bold",
                        }}
                      >
                        Parcela {farmland?.blocks?.length + 1}
                      </Text>
                    </View>
                    <View
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                    }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          // setIsNewBlockVisible(false);
                          resizeBlockView(0);
                        }}
                        >
                        <Icon name="close" color={COLORS.grey} size={25} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <ScrollView
                    decelerationRate={"normal"}
                    fadingEdgeLength={2}
                    style={{}}
                  >
                    <View
                      w="100%"
                      px="1"
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 10,
                        paddingBottom: 20,
                      }}
                    >

                      {ownerImage ? (
                        <Image
                          source={{ uri: ownerImage }}
                          style={{
                            width: 60,
                            height: 60,
                            borderColor: COLORS.main,
                            marginHorizontal: 3,
                            borderRadius: 120,
                          }}
                          />
                      ) : (
                        <Icon
                          name="account-circle"
                          size={80}
                          color={COLORS.lightgrey}
                          />
                        )}

                      <View>
                        <Text
                          style={{
                            fontSize: 14,
                            color: false ? COLORS.red : COLORS.main,
                            fontFamily: "JosefinSans-Regular",
                            textAlign: "right",
                          }}
                          >
                          Este pomar tem...
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: false ? COLORS.red : COLORS.main,
                            fontFamily: "JosefinSans-Regular",
                            textAlign: "right",
                          }}
                          >
                          {farmland?.blocks?.length}{" "}
                          {farmland?.blocks?.length <= 1
                            ? "parcela"
                            : "parcelas"}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: false ? COLORS.red : COLORS.main,
                            fontFamily: "JosefinSans-Regular",
                            textAlign: "right",
                          }}
                        >
                          {farmland.trees} árvores;
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: false ? COLORS.red : COLORS.main,
                            fontFamily: "JosefinSans-Regular",
                            textAlign: "right",
                          }}
                        >
                         
                          {remainingArea?.toFixed(1)} hectares disponíveis.
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        minHeight: "70%",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: 2,
                        paddingBottom: 50,
                      }}
                      >
                      <>
                        <View style={{flexDirection: "row", marginHorizontal: 3, width: "100%",}}>
                          <View w="100%" px="1">
                            <FormControl
                              isRequired
                              my="1"
                              isInvalid={"plantingYear" in errors}
                              >
                              <FormControl.Label>
                                Ano de plantio
                              </FormControl.Label>
                              <SelectList
                                      // @ts-expect-error TS(2769): No overload matches this call.
                                      data={() => getFullYears2(70)}
                                      setSelected={(newYear: any) => {
                                        setErrors((prev) => ({
                                          ...prev,
                                          plantingYear: "",
                                        }));
                                        setPlantingYear(newYear);
                                      }}
                                      save="value"
                                      placeholder="Escolher ano"
                                      searchPlaceholder="Procurar ano"
                                      maxHeight={400}
                                      fontFamily="JosefinSans-Regular"
                                      notFoundText="Ano não encontrado"
                                      dropdownTextStyles={{
                                        fontSize: 16,
                                        color: COLORS.black,
                                        padding: 5,
                                      }}
                                      arrowicon={
                                        <Icon
                                        name="arrow-drop-down"
                                        color={COLORS.main}
                                  />
                                }
                                closeicon={
                                  <Icon
                                    name="close"
                                    size={20}
                                    color={COLORS.grey}
                                  />
                                }
                                inputStyles={{
                                  fontSize: 15,
                                  color: plantingYear
                                  ? COLORS.black
                                  : COLORS.grey,
                                }}
                                viewStyles={{
                                  minHeight: 55,
                                  borderRadius: 5,
                                  borderColor: COLORS.lightgrey,
                                  marginTop: 5,
                                }}
                              />

                              {"plantingYear" in errors ? (
                                <FormControl.ErrorMessage
                                  leftIcon={
                                    <Icon
                                      name="error-outline"
                                      size={16}
                                      color="red"
                                    />
                                  }
                                  _text={{ fontSize: "xs" }}
                                >
                                  {errors?.plantingYear}
                                </FormControl.ErrorMessage>
                              ) : (
                                <FormControl.HelperText></FormControl.HelperText>
                              )}
                            </FormControl>
                          </View>
                          <View w="10%"></View>
                        </View>
                        <View style={{}}>
                          <View style={{flexDirection: "row", gap: 3, width: "100%",}}>
                            <View style={{ width: "48%",}}>
                              <FormControl
                                isRequired
                                my="2"
                                isInvalid={"usedArea" in errors}
                                >
                                <FormControl.Label>
                                  Área Aproveitada
                                </FormControl.Label>
                                <CustomInput
                                  width="100%"
                                  keyboardType="numeric"
                                  textAlign="center"
                                  placeholder="Hectares"
                                  value={usedArea}
                                  onChangeText={(newNumber: any) => {
                                    setErrors((prev) => ({
                                      ...prev,
                                      blockTrees: null,
                                      usedArea: null,
                                      treeDensity: null,
                                    }));
                                    setUsedArea(newNumber);
                                  }}
                                />
                              </FormControl>
                            </View>

                            <View
                             
                              style={{
                                justifyContent: "flex-end",
                                width: "48%",
                              }}
                            >
                              <FormControl
                                isRequired
                                my="2"
                                isInvalid={"blockTrees" in errors}
                              >
                                <FormControl.Label>
                                  N° de Cajueiros
                                </FormControl.Label>
                                <CustomInput
                                  width="100%"
                                  keyboardType="numeric"
                                  textAlign="center"
                                  placeholder="Cajueiros"
                                  value={blockTrees}
                                  onChangeText={(newNumber: any) => {
                                    setErrors((prev) => ({
                                      ...prev,
                                      blockTrees: null,
                                      usedArea: null,
                                      treeDensity: null,
                                    }));
                                    setBlockTrees(newNumber);
                                  }}
                                  />
                              </FormControl>
                            </View>
                          </View>
                           {errors?.blockTrees && errors?.usedArea && (
                            <View
                            
                              style={{
                                backgroundColor: COLORS.danger,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: COLORS.ghostwhite,
                                  padding: 6,
                                }}
                                >
                                {" "}
                                <Icon
                                  name="error-outline"
                                  size={20}
                                  color={COLORS.ghostwhite}
                                  />{" "}
                                {errors?.usedArea}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: COLORS.ghostwhite,
                                  padding: 6,
                                }}
                                >
                                {" "}
                                <Icon
                                  name="error-outline"
                                  size={20}
                                  color={COLORS.ghostwhite}
                                  />{" "}
                                {errors?.blockTrees}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: COLORS.ghostwhite,
                                  padding: 6,
                                }}
                              >
                                {" "}
                                <Icon
                                  name="error-outline"
                                  size={20}
                                  color={COLORS.ghostwhite}
                                />{" "}
                                {errors?.treeDensity}
                              </Text>
                            </View>
                          )}
                          {errors?.blockTrees && !errors?.usedArea && (
                            <View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: COLORS.red,
                                  padding: 6,
                                }}
                              >
                                {" "}
                                <Icon
                                  name="error-outline"
                                  size={20}
                                  color={COLORS.red}
                                />{" "}
                                {errors?.blockTrees}
                              </Text>
                            </View>
                          )}
                          {!errors?.blockTrees && errors?.usedArea && (
                            <View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: COLORS.red,
                                  padding: 6,
                                }}
                                >
                                {" "}
                                <Icon
                                  name="error-outline"
                                  size={20}
                                  color={COLORS.red}
                                  />{" "}
                                {errors?.usedArea}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View
                          w="100%"
                          style={{
                            marginTop:
                            
                            // @ts-expect-error TS(2339): Property 'usedArea' does not exist on type '{}'.
                            errors?.usedArea && errors?.blockTrees ? 0 : 0,
                          }}
                          >
                          <FormControl
                            isRequired
                            my="1"
                            isInvalid={"densityMode" in errors}
                            >
                            <FormControl.Label>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontFamily: "JosefinSans-Regular",
                                  color: COLORS.grey,
                                  paddingLeft: 15,
                                }}
                              >
                                Compasso
                              </Text>
                            </FormControl.Label>
                            <View style={{flexDirection: "row", marginHorizontal: 3, width: "100%",}} >
                              <View w="50%" px="1">
                                <CheckView
                                  center
                                  fontFamily="JosefinSans-Bold"
                                  containerStyle={{
                                    backgroundColor: "transparent",
                                  }}
                                  textStyle={{
                                    fontWeight: "120",
                                    color: isDensityModeRegular
                                    ? COLORS.main
                                    : COLORS.grey,
                                  }}
                                  title="Regular"
                                  checked={isDensityModeRegular}
                                  checkedIcon={
                                    <Icon
                                    name="check-view"
                                    color={COLORS.main}
                                    size={30}
                                    iconStyle={{ marginRight: 1 }}
                                    />
                                  }
                                  uncheckedIcon={
                                    <Icon
                                      name="radio-button-unchecked"
                                      color={COLORS.grey}
                                      size={30}
                                      iconStyle={{ marginRight: 1 }}
                                    />
                                  }
                                  onPress={() => {
                                    setIsDensityModeRegular(true);
                                    setIsDensityModeIrregular(false);
                                    setErrors({
                                      ...errors,
                                      densityMode: "",
                                    });
                                  }}
                                />
                              </View>
                              <View w="50%" px="1">
                                <CheckView
                                  center
                                  fontFamily="JosefinSans-Bold"
                                  containerStyle={{
                                    backgroundColor: "transparent",
                                  }}
                                  textStyle={{
                                    fontWeight: "120",
                                    color: isDensityModeIrregular
                                    ? COLORS.main
                                    : COLORS.grey,
                                  }}
                                  title="Irregular"
                                  checked={isDensityModeIrregular}
                                  checkedIcon={
                                    <Icon
                                      name="check-view"
                                      color={COLORS.main}
                                      size={30}
                                      iconStyle={{ marginRight: 1 }}
                                    />
                                  }
                                  uncheckedIcon={
                                    <Icon
                                      name="radio-button-unchecked"
                                      color={COLORS.grey}
                                      size={30}
                                      iconStyle={{ marginRight: 1 }}
                                    />
                                  }
                                  onPress={() => {
                                    setIsDensityModeIrregular(true);
                                    setIsDensityModeRegular(false);
                                    setErrors({
                                      ...errors,
                                      densityMode: "",
                                    });
                                    setDensityWidth("");
                                    setDensityLength("");
                                  }}
                                />
                              </View>
                            </View>
                            {"densityMode" in errors ? (
                              <FormControl.ErrorMessage
                              leftIcon={
                                <Icon
                                name="error-outline"
                                    size={16}
                                    color="red"
                                    />
                                  }
                                  _text={{ fontSize: "xs" }}
                              >
                                {errors?.densityMode}
                              </FormControl.ErrorMessage>
                            ) : (
                              <FormControl.HelperText></FormControl.HelperText>
                            )}
                          </FormControl>
                        </View>

                        {isDensityModeRegular && (
                          <View style={{flexDirection: "row", marginHorizontal: 3, width: "100%",}}>
                            <View w="45%" px="1">
                              <FormControl
                                my="1"
                                isRequired
                                isInvalid={"density" in errors}
                                >
                                <FormControl.Label>
                                  Comprimento
                                </FormControl.Label>
                                <CustomInput
                                  width="100%"
                                  textAlign="center"
                                  keyboardType="numeric"
                                  placeholder="Comprimento"
                                  value={densityLength}
                                  onChangeText={(newNumber: any) => {
                                    setErrors((prev) => ({
                                      ...prev,
                                      density: "",
                                      blockTrees: null,
                                      usedArea: null,
                                      treeDensity: null,
                                    }));
                                    setDensityLength(newNumber);
                                  }}
                                  />

                                {"density" in errors ? (
                                  <FormControl.ErrorMessage
                                    leftIcon={
                                      <Icon
                                        name="error-outline"
                                        size={16}
                                        color="red"
                                        />
                                    }
                                    _text={{ fontSize: "xs" }}
                                    >
                                    {errors?.density}
                                  </FormControl.ErrorMessage>
                                ) : (
                                  <FormControl.HelperText></FormControl.HelperText>
                                )}
                              </FormControl>
                            </View>
                            <View
                              w="10%"
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: "density" in errors ? 10 : 20,
                              }}
                              >
                              <Text
                                style={{
                                  fontSize: 20,
                                }}
                              >
                                X
                              </Text>
                            </View>
                            <View w="45%" px="1">
                              <FormControl
                                my="1"
                                isRequired
                                isInvalid={"density" in errors}
                              >
                                <FormControl.Label>Largura</FormControl.Label>
                                <CustomInput
                                  width="100%"
                                  keyboardType="numeric"
                                  textAlign="center"
                                  placeholder="Largura"
                                  value={densityWidth}
                                  onChangeText={(newNumber: any) => {
                                    setErrors((prev) => ({
                                      ...prev,
                                      density: "",
                                      blockTrees: null,
                                      usedArea: null,
                                      treeDensity: null,
                                    }));
                                    setDensityWidth(newNumber);
                                  }}
                                  />

                                {"density" in errors ? (
                                  <FormControl.ErrorMessage
                                    leftIcon={
                                      <Icon
                                      name="error-outline"
                                        size={16}
                                        color="red"
                                      />
                                    }
                                    _text={{ fontSize: "xs" }}
                                  >
                                    {errors?.density}
                                  </FormControl.ErrorMessage>
                                ) : (
                                  <FormControl.HelperText></FormControl.HelperText>
                                )}
                              </FormControl>
                            </View>
                          </View>
                        )}

                        <FormControl
                          isRequired
                          my="1"
                          isInvalid={"plantTypes" in errors}
                          >
                          <FormControl.Label>
                            Tipo de plantas
                          </FormControl.Label>
                          <MultipleSelectList
                            setSelected={(type: any) => {
                              setErrors((prev) => ({
                                ...prev,
                                plantTypes: "",
                              }));
                              setPlantTypes(type);
                            }}
                            data={plantingTypes}
                            notFoundText={"Tipo de planta não encontrado"}
                            placeholder="Tipo de plantas"
                            searchPlaceholder="Seleccionar tipo de plantas"
                            save="value"
                            label="Tipo de plantas"
                            badgeStyles={{
                              backgroundColor: COLORS.main,
                            }}
                            badgeTextStyles={{
                              fontSize: 16,
                            }}
                            arrowicon={
                              <Icon
                              // size={45}
                              name="arrow-drop-down"
                              color={COLORS.main}
                              />
                            }
                            closeicon={
                              <Icon
                              name="close"
                              size={20}
                              color={COLORS.grey}
                              />
                            }
                            fontFamily="JosefinSans-Regular"
                            dropdownTextStyles={{
                              fontSize: 16,
                              color: COLORS.black,
                              padding: 5,
                            }}
                            inputStyles={{
                              fontSize: 16,
                              color: "#A8A8A8",
                            }}
                            viewStyles={{
                              minHeight: 55,
                              borderRadius: 5,
                              borderColor: COLORS.lightgrey,
                            }}
                          />
                          {"plantTypes" in errors ? (
                            <FormControl.ErrorMessage
                              leftIcon={
                                <Icon
                                name="error-outline"
                                  size={16}
                                  color="red"
                                  />
                                }
                                _text={{ fontSize: "xs" }}
                                >
                              {errors?.plantTypes}
                            </FormControl.ErrorMessage>
                          ) : (
                            <FormControl.HelperText></FormControl.HelperText>
                          )}
                        </FormControl>
                        {plantTypes?.some((el) => el?.includes("enxert")) && (
                          <>
                            <FormControl
                              my="1"
                              isRequired
                              isInvalid={"clones" in errors}
                            >
                              <FormControl.Label>Clones</FormControl.Label>
                              <MultipleSelectList
                                setSelected={(type: any) => {
                                  setErrors((prev) => ({
                                    ...prev,
                                    clones: "",
                                  }));
                                  setClones(type);
                                }}
                                data={cloneList}
                                notFoundText={"Clone não encontrado"}
                                placeholder="clones"
                                save="value"
                                label="Clones"
                                badgeStyles={{
                                  backgroundColor: COLORS.main,
                                }}
                                badgeTextStyles={{
                                  fontSize: 16,
                                }}
                                arrowicon={
                                  <Icon
                                    // size={45}
                                    name="arrow-drop-down"
                                    color={COLORS.main}
                                  />
                                }
                                closeicon={
                                  <Icon
                                  name="close"
                                  size={20}
                                  color={COLORS.grey}
                                  />
                                }
                                fontFamily="JosefinSans-Regular"
                                dropdownTextStyles={{
                                  fontSize: 16,
                                  color: COLORS.black,
                                  padding: 5,
                                }}
                                inputStyles={{
                                  fontSize: 16,
                                  color: "#A8A8A8",
                                }}
                                viewStyles={{
                                  minHeight: 55,
                                  borderRadius: 5,
                                  borderColor: COLORS.lightgrey,
                                }}
                              />
                              {"clones" in errors ? (
                                <FormControl.ErrorMessage
                                  leftIcon={
                                    <Icon
                                      name="error-outline"
                                      size={16}
                                      color="red"
                                    />
                                  }
                                  _text={{ fontSize: "xs" }}
                                >
                                  {errors?.clones}
                                </FormControl.ErrorMessage>
                              ) : null}
                            </FormControl>

                            {clones?.find((clone) => clone === "Outro") && (
                              <View
                                w="100%"
                                alignItems={"center"}
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <View w="70%">
                                  <FormControl
                                    my="1"
                                    isInvalid={"addedClone" in errors}
                                  >
                                    <FormControl.Label>
                                      Adiciona novo clone
                                    </FormControl.Label>
                                    <CustomInput
                                      width="100%"
                                      type="text"
                                      placeholder="Clone não econtrado na lista"
                                      value={addedClone}
                                      onChangeText={(newClone: any) => {
                                        setErrors({
                                          ...errors,
                                          addedClone: "",
                                        });
                                        setAddedClone(newClone);
                                      }}
                                    />
                                    {"addedClone" in errors ? (
                                      <FormControl.ErrorMessage
                                        leftIcon={
                                          <Icon
                                            name="error-outline"
                                            size={16}
                                            color="red"
                                          />
                                        }
                                        _text={{ fontSize: "xs" }}
                                      >
                                        {errors?.addedClone}
                                      </FormControl.ErrorMessage>
                                    ) : (
                                      <FormControl.HelperText></FormControl.HelperText>
                                    )}
                                  </FormControl>
                                </View>
                                <View
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    bottom: -5,
                                    left: 0,
                                  }}
                                >
                                  <TouchableOpacity
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                      marginHorizontal: 10,
                                      marginTop: 10,
                                      padding: 5,
                                      borderRadius: 100,
                                      backgroundColor: COLORS.main,
                                      borderColor: COLORS.main,
                                      borderWidth: 1,
                                    }}
                                    onPress={() => {
                                      if (addedClone) {
                                        
                                        // @ts-expect-error TS(2345): Argument of type '(prev: never[]) => string[]' is ... Remove this comment to see the full error message
                                        setClones((prev) => [
                                          ...prev,
                                          addedClone,
                                        ]);

                                        setAddedClone("");
                                      } else {
                                        setErrors({
                                          ...errors,
                                          addedClone: "Indica novo clone",
                                        });
                                      }
                                    }}
                                  >
                                    <Icon
                                      name="arrow-downward"
                                      size={35}
                                      color={COLORS.ghostwhite}
                                      />
                                  </TouchableOpacity>
                                </View>
                                <View w="15%"></View>
                              </View>
                            )}
                          </>
                        )}

                        {plantTypes.length > 0 &&
                          sameTypeTreesList.length > 0 && (

                            <View w="100%" my="5" style={{}}>
                                  {errors?.sameTypeTrees && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    paddingHorizontal: 10,
                                  }}
                                >
                                  <Icon
                                    name="error-outline"
                                    size={26}
                                    color="red"
                                  />
                                  <Text
                                    style={{
                                      color: COLORS.red,
                                      fontSize: 14,
                                      fontFamily: "JosefinSans-Regular",
                                      paddingLeft: 5,
                                      marginLeft: 5,
                                    }}
                                  >
                                    {errors?.sameTypeTrees}
                                  </Text>
                                </View>
                              )}
                              <View w="100%" mb="2">
                                <View style={{flexDirection: "row", gap: 3, }}>
                                  <View w="65%">
                                    <Text
                                      style={{
                                        color: COLORS.main,
                                        fontSize: 16,
                                        fontFamily: "JosefinSans-Bold",
                                      }}
                                    >
                                      Tipos de plantas
                                    </Text>
                                  </View>
                                  <View w="35%">
                                    <Text
                                      style={{
                                        color: COLORS.main,
                                        fontSize: 16,
                                        fontFamily: "JosefinSans-Bold",
                                      }}
                                    >
                                      Cajueiros
                                    </Text>
                                  </View>
                                </View>
                              </View>

                              {sameTypeTreesList?.map(
                                (sameTypeTree, index) => (
                                  <View style={{ width: "100%", marginBottom: 1, }} key={index} >
                                    <View style={{flexDirection: "row", marginHorizontal: 3, width: "100%",}}>
                                    <View
                                        w="65%"
                                        style={{
                                          justifyContent: "center",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: 16,
                                            fontFamily: "JosefinSans-Regular",
                                            color: COLORS.grey,
                                          }}
                                        >
                                          <Icon
                                            name="arrow-forward"
                                            color={COLORS.grey}
                                            size={10}
                                          />{" "}
                                          {sameTypeTree?.treeType}
                                          </Text>
                                          </View>
                                          <View w="35%">
                                          <CustomInput
                                          width="90%"
                                          textAlign="center"
                                          keyboardType="numeric"
                                          placeholder="Cajueiros"
                                          
                                          // @ts-expect-error TS(2339): Property 'trees' does not exist on type 'never'.
                                          value={sameTypeTree?.trees}
                                          onChangeText={(newTrees: any) => {
                                            setErrors((prev) => ({
                                              ...prev,
                                              sameTypeTrees: "",
                                            }));
                                            setSameTypeTreesList(
                                              sameTypeTreesList.map(
                                                (object) => {
                                                  if (

                                                    // @ts-expect-error TS(2339): Property 'treeType' does not exist on type 'never'... Remove this comment to see the full error message
                                                    object?.treeType ===   sameTypeTree?.treeType
                                                  ) {

                                                    // @ts-expect-error TS(2339): Property 'trees' does not exist on type 'never'.
                                                    object.trees = newTrees;
                                                  }
                                                  return object;
                                                },
                                              ),
                                            );
                                          }}
                                        />
                                      </View>
                                      </View>
                                      </View>
                                ),
                              )}
                            </View>
                          )}
                      </>
                      <View
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: 3,
                        }}
                      >
                        <PrimaryButton
                          onPress={() => {
                            setAddBlockIsOn(true);
                          }}
                          title="Salvar parcela"
                          />
                      </View>
                    </View>
                  </ScrollView>
                </>
              )}
            </Animated.View>
          </SafeAreaView>
        </Modal>
      )

    }
  </>

;
}
