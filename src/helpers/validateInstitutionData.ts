import { ActorFormDataTypes, useActorStore } from "../app/stores/actorStore";
import { InstitutionFormDataTypes } from "../app/stores/institutionStore";
import { assetTypes } from "../consts/assetTypes";
import categories from "../consts/categories";
import { ErrorType } from "../lib/types";
import { capitalize } from "./capitalize";
import { containsNonNumeric } from "./containsNonNumeric";
import { generateUAID } from "./generateUAID";

// const updateActorField = useActorStore.getState().updateActorField

export const validateInstitutionData = (
  institutionData: InstitutionFormDataTypes,
) => {
  const {
    isPrivate,
    type,
    name,
    address,
    manager,
    nuit,
    licence,
  } = institutionData;


  let errors: ErrorType = {};

  if (isPrivate !== "Sim" && isPrivate !== "Não") {
    errors["isPrivate"] = "Indica uma opção";
  }

  if (!type) {
    errors["type"] = "Selecciona o tipo de instituição";
  }

  if (!capitalize(name.trim())) {
    errors["name"] = "Indica a designação da instituição";
  } 

  if (!capitalize(manager.fullname.trim())) {
    errors["managerName"] = "Indica o nome do responsável";
  } 



  if (manager.phone && String(manager.phone).length > 0) {
    if (
      (manager.phone !== 0 &&
        String(manager.phone).length !== 9) ||
      ![2, 3, 4, 5, 6, 7].some(
        (digit) => String(digit) === String(manager.phone)[1],
      ) ||
      String(manager.phone)[0] !== String(8) ||
      containsNonNumeric(manager.phone)
    ) {
      errors["phone"] = "Número de telefone inválido";
    }
  }


  if (!address.adminPost) {
    errors["adminPost"] = "Indica o Posto Administrativo";
  }


  if (
    nuit &&
    (!Number(nuit) ||
      nuit?.toString().length !== 9 ||
      containsNonNumeric(nuit))
  ) {
    errors["nuit"] = "Indica o NUIT válido";
  }

  return {
    isValid: Object.keys(errors).length > 0 ? false : true,
    errorMessages: errors,
  };
};
