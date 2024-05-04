import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform  } from "react-native";
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
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import COLORS from "../../consts/colors";
import districts from "../../consts/districts";

import { secrets } from "../../secrets";
import { useUser } from "@realm/react";
// import UserItem from "../UserItem/UserItem";
import { useFocusEffect } from "@react-navigation/native";
import { InteractionManager } from "react-native";
import { errorMessages } from "../../consts/errorMessages";
// import GoalSetting from "../LottieComponents/GoalSetting";
import tailwind from "twrnc";
import { backgroundStyle } from "../../styles/globals";

export default function UserRecordsScreen() {
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




  return (
    <View>
      {
        !districtalUsers && <Text>Loading</Text>
      }
      {districtalUsers &&
        Array(20).fill(districtalUsers[0]).flat().map((item, index)=>(
          <View>
            <Text>{item.name}</Text>
            </View>
        ))
      }
    </View>
  )
}