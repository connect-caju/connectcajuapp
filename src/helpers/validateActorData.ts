import { ActorFormDataTypes, useActorStore } from "../app/stores/actorStore";
import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { ErrorType } from "../lib/types";
import { capitalize } from "./capitalize";
import { containsNonNumeric } from "./containsNonNumeric";
import { generateUAID } from "./generateUAID";

// const updateActorField = useActorStore.getState().updateActorField

export const validateActorData = (actorData: ActorFormDataTypes) => {
  const {
    isSprayingAgent,
    isGroupMember,
    names,
    gender,
    familySize,
    birthDate,
    birthPlace,
    address,
    contact,
    idDocument,
  } = actorData;

  // console.log("actorData", actorData)

  let errors: ErrorType = {};

  if (isSprayingAgent !== "Sim" && isSprayingAgent !== "Não") {
    errors["isSprayingAgent"] = "Indica uma opção";
  }

  if (isGroupMember !== "Sim" && isGroupMember !== "Não") {
    errors["isGroupMember"] = "Indica uma opção";
  }

  if (gender !== "Masculino" && gender !== "Feminino" && gender !== "Outro") {
    errors["gender"] = "Indica uma opção";
  }

  if (
    !familySize ||
    Number(familySize) === 0 ||
    Number(familySize) > 30
  ) {
    errors["familySize"] = "Indica um agregado não superior a 30";
  }

  if (!capitalize(names.surname.trim())) {
    errors["surname"] = "Indica o apelido";
  } else if (names.surname.trim()?.split(" ").length > 1) {
    errors["surname"] = "Indica apenas 1 nome como apelido";
  }

  if (!capitalize(names.otherNames.trim())) {
    errors["otherNames"] = "Indica Outros nomes";
  }

  if (
    !birthDate ||
    new Date(birthDate).getFullYear() >= new Date().getFullYear() - 14 ||
    new Date(birthDate).getFullYear() < new Date().getFullYear() - 90
  ) {
    errors["birthDate"] = "Indica uma data válida";
  }

  if (contact.primaryPhone && String(contact.primaryPhone).length > 0) {
    if (
      (contact.primaryPhone !== 0 &&
        String(contact.primaryPhone).length !== 9) ||
      ![2, 3, 4, 5, 6, 7].some(
        (digit) => String(digit) === String(contact.primaryPhone)[1],
      ) ||
      String(contact.primaryPhone)[0] !== String(8) ||
      containsNonNumeric(contact.primaryPhone)
    ) {
      errors["primaryPhone"] = "Número de telefone inválido";
    }
  }

  if (contact.secondaryPhone && String(contact.secondaryPhone).length > 0) {
    if (
      (contact.secondaryPhone !== 0 &&
        String(contact.secondaryPhone).length !== 9) ||
      ![2, 3, 4, 5, 6, 7].some(
        (digit) => String(digit) === String(contact.secondaryPhone)[1],
      ) ||
      String(contact.secondaryPhone)[0] !== String(8) ||
      containsNonNumeric(contact.secondaryPhone)
    ) {
      errors["secondaryPhone"] = "Número de telefone inválido";
    }
  }

  if (
    contact.primaryPhone &&
    String(contact.primaryPhone).length > 0 &&
    contact.primaryPhone === contact.secondaryPhone &&
    String(contact.primaryPhone) !== String(0)
  ) {
    errors["primaryPhone"] = "Número igual ao alternativo";
    errors["secondaryPhone"] = "Número igual ao principal";
  }


  if (!address.adminPost) {
    errors["addressAdminPost"] = "Indica o Posto Administrativo de origem";
  }

  if (!birthPlace.district && !birthPlace.province?.includes("Cidade")) {
    const errorMessage =
      birthPlace.province === "País Estrangeiro"
        ? "Indica país onde nasceu."
        : "Indica província onde nasceu.";

    errors["birthProvince"] = errorMessage;
  }

  if (
    !birthPlace.adminPost &&
    birthPlace.province !== "País Estrangeiro" &&
    !birthPlace.district?.includes("Cidade") &&
    birthPlace.province !== "Maputo" &&
    !birthPlace.province?.includes("Cidade")
  ) {
    errors["birthAdminPost"] = "Indica o Posto Administrativo";
  }

  if (idDocument.docNumber && !idDocument.docType) {
    errors["docType"] = "Indica o tipo de documento";
  } else if (!idDocument.docNumber && idDocument.docType !== "Não tem") {
    errors["docNumber"] = "Indica o número de documento";
  }
  else if (idDocument.docNumber && ((idDocument.docType === "Não tem") || !idDocument.docType)){
    errors["docType"] = "Indica o tipo de documento";
  }

  if (
    idDocument.nuit &&
    (!Number(idDocument.nuit) ||
      idDocument.nuit?.toString().length !== 9 ||
      containsNonNumeric(idDocument.nuit))
  ) {
    errors["nuit"] = "Indica o NUIT válido";
  }


  return {
    isValid: Object.keys(errors).length > 0 ? false : true,
    errorMessages: errors,
  };

  
};
