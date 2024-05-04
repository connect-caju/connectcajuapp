import { ActorFormData, ErrorType, useActorStore } from "../app/stores/actorStore";
import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { capitalize } from "./capitalize";
import { containsNonNumeric } from "./containsNonNumeric";
import { dateLimits } from "./dates";
import { genders } from "./gender";
/**
 *
 * @param {*} farmerData
 * @param {*} errors
 * @param {*} setErrors
 * @returns false if invalid data found, farmerdata if no invalid data found
 *
 * This function sanitizes, and validates all the farmer data before they
 * are persisted.
 * Invalid data trigger errorMessages to the respective input component
 * in the form.
 */


// const updateActorField = useActorStore.getState().updateActorField

export const validateActorForm = (actorData: ActorFormData) => {

  const {
    isNotSprayingAgent,
    isSprayingAgent,
    isGroupMember,
    isNotGroupMember,
    surname,
    otherNames,
    gender,
    familySize,
    birthDate,
    birthVillage,
    birthAdminPost,
    birthDistrict,
    birthProvince,
    addressVillage,
    addressAdminPost,
    addressDistrict,
    addressProvince,
    primaryPhone,
    secondaryPhone,
    docNumber,
    docType,
    nuit,
  } = actorData;

  let errors: ErrorType = {};

  if (
    (!Boolean(isSprayingAgent) && !Boolean(isNotSprayingAgent)) ||
    (Boolean(isSprayingAgent) && Boolean(isNotSprayingAgent))
  ) {
    errors["isSprayingAgent"] = "Indica uma opção";
  }

  if (
    (!Boolean(isGroupMember) && !Boolean(isNotGroupMember)) ||
    (Boolean(isGroupMember) && Boolean(isNotGroupMember))
  ) {
    errors["isGroupMember"] = "Indica uma opção";
  }

  if (!gender || !genders.some((g) => g === gender)) {
    errors["gender"] = "Indica o género";
  }

  if (
    !familySize ||
    Number(parseInt(familySize)) === 0 ||
    Number(parseInt(familySize)) > 30
  ) {
    errors["familySize"] = "Indica um agregado válido";
  }

  if (!capitalize(surname.trim())) {
    errors["surname"] = "Indica o apelido";
  } else if (surname?.split(" ").length > 1) {
    errors["surname"] = "Indica apenas 1 nome como apelido";
  }

  if (!capitalize(otherNames.trim())) {
    errors["otherNames"] = "Indica Outros nomes";
  }

  if (
    !birthDate ||
    new Date(birthDate).getFullYear() >= (new Date().getFullYear() - 14) ||
    new Date(birthDate).getFullYear() < (new Date().getFullYear() - 90)
  ) {
    errors["birthDate"] = "Indica uma data válida";
  }

  if (primaryPhone && primaryPhone.length > 0) {
    if (
      (Number(parseInt(primaryPhone)) !== 0 && primaryPhone.length !== 9) ||
      ![2, 3, 4, 5, 6, 7].some((digit) => String(digit) === primaryPhone[1]) ||
      primaryPhone[0] !== String(8)
    ) {
      errors["primaryPhone"] = "Número de telefone inválido";
    }
  }


  if (secondaryPhone && secondaryPhone.length > 0) {
    if (
      (Number(parseInt(secondaryPhone)) !== 0 && secondaryPhone.length !== 9) ||
      ![2, 3, 4, 5, 6, 7].some(
        (digit) => String(digit) === secondaryPhone[1],
      ) ||
      secondaryPhone[0] !== String(8)
    ) {
      errors["secondaryPhone"] = "Número de telefone inválido";
    }
  }

  if (primaryPhone && primaryPhone.length > 0 && (primaryPhone === secondaryPhone && primaryPhone !== String(0))) {
    errors["primaryPhone"] = "Número igual ao alternativo";
    errors["secondaryPhone"] = "Número igual ao principal";
  }

  if (!addressProvince) {
    errors["addressProvince"] = "Indica a Província de residencia";
  }

  let asset = {
    category: categories.farmer.category,
    subcategory: categories.farmer.subcategories.notSubcategorized,
    assetType: assetTypes.farmland,
  };

  if (!addressAdminPost) {
    errors["addressAdminPost"] = "Indica o Posto Administrativo de origem";
  }

  if (!birthDistrict && !birthProvince?.includes("Cidade")) {
    const errorMessage =
      birthProvince === "País Estrangeiro"
        ? "Indica país onde nasceu."
        : "Indica distrito onde nasceu.";

    errors["birthProvince"] = errorMessage;
  }

  if (
    !birthAdminPost &&
    birthProvince !== "País Estrangeiro" &&
    !birthDistrict?.includes("Cidade") &&
    birthProvince !== "Maputo" &&
    !birthProvince?.includes("Cidade")
  ) {
    errors["birthAdminPost"] = "Indica o Posto Administrativo";
  }

  if (docNumber && !docType) {
    errors["docType"] = "Indica o tipo de documento";
  } else if (!docNumber && docType !== "Não tem") {
    errors["docType"] = "Indica o número de documento";
  }

  if (
    nuit &&
    (!Number.isInteger(parseInt(nuit)) ||
      nuit?.toString().length !== 9 ||
      containsNonNumeric(nuit))
  ) {
    errors["nuit"] = "Indica o NUIT";
  }

  return {
    isValid: Object.keys(errors).length > 0 ? false : true,
    errorMessages: errors,
  }

  //   const farmerData = {
  //     names: {
  //       surname: retrievedSurname,
  //       otherNames: retrievedOtherNames,
  //     },
  //     isSprayingAgent: retrievedIsSprayingAgent,
  //     assets: [asset],
  //     gender: retrievedGender,
  //     familySize: retrievedFamilySize ? parseInt(retrievedFamilySize) : 0,
  //     birthDate: retrievedBirthDate,
  //     birthPlace: {
  //       province: retrievedBirthProvince,
  //       district: retrievedBirthDistrict,
  //       adminPost: retrievedBirthAdminPost,
  //       // village: retrievedBirthVillage,
  //     },
  //     address: {
  //       province: retrievedAddressProvince,
  //       district: retrievedAddressDistrict,
  //       adminPost: retrievedAddressAdminPost,
  //       village: retrievedAddressVillage,
  //     },
  //     contact: {
  //       // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
  //       primaryPhone: retrievedPrimaryPhone ? parseInt(retrievedPrimaryPhone) : 0,
  //       secondaryPhone: retrievedSecondaryPhone
  //         ? // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
  //           parseInt(retrievedSecondaryPhone)
  //         : 0,
  //     },
  //     idDocument: {
  //       docType: retrievedDocType ? retrievedDocType : "Nenhum",
  //       docNumber: retrievedDocNumber ? retrievedDocNumber : "Nenhum",
  //       nuit: retrievedNuit ? parseInt(retrievedNuit) : 0,
  //     },
  //     isGroupMember: retrievedIsGroupMember,
  //   };
  //   return farmerData;
};


