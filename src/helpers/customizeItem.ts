/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { months } from "./dates";
import { getInitials } from "./getInitials";

import { realmContext } from "../models/realmContext";
import { useObject } from "@realm/react";
import { BSON } from "realm";
import { farmerTypes } from "../consts/farmerTypes";
import { resourceTypes } from "../consts/resourceTypes";
import { auditedArea } from "./auditedArea";
import { getCustomizedFarmlandBlocks } from "./getCustomizedFarmlandBlocks";
import { calculateFarmlandUsedArea } from "./calculateFarmlandUsedArea";
const { useRealm } = realmContext;

// get the long and lat proprieties from the point object
const getGeolocation = (point: any) => {
  return {
    latitude: point?.latitude,
    longitude: point?.longitude,
  };
};



export const customizeItem = (
  farmersList: any,
  farmlandsList: any,
  serviceProviders: any,
  customUserData: any,
  flag: any,
) => {
  let farmersIds = [];
  let groupsIds = [];
  let institutionsIds = [];

  return farmersList

    // @ts-expect-error TS(7030): Not all code paths return a value.
    ?.map((item: any, index: any) => {
      const farmlands = farmlandsList?.filter(
        (farmland: any) => farmland.farmerId === item._id,
      );
      const isServiceProvider = serviceProviders?.filter(
        (provider: any) => provider?.actorId === item?._id,
      );
      const { assets } = item;
      let newItem = {};

      if (flag === farmerTypes.farmer) {
        newItem = {
          ...newItem,
          _id: item?._id,
          image: item?.image ? item?.image : "htt://localhost/not-set-yet",
          imageAlt: getInitials(item?.names.surname),
          name: item?.names.otherNames + " " + item?.names.surname,
          assets: assets,
          isSprayingAgent: isServiceProvider.length > 0 ? true : false,
          phone:
            item?.contact.primaryPhone &&
              item?.contact.primaryPhone > 0 &&
              item?.contact.secondaryPhone &&
              item?.contact.secondaryPhone > 0
              ? `${item?.contact.primaryPhone}`
              : item?.contact.primaryPhone && item?.contact.primaryPhone
                ? `${item?.contact.primaryPhone}`
                : item?.contact.secondaryPhone && item?.contact.secondaryPhone
                  ? `${item?.contact.secondaryPhone}`
                  : "Nenhum",

          farmlands: farmlands?.length ? farmlands?.length : 0,
          farmlandsList: farmlands,
          sortingKey: item?.modifiedAt,
          createdAt: `${new Date(item?.createdAt).getDate()}/${new Date(item?.createdAt).getMonth() + 1
            }/${new Date(item?.createdAt).getFullYear()}`,
          modifiedAt: `${new Date(item?.modifiedAt).getDate()}/${new Date(item?.modifiedAt).getMonth() + 1
            }/${new Date(item?.modifiedAt).getFullYear()}`,
          modifiedBy: item?.modifiedBy,
          user:
            item?.userName === customUserData?.name ? "mim" : item?.userName,
          status: item?.status,
          checkedBy: item?.checkedBy,
          flag: flag,
        };
        return newItem;
      } else if (flag === farmerTypes.group) {
        newItem = {
          ...newItem,
          _id: item?._id,
          operationalStatus: item?.operationalStatus,
          image: item?.image ? item?.image : "htt://localhost/not-set-yet",
          imageAlt: getInitials(item?.name),
          name: item?.name,
          type: item?.type,
          assets: assets,
          creationYear: item?.creationYear,
          legalStatus: item?.legalStatus,
          affiliationYear: item?.affiliationYear,
          members: item?.numberOfMembers.total,
          farmlands: farmlands?.length ? farmlands?.length : 0,
          farmlandsList: farmlands,
          createdAt: `${new Date(item?.createdAt).getDate()}/${new Date(item?.createdAt).getMonth() + 1
            }/${new Date(item?.createdAt).getFullYear()}`,
          sortingKey: item?.modifiedAt,
          modifiedAt: `${new Date(item?.modifiedAt).getDate()}/${new Date(item?.modifiedAt).getMonth() + 1
            }/${new Date(item?.modifiedAt).getFullYear()}`,
          modifiedBy: item?.modifiedBy,
          user:
            item?.userName === customUserData?.name ? "mim" : item?.userName,
          status: item?.status,
          checkedBy: item?.checkedBy,
          flag: flag,
        };
        return newItem;
      } else if (flag === farmerTypes.institution) {
        newItem = {
          ...newItem,
          _id: item?._id,
          image: item?.image ? item?.image : "htt://localhost/not-set-yet",
          imageAlt: getInitials(item?.manager.fullname),
          name: item?.name,
          type: item?.type,
          isPrivate: item?.private,
          manager: item?.manager?.fullname,
          phone:
            item?.manager.phone && item?.manager.phone
              ? `${item?.manager.phone}`
              : "Nenhum",
          assets: assets,
          farmlands: farmlands?.length ? farmlands?.length : 0,
          farmlandsList: farmlands,
          createdAt: `${new Date(item?.createdAt).getDate()}/${new Date(item?.createdAt).getMonth() + 1
            }/${new Date(item?.createdAt).getFullYear()}`,
          sortingKey: item?.modifiedAt,
          modifiedAt: `${new Date(item?.modifiedAt).getDate()}/${new Date(item?.modifiedAt).getMonth() + 1
            }/${new Date(item?.modifiedAt).getFullYear()}`,
          modifiedBy: item?.modifiedBy,
          user:
            item?.userName === customUserData?.name ? "mim" : item?.userName,
          status: item?.status,
          checkedBy: item?.checkedBy,
          flag: flag,
        };
        return newItem;
      }
      else if (flag === resourceTypes.farmland) {
        // customize the Farmland resource proprieties
        newItem = {
          ...newItem,
          _id: item?._id,
          description: item?.description,
          consociatedCrops: (item?.consociatedCrops.length === 1 && item?.consociatedCrops[0] === "Nenhuma") ? "Nenhuma" : item?.consociatedCrops.join("; "),
          auditedArea: auditedArea(item),
          geolocation: item?.geolocation ? getGeolocation(item?.geolocation) : "Sem coordenadas",
          farmerId: item?.farmerId,
          ownerType: item?.ownerType,
          totalArea: item?.totalArea.toFixed(1),
          trees: item?.trees,
          usedArea: calculateFarmlandUsedArea(item),
          blocks: getCustomizedFarmlandBlocks(item),
          createdAt: `${new Date(item?.createdAt).getDate()}/${new Date(item?.createdAt).getMonth() + 1
            }/${new Date(item?.createdAt).getFullYear()}`,
          sortingKey: item?.modifiedAt,
          modifiedAt: `${new Date(item?.modifiedAt).getDate()}/${new Date(item?.modifiedAt).getMonth() + 1
            }/${new Date(item?.modifiedAt).getFullYear()}`,
          modifiedBy: item?.modifiedBy,
          user: item?.userName === customUserData?.name ? "mim" : item?.userName,
          status: item?.status,
          checkedBy: item?.checkedBy,
          flag: flag,
        };
        return newItem;
      }
    })
    .sort(
      (item1: any, item2: any) =>
        new Date(item2?.sortingKey).getTime() -
        new Date(item1?.sortingKey).getTime(),
    );
};
