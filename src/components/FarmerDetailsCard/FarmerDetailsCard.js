/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import {
  faBirthdayCake,
  faEllipsisVertical,
  faHome,
  faIdCard,
  faLocation,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Icon } from "@rneui/base";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import CustomDivider from "../Divider/CustomDivider";
import COLORS from "../../consts/colors";
import { bottomSheetFlags } from "../../consts/bottomSheetFlags";
import { calculateAge } from "../../helpers/dates";
import { roles } from "../../consts/roles";
import { resourceValidation } from "../../consts/resourceValidation";
import ValidationOptions from "../ValidationOptions/ValidationOptions";
import { resourceTypes } from "../../consts/resourceTypes";
import { useState } from "react";
import InvalidationMessage from "../InvalidationMessage/InvalidationMessage";
import ResourceSignature from "../ResourceSignature/ResourceSignature";
import ResourceStatusIcon from "../ResourceStatusIcon/ResourceStatusIcon";

export default function FarmerDetailsCard({
  handlePresentModalPress,
  farmer,
  customUserData,
  realm,
  onPressEllipsis,
}) {
  const [alert, setAlert] = useState(false);

  return (
    <Animated.View
      className="bg-white p-2 my-2 shadow-sm shadow-slate-100"
    >
      {/* Resource Status Icon (Validated, Invalidated, Pendind) */}
      <View
        style={{
          width: 80,
          position: "absolute",
          top: -37,
          right: 10,
          alignSelf: "flex-end",
        }}
      >
        <ResourceStatusIcon
          resource={farmer}
        />
      </View>
      {/* ellipsis option */}
      {roles.haveReadAndWritePermissions.some(role => role === customUserData?.role)
        && <TouchableOpacity
          disabled={farmer?.status === resourceValidation.status.validated}
          style={{
            alignSelf: "flex-end",
          }}
          onPress={handlePresentModalPress}
        >
          <View>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              size={20}
              color={farmer?.status === resourceValidation.status.validated ? COLORS.grey : COLORS.grey}
            />
          </View>
        </TouchableOpacity>}

      <View
        className="flex flex-row gap-2 justify-between items-center mb-4"
      >
        <View
          className="flex flex-col items-center justify-center gap-1"
        >
          <FontAwesomeIcon
            icon={faHome}
            size={20}
            color={COLORS.grey}
          />
          <Text
            className="text-sm text-gray-400 font-normal"
          >
            {farmer?.address?.district
              ? farmer?.address?.adminPost
              : "NA"}{"; "}
            {farmer?.address?.adminPost
              ? farmer?.address?.village
              : "NA"}
          </Text>
        </View>
        <View
          className="flex flex-col items-center justify-center gap-1"
        >
          <FontAwesomeIcon
            style={
              {
                // alignSelf: 'center',
              }
            }
            icon={faPhone}
            size={20}
            color={COLORS.grey}
          />
          <View>
            {farmer?.contact?.primaryPhone !== 0 &&
              farmer?.contact?.secondaryPhone !== 0 && (
                <>
                  <Text
                    className="text-sm text-gray-400 font-normal"
                  >
                    {farmer?.contact?.primaryPhone}
                  </Text>
                  <Text
                    className="text-sm text-gray-400 font-normal"
                  >
                    {farmer?.contact?.secondaryPhone}
                  </Text>
                </>
              )}
            {farmer?.contact?.primaryPhone !== 0 &&
              farmer?.contact?.secondaryPhone === 0 && (
                <Text
                  className="text-sm text-gray-400 font-normal"
                >
                  {farmer?.contact?.primaryPhone}
                </Text>
              )}

            {farmer?.contact?.primaryPhone === 0 &&
              farmer?.contact?.secondaryPhone !== 0 && (
                <Text
                  className="text-sm text-gray-400 font-normal"
                >
                  {farmer?.contact?.secondaryPhone}
                </Text>
              )}

            {farmer?.contact?.primaryPhone === 0 &&
              farmer?.contact?.secondaryPhone === 0 && (
                <Text
                  className="text-lg text-gray-400 font-normal"
                >
                  ?
                </Text>
              )}
          </View>
        </View>
        <View
          className="flex flex-col items-center justify-center gap-1"
        >
          <View
            style={{
              // width: "30%",
            }}
          >
            <Icon name="location-pin" size={25} color={COLORS.grey} />
          </View>
          <Text
            className="text-sm text-gray-400 font-normal"
          >
            Long:
            {farmer?.geolocation?.longitude
              ? " ☑ "
              : "?"}{" | "}
            Lat:
            {farmer?.geolocation?.latitude
              ? " ☑ "
              : "?"}
          </Text>
        </View>
      </View>



      {/* <CustomDivider thickness={2} color={COLORS.lightgrey} />

      <View
        style={{
          padding: 8,
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "50%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  style={{}}
                  icon={faIdCard}
                  size={20}
                  color={COLORS.grey}
                />
              </View>

              <View
                style={{
                  width: "70%",
                }}
              >
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  BI:{" "}
                  {farmer?.idDocument?.docNumber !== "Nenhum"
                    ? farmer?.idDocument?.docNumber
                    : "Nenhum"}{" "}
                  {farmer?.idDocument?.docType !== "Não tem" &&
                    `(${farmer?.idDocument?.docType})`}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  NUIT:{" "}
                  {farmer?.idDocument?.nuit !== 0
                    ? farmer?.idDocument?.nuit
                    : "Nenhum"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View> */}





      {/* <CustomDivider thickness={2} color={COLORS.lightgrey} /> */}

      {/* Resource signature (registered by, approved by, rejected by, modified by) */}
      <ResourceSignature
        resource={farmer}
        customUserData={customUserData}
      />

      {/* type and send messages (motives) of invalidation */}
      {farmer?.status === resourceValidation.status.invalidated &&
        (
          <InvalidationMessage
            resource={farmer}
            resourceType={resourceTypes.actor}
          />
        )}

      {/* Validation options: to validate or invalidate resource  */}
      {/* {roles.haveReadAndValidatePermissions.some(role => role === customUserData?.role) &&
        farmer?.status === resourceValidation.status.pending && (
          <ValidationOptions
            resource={farmer}
            resourceType={resourceTypes.actor}
            customUserData={customUserData}
            realm={realm}
            alert={alert}
            setAlert={setAlert}
          />
        )} */}



    </Animated.View>
  );
}
