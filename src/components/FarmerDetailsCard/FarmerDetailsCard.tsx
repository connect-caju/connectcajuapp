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
import COLORS from "../../consts/colors";
import { roles } from "../../consts/roles";
import { resourceValidation } from "../../consts/resourceValidation";
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
  onPressEllipsis
}: any) {
  const [alert, setAlert] = useState(false);

  return (
    <Animated.View
      className="bg-neutral-50 dark:bg-gray-800 p-2 my-2 shadow-sm"
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
        className="flex flex-row gap-2 justify-between items-center flex-wrap"
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
            className="text-sm text-gray-500 font-light"
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
                    className="text-sm text-gray-500 font-light"
                  >
                    {farmer?.contact?.primaryPhone}
                  </Text>
                  <Text
                    className="text-sm text-gray-500 font-light"
                  >
                    {farmer?.contact?.secondaryPhone}
                  </Text>
                </>
              )}
            {farmer?.contact?.primaryPhone !== 0 &&
              farmer?.contact?.secondaryPhone === 0 && (
                <Text
                  className="text-sm text-gray-500 font-light"
                >
                  {farmer?.contact?.primaryPhone}
                </Text>
              )}

            {farmer?.contact?.primaryPhone === 0 &&
              farmer?.contact?.secondaryPhone !== 0 && (
                <Text
                  className="text-sm text-gray-500 font-light"
                >
                  {farmer?.contact?.secondaryPhone}
                </Text>
              )}

            {farmer?.contact?.primaryPhone === 0 &&
              farmer?.contact?.secondaryPhone === 0 && (
                <Text
                  className="text-lg text-gray-500 font-light"
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
            className="text-sm text-gray-500 font-light"
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

    </Animated.View>
  );
}
