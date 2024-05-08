import { groupAffiliationStatus } from "../consts/groupAffiliationStatus";
import { CoopFormDataTypes, ErrorType } from "../lib/types";
import { capitalize } from "./capitalize";
import { containsNonNumeric } from "./containsNonNumeric";

export const validateCoopData = (coopData: CoopFormDataTypes) => {
  const {
    isActive,
    type,
    name,
    creationYear,
    affiliationYear,
    legalStatus,
    purposes,
    address,
    numberOfMembers,
    nuit,
    licence,
    nuel,
  } = coopData;

  let errors: ErrorType = {};

  if (isActive !== "Sim" && isActive !== "Não") {
    errors["isActive"] = "Indica uma opção";
  }

  if (!type) {
    errors["type"] = "Indica o tipo de organização";
  }

  if (!capitalize(name.trim())) {
    errors["name"] = "Indica a designação da organização";
  }

  if (!numberOfMembers.total) {
    errors["total"] = "Indica o número de membros";
  }

  if (!numberOfMembers.women) {
    errors["women"] = "Indica o número de mulheres";
  } else if (
    Number(numberOfMembers.women) &&
    numberOfMembers.women > numberOfMembers.total
  ) {

    errors["women"] = "Número de mulher superior ao total";
  }

  if (purposes.length === 0) {
    errors["purposes"] = "Indica a finalidade";
  }

  if (!legalStatus) {
    errors["legalStatus"] = "Indica a situação legal";
  }

  if (!creationYear) {
    errors["creationYear"] = "Indica o ano de criação";
  }

  if (legalStatus === groupAffiliationStatus.affiliated) {
    if (!affiliationYear) {
      errors["affiliationYear"] = "Indica o ano de legalização";
    }
    if (creationYear && affiliationYear && creationYear > affiliationYear) {
      errors["creationYear"] = "Ano de criação posterior ao ano de legalização";
      errors["affiliationYear"] =
        "Ano de legalização é anterior ao ano de criação";
    }
  }

  if (!licence) {
    errors["licence"] = "Indica o alvará";
  }
  if (!nuel) {
    errors["nuel"] = "Indica o NUEL";
  }

  if (!nuit) {
    errors["nuit"] = "Indica o NUIT";
  } else if (
    nuit &&
    (!Number(nuit) || nuit?.toString().length !== 9 || containsNonNumeric(nuit))
  ) {
    errors["nuit"] = "Indica o NUIT válido";
  }

  if (
    nuel &&
    (!Number(nuel) || nuit?.toString().length !== 9 || containsNonNumeric(nuel))
  ) {
    errors["nuel"] = "Indica o NUEL válido";
  }

  if (!address.adminPost) {
    errors["adminPost"] = "Indica o Posto Administrativo";
  }

  console.log("errorMessages:", errors);
  return {
    isValid: Object.keys(errors).length > 0 ? false : true,
    errorMessages: errors,
  };
};
