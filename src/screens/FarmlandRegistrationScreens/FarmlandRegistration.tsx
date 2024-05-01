import {
  Text,
  ScrollView,
  Animated as NativeAnimated,
  Easing,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Image,
  View,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Icon, Chip } from "@rneui/themed";
import { Box, FormControl, Stack, Center } from "native-base";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import AwesomeAlert from "react-native-awesome-alerts";
import Animated, { SlideInLeft } from "react-native-reanimated";

import CustomActivityIndicator from "../../components/ActivityIndicator/CustomActivityIndicator";
import styles from "./styles";
import { CustomInput } from "../../components/Inputs/CustomInput";
import { crops } from "../../consts/crops";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";
import SuccessAlert from "../../components/Alerts/SuccessAlert";
import COLORS from "../../consts/colors";
import validateFarmlandMainData from "../../helpers/validateFarmlandMainData";
import { assetTypes } from "../../consts/assetTypes";
import { v4 as uuidv4 } from "uuid";

import { categorizeFarmer } from "../../helpers/categorizeFarmer";
import FarmlandBlockRegistration from "../../components/FarmlandBlockRegistration/FarmlandBlockRegistration";

import categories from "../../consts/categories";
import validateBlockData from "../../helpers/validateBlockData";
import { normalizeBlockList } from "../../helpers/normalizeBlockList";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { errorMessages } from "../../consts/errorMessages";
import { resourceValidation } from "../../consts/resourceValidation";
import { ordinalNumberings } from "../../consts/ordinalNumberings";
import { SuccessLottie } from "../../components/LottieComponents/SuccessLottie";
import { farmerTypes } from "../../consts/farmerTypes";
import { resourceTypes } from "../../consts/resourceTypes";
import { farmlandOwners } from "../../consts/farmlandOwners";
import { backgroundStyle } from "../../styles/globals";
const { useRealm, useQuery } = realmContext;

const farmlandResourceMessage = "farmlandResourceMessage";

export default function FarmlandRegistration({ route, navigation }: any) {
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;
  const [farmlandId, setFarmlandId] = useState("");

  // SuccessLottie
  const [successLottieVisible, setSuccessLottieVisible] = useState(false);

  const currentUserStat = useQuery(resourceTypes.userStat).filtered(
    "userId == $0",
    customUserData?.userId,
  )[0];
  const farmland = realm.objectForPrimaryKey(
    resourceTypes.farmland,
    farmlandId,
  );

  // extract farmland owner id, name from the previous screen
  const { ownerId, ownerName, flag, ownerImage, ownerAddress } = route.params;

  // go back to the previous screen
  // if farmerId is undefined
  if (!ownerId || !flag) {
    navigation.goBack();
    return;
  }

  const [isCoordinatesModalVisible, setIsCoordinatesModalVisible] =
    useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const [consociatedCrops, setConsociatedCrops] = useState([]);
  const [otherConsociatedCrops, setOtherConsociatedCrops] = useState([]);
  const [newCrop, setNewCrop] = useState("");

  const [description, setDescription] = useState("");
  const [plantingYear, setPlantingYear] = useState("");
  const [trees, setTrees] = useState("");

  const [blockTrees, setBlockTrees] = useState("");

  const [totalArea, setTotalArea] = useState("");
  const [usedArea, setUsedArea] = useState("");
  const [densityWidth, setDensityWidth] = useState("");
  const [densityLength, setDensityLength] = useState("");
  const [plantTypes, setPlantTypes] = useState<{id: string, name: string}[]>([]);
  const [clones, setClones] = useState<{id: string, name: string}[]>([]);
  const [isDensityModeIrregular, setIsDensityModeIrregular] = useState(false);
  const [isDensityModeRegular, setIsDensityModeRegular] = useState(false);
  const [sameTypeTreesList, setSameTypeTreesList] = useState([]);

  const [errorAlert, setErrorAlert] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [isDeleteBlockOn, setIsDeleteBlockOn] = useState(false);

  // count all blocks associated to the farmland
  const [blockCount, setBlockCount] = useState(0);

  const [treesFlag, setTreesFlag] = useState(0);
  const [areaFlag, setAreaFlag] = useState(0);

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const scale = useRef(new NativeAnimated.Value(0)).current;

  // loading activity indicator
  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);

  // ------------------------------------------
  const [alert, setAlert] = useState(false);

  const [messageAlert, setMessageAlert] = useState("");
  const [titleAlert, setTitleAlert] = useState("");
  const [cancelText, setCancelText] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const [logFlag, setLogFlag] = useState("");
  const [invalidationMessage, setInvalidationMessage] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (successLottieVisible) {
      setTimeout(() => {
        setSuccessLottieVisible(false);
      }, 3000);
    }
  }, [successLottieVisible]);

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  const visualizeBlockData = () => {
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
      usedArea: Number(retrievedBlockData?.usedArea.toFixed(1)),

      // @ts-expect-error TS(2339): Property 'sameTypeTrees' does not exist on type 'f... Remove this comment to see the full error message
      sameTypeTrees: retrievedBlockData?.sameTypeTrees,

      // @ts-expect-error TS(2339): Property 'plantTypes' does not exist on type 'fals... Remove this comment to see the full error message
      plantTypes: retrievedBlockData?.plantTypes,
      userName: customUserData?.name,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    onAddBlock(block, farmlandId, realm);

    turnOffOverlay();
  };

  const invalidateFarmland = useCallback(
    (farmlandId: any, invalidationMessage: any, realm: any) => {
      const foundFarmland = realm.objectForPrimaryKey(
        resourceTypes.farmland,
        farmlandId,
      );

      realm.write(() => {
        if (foundFarmland) {
          foundFarmland.status = resourceValidation.status.invalidated;
          foundFarmland.checkedBy = customUserData?.name;
        }
      });

      try {
        addInvalidationMessage(farmlandId, invalidationMessage, realm);
      } catch (error) {
        console.log("could not add invalidation message:", { cause: error });
      }
    },
    [realm, farmlandId],
  );

  const addInvalidationMessage = useCallback(
    (farmlandId: any, message: any, realm: any) => {
      const newMessageObject = {
        position: 0,
        message: message,
        ownerName: customUserData?.name,
        createdAt: new Date(),
      };

      realm.write(async () => {
        const newResourceMessage = await realm.create(
          resourceTypes.invalidationMotive,
          {
            _id: uuidv4(),
            resourceId: farmlandId,
            resourceName: resourceTypes.farmland,
            messages: [newMessageObject],
            createdAt: new Date(),
          },
        );
      });
    },
    [realm, farmlandId],
  );

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.removeByName(farmlandResourceMessage);
      mutableSubs.add(
        realm
          .objects(resourceTypes.invalidationMotive)
          .filtered(`resourceId == "${farmlandId}"`),
        { name: farmlandResourceMessage },
      );
    });
  }, [realm, farmlandId]);

  const deleteBlock = useCallback(
    (farmlandId: any, realm: any) => {
      const foundFarmland = realm.objectForPrimaryKey(
        resourceTypes.farmland,
        farmlandId,
      );

      realm.write(() => {
        foundFarmland.blocks.pop();

        setRefresh(!refresh);
      });
    },
    [realm, farmlandId, farmland],
  );

  const checkBlockConformity = (farmlandId: any, realm: any) => {
    const farmland = realm.objectForPrimaryKey(
      resourceTypes.farmland,
      farmlandId,
    );

    const blocksTrees = farmland?.blocks
      ?.map((block: any) => parseInt(block?.trees))
      ?.reduce((acc: any, el: any) => acc + el, 0);
    const blocksAreas = farmland?.blocks
      ?.map((block: any) => parseFloat(block?.usedArea))
      ?.reduce((acc: any, el: any) => acc + el, 0)
      .toFixed(1);
    const totalArea = Number(farmland?.totalArea.toFixed(1));
    const totalTrees = parseInt(farmland?.trees);
    if (
      blocksTrees === 0 &&
      totalTrees > 0 &&
      blocksAreas === 0 &&
      totalArea > 0
    ) {
      setAlert(true);
      setTitleAlert(errorMessages.farmlandWithNoBlockError.title);
      setMessageAlert(errorMessages.farmlandWithNoBlockError.message);
      setShowCancelButton(
        errorMessages.farmlandWithNoBlockError.showCancelButton,
      );
      setShowConfirmButton(
        errorMessages.farmlandWithNoBlockError.showConfirmButton,
      );
      setCancelText(errorMessages.farmlandWithNoBlockError.cancelText);
      setConfirmText(errorMessages.farmlandWithNoBlockError.confirmText);
      setLogFlag(errorMessages.farmlandWithNoBlockError.logFlag);
      setInvalidationMessage(
        errorMessages.farmlandWithNoBlockError.invalidationMessage,
      );

      return false;
    } else if (blocksTrees > 0 && blocksTrees !== totalTrees) {
      setAlert(true);
      setTitleAlert(errorMessages.blockTreesConformityError.title);
      setMessageAlert(errorMessages.blockTreesConformityError.message);
      setShowCancelButton(
        errorMessages.blockTreesConformityError.showCancelButton,
      );
      setShowConfirmButton(
        errorMessages.blockTreesConformityError.showConfirmButton,
      );
      setCancelText(errorMessages.blockTreesConformityError.cancelText);
      setConfirmText(errorMessages.blockTreesConformityError.confirmText);
      setLogFlag(errorMessages.blockTreesConformityError.logFlag);
      setInvalidationMessage(
        errorMessages.blockTreesConformityError.invalidationMessage,
      );

      return false;
    }
    // this block of code is no longer used
    // the blocksAreas and totalAreas are not longer compared to each other at this point of the logic
    if (totalArea - blocksAreas < 0) {
      setAlert(true);
      setTitleAlert(errorMessages.blockAreaConformityError.title);
      setMessageAlert(errorMessages.blockAreaConformityError.message);
      setShowCancelButton(
        errorMessages.blockAreaConformityError.showCancelButton,
      );
      setShowConfirmButton(
        errorMessages.blockAreaConformityError.showConfirmButton,
      );
      setCancelText(errorMessages.blockAreaConformityError.cancelText);
      setConfirmText(errorMessages.blockAreaConformityError.confirmText);
      setLogFlag(errorMessages.blockAreaConformityError.logFlag);
      setInvalidationMessage(
        errorMessages.blockAreaConformityError.invalidationMessage,
      );

      return false;
    }
    return true;
  };

  useEffect(() => {
    if (isDeleteBlockOn) {
      deleteBlock(farmlandId, realm);
      setIsDeleteBlockOn(false);
    }
  }, [isDeleteBlockOn]);

  const turnOffOverlay = () => {
    setPlantingYear("");
    setUsedArea("");
    setBlockTrees("");
    setClones([]);
    setPlantTypes([]);
    setDensityLength("");
    setDensityWidth("");
    setIsDensityModeIrregular(false);
    setIsDensityModeRegular(false);

    resizeBlockBox(0);
  };

  const onAddBlock = useCallback(
    (block: any, farmlandId: any, realm: any) => {
      const farmland = realm.objectForPrimaryKey(
        resourceTypes.farmland,
        farmlandId,
      );
      realm.write(() => {
        farmland?.blocks?.push(block);
        if (
          farmland?.trees === farmland?.blocks
            ?.map((block: any) => block.trees)
            ?.reduce((acc: any, el: any) => acc + el, 0)
        ) {
          farmland.status = resourceValidation.status.pending;
        }

        setBlockCount((prev) => prev + 1);
      });
      setRefresh(!refresh);
      setSuccessLottieVisible(true);
    },
    [realm, farmland, farmlandId],
  );

  const visualizeFarmlandMainData = () => {
    let farmlandMainData = {
      description,
      consociatedCrops,
      otherConsociatedCrops,
      totalArea,
      trees,
    };
    // if any required data is not validated
    // a alert message is sent to the user
    if (!validateFarmlandMainData(farmlandMainData, errors, setErrors)) {
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
    let retrievedFarmlandMainData = validateFarmlandMainData(
      farmlandMainData,
      errors,
      setErrors,
    );

    onAddFarmland(retrievedFarmlandMainData, realm);
  };

  const navigateBack = () => {
    navigation.navigate("Profile", {
      ownerId: ownerId,
      farmerType: flag,
      farmersIDs: [],
    });
  };

  const onAddFarmland = useCallback(
    // @ts-expect-error TS(7030): Not all code paths return a value.
    (farmlandMainData: any, realm: any) => {
      const { description, consociatedCrops, trees, totalArea } =
        farmlandMainData;

      if (!ownerId) {
        return {
          status: "FAILED",
          code: 404,
          message: "Indica o proprietário desta parcela!",
        };
      }

      let owner: any;
      let ownerType: any;
      if (flag === farmerTypes.farmer) {
        owner = realm.objectForPrimaryKey(resourceTypes.actor, ownerId);
        ownerType = farmlandOwners.farmer;
      } else if (flag === farmerTypes.group) {
        owner = realm.objectForPrimaryKey(resourceTypes.group, ownerId);
        ownerType = farmlandOwners.group;
      } else if (flag === farmerTypes.institution) {
        owner = realm.objectForPrimaryKey(resourceTypes.institution, ownerId);
        ownerType = farmlandOwners.institution;
      }

      if (!owner) {
        return {
          status: "FAILED",
          code: 404,
          message: "O proprietário desta parcela ainda não foi registado!",
        };
      }

      let newFarmland;

      realm.write(async () => {
        newFarmland = await realm.create(resourceTypes.farmland, {
          _id: uuidv4(),
          description,
          consociatedCrops,
          trees,
          totalArea: Number(totalArea.toFixed(1)),
          farmerId: owner._id,
          userDistrict: customUserData?.userDistrict,
          userProvince: customUserData?.userProvince,
          userId: customUserData?.userId,
          userName: customUserData?.name,
          status: resourceValidation.status.invalidated,
          ownerType,
        });

        // convert realm object to JS object
        const farmlandObject = {
          ...newFarmland,
        };

        // set the farmlandId
        setFarmlandId(newFarmland._id);

        // setFarmland(farmlandObject);
      });

      if (flag === farmerTypes.farmer) {
        // categorize by 'comercial' | 'familiar' | 'nao-categorizado'
        const ownerFarmlands = realm
          .objects(resourceTypes.farmland)
          .filtered("farmerId == $0", owner._id);
        const subcategory = categorizeFarmer(ownerFarmlands);
        let farmlandIds = ownerFarmlands?.map((farmland: any) => farmland._id);

        realm.write(() => {
          let isAssetUpdated = false;
          for (let i = 0; i < owner?.assets?.length; i++) {
            if (owner.assets[i].assetType === assetTypes.farmland) {
              owner.assets[i].subcategory = subcategory;
              owner.assets[i].assets = farmlandIds;

              // asset is updated
              isAssetUpdated = true;
            }
          }
          // create assets if not found
          if (!isAssetUpdated) {
            const asset = {
              assetType: assetTypes.farmland,
              category: categories.farmer.category,
              subcategory: subcategory,
              assets: farmlandIds,
            };
            owner.assets = [asset]; // add new asset
          }
        });
      } else if (flag === farmerTypes.group) {
        const ownerFarmlands = realm
          .objects(resourceTypes.farmland)
          .filtered("farmerId == $0", owner._id);
        let farmlandIds = ownerFarmlands?.map((farmland: any) => farmland._id);

        realm.write(() => {
          let isAssetUpdated = false;
          for (let i = 0; i < owner?.assets?.length; i++) {
            if (owner.assets[i].assetType === assetTypes.farmland) {
              owner.assets[i].subcategory =
                categories.group.subcategories.production;
              owner.assets[i].assets = farmlandIds;

              // asset is updated
              isAssetUpdated = true;
            }
          }
          // create assets if not found
          if (!isAssetUpdated) {
            const asset = {
              assetType: assetTypes.farmland,
              category: categories.group.category,
              subcategory: categories.group.subcategories.production,
              assets: farmlandIds,
            };
            owner.assets = [asset]; // add new asset
          }
        });
      } else if (flag === farmerTypes.institution) {
        const ownerFarmlands = realm
          .objects(resourceTypes.farmland)
          .filtered("farmerId == $0", owner._id);
        let farmlandIds = ownerFarmlands?.map((farmland: any) => farmland._id);

        realm.write(() => {
          let isAssetUpdated = false;
          for (let i = 0; i < owner?.assets?.length; i++) {
            if (owner.assets[i].assetType === assetTypes.farmland) {
              owner.assets[i].subcategory =
                categories.institution.subcategories.production;
              owner.assets[i].assets = farmlandIds;

              // asset is updated
              isAssetUpdated = true;
            }
          }
          // create assets if not found
          if (!isAssetUpdated) {
            const asset = {
              assetType: assetTypes.farmland,
              category: categories.institution.category,
              subcategory: categories.institution.subcategories.production,
              assets: farmlandIds,
            };

            owner.assets = [asset]; // add new asset
          }
        });
      }

      // update user stat (1 more farmland registered by the user)
      if (currentUserStat) {
        realm.write(() => {
          // @ts-expect-error TS(2339): Property 'registeredFarmlands' does not exist on t... Remove this comment to see the full error message
          currentUserStat.registeredFarmlands =
            // @ts-expect-error TS(2339): Property 'registeredFarmlands' does not exist on t... Remove this comment to see the full error message
            currentUserStat.registeredFarmlands + 1;
        });
      } else {
        realm.write(() => {
          const newStat = realm.create(resourceTypes.userStat, {
            _id: uuidv4(),
            userName: customUserData.name,
            userId: customUserData.userId,
            userDistrict: customUserData.userDistrict,
            userProvince: customUserData.userProvince,
            userRole: customUserData.role,
            registeredFarmlands: 1,
          });
        });
      }
    },
    [realm, farmland],
  );

  useEffect(() => {}, [ownerId, farmlandId]);

  useEffect(() => {
    setLoadingActivityIndicator(true);
  }, [navigation]);

  const resizeBlockBox = (to: any) => {
    to === 1 && setIsOverlayVisible(true);
    NativeAnimated.timing(scale, {
      toValue: to,
      useNativeDriver: true,
      duration: 400,
      easing: Easing.linear,
    }).start(() => to === 0 && setIsOverlayVisible(false));
  };

  return (
    <SafeAreaView className={`flex flex-1 mb-10 ${backgroundStyle}`}>
      <Animated.View entering={SlideInLeft.duration(600)}>
        <AwesomeAlert
          show={errorAlert}
          showProgress={false}
          title="Dados Obrigatórios"
          message="Os campos obrigatórios devem ser bem preenchidos!"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="   OK!   "
          confirmButtonColor={COLORS.danger}
          onConfirmPressed={() => {
            setErrorAlert(false);
          }}
        />

        <AwesomeAlert
          show={alert}
          titleStyle={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 5,
            width: "100%",
            textAlign: "center",
          }}
          messageStyle={{
            fontSize: 16,
            color: COLORS.grey,
            fontFamily: "JosefinSans-Regular",
            lineHeight: 25,
            textAlign: "center",
          }}
          cancelButtonStyle={{
            marginRight: 10,
          }}
          cancelButtonTextStyle={{
            fontSize: 14,
            textAlign: "center",
            fontFamily: "JosefinSans-Bold",
          }}
          confirmButtonStyle={{
            marginLeft: 10,
          }}
          confirmButtonTextStyle={{
            fontSize: 14,
            textAlign: "center",
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
          cancelButtonColor={COLORS.danger}
          confirmButtonColor={
            logFlag?.includes("inconsistencies") ||
            logFlag?.includes("no blocks")
              ? COLORS.main
              : COLORS.main
          }
          onCancelPressed={() => {
            if (
              logFlag?.includes("inconsistencies") ||
              logFlag?.includes("no blocks")
            ) {
              try {
                invalidateFarmland(farmlandId, invalidationMessage, realm);
                navigateBack();
              } catch (error) {
                console.log("could not finish invalidation task: ", {
                  cause: error,
                });
              }
            }
            setAlert(false);
          }}
          onConfirmPressed={() => {
            setAlert(false);
          }}
        />

        <Box
          w="100%"
          px="3"
          // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; px: "3"; s... Remove this comment to see the full error message
          style={{
            backgroundColor: COLORS.fourth,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() => {
              if (farmlandId) {
                if (checkBlockConformity(farmlandId, realm)) {
                  navigateBack();
                }
              } else {
                navigation.goBack();
              }
            }}
            style={{
              position: "absolute",
              left: 6,
              top: 6,
            }}
          >
            <Icon name="arrow-back" color={COLORS.black} size={30} />
          </Pressable>

          <Text
            style={{
              fontFamily: "JosefinSans-Bold",
              fontSize: 24,
              color: COLORS.black,
            }}
          >
            Registo
          </Text>
          <View
            style={{
              position: "absolute",
              top: 4,
              right: 2,
            }}
          >
            <Icon name="app-registration" size={40} color={COLORS.grey} />
          </View>
        </Box>
        <ScrollView
          decelerationRate={"normal"}
          fadingEdgeLength={2}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 60,
          }}
        >
          <View
            style={{
              elevation: 1,
              borderWidth: 1,
              paddingVertical: 5,
              borderColor: COLORS.lightgrey,
              backgroundColor: "transparent",
              flexDirection: "row",
              paddingBottom: 1,
            }}
          >
            <Box w="3%"></Box>
            <View
              style={{
                flexDirection: "row",
                minHeight: 80,
                width: "95%",
              }}
            >
              {ownerImage ? (
                <Image
                  source={{ uri: ownerImage }}
                  style={{
                    width: 80,
                    height: 80,
                    marginRight: 3,
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
              <Box
                // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { justifyConte... Remove this comment to see the full error message
                style={{
                  justifyContent: "flex-end",
                  paddingLeft: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "JosefinSans-Bold",
                    color: COLORS.black,
                    lineHeight: 30,
                  }}
                >
                  {ownerName?.includes("Outra")
                    ? `Instituição ${ownerName?.slice(6)}`
                    : ownerName}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "JosefinSans-Regular",
                    color: COLORS.grey,
                    lineHeight: 25,
                  }}
                >
                  {ownerAddress?.district}; {ownerAddress?.adminPost}
                </Text>
              </Box>
            </View>
          </View>

          {loadingActivitiyIndicator && (
            <CustomActivityIndicator
              loadingActivitiyIndicator={loadingActivitiyIndicator}
              setLoadingActivityIndicator={setLoadingActivityIndicator}
            />
          )}

          <Box
            w="100%"
            p="4"
            // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; p: "4"; st... Remove this comment to see the full error message
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 90,
            }}
          >
            <Box>
              <Text style={styles.headerText}>Registo de pomar</Text>
              {!farmland && (
                <Text
                  style={{
                    color: COLORS.grey,
                    fontSize: 15,
                    fontFamily: "JosefinSans-Regular",
                    paddingTop: 5,
                  }}
                >
                  Introduza dados do pomar.
                </Text>
              )}
            </Box>
            <Center
              // @ts-expect-error TS(2322): Type '{ children: Element; style: { borderRadius: ... Remove this comment to see the full error message
              style={{
                borderRadius: 5,
                backgroundColor: COLORS.grey,
                padding: 5,
              }}
            >
              <FontAwesomeIcon
                icon={faTree}
                size={30}
                color={COLORS.lightestgrey}
              />
            </Center>
          </Box>

          {!farmland && (
            <Box px="3" my="6">
              <Box w="100%" alignItems="center">
                <FormControl
                  isRequired
                  my="1"
                  isInvalid={"description" in errors}
                >
                  <FormControl.Label>Localização do Pomar</FormControl.Label>
                  <CustomInput
                    width="100%"
                    type="text"
                    maxLength={50}
                    multiline={true}
                    placeholder="Descrição da localização"
                    value={description}
                    onChangeText={(newDescription: any) => {
                      setErrors((prev) => ({ ...prev, description: "" }));
                      setDescription(newDescription);
                    }}
                  />
                  {"description" in errors ? (
                    <FormControl.ErrorMessage
                      leftIcon={
                        <Icon name="error-outline" size={16} color="red" />
                      }
                      _text={{ fontSize: "xs" }}
                    >
                      {errors?.description}
                    </FormControl.ErrorMessage>
                  ) : (
                    <FormControl.HelperText></FormControl.HelperText>
                  )}
                </FormControl>

                <Box w="100%" alignItems="center">
                  <FormControl
                    my="1"
                    isRequired
                    isInvalid={"consociatedCrops" in errors}
                  >
                    <FormControl.Label>Culturas consociadas</FormControl.Label>
                    <MultipleSelectList
                      setSelected={(crop: any) => {
                        setErrors((prev) => ({
                          ...prev,
                          consociatedCrops: "",
                        }));
                        setConsociatedCrops(crop);
                      }}
                      data={crops}
                      notFoundText={"Tipo de cultura não encontrada"}
                      maxHeight={400}
                      save="value"
                      arrowicon={
                        <Icon name="arrow-drop-down" color={COLORS.main} />
                      }
                      closeicon={
                        <Icon name="close" size={20} color={COLORS.grey} />
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
                      boxStyles={{
                        minHeight: 55,
                        borderRadius: 5,
                        borderColor: COLORS.lightgrey,
                      }}
                      label="Culturas"
                      placeholder="Culturas consociadas"
                      badgeStyles={{
                        backgroundColor: COLORS.main,
                      }}
                      badgeTextStyles={{
                        fontSize: 16,
                      }}
                      checkBoxStyles={{}}
                    />
                    {"consociatedCrops" in errors ? (
                      <FormControl.ErrorMessage
                        leftIcon={
                          <Icon name="error-outline" size={14} color="red" />
                        }
                        _text={{ fontSize: "xs" }}
                      >
                        {errors?.consociatedCrops}
                      </FormControl.ErrorMessage>
                    ) : (
                      <FormControl.HelperText></FormControl.HelperText>
                    )}
                  </FormControl>

                  {/* show all the newCrops that are typed by the user */}
                  {otherConsociatedCrops.length > 0 && (
                    <Box
                      // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { flexDirectio... Remove this comment to see the full error message
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        minHeight: 30,
                        backgroundColor: COLORS.grey,
                        borderRadius: 5,
                      }}
                    >
                      <Box
                        w="90%"
                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "90%"; style: { padd... Remove this comment to see the full error message
                        style={{
                          padding: 5,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            fontSize: 13,
                            textAlign: "left",
                            color: COLORS.ghostwhite,
                            lineHeight: 20,
                          }}
                        >
                          [ {otherConsociatedCrops.join("; ")} ]
                        </Text>
                      </Box>
                      <Box
                        w="10%"
                        // @ts-expect-error TS(2322): Type '{ children: Element; w: "10%"; style: { alig... Remove this comment to see the full error message
                        style={{
                          alignItems: "flex-end",
                          justifyContent: "flex-start",
                          padding: 2,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setOtherConsociatedCrops([]);
                          }}
                        >
                          <Icon
                            name="close"
                            color={COLORS.ghostwhite}
                            size={20}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  )}

                  {/* Show this only when the user chooses 'Outras' option in the consociatedCrops */}
                  {consociatedCrops?.find((crop) => crop === "Outras") && (
                    // @ts-expect-error TS(2322): Type '{ children: Element; style: {}; }' is not as... Remove this comment to see the full error message
                    <Box style={{}}>
                      <Stack direction="row" w="100%" space={2}>
                        <Box w="80%">
                          <FormControl
                            isRequired
                            my="2"
                            isInvalid={"newCrop" in errors}
                          >
                            <FormControl.Label>
                              Outras culturas
                            </FormControl.Label>
                            <CustomInput
                              width="100%"
                              keyboardType="default"
                              textAlign="center"
                              placeholder="Outra cultura"
                              // @ts-expect-error TS(2339): Property 'newCrop' does not exist on type '{}'.
                              borderColor={errors?.newCrop ? "red" : ""}
                              value={newCrop}
                              onChangeText={(crop: any) => {
                                setErrors((prev) => ({ ...prev, newCrop: "" }));
                                setNewCrop(crop);
                              }}
                            />

                            {"newCrop" in errors ? (
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
                                {errors?.newCrop}
                              </FormControl.ErrorMessage>
                            ) : (
                              <FormControl.HelperText></FormControl.HelperText>
                            )}
                          </FormControl>
                        </Box>

                        <Box
                          w="20%"
                          // @ts-expect-error TS(2322): Type '{ children: Element; w: "20%"; style: { just... Remove this comment to see the full error message
                          style={{
                            justifyContent: "center",
                            alignItems: "center",

                            // @ts-expect-error TS(2339): Property 'newCrop' does not exist on type '{}'.
                            paddingTop: errors?.newCrop ? 10 : 20,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              if (
                                newCrop !== "" &&
                                !otherConsociatedCrops?.find(
                                  (crop) =>
                                    // @ts-expect-error TS(2339): Property 'toLowerCase' does not exist on type 'nev... Remove this comment to see the full error message
                                    crop?.toLowerCase() ===
                                    newCrop?.toLowerCase(),
                                )
                              ) {
                                // @ts-expect-error TS(2345): Argument of type '(prev: never[]) => string[]' is ... Remove this comment to see the full error message
                                setOtherConsociatedCrops((prev) => [
                                  ...prev,
                                  newCrop,
                                ]);
                                setNewCrop("");
                              } else {
                                setErrors((prev) => ({
                                  prev,
                                  newCrop: "Indica outra cultura",
                                }));
                              }
                            }}
                          >
                            <Icon
                              name="arrow-circle-up"
                              size={40}
                              color={COLORS.mediumseagreen}
                            />
                          </TouchableOpacity>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                  <Box>
                    <Stack direction="row" w="100%" space={2}>
                      <Box w="48%">
                        <FormControl
                          isRequired
                          my="2"
                          isInvalid={"totalArea" in errors}
                        >
                          <FormControl.Label>
                            Área Total Declarada
                          </FormControl.Label>
                          <CustomInput
                            width="100%"
                            keyboardType="decimal-pad"
                            textAlign="center"
                            placeholder="Hectares"
                            value={totalArea}
                            onChangeText={(newNumber: any) => {
                              setErrors((prev) => ({ ...prev, totalArea: "" }));

                              // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                              setTotalArea(Number(newNumber));
                            }}
                          />

                          {"totalArea" in errors ? (
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
                              {errors?.totalArea}
                            </FormControl.ErrorMessage>
                          ) : (
                            <FormControl.HelperText></FormControl.HelperText>
                          )}
                        </FormControl>
                      </Box>

                      <View
                        style={{
                          justifyContent: "flex-end",
                          width: "48%",
                        }}
                      >
                        <FormControl
                          isRequired
                          my="2"
                          isInvalid={"trees" in errors}
                        >
                          <FormControl.Label>
                            N° Total de Cajueiros
                          </FormControl.Label>
                          <CustomInput
                            width="100%"
                            keyboardType="numeric"
                            textAlign="center"
                            placeholder="Cajueiros"
                            value={trees}
                            onChangeText={(newNumber: any) => {
                              setErrors((prev) => ({ ...prev, trees: "" }));
                              setTrees(newNumber);
                            }}
                          />

                          {"trees" in errors ? (
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
                              {errors?.trees}
                            </FormControl.ErrorMessage>
                          ) : (
                            <FormControl.HelperText></FormControl.HelperText>
                          )}
                        </FormControl>
                      </View>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {farmland && (
            <>
              <Box
                w="100%"
                // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; style: { p... Remove this comment to see the full error message
                style={{
                  padding: 20,
                }}
              >
                <Box>
                  <Text
                    style={{
                      color: COLORS.grey,
                      fontSize: 14,
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    Área Total
                  </Text>
                  <Chip
                    // @ts-expect-error TS(2339): Property 'totalArea' does not exist on type 'Objec... Remove this comment to see the full error message
                    title={`${Number(farmland?.totalArea.toFixed(1))} hectares`}
                    titleStyle={{
                      color: COLORS.grey,
                    }}
                    icon={{
                      name: "scatter-plot",
                      size: 20,
                      color: COLORS.grey,
                    }}
                    containerStyle={{ marginVertical: 15 }}
                  />
                </Box>

                <Box>
                  <Text
                    style={{
                      color: COLORS.grey,
                      fontSize: 14,
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    Cajueiros
                  </Text>
                  <Chip
                    // @ts-expect-error TS(2339): Property 'trees' does not exist on type 'Object<un... Remove this comment to see the full error message
                    title={`${farmland?.trees} árvores`}
                    titleStyle={{
                      color: COLORS.grey,
                    }}
                    icon={{
                      name: "scatter-plot",
                      size: 20,
                      color: COLORS.grey,
                    }}
                    containerStyle={{ marginVertical: 15 }}
                  />
                </Box>

                <Box>
                  <Text
                    style={{
                      color: COLORS.grey,
                      fontSize: 14,
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    Consociação
                  </Text>
                  <Chip
                    // @ts-expect-error TS(2339): Property 'consociatedCrops' does not exist on type... Remove this comment to see the full error message
                    title={farmland?.consociatedCrops?.join("; ")}
                    titleStyle={{
                      color: COLORS.grey,
                    }}
                    icon={{
                      name: "scatter-plot",
                      size: 20,
                      color: COLORS.grey,
                    }}
                    containerStyle={{ marginVertical: 15 }}
                  />
                </Box>
              </Box>

              {farmland?.blocks?.length > 0 &&
                // @ts-expect-error TS(2339): Property 'blocks' does not exist on type 'Object<u... Remove this comment to see the full error message
                normalizeBlockList(farmland?.blocks)?.map(
                  (block: any, index: any) => {
                    return (
                      <Box
                        key={index}
                        // @ts-expect-error TS(2322): Type '{ children: Element[]; key: any; style: { fl... Remove this comment to see the full error message
                        style={{
                          flex: 1,
                          margin: 10,
                        }}
                      >
                        <Box
                          w="100%"
                          // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; style: { b... Remove this comment to see the full error message
                          style={{
                            backgroundColor: COLORS.dark,
                            borderWidth: 1,
                            borderColor: COLORS.dark,
                            borderTopEndRadius: 8,
                            borderTopStartRadius: 8,
                            paddingVertical: 3,
                            // paddingHorizontal: 6,
                            flexDirection: "row",
                          }}
                        >
                          <Box
                            w="85%"
                            // @ts-expect-error TS(2322): Type '{ children: Element; w: "85%"; style: { padd... Remove this comment to see the full error message
                            style={{
                              paddingLeft: 10,
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.ghostwhite,
                                fontFamily: "JosefinSans-Bold",
                                fontSize: 15,
                              }}
                              numberOfLines={1}
                              ellipsizeMode="head"
                            >
                              Parcela {index + 1} ({block?.plantingYear})
                            </Text>
                          </Box>

                          <Box w="15%">
                            <TouchableOpacity
                              disabled={
                                // @ts-expect-error TS(2339): Property 'blocks' does not exist on type 'Object<u... Remove this comment to see the full error message
                                block?.position === farmland?.blocks?.length - 1
                                  ? false
                                  : true
                              }
                              onPress={() => {
                                setAreaFlag(
                                  (prev) => prev - parseFloat(block?.usedArea),
                                );
                                setTreesFlag(
                                  (prev) => prev - parseInt(block?.trees),
                                );

                                setIsDeleteBlockOn(true);
                              }}
                            >
                              <Icon
                                name={
                                  block?.position ===
                                  // @ts-expect-error TS(2339): Property 'blocks' does not exist on type 'Object<u... Remove this comment to see the full error message
                                  farmland?.blocks?.length - 1
                                    ? "delete-forever"
                                    : "check-circle"
                                }
                                size={25}
                                color={
                                  block?.position ===
                                  // @ts-expect-error TS(2339): Property 'blocks' does not exist on type 'Object<u... Remove this comment to see the full error message
                                  farmland?.blocks?.length - 1
                                    ? COLORS.ghostwhite
                                    : COLORS.ghostwhite
                                }
                              />
                            </TouchableOpacity>
                          </Box>
                          <Box w="5%"></Box>
                        </Box>
                        <Box
                          // @ts-expect-error TS(2322): Type '{ children: any[]; style: { borderWidth: num... Remove this comment to see the full error message
                          style={{
                            borderWidth: 1,
                            borderColor: COLORS.dark,
                          }}
                        >
                          <Box w="100%">
                            <Stack direction="row" w="100%" space={1} my="3">
                              <Box w="50%" alignItems={"center"}>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: "JosefinSans-Bold",
                                    fontSize: 14,
                                  }}
                                >
                                  Área (hectares)
                                </Text>
                                <Text
                                  style={{
                                    textAlign: "center",
                                    color: COLORS.grey,
                                  }}
                                >
                                  ({Number(block?.usedArea.toFixed(1))})
                                </Text>
                              </Box>
                              <Box w="50%" alignItems={"center"}>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: "JosefinSans-Bold",
                                    fontSize: 14,
                                  }}
                                >
                                  Cajueiros (árvores)
                                </Text>
                                <Text
                                  style={{
                                    textAlign: "center",
                                    color: COLORS.grey,
                                  }}
                                >
                                  ({block?.trees})
                                </Text>
                              </Box>
                            </Stack>
                          </Box>
                          <Box w="100%">
                            <Stack direction="row" w="100%" space={1} my="3">
                              <Box w="50%" alignItems={"center"}>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: "JosefinSans-Bold",
                                    fontSize: 14,
                                  }}
                                >
                                  Compasso (metros)
                                </Text>
                                <Text
                                  style={{
                                    textAlign: "center",
                                    color: COLORS.grey,
                                  }}
                                >
                                  {block?.density?.mode === "Regular"
                                    ? `(${block?.density?.mode}: ${block?.density?.length}x${block?.density?.width})`
                                    : `(${block?.density?.mode})`}
                                </Text>
                              </Box>
                              <Box w="50%" alignItems={"center"}>
                                <Text
                                  style={{
                                    color: COLORS.black,
                                    fontFamily: "JosefinSans-Bold",
                                    fontSize: 14,
                                  }}
                                >
                                  Tipo de plantas
                                </Text>
                                <Text
                                  style={{
                                    textAlign: "center",
                                    color: COLORS.grey,
                                  }}
                                >
                                  ({block?.plantTypes?.plantType?.join("; ")})
                                </Text>
                                <Text
                                  style={{
                                    textAlign: "center",
                                    color: COLORS.grey,
                                  }}
                                >
                                  {block?.plantTypes?.plantType?.some(
                                    (plant: any) => plant?.includes("enxert"),
                                  )
                                    ? `(clones: ${block?.plantTypes?.clones?.join(
                                        "; ",
                                      )})`
                                    : ""}
                                </Text>
                              </Box>
                            </Stack>
                          </Box>
                        </Box>
                      </Box>
                    );
                  },
                )}
            </>
          )}
          {farmland?.blocks?.length > 0 ? (
            <>
              {farmland && farmland?.blocks && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Roboto-Regular",
                    color: COLORS.dark,
                    textAlign: "right",
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}
                >
                  {ordinalNumberings[farmland?.blocks?.length + 1]} parcela.
                </Text>
              )}

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (checkBlockConformity(farmlandId, realm)) {
                      setIsCoordinatesModalVisible(true);
                    }
                  }}
                  style={{
                    backgroundColor: COLORS.main,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 4,
                    height: 45,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.ghostwhite,
                      fontFamily: "Roboto-Regular",
                      textAlign: "center",
                      padding: 4,
                    }}
                  >
                    Concluir Registo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (farmland) {
                      // make the block data form visible
                      resizeBlockBox(1);
                    } else {
                      setLoadingButton(true);

                      // visualize and save the farmland main data
                      visualizeFarmlandMainData();
                    }
                  }}
                  style={{
                    backgroundColor: COLORS.dark,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 4,
                    height: 45,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.ghostwhite,
                      fontSize: 13,
                      fontFamily: "Roboto-Regular",
                      textAlign: "center",
                      padding: 4,
                    }}
                  >
                    Adicionar Parcela
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {farmland && farmland?.blocks && (
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Roboto-Regular",
                    color: COLORS.dark,
                    textAlign: "right",
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}
                >
                  {ordinalNumberings[farmland?.blocks?.length + 1]} parcela.
                </Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (farmland) {
                    // make the block data form visible
                    resizeBlockBox(1);
                  } else {
                    setLoadingButton(true);
                    // visualize and save the farmland main data
                    visualizeFarmlandMainData();
                  }
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  marginHorizontal: 10,
                  backgroundColor: !farmland ? COLORS.main : COLORS.dark,
                  height: 45,
                }}
              >
                <Text
                  style={{
                    color: COLORS.ghostwhite,
                    fontSize: 16,
                    fontFamily: "Roboto-Regular",
                    textAlign: "center",
                  }}
                >
                  {!farmland ? "Adicionar Pomar" : "Adicionar Parcela"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <FarmlandBlockRegistration
            isOverlayVisible={isOverlayVisible}
            setIsOverlayVisible={setIsOverlayVisible}
            resizeBlockBox={resizeBlockBox}
            scale={scale}
            customUserData={customUserData}
            errors={errors}
            setErrors={setErrors}
            alert={alert}
            setAlert={setAlert}
            plantingYear={plantingYear}
            setPlantingYear={setPlantingYear}
            blockTrees={blockTrees}
            setBlockTrees={setBlockTrees}
            usedArea={usedArea}
            setUsedArea={setUsedArea}
            plantTypes={plantTypes}
            setPlantTypes={setPlantTypes}
            clones={clones}
            setClones={setClones}
            densityLength={densityLength}
            setDensityLength={setDensityLength}
            setDensityWidth={setDensityWidth}
            densityWidth={densityWidth}
            isDensityModeIrregular={isDensityModeIrregular}
            isDensityModeRegular={isDensityModeRegular}
            setIsDensityModeIrregular={setIsDensityModeIrregular}
            setIsDensityModeRegular={setIsDensityModeRegular}
            visualizeBlockData={visualizeBlockData}
            farmlandId={farmlandId}
            totalArea={totalArea}
            setTotalArea={setTotalArea}
            totalTrees={trees}
            setTotalTrees={setTrees}
            sameTypeTreesList={sameTypeTreesList}
            setSameTypeTreesList={setSameTypeTreesList}
            treesFlag={treesFlag}
            setTreesFlag={setTreesFlag}
            areaFlag={areaFlag}
            setAreaFlag={setAreaFlag}
            turnOffOverlay={turnOffOverlay}
            messageAlert={messageAlert}
            setMessageAlert={setMessageAlert}
            titleAlert={titleAlert}
            setTitleAlert={setTitleAlert}
            cancelText={cancelText}
            setCancelText={setCancelText}
            confirmText={confirmText}
            setConfirmText={setConfirmText}
            showCancelButton={showCancelButton}
            setShowCancelButton={setShowCancelButton}
            showConfirmButton={showConfirmButton}
            setShowConfirmButton={setShowConfirmButton}
            ownerImage={ownerImage}
          />

          {successLottieVisible && (
            <SuccessLottie
              successLottieVisible={successLottieVisible}
              setSuccessLottieVisible={setSuccessLottieVisible}
            />
          )}

          <Box>
            <SuccessAlert
              isCoordinatesModalVisible={isCoordinatesModalVisible}
              setIsCoordinatesModalVisible={setIsCoordinatesModalVisible}
              farmlandId={farmlandId}
              flag={"farmland"}
              farmlandOwnerType={flag}
              ownerId={ownerId}
            />
          </Box>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
