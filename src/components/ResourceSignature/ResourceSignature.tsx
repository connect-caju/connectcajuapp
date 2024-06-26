import { View, Text } from "react-native";
import React from "react";
import { Box, Stack } from "native-base";
import { resourceValidation } from "../../consts/resourceValidation";

const ResourceSignature = ({
  resource,
  customUserData
}: any) => {
  return (
    <Box

      // @ts-expect-error TS(2322): Type '{ children: any[]; className: string; }' is ... Remove this comment to see the full error message
      className="mt-2 flex self-end"
    >
      <Text
        className="-mb-1 text-xs text-gray-500 italic text-right font-light"
      >
        Registado por{" "}
        {
          resource?.user && (
            resource.user === customUserData?.name ? "mim" : resource.user
          )
        }
        {resource?.userName && (
          resource?.userName === customUserData?.name ? "mim" : resource?.userName
        )
        }
        {" "}
        aos {
          resource?.user && resource.createdAt
        }
        {
          resource?.userName && (
            `${new Date(resource?.createdAt).getDate()}/${new Date(resource?.createdAt).getMonth() + 1}/${new Date(resource?.createdAt).getFullYear()}`
          )
        }
      </Text>

      {resource?.modifiedBy && (
        <Text
          className="-mb-1 text-xs text-gray-500 italic text-right font-light"
        >
          Actualizado por{" "}
          {resource?.modifiedBy === customUserData?.name
            ? "mim"
            : resource?.modifiedBy}{" "}
          aos {
            resource?.user && resource?.modifiedAt
          }
          {
            resource?.userName && (
              `${new Date(resource?.modifiedAt).getDate()}/${new Date(resource?.modifiedAt).getMonth() + 1}/${new Date(resource?.modifiedAt).getFullYear()}`
            )
          }
        </Text>
      )}
      {resource?.status === resourceValidation.status.invalidated && (
        <Text
          className="-mb-1 text-xs text-gray-500 italic text-right font-light"
        >
          Indeferido por{" "}
          {resource?.checkedBy
            ? resource?.checkedBy
            : "ConnectCaju"}
        </Text>
      )}
      {resource?.status === resourceValidation.status.validated && (
        <Text
          className="-mb-1 text-xs text-gray-500 italic text-right font-light"
        >
          Deferido por {resource?.checkedBy}
        </Text>
      )}
    </Box>
  );
};

export default ResourceSignature;
