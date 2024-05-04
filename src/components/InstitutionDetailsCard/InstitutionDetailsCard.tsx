
import {
  faEllipsisVertical,
  faHome,
  faIdCard,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Icon } from "@rneui/base";
import { Stack, Box, Center } from "native-base";

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import CustomDivider from "../Divider/CustomDivider";
import COLORS from "../../consts/colors";
import { roles } from "../../consts/roles";
import { resourceValidation } from "../../consts/resourceValidation";
import { resourceTypes } from "../../consts/resourceTypes";
import { useState } from "react";
import ResourceSignature from "../ResourceSignature/ResourceSignature";
import InvalidationMessage from "../InvalidationMessage/InvalidationMessage";
import ResourceStatusIcon from "../ResourceStatusIcon/ResourceStatusIcon";

export default function InstitutionDetailsCard({
  handlePresentModalPress,
  farmer,
  customUserData,
  realm,
  onPressEllipsis
}: any) {
  const [alert, setAlert] = useState(false);

  return (
    <Animated.View
      className="bg-neutral-50 dark:bg-gray-800 p-2 my-2 shadow-sm shadow-slate-100"
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

      <Stack
        w="100%"
        direction={"row"}

        // @ts-expect-error TS(2322): Type '{ children: Element[]; w: "100%"; direction:... Remove this comment to see the full error message
        style={{
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            width: "5%",
          }}
        ></View>
        <View
          style={{
            width: "85%",
            justifyContent: "center",
          }}
        >
          <Text
            className="text-gray-600 font-semibold text-lg"
          >
            {farmer?.manager?.fullname}
          </Text>

          <Text
            className="text-xs font-light text-gray-500"
          >
            (Responsável)
          </Text>
        </View>
        <View
          style={{
            width: "10%",
            justifiyContent: "center",
            alignItems: "center",
          }}
        >
          {roles.haveReadAndWritePermissions.some(role => role === customUserData?.role)
            && <TouchableOpacity
              disabled={farmer?.status === resourceValidation.status.validated}
              style={{}}
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
        </View>
      </Stack>
      <CustomDivider thickness={1} color={COLORS.lightgrey} />
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
                <FontAwesomeIcon icon={faHome} size={20} color={COLORS.grey} />
              </View>

              <View
                style={{
                  width: "70%",
                }}
              >
                <Text
                  className="font-light text-xs text-gray-500 -mb-1"
                >
                  {farmer?.address?.district
                    ? farmer?.address?.adminPost
                    : "Não Aplicável"}
                </Text>
                <Text
                  className="font-light text-xs text-gray-500"
                >
                  {farmer?.address?.adminPost
                    ? farmer?.address?.village
                    : "Não Aplicável"}
                </Text>
              </View>
            </View>
          </View>

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
                // alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: "30%",
                }}
              >
                <FontAwesomeIcon icon={faPhone} size={20} color={COLORS.grey} />
              </View>

              <View
                style={{
                  width: "70%",
                  justifyContent: "center",
                }}
              >
                {(!farmer?.manager?.phone || farmer?.manager?.phone === 0) && (
                  <Text
                    className="font-light text-xs text-gray-500"
                  >
                    Nenhum
                  </Text>
                )}
                {(farmer?.manager?.phone || farmer?.manager?.phone !== 0) && (
                  <Text
                    className="font-light text-xs text-gray-500"
                  >
                    {farmer?.manager?.phone}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      <CustomDivider thickness={1} color={COLORS.lightgrey} />

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
            justifyContent: "center",
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
                  icon={faIdCard}
                  size={20}
                  color={COLORS.grey}
                />
              </View>

              <View
                style={{
                  width: "70%",
                  justifyContent: "center",
                }}
              >
                <Text
                  className="font-light text-xs text-gray-500"
                >
                  NUIT:{" "}
                  {farmer?.nuit && farmer?.nuit !== 0 ? farmer?.nuit : "Nenhum"}
                </Text>
                <Text
                  className="font-light text-xs text-gray-500"
                >
                  Alvará/Licença:{" "}
                  {farmer?.licence && farmer?.licence !== ""
                    ? farmer?.licence
                    : "Nenhum"}
                </Text>
              </View>
            </View>
          </View>

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
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="location-pin" size={25} color={COLORS.grey} />
              </View>

              <View
                style={{
                  width: "70%",
                  justifyContent: "center",
                }}
              >
                <Text
                  className="font-light text-xs text-gray-500"
                >
                  Long:{" "}
                  {farmer?.geolocation?.longitude
                    ? farmer?.geolocation?.longitude
                    : "Nenhuma"}
                </Text>
                <Text
                  className="font-light text-xs text-gray-500"
                >
                  Lat:{" "}
                  {farmer?.geolocation?.latitude
                    ? farmer?.geolocation?.latitude
                    : "Nenhuma"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <CustomDivider thickness={1} color={COLORS.lightgrey} />

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
            resourceType={resourceTypes.institution}
          />
        )}

    </Animated.View>
  );
}
