/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import {
  faEllipsisVertical,
  faHome,
  faIdCard,
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
import ValidationOptions from "../ValidationOptions/ValidationOptions";
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
  onPressEllipsis,
}) {
  const [alert, setAlert] = useState(false);

  return (
    <Animated.View
      // entering={BounceIn.duration(1000)}
      // style={{
      //   width: "100%",
      //   borderRadius: 15,
      //   padding: 8,
      //   borderColor: COLORS.dark,
      //   backgroundColor: COLORS.ghostwhite,
      //   marginVertical: 10,
      //   elevation: 3,
      //   opacity: 1,
      // }}
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

      <Stack
        w="100%"
        direction={"row"}
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
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontFamily: "JosefinSans-Bold",
              alignItems: "baseline",
            }}
          >
            {farmer?.manager?.fullname}
          </Text>

          <Text
            style={{
              color: COLORS.grey,
              fontSize: 12,
              fontFamily: "JosefinSans-Regular",
              alignItems: "baseline",
            }}
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
              <View
                style={{
                  padding: 6,
                  borderRadius: 100,
                  backgroundColor: COLORS.lightgrey,
                }}
              >
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  size={20}
                  color={farmer?.status === resourceValidation.status.validated ? COLORS.grey : COLORS.black}
                />
              </View>
            </TouchableOpacity>}
        </View>
      </Stack>
      <CustomDivider thickness={2} color={COLORS.lightgrey} />
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
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  {farmer?.address?.district
                    ? farmer?.address?.adminPost
                    : "Não Aplicável"}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
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
                <Icon name="phone-in-talk" size={25} color={COLORS.grey} />
              </View>

              <View
                style={{
                  width: "70%",
                  justifyContent: "center",
                }}
              >
                {(!farmer?.manager?.phone || farmer?.manager?.phone === 0) && (
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 13,
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    Nenhum
                  </Text>
                )}
                {(farmer?.manager?.phone || farmer?.manager?.phone !== 0) && (
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 13,
                      // paddingLeft: 10,
                      fontFamily: "JosefinSans-Regular",
                    }}
                  >
                    {farmer?.manager?.phone}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      <CustomDivider thickness={2} color={COLORS.lightgrey} />

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
                  style={
                    {
                      // alignSelf: 'center',
                    }
                  }
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
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  NUIT:{" "}
                  {farmer?.nuit && farmer?.nuit !== 0 ? farmer?.nuit : "Nenhum"}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 13,
                    fontFamily: "JosefinSans-Regular",
                  }}
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
                  style={{
                    color: "grey",
                    fontSize: 12,
                    fontFamily: "JosefinSans-Regular",
                  }}
                >
                  Long:{" "}
                  {farmer?.geolocation?.longitude
                    ? farmer?.geolocation?.longitude
                    : "Nenhuma"}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 12,
                    fontFamily: "JosefinSans-Regular",
                  }}
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

      <CustomDivider thickness={2} color={COLORS.lightgrey} />

      {/* Resource signature (registered by, approved by, rejected by, modified by) */}
      <ResourceSignature
        resource={farmer}
        customUserData={customUserData}
      />

      {/* type and send messages (motives) of invalidation */}
      {farmer?.status === resourceValidation.status.invalidated &&
        // roles.haveReadAndValidatePermissions.some(role => role === customUserData?.role) && 
        (
          <InvalidationMessage
            resource={farmer}
            resourceType={resourceTypes.institution}
          />
        )}

      {/* {roles.haveReadAndValidatePermissions.some(role => role === customUserData?.role) &&
        farmer?.status === resourceValidation.status.pending && (
          <ValidationOptions
            resource={farmer}
            resourceType={resourceTypes.institution}
            customUserData={customUserData}
            realm={realm}
            alert={alert}
            setAlert={setAlert}
          />
        )} */}
    </Animated.View>
  );
}
