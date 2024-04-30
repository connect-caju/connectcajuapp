import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { groupAffiliationStatus } from "../consts/groupAffiliationStatus";
import { capitalize } from "./capitalize";
import { containsNonNumeric } from "./containsNonNumeric";

const validateGroupFarmerData = (
  {
    isGroupActive,
    isGroupInactive,
    groupType,
    groupName,
    groupGoals,
    groupMembersNumber,
    groupWomenNumber,
    groupLegalStatus,
    groupCreationYear,
    groupAffiliationYear,
    groupOperatingLicence,
    groupNuel,
    groupNuit,
    groupAdminPost,
    groupVillage,
    groupProvince,

    // groupManagerName,
    // groupManagerPhone,
    groupDistrict
  }: any,
  errors: any,
  setErrors: any,
) => {
  const retrievedIsGroupActive = isGroupActive;
  const retrievedIsGroupInactive = isGroupInactive;
  const retrievedGroupType = groupType?.trim();
  const retrievedGroupName = capitalize(groupName?.trim());
  const retrievedGroupGoals = groupGoals;
  const retrievedGroupMembersNumber = parseInt(groupMembersNumber);
  const retrievedGroupWomenNumber = parseInt(groupWomenNumber);
  const retrievedGroupLegalStatus = groupLegalStatus?.trim();
  const retrievedGroupCreationYear = parseInt(groupCreationYear);
  const retrievedGroupAffiliationYear = parseInt(groupAffiliationYear);
  const retrievedGroupOperatingLicence = groupOperatingLicence?.trim();
  const retrievedGroupNuit = parseInt(groupNuit);
  const retrievedGroupNuel = parseInt(groupNuel);
  const retrievedGroupProvince = groupProvince?.trim();
  const retrievedGroupDistrict = groupDistrict?.trim();
  const retrievedGroupAdminPost = groupAdminPost?.trim();
  const retrievedGroupVillage = groupVillage?.trim();
  // const retrievedGroupManagerName = capitalize(groupManagerName.trim());
  // const retrievedGroupManagerPhone = Number(parseInt(groupManagerPhone)) ? Number(parseInt(groupManagerPhone)) : 0;

  //  normalize asset array
  // const normalizeAssets = (assets)=>{
  let normalizedAssets = retrievedGroupGoals?.map((asset: any) => {
    return {
      category: categories.group.category,
      subcategory: asset,
      assetType: assetTypes.cashew,
    };
  });
  // console.log('assets: ', assets)
  // if (assets?.lenght > 0) {

  //     return normalizedAssets;
  // }
  // }

  // console.log('assets: ', normalizeAssets(retrievedGroupGoals))

  if (
    (!retrievedIsGroupActive && !retrievedIsGroupInactive) ||
    (retrievedIsGroupActive && retrievedIsGroupInactive)
  ) {
    setErrors({
      ...errors,
      isGroupActive: "Escolha um estado de funcionamento",
    });
    return false;
  }

  if (!retrievedGroupType) {
    setErrors({ ...errors, groupType: "Indica tipo de grupo." });
    return false;
  }

  if (!retrievedGroupName) {
    setErrors({ ...errors, groupName: "Indica nome de grupo." });
    return false;
  }

  if (!retrievedGroupMembersNumber && retrievedGroupMembersNumber !== 0) {
    setErrors({ ...errors, groupMembersNumber: "Número total de membros." });
    return false;
  }

  if (!retrievedGroupWomenNumber && retrievedGroupWomenNumber !== 0) {
    setErrors({ ...errors, groupWomenNumber: "Número total de mulheres." });
    return false;
  } else if (

    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    parseInt(retrievedGroupWomenNumber) > parseInt(retrievedGroupMembersNumber)
  ) {
    setErrors({
      ...errors,
      groupWomenNumber: "Número de mulheres superior ao total.",
    });
    return false;
  }

  if (retrievedGroupGoals?.length === 0) {
    setErrors({
      ...errors,
      groupGoals: "Indica a finalidade do grupo.",
    });
    return false;
  }

  if (!retrievedGroupLegalStatus) {
    setErrors({
      ...errors,
      groupLegalStatus: "Indica a situação Legal",
    });
    return false;
  }

  if (!retrievedGroupCreationYear) {
    setErrors({ ...errors, groupCreationYear: "Indica ano de criação." });
    return false;
  }

  if (retrievedGroupLegalStatus === groupAffiliationStatus.affiliated) {
    if (!retrievedGroupAffiliationYear) {
      setErrors({
        ...errors,
        groupAffiliationYear: "Indica ano de legalização.",
      });

      return false;
    }

    if (retrievedGroupCreationYear > retrievedGroupAffiliationYear) {
      setErrors({
        ...errors,
        groupCreationYear: "Ano de criação posterior ao ano de legalização",
        // groupAffiYear: 'Ano de criação superior a ano de legalização'
      });

      return false;
    }

    if (!retrievedGroupOperatingLicence) {
      setErrors({
        ...errors,
        groupOperatingLicence: "Indica o alvará.",
      });
      return false;
    }

    if (!retrievedGroupNuit) {
      setErrors({
        ...errors,
        groupNuit: "Indica o NUIT.",
      });
      return false;
    }

    if (!retrievedGroupNuel) {
      setErrors({
        ...errors,
        groupNuel: "Indica o NUEL.",
      });
      return false;
    }
  }

  if (
    retrievedGroupNuit &&

    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    (!Number.isInteger(parseInt(retrievedGroupNuit)) ||
      retrievedGroupNuit?.toString().length !== 9 ||
      containsNonNumeric(retrievedGroupNuit))
  ) {
    setErrors({ ...errors, groupNuit: "NUIT inválido." });
    return false;
  }

  if (
    retrievedGroupNuel &&

    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    (!Number.isInteger(parseInt(retrievedGroupNuel)) ||
      retrievedGroupNuel?.toString().length !== 9 ||
      containsNonNumeric(retrievedGroupNuel))
  ) {
    setErrors({ ...errors, groupNuel: "NUEL inválido." });
    return false;
  }

  if (!retrievedGroupAdminPost) {
    setErrors({ ...errors, groupAdminPost: "Indica Posto Administrativo." });
    return false;
  }

  const farmerData = {
    operationalStatus: isGroupActive ? true : false,
    type: retrievedGroupType,
    name: retrievedGroupName,
    address: {
      province: retrievedGroupProvince,
      district: retrievedGroupDistrict,
      adminPost: retrievedGroupAdminPost,
      village: retrievedGroupVillage,
    },
    assets: normalizedAssets,
    legalStatus: retrievedGroupLegalStatus,
    creationYear: retrievedGroupCreationYear,
    affiliationYear: retrievedGroupAffiliationYear

      // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      ? parseInt(retrievedGroupAffiliationYear)
      : 0,
    numberOfMembers: {
      total: retrievedGroupMembersNumber

        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        ? parseInt(retrievedGroupMembersNumber)
        : 0,
      women: retrievedGroupWomenNumber

        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        ? parseInt(retrievedGroupWomenNumber)
        : 0,
    },

    licence: retrievedGroupOperatingLicence,

    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    nuel: retrievedGroupNuel ? parseInt(retrievedGroupNuel) : 0,

    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    nuit: retrievedGroupNuit ? parseInt(retrievedGroupNuit) : 0,
  };
  return farmerData;
};

export default validateGroupFarmerData;
