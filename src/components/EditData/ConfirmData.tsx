import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Modal from "react-native-modal";
import {
  Box,
  FormControl,
  Stack,
  Select,
  CheckIcon,
  Center,
  Radio,
} from "native-base";
import { Overlay, Icon, Button } from "@rneui/base";
import COLORS from "../../consts/colors";
import CustomActivityIndicator from "../ActivityIndicator/CustomActivityIndicator";
import { resourceValidation } from "../../consts/resourceValidation";

import { useUser } from "@realm/react";
import { realmContext } from "../../models/realmContext";
import { SuccessLottie } from "../LottieComponents/SuccessLottie";
const { useRealm } = realmContext;

const ConfirmData = ({
  // setIsOverlayVisible,
  isConfirmDataVisible,

  setIsConfirmDataVisible,
  newDataObject,
  oldDataObject,
  dataToBeUpdated,
  resourceName,
  ownerName,
  resource,
  blockId,
  setSuccessLottieVisible,
  successLottieVisible
}: any) => {
  const realm = useRealm();
  const user = useUser();
  const customUserData = user?.customData;

  const onUpdateData = (
    resource: any,
    newDataObject: any,
    realm: any,
    dataToBeUpdated: any,
    resourceName: any,
  ) => {
    realm.write(() => {
      if (dataToBeUpdated === "address" && resourceName === "Farmer") {
        resource.address = newDataObject;
        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        // resource.userProvince = newData?.province;
        // resource.userDistrict = newData?.district;
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "contact" && resourceName === "Farmer") {
        resource.contact = newDataObject;
        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        // resource.userProvince = newData?.province;
        // resource.userDistrict = newData?.district;
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "idDocument" && resourceName === "Farmer") {
        resource.idDocument = newDataObject;
        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        // resource.userProvince = newData?.province;
        // resource.userDistrict = newData?.district;
        resource.status = resourceValidation.status.pending;
      }

      if (
        dataToBeUpdated === "institutionDocument" &&
        resourceName === "Institution"
      ) {
        resource.nuit = newDataObject?.nuit;
        resource.licence = newDataObject?.licence;

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        // resource.userProvince = newData?.province;
        // resource.userDistrict = newData?.district;
        resource.status = resourceValidation.status.pending;
      }

      if (
        dataToBeUpdated === "institutionManager" &&
        resourceName === "Institution"
      ) {
        resource.manager.fullname = newDataObject?.fullname;
        resource.manager.phone = newDataObject?.phone;

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        // resource.userProvince = newData?.province;
        // resource.userDistrict = newData?.district;
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "groupManager" && resourceName === "Group") {
        resource.manager.fullname = newDataObject?.fullname;
        resource.manager.phone = newDataObject?.phone;

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        // resource.userProvince = newData?.province;
        // resource.userDistrict = newData?.district;
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "groupMembers" && resourceName === "Group") {
        resource.operationalStatus = newDataObject?.operationalStatus;
        resource.numberOfMembers.total = newDataObject?.total;
        resource.numberOfMembers.women = newDataObject?.women;

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        // resource.userProvince = newData?.province;
        // resource.userDistrict = newData?.district;
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "groupIdentity" && resourceName === "Group") {
        resource.affiliationYear = newDataObject?.affiliationYear;
        resource.creationYear = newDataObject?.creationYear;
        resource.legalStatus = newDataObject?.legalStatus;
        resource.licence = newDataObject?.licence;
        resource.nuit = newDataObject?.nuit;
        resource.nuel = newDataObject?.nuel;
        

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        // resource.userProvince = newData?.province;
        // resource.userDistrict = newData?.district;
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "groupType" && resourceName === "Group") {
        resource.name = newDataObject?.name;
        resource.type = newDataObject?.type;
        resource.assets = newDataObject?.goals?.map((goal: any) => ({
          assetType: "Caju",
          category: "Grupo",
          subcategory: goal
        }));

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;

        resource.status = resourceValidation.status.pending;
      }

      if (
        dataToBeUpdated === "farmlandMainData" &&
        resourceName === "Farmland"
      ) {
        resource.description = newDataObject?.description;
        resource.consociatedCrops = newDataObject?.consociatedCrops;
        resource.trees = newDataObject?.trees;
        resource.totalArea = newDataObject?.totalArea;

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;

        let blocksTrees = resource?.blocks
          ?.map((block: any) => block?.trees)
          .reduce((acc: any, el: any) => acc + el, 0);
        if (blocksTrees === resource.trees) {
          resource.status = resourceValidation.status.pending;
          // }
        } else {
          resource.status = resourceValidation.status.invalidated;
        }
      }

      if (dataToBeUpdated === "blockData" && resourceName === "Farmland") {
        // find and update the block
        let blockTobeUpdated = resource?.blocks.find(
          (block: any) => block._id === blockId,
        );
        blockTobeUpdated.userName = customUserData?.name;
        blockTobeUpdated.modifiedAt = new Date();
        blockTobeUpdated.usedArea = newDataObject?.usedArea;
        blockTobeUpdated.density = newDataObject?.density;
        blockTobeUpdated.plantingYear = newDataObject?.plantingYear;
        blockTobeUpdated.trees = newDataObject?.trees;
        blockTobeUpdated.sameTypeTrees = [];
        blockTobeUpdated.plantTypes = {};

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;

        // check blocksTrees and totalTrees consistency
        // only update the resource status if there is consistency
        if (resource.status === resourceValidation.status.invalidated) {
          let blocksTrees = resource?.blocks
            ?.map((block: any) => block?.trees)
            .reduce((acc: any, el: any) => acc + el, 0);
          if (blocksTrees === resource.trees) {
            resource.status = resourceValidation.status.pending;
          }
        }
      }

      if (dataToBeUpdated === "plantType" && resourceName === "Farmland") {
        // find and update the block
        let blockTobeUpdated = resource?.blocks.find(
          (block: any) => block._id === blockId,
        );

        blockTobeUpdated.modifiedAt = new Date();
        blockTobeUpdated.userName = customUserData?.name;
        blockTobeUpdated.sameTypeTrees = newDataObject?.sameTypeTrees;
        blockTobeUpdated.plantTypes = newDataObject?.plantTypes;

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;

        // check blocksTrees and totalTrees consistency
        // only update the resource status if there is consistency
        if (resource.status === resourceValidation.status.invalidated) {
          let blocksTrees = resource?.blocks
            ?.map((block: any) => block?.trees)
            .reduce((acc: any, el: any) => acc + el, 0);
          if (blocksTrees === resource.trees) {
            resource.status = resourceValidation.status.pending;
          }
        }
      }
    });
    setSuccessLottieVisible(true);
    // setAutoRefresh(!autoRefresh);
    // setRefresh(!refresh);
  };

  // SuccesLottie effect
  useEffect(() => {
    if (successLottieVisible) {

      // @ts-expect-error TS(2304): Cannot find name 'setTimeout'.
      setTimeout(() => {
        setSuccessLottieVisible(false);
      }, 3000);
    }
  }, [successLottieVisible]);

  const toggleOverlay = () => {
    setIsConfirmDataVisible(!isConfirmDataVisible);
    // setAutoRefresh(!autoRefresh);
  };

  return (
    <Modal
      isVisible={isConfirmDataVisible}
      supportedOrientations={["portrait", "landscape"]}
      propagateSwipe
      animationIn={"zoomIn"}
      animationInTiming={600}
      animationOut={"zoomOut"}
      swipeDirection={["left", "right"]}
      // animationOutTiming={600}
      hideModalContentWhileAnimating={true}
      swipeThreshold={1000}
    >
      <View>
        <View
          style={{
            // width: "100%",
            // minHeight: 50,
            paddingHorizontal: 5,
            backgroundColor: COLORS.main,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <View
            style={{
              alignSelf: "flex-end",
            }}
          >
            <Icon
              name="close"
              size={20}
              color={COLORS.ghostwhite}
              onPress={() => {
                setIsConfirmDataVisible(false);
              }}
            />
          </View>
        </View>
        <ScrollView>
          <View
            flex={1}
            onStartShouldSetResponder={() => true}
            style={{
              backgroundColor: COLORS.ghostwhite,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              padding: 10,
            }}
          >
            {/* farmland block */}
            <>
              {dataToBeUpdated === "plantType" &&
                resourceName === "Farmland" && (
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                    style={{
                      paddingBottom: 30,
                      // alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 18,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Tipos de Planta Actuais
                    </Text>

                    <Stack direction="row">
                      <Box w="100%">
                        {newDataObject.sameTypeTrees?.map((same: any) => <Stack key={same.treeType} direction="row">
                          <Box w="60%">
                            <Text
                              style={{
                                fontFamily: "JosefinSans-Bold",
                                paddingTop: 2,
                              }}
                            >
                              <Icon
                                name="arrow-forward"
                                color={COLORS.grey}
                                size={10}
                              />{" "}
                              {same?.treeType}
                            </Text>
                          </Box>
                          <Box w="40%">
                            <Text
                              style={{
                                fontFamily: "JosefinSans-Regular",
                                paddingTop: 2,
                              }}
                            >
                              {same?.trees} árvores
                            </Text>
                          </Box>
                        </Stack>)}
                      </Box>
                    </Stack>
                  </Box>
                )}
            </>

            <>
              {dataToBeUpdated === "blockData" &&
                resourceName === "Farmland" && (
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                    style={{
                      paddingBottom: 30,
                      // alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Dados Anteriores da Parcela
                    </Text>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Ano de plantio
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {oldDataObject?.plantingYear}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Área aproveitada
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {oldDataObject?.usedArea
                            ? `${oldDataObject?.usedArea} hectares`
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Compasso
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {oldDataObject.density?.mode
                            ? oldDataObject.density.mode
                            : "Nenhum"}
                          {oldDataObject.density?.mode === "Regular" &&
                            `(${oldDataObject.density?.width} x ${oldDataObject.density?.length} metros)`}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Cajueiros
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {oldDataObject.trees
                            ? `${oldDataObject.trees} árvores`
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Box

                      // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                      style={{
                        paddingVertical: 20,
                      }}
                    ></Box>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Dados Actuais do Parcela
                    </Text>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Ano de plantio
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {newDataObject?.plantingYear}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Área aproveitada
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {newDataObject?.usedArea
                            ? `${newDataObject?.usedArea} hectares`
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Compasso
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {newDataObject.density?.mode
                            ? newDataObject.density.mode
                            : "Nenhum"}
                          {newDataObject.density?.mode === "Regular" &&
                            `(${newDataObject.density?.width} x ${newDataObject.density?.length} metros)`}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Cajueiros
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {newDataObject.trees
                            ? `${newDataObject.trees} árvores`
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                )}
            </>

            {/* farmland data updating */}
            <>
              {dataToBeUpdated === "farmlandMainData" &&
                resourceName === "Farmland" && (
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                    style={{
                      paddingBottom: 30,
                      // alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Dados Anteriores do Pomar
                    </Text>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Descrição
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {oldDataObject?.description
                            ? oldDataObject?.description
                            : "Nenhuma"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Culturas consociadas
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {oldDataObject?.consociatedCrops?.length > 0
                            ? oldDataObject?.consociatedCrops?.join("; ")
                            : "Nenhuma"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Área total
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {oldDataObject?.totalArea
                            ? oldDataObject?.totalArea
                            : "Nenhuma"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          N° de cajueiros
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {oldDataObject?.trees
                            ? oldDataObject?.trees
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Box

                      // @ts-expect-error TS(2322): Type '{ style: { paddingBottom: number; }; }' is n... Remove this comment to see the full error message
                      style={{
                        paddingBottom: 20,
                      }}
                    ></Box>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Dados Actuais do Pomar
                    </Text>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Descrição
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {newDataObject?.description
                            ? newDataObject?.description
                            : "Nenhuma"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Culturas consociadas
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {newDataObject?.consociatedCrops?.length > 0
                            ? newDataObject?.consociatedCrops?.join("; ")
                            : "Nenhuma"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          Área total
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {newDataObject?.totalArea
                            ? newDataObject?.totalArea
                            : "Nenhuma"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                          }}
                        >
                          N° de cajueiros
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                          }}
                        >
                          {newDataObject?.trees
                            ? newDataObject?.trees
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                )}
            </>

            {/* groups data updating  */}
            <>
              {dataToBeUpdated === "groupType" && resourceName === "Group" && (
                <Box

                  // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                  style={{
                    paddingBottom: 30,
                    // alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: "JosefinSans-Bold",
                      paddingBottom: 5,
                    }}
                  >
                    Tipo de Organização Anterior
                  </Text>
                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Nome
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {oldDataObject?.name ? oldDataObject?.name : "Nenhum"}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Tipo
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {oldDataObject?.type ? oldDataObject?.type : "Nenhum"}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Finalidade
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {oldDataObject?.goals?.length > 0
                          ? oldDataObject?.goals?.join("; ")
                          : "Nenhuma"}
                      </Text>
                    </Box>
                  </Stack>

                  <Box

                    // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                    style={{
                      paddingVertical: 20,
                    }}
                  ></Box>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: "JosefinSans-Bold",
                      paddingBottom: 5,
                    }}
                  >
                    Tipo de Organização Actual
                  </Text>

                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Nome
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {newDataObject?.name ? newDataObject?.name : "Nenhum"}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Tipo
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {newDataObject?.type ? newDataObject?.type : "Nenhum"}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Finalidade
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {newDataObject?.goals?.length > 0
                          ? newDataObject?.goals?.join("; ")
                          : "Nenhuma"}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              )}
            </>

            <>
              {dataToBeUpdated === "groupIdentity" &&
                resourceName === "Group" && (
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                    style={{
                      paddingBottom: 30,
                      // alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Identidade Anterior
                    </Text>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Situação Legal
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.legalStatus
                            ? oldDataObject?.legalStatus
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Ano de Criação
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.creationYear
                            ? oldDataObject?.creationYear
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Ano de Legalização
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.affiliationYear
                            ? oldDataObject?.affiliationYear
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          NUIT
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.nuit ? oldDataObject?.nuit : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          NUEL
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.nuel ? oldDataObject?.nuel : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Alvará
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.licence
                            ? oldDataObject?.licence
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Box

                      // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                      style={{
                        paddingVertical: 20,
                      }}
                    ></Box>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Identidade Actual
                    </Text>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Situação Legal
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.legalStatus
                            ? newDataObject?.legalStatus
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Ano de Criação
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.creationYear
                            ? newDataObject?.creationYear
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Ano de Legalização
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.affiliationYear
                            ? newDataObject?.affiliationYear
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          NUIT
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.nuit ? newDataObject.nuit : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          NUEL
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.nuel ? newDataObject.nuel : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Alvará
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.licence
                            ? newDataObject?.licence
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                )}
            </>

            <>
              {dataToBeUpdated === "groupMembers" &&
                resourceName === "Group" && (
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                    style={{
                      paddingBottom: 30,
                      // alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Efectividade Anterior
                    </Text>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Modo de Funcionamento
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.operationalStatus
                            ? "Activo"
                            : "Inactivo"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Total de Membros
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.total ? oldDataObject?.total : 0}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Total de Mulheres{" "}
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.women ? oldDataObject?.women : 0}
                        </Text>
                      </Box>
                    </Stack>

                    <Box

                      // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                      style={{
                        paddingVertical: 20,
                      }}
                    ></Box>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Efectividade Actual
                    </Text>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Modo de Funcionamento
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.operationalStatus
                            ? "Activo"
                            : "Inactivo"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Total de Membros
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.total ? newDataObject?.total : 0}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Total de Mulheres
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.women ? newDataObject?.women : 0}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                )}
            </>

            <>
              {dataToBeUpdated === "groupManager" &&
                resourceName === "Group" && (
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                    style={{
                      paddingBottom: 30,
                      // alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Contacto Anterior
                    </Text>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Nome do Presidente
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.fullname
                            ? oldDataObject?.fullname
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Número de telemóvel
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.phone
                            ? oldDataObject?.phone
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Box

                      // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                      style={{
                        paddingVertical: 20,
                      }}
                    ></Box>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Contacto Actual
                    </Text>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Nome do Presidente
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.fullname
                            ? newDataObject?.fullname
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Número de telemóvel
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.phone
                            ? newDataObject?.phone
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                )}
            </>

            <>
              {/* Institutions data updating  */}

              {dataToBeUpdated === "institutionManager" &&
                resourceName === "Institution" && (
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                    style={{
                      paddingBottom: 30,
                      // alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Contacto Anterior
                    </Text>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Nome do Responsável
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.fullname
                            ? oldDataObject?.fullname
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Número de telemóvel
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.phone
                            ? oldDataObject?.phone
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Box

                      // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                      style={{
                        paddingVertical: 20,
                      }}
                    ></Box>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Contacto Actual
                    </Text>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Nome do Responsável
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.fullname
                            ? newDataObject?.fullname
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Número de telemóvel
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.phone
                            ? newDataObject?.phone
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                )}
            </>

            <>
              {dataToBeUpdated === "institutionDocument" &&
                resourceName === "Institution" && (
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                    style={{
                      paddingBottom: 30,
                      // alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Documentação Anterior
                    </Text>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          NUIT da instituição
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.nuit ? oldDataObject?.nuit : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Número do alvará
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.licence
                            ? oldDataObject?.licence
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Box

                      // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                      style={{
                        paddingVertical: 20,
                      }}
                    ></Box>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Documentação Actual
                    </Text>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          NUIT da instituição
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.nuit ? newDataObject?.nuit : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Número do alvará
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.licence
                            ? newDataObject?.licence
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                )}
            </>

            <>
              {dataToBeUpdated === "idDocument" &&
                resourceName === "Farmer" && (
                  <Box

                    // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                    style={{
                      paddingBottom: 30,
                      // alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Documentos de Identificação Anteriores
                    </Text>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Tipo do documento
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.docType
                            ? oldDataObject?.docType
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Número do documento
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.docNumber
                            ? oldDataObject?.docNumber
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          NUIT
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {oldDataObject?.nuit ? oldDataObject?.nuit : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>

                    <Box

                      // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                      style={{
                        paddingVertical: 20,
                      }}
                    ></Box>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 16,
                        fontFamily: "JosefinSans-Bold",
                        paddingBottom: 5,
                      }}
                    >
                      Documentos de Identificação Actuais
                    </Text>

                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Tipo do documento
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.docType
                            ? newDataObject?.docType
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          Número do documento
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.docNumber
                            ? newDataObject?.docNumber
                            : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                    <Stack direction="row">
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Bold",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          NUIT
                        </Text>
                      </Box>
                      <Box w="50%">
                        <Text
                          style={{
                            fontFamily: "JosefinSans-Regular",
                            paddingTop: 2,
                            color: COLORS.grey,
                          }}
                        >
                          {newDataObject?.nuit ? newDataObject?.nuit : "Nenhum"}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                )}
            </>

            <>
              {dataToBeUpdated === "contact" && resourceName === "Farmer" && (
                <Box

                  // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                  style={{
                    paddingBottom: 30,
                    // alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: "JosefinSans-Bold",
                      paddingBottom: 5,
                    }}
                  >
                    Contacto Anterior
                  </Text>
                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Telemóvel principal
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {oldDataObject?.primaryPhone
                          ? oldDataObject?.primaryPhone
                          : "Nenhum"}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Telemóvel alternativo
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {oldDataObject?.secondaryPhone
                          ? oldDataObject?.secondaryPhone
                          : "Nenhum"}
                      </Text>
                    </Box>
                  </Stack>

                  <Box

                    // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                    style={{
                      paddingVertical: 20,
                    }}
                  ></Box>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: "JosefinSans-Bold",
                      paddingBottom: 5,
                    }}
                  >
                    Contacto Actual
                  </Text>

                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Telemóvel principal
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {newDataObject?.primaryPhone
                          ? newDataObject?.primaryPhone
                          : "Nenhum"}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Telemóvel alternativo
                      </Text>
                    </Box>
                    <Box w="50%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {newDataObject?.secondaryPhone
                          ? newDataObject?.secondaryPhone
                          : "Nenhum"}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              )}
            </>

            <>
              {dataToBeUpdated === "address" && resourceName === "Farmer" && (
                <Box

                  // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
                  style={{
                    paddingBottom: 30,
                    // alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: "JosefinSans-Bold",
                      paddingBottom: 5,
                    }}
                  >
                    Endereço Anterior
                  </Text>
                  <Stack direction="row">
                    <Box w="40%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Posto Admin.
                      </Text>
                    </Box>
                    <Box w="60%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {oldDataObject?.adminPost}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box w="40%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Localidade
                      </Text>
                    </Box>
                    <Box w="60%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {oldDataObject?.village}
                      </Text>
                    </Box>
                  </Stack>

                  <Box

                    // @ts-expect-error TS(2322): Type '{ style: { paddingVertical: number; }; }' is... Remove this comment to see the full error message
                    style={{
                      paddingVertical: 20,
                    }}
                  ></Box>
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                      fontFamily: "JosefinSans-Bold",
                      paddingBottom: 5,
                    }}
                  >
                    Endereço Actual
                  </Text>

                  <Stack direction="row">
                    <Box w="40%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Posto Admin.
                      </Text>
                    </Box>
                    <Box w="60%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {newDataObject?.adminPost}
                      </Text>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box w="40%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Bold",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        Localidade
                      </Text>
                    </Box>
                    <Box w="60%">
                      <Text
                        style={{
                          fontFamily: "JosefinSans-Regular",
                          paddingTop: 2,
                          color: COLORS.grey,
                        }}
                      >
                        {newDataObject?.village
                          ? newDataObject?.village
                          : "Não Aplicável?"}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              )}
            </>

            <Button
              title="Actualizar"
              titleStyle={{
                color: COLORS.ghostwhite,
                fontFamily: "JosefinSans-Bold",
              }}
              iconPosition="right"
              containerStyle={{
                backgroundColor: COLORS.main,
                borderRadius: 10,
                // color: COLORS.ghostwhite,
              }}
              type="outline"

              // @ts-expect-error TS(2322): Type '{ title: string; titleStyle: { color: string... Remove this comment to see the full error message
              onPress={() => {
                try {
                  onUpdateData(
                    resource,
                    newDataObject,
                    realm,
                    dataToBeUpdated,
                    resourceName,
                  );
                } catch (error) {

                  // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
                  console.log("Could not update data", { cause: error });
                } finally {
                  setIsConfirmDataVisible(false);
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: "center",
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: "center",
    //   color: 'ghostwhite',
    fontSize: 17,
  },
});

export default ConfirmData;
