
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Overlay, Icon, Button } from "@rneui/base";
import {
  Box,
  Center,
  CheckIcon,
  FormControl,
  Select,
  Stack,
} from "native-base";
import AwesomeAlert from "react-native-awesome-alerts";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import COLORS from "../../consts/colors";
import districts from "../../consts/districts";

import { secrets } from "../../secrets";
import { useUser } from "@realm/react";
import UserItem from "../UserItem/UserItem";
import { useFocusEffect } from "@react-navigation/native";
import { InteractionManager } from "react-native";
import { errorMessages } from "../../consts/errorMessages";
import GoalSetting from "../LottieComponents/GoalSetting";
import tailwind from "twrnc";
import { backgroundStyle } from "../../styles/globals";

export default function UserGoalEdit({
  isGoalUpdateVisible,
  setIsGoalUpdateVisible
}: any) {
  const user = useUser();
  const customUserData = user?.customData;
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState(customUserData?.userProvince);
  const [districtalUsers, setDistritalUsers] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  // ------------------------------------------
  const [alert, setAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [titleAlert, setTitleAlert] = useState("");
  const [cancelText, setCancelText] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showConfirmButton, setShowConfirmBttom] = useState(false);

  // ---------------------------------------------

  const [loadingActivitiyIndicator, setLoadingActivityIndicator] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setLoadingActivityIndicator(true);
      });
      return () => task.cancel();
    }, []),
  );

  const getUsersByDistrict = async (district: any) => {
    const mongo = user.mongoClient(secrets.serviceName);
    const collection = mongo
      .db(secrets.databaseName)
      .collection(secrets.userCollectionName);
    let users;
    try {
      users = await collection.find({ userDistrict: district });

      // @ts-expect-error TS(2345): Argument of type 'Document<any>[]' is not assignab... Remove this comment to see the full error message
      setDistritalUsers(users);
    } catch (error) {

      // @ts-expect-error TS(2571): Object is of type 'unknown'.
      if (error.includes(errorMessages.network.logFlag)) {
        // Alert message
        setTitleAlert(errorMessages.network.title);
        setMessageAlert(errorMessages.network.message);
        setShowCancelButton(errorMessages.network.showCancelButton);
        setShowConfirmBttom(errorMessages.network.showCancelButton);
        setConfirmText(errorMessages.network.confirmText);
        setCancelText(errorMessages.network.cancelText);
        setAlert(true);
      } else {
        // Alert message
        setTitleAlert(errorMessages.server.title);
        setMessageAlert(errorMessages.server.message);
        setShowCancelButton(errorMessages.server.showCancelButton);

        // @ts-expect-error TS(2339): Property 'service' does not exist on type '{ autom... Remove this comment to see the full error message
        setShowConfirmBttom(errorMessages.service.showConfirmButton);
        setConfirmText(errorMessages.server.confirmText);
        setCancelText(errorMessages.server.cancelText);
        setAlert(true);
      }
      return;
    }
    return users;
  };

  useEffect(() => {
    if (province) {

      // @ts-expect-error TS(2538): Type 'unknown' cannot be used as an index type.
      setSelectedDistricts(districts[province]);
    }
  }, [province]);

  const toggleOverlay = () => {
    setIsGoalUpdateVisible(!isGoalUpdateVisible);
  };

  return (
    <>
      <Overlay
        isVisible={isGoalUpdateVisible}
        onBackdropPress={toggleOverlay}
        overlayStyle={tailwind`${backgroundStyle} w-full min-h-full`}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          <Stack w="100%" py="4" direction="row">
            <Box>
              <Pressable
                onPress={() => {
                  setIsGoalUpdateVisible(false);
                }}
                className="absolute left-0 top-0 flex-row"
              >
                <Icon
                  name="arrow-back"
                  color={COLORS.grey}
                  size={wp("8%")}
                />
              </Pressable>

            </Box>
            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element; className: string; }' i... Remove this comment to see the full error message
              className="w-full justify-center items-center"
            >
              <Text
                className="text-center text-gray-600 font-bold text-lg"
              >
                {customUserData?.userProvince}
              </Text>
            </Box>
          </Stack>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: COLORS.main,
              fontFamily: "JosefinSans-Bold",
            }}
          ></Text>
          <Box

            // @ts-expect-error TS(2322): Type '{ children: Element; style: { width: string;... Remove this comment to see the full error message
            style={{
              width: "100%",
            }}
          >
            <Stack w="100%" direction="column" space={1}>
              {false && (
                <Box w="100%">
                  <FormControl isRequired my="3">
                    <FormControl.Label>Província</FormControl.Label>
                    <Select

                      // @ts-expect-error TS(2322): Type 'unknown' is not assignable to type 'string |... Remove this comment to see the full error message
                      selectedValue={province}
                      accessibilityLabel="Escolha província"
                      placeholder="Escolha província"
                      _selectedItem={{
                        bg: "teal.600",
                        fontSize: "lg",
                        endIcon: <CheckIcon size="5" />,
                      }}
                      dropdownCloseIcon={
                        province ? (
                          <Icon
                            name="close"
                            size={25}
                            color="grey"
                            onPress={() => {
                              setDistrict("");
                              setProvince("");
                            }}
                          />
                        ) : (
                          <Icon
                            size={25}
                            name="arrow-drop-down"
                            color="#005000"
                          />
                        )
                      }
                      mt={1}
                      onValueChange={(newProvince) => {
                        setDistrict("");
                        setProvince(newProvince);
                      }}
                    >
                      <Select.Item

                        // @ts-expect-error TS(2322): Type 'unknown' is not assignable to type 'string'.
                        label={customUserData?.userProvince}

                        // @ts-expect-error TS(2322): Type 'unknown' is not assignable to type 'string'.
                        value={customUserData?.userProvince}
                      />
                    </Select>
                  </FormControl>
                </Box>
              )}
              <Box w="100%">
                <FormControl isRequired my="3">
                  <FormControl.Label>Distrito</FormControl.Label>
                  <Select
                    selectedValue={district}

                    placeholder="Escolha distrito"
                    _selectedItem={{
                      bg: "teal.600",
                      fontSize: "lg",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    dropdownCloseIcon={
                      district ? (
                        <Icon
                          name="close"
                          size={25}
                          color="grey"
                          onPress={() => setDistrict("")}
                        />
                      ) : (
                        <Icon
                          size={25}
                          name="arrow-drop-down"
                          color="#005000"
                        />
                      )
                    }
                    mt={1}
                    onValueChange={async (newDistrict) => {
                      setDistrict(newDistrict);
                      await getUsersByDistrict(newDistrict);
                    }}
                  >
                    {selectedDistricts?.map((district, index) => (
                      <Select.Item
                        key={index}
                        label={district}
                        value={district}
                      />
                    ))}
                  </Select>
                  <FormControl.HelperText></FormControl.HelperText>
                </FormControl>
              </Box>
            </Stack>
          </Box>

          <Box

            // @ts-expect-error TS(2322): Type '{ children: (false | "" | Element)[]; style:... Remove this comment to see the full error message
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            {(!district || districtalUsers.length === 0) && (
              <GoalSetting />
            )}
            {!district && (
              <Text
                className="text-center font-normal text-sm text-gray-400"
              >
                Seleccionar distrito do usuário.
              </Text>
            )}

            {district && districtalUsers.length === 0 && (
              <View
                className="w-60"
              >
                <Text
                  className="text-center font-normal text-sm text-red-400"
                >
                  O distrito de {district} não tem usuários registados.
                </Text>
              </View>
            )}
            { }
          </Box>

          {district && districtalUsers.length > 0 && (
            <Box

              // @ts-expect-error TS(2322): Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
              className="flex flex-1 w-full"
            >
              <Stack


                // @ts-expect-error TS(2322): Type '{ children: Element[]; className: string; }'... Remove this comment to see the full error message
                className="w-full flex flex-row mb-2 bg-slate-400 rounded-t-md p-2 gap-1"
              >
                <Box
                  w="40%"

                  // @ts-expect-error TS(2322): Type '{ children: Element; w: "40%"; className: st... Remove this comment to see the full error message
                  className="justify-center"
                >
                  <Text
                    className="font-normal text-sm text-white"
                  >
                    Usuário
                  </Text>
                </Box>
                <Box w="20%">
                  <Text
                    className="font-normal text-sm text-white text-center"
                  >
                    Meta
                  </Text>
                  <Text
                    className="font-normal text-xs text-white text-center"
                  >
                    Produtores
                  </Text>
                </Box>
                <Box w="20%">
                  <Text
                    className="font-normal text-sm text-white text-center"
                  >
                    Meta
                  </Text>
                  <Text
                    className="font-normal text-xs text-white text-center"
                  >
                    Parcelas
                  </Text>
                </Box>

                <Box
                  w="20%"

                  // @ts-expect-error TS(2322): Type '{ children: Element; w: "20%"; style: { just... Remove this comment to see the full error message
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <Text
                    className="font-normal text-sm text-white text-center"
                  >
                    Acção
                  </Text>
                </Box>
              </Stack>
              <ScrollView>
                {districtalUsers?.map((userItem) => {

                  // @ts-expect-error TS(2339): Property 'userId' does not exist on type 'never'.
                  return <UserItem key={userItem.userId} userItem={userItem} />;
                })}
              </ScrollView>
            </Box>
          )}
        </View>
      </Overlay>
      <AwesomeAlert
        show={alert}
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
        confirmButtonColor={COLORS.main}
        onCancelPressed={() => {
          setAlert(false);
        }}
        onConfirmPressed={() => {
          setAlert(false);
        }}
      />
    </>
  );
}
