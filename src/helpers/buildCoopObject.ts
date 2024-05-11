import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { capitalize } from "./capitalize";
import { generateUniqueNumber } from "./generateUniqueNumber";
import { farmerTypes } from "../consts/farmerTypes";
import { CoopFormDataTypes, UserDetails } from "../lib/types";

export const buildCoopObject = (
  coopData: CoopFormDataTypes,
  userDetails: UserDetails,
) => {
  const { isActive, type, name, creationYear, affiliationYear, legalStatus,  address, nuit, nuel, licence, purposes, numberOfMembers, } =
  coopData;

  let assets = purposes?.map((asset) => {
    return {
      category: categories.group.category,
      subcategory: asset,
      assetType: assetTypes.cashew,
    };
  });

  let identifier = generateUniqueNumber(
    userDetails.userDistrict!,
    farmerTypes.group!,
  );

  const builtCoopData = {
    _id: uuidv4(),
    type,
    name: capitalize(name.trim()),
    identifier,
    creationYear: Number(creationYear),
    affiliationYear: affiliationYear ?? Number(affiliationYear),
    legalStatus,
    operationalStatus: isActive === "Sim" ? true : false,
    address: {
      province: userDetails.userDistrict,
      district: userDetails.userDistrict,
      adminPost: address.adminPost,
      village: address.village,
    },
    numberOfMembers: {
      ...numberOfMembers,
      total: Number(numberOfMembers.total),
      women: Number(numberOfMembers.women)
    },
    assets,
    nuit: nuit ? Number(nuit) : 0,
    licence: licence?.trim(),
    nuel: nuel ? Number(nuel) : 0,

    userDistrict: userDetails?.userDistrict,
    userProvince: userDetails?.userProvince,
    userId: userDetails.userId,
    userName: userDetails?.userName,
  };

  return builtCoopData;
};
