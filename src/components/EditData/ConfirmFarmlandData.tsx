import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
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

const { useRealm } = realmContext;

const ConfirmFarmlandData = ({
  // setIsOverlayVisible,
  isConfirmDataVisible,

  setIsConfirmDataVisible,
  newDataObject,
  oldDataObject,
  dataToBeUpdated,
  resourceName,
  ownerName,
  resource,
  blockId
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
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "contact" && resourceName === "Farmer") {
        resource.contact = newDataObject;
        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "idDocument" && resourceName === "Farmer") {
        resource.idDocument = newDataObject;
        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
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
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "groupManager" && resourceName === "Group") {
        resource.manager.fullname = newDataObject?.fullname;
        resource.manager.phone = newDataObject?.phone;

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "groupMembers" && resourceName === "Group") {
        resource.operationalStatus = newDataObject?.operationalStatus;
        resource.numberOfMembers.total = newDataObject?.total;
        resource.numberOfMembers.women = newDataObject?.women;

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
        resource.status = resourceValidation.status.pending;
      }

      if (dataToBeUpdated === "groupIdentity" && resourceName === "Group") {
        resource.affiliationYear = newDataObject?.affiliationYear;
        resource.creationYear = newDataObject?.creationYear;
        resource.legalStatus = newDataObject?.legalStatus;
        resource.licence = newDataObject?.licence;
        resource.nuit = newDataObject?.nuit;

        resource.modifiedAt = new Date();
        resource.modifiedBy = customUserData?.name;
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

        // check blocksTrees and totalTrees consistency
        // only update the resource status if there is consistency
        // if (resource.status === resourceValidation.status.invalidated){
        let blocksTrees = resource?.blocks
          ?.map((block: any) => block?.trees)
          .reduce((acc: any, el: any) => acc + el, 0);
        if (blocksTrees === resource.trees) {
          resource.status = resourceValidation.status.pending;
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
  };

  const toggleOverlay = () => {
    setIsConfirmDataVisible(!isConfirmDataVisible);
  };

  return (
    <Overlay
      overlayStyle={{
        backgroundColor: COLORS.ghostwhite,
        width: "90%",
        maxHeight: "90%",
        borderRadius: 10,
      }}
      isVisible={isConfirmDataVisible}
      onBackdropPress={toggleOverlay}
    >
      <ScrollView
        style={{
          maxHeight: "100%",
        }}
      >
        <View
          style={{
            // minHeight: '70%',
            justifyContent: "center",

          }}
        >
      
          <View
            style={{
              backgroundColor: COLORS.main,
              width: "100%",
            }}
          >
            <Pressable
              style={{
                alignSelf: "flex-end",
              }}
              onPress={() => {
                setIsConfirmDataVisible(false);
              }}
            >
              <Icon
                name="close"
                size={20}
                color={COLORS.white}
              />
            </Pressable>
          </View>

          {/* farmland block */}

          {dataToBeUpdated === "plantType" && resourceName === "Farmland" && (
            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element[]; style: { paddingBotto... Remove this comment to see the full error message
              style={{
                paddingBottom: 30,
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

          {dataToBeUpdated === "blockData" && resourceName === "Farmland" && (
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

          {/* farmland data updating */}

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
                      {oldDataObject?.trees ? oldDataObject?.trees : "Nenhum"}
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
                      {newDataObject?.trees ? newDataObject?.trees : "Nenhum"}
                    </Text>
                  </Box>
                </Stack>
              </Box>
            )}

          {/* groups data updating  */}

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

          {dataToBeUpdated === "groupIdentity" && resourceName === "Group" && (
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
                    }}
                  >
                    {oldDataObject?.licence ? oldDataObject?.licence : "Nenhum"}
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
                    }}
                  >
                    {newDataObject?.licence ? newDataObject?.licence : "Nenhum"}
                  </Text>
                </Box>
              </Stack>
            </Box>
          )}

          {dataToBeUpdated === "groupMembers" && resourceName === "Group" && (
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
                    }}
                  >
                    {oldDataObject?.operationalStatus ? "Activo" : "Inactivo"}
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
                    Total de Membros
                  </Text>
                </Box>
                <Box w="50%">
                  <Text
                    style={{
                      fontFamily: "JosefinSans-Regular",
                      paddingTop: 2,
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
                    }}
                  >
                    {newDataObject?.operationalStatus ? "Activo" : "Inactivo"}
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
                    Total de Membros
                  </Text>
                </Box>
                <Box w="50%">
                  <Text
                    style={{
                      fontFamily: "JosefinSans-Regular",
                      paddingTop: 2,
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
                    }}
                  >
                    {newDataObject?.women ? newDataObject?.women : 0}
                  </Text>
                </Box>
              </Stack>
            </Box>
          )}

          {dataToBeUpdated === "groupManager" && resourceName === "Group" && (
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
                    }}
                  >
                    {oldDataObject?.phone ? oldDataObject?.phone : "Nenhum"}
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
                    }}
                  >
                    {newDataObject?.phone ? newDataObject?.phone : "Nenhum"}
                  </Text>
                </Box>
              </Stack>
            </Box>
          )}

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
                      }}
                    >
                      {oldDataObject?.phone ? oldDataObject?.phone : "Nenhum"}
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
                      }}
                    >
                      {newDataObject?.phone ? newDataObject?.phone : "Nenhum"}
                    </Text>
                  </Box>
                </Stack>
              </Box>
            )}

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

          {dataToBeUpdated === "idDocument" && resourceName === "Farmer" && (
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
                    }}
                  >
                    {oldDataObject?.docType ? oldDataObject?.docType : "Nenhum"}
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
                    Número do documento
                  </Text>
                </Box>
                <Box w="50%">
                  <Text
                    style={{
                      fontFamily: "JosefinSans-Regular",
                      paddingTop: 2,
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
                    }}
                  >
                    {newDataObject?.docType ? newDataObject?.docType : "Nenhum"}
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
                    Número do documento
                  </Text>
                </Box>
                <Box w="50%">
                  <Text
                    style={{
                      fontFamily: "JosefinSans-Regular",
                      paddingTop: 2,
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
                    }}
                  >
                    {newDataObject?.nuit ? newDataObject?.nuit : "Nenhum"}
                  </Text>
                </Box>
              </Stack>
            </Box>
          )}

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
                    }}
                  >
                    {newDataObject?.village}
                  </Text>
                </Box>
              </Stack>
            </Box>
          )}
        </View>
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
              console.log("Could not update data", { cause: error });
            } finally {
              setIsConfirmDataVisible(false);
            }
          }}
        />
      </ScrollView>
    </Overlay>
  );
};


export default ConfirmFarmlandData;
