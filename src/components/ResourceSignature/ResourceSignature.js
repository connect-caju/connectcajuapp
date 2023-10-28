/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { View, Text } from "react-native";
import React from "react";
import { Box, Stack } from "native-base";
import COLORS from "../../consts/colors";
import { resourceValidation } from "../../consts/resourceValidation";

const ResourceSignature = ({ resource, customUserData }) => {
    return (
        <Box
        style={{
          marginTop: -10,
          backgroundColor: COLORS.verylightgrey,
        }}
      >
        <Stack direction="column" w="100%" style={{ paddingTop: 5 }}>
          <Box w="100%">
            <Text
              style={{
                textAlign: "right",
                color: COLORS.grey,
                fontFamily: "JosefinSans-Italic",
                fontSize: 12,
              }}
            >
              Registado por{" "}
              {resource?.userName === customUserData?.name
                ? "mim"
                : resource?.userName}{" "}
              aos {new Date(resource?.createdAt).getDate()}/
              {new Date(resource?.createdAt).getMonth() + 1}/
              {new Date(resource?.createdAt).getFullYear()}
            </Text>

            {resource?.modifiedBy && (
              <Box w="100%">
                <Text
                  style={{
                    textAlign: "right",
                    color: COLORS.grey,
                    fontFamily: "JosefinSans-Italic",
                    fontSize: 12,
                  }}
                >
                  Actualizado por{" "}
                  {resource?.modifiedBy === customUserData?.name
                    ? "mim"
                    : resource?.modifiedBy}{" "}
                  aos {new Date(resource?.modifiedAt).getDate()}/
                  {new Date(resource?.modifiedAt).getMonth() + 1}/
                  {new Date(resource?.modifiedAt).getFullYear()}
                </Text>
              </Box>
            )}
          </Box>
          {resource?.status === resourceValidation.status.invalidated && (
            <Box w="100%">
              <Text
                style={{
                  textAlign: "right",
                  color: COLORS.grey,
                  fontFamily: "JosefinSans-Italic",
                  fontSize: 12,
                }}
              >
                Indeferido por{" "}
                {resource?.checkedBy
                  ? resource?.checkedBy
                  : "ConnectCaju"}
              </Text>
            </Box>
          )}
          {resource?.status === resourceValidation.status.validated && (
            <Box w="100%">
              <Text
                style={{
                  textAlign: "right",
                  color: COLORS.grey,
                  fontFamily: "JosefinSans-Italic",
                  fontSize: 12,
                }}
              >
                Deferido por {resource?.checkedBy}
              </Text>
            </Box>
          )}
        </Stack>
      </Box>
    );
};

export default ResourceSignature;
