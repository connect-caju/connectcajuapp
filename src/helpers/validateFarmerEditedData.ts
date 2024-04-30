import { assetTypes } from "../consts/assetTypes"
import categories from "../consts/categories"
import { capitalize } from "./capitalize"
import { containsNonNumeric } from "./containsNonNumeric"
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


// @ts-expect-error TS(7030): Not all code paths return a value.
const validateIndividualFarmerData = (
  {
    address,
    oldAddress,
    contact,
    oldContact,
    idDocument,
    oldIdDocument
  }: any,
  errors: any,
  setErrors: any,
  dataToBeUpdated: any,
  resourceName: any,
) => {
  // sanitizing recieved data
  if (dataToBeUpdated === "address" && resourceName == "Farmer") {
    const retrievedAddressAdminPost = address?.addressAdminPost?.trim()
    const retrievedAddressVillage = address?.addressVillage?.trim()

    const retrievedAddressOldAdminPost = oldAddress?.addressAdminPost?.trim()
    const retrievedAddressOldVillage = oldAddress?.addressVillage?.trim()

    if (
      retrievedAddressAdminPost === retrievedAddressOldAdminPost &&
      retrievedAddressVillage === retrievedAddressOldVillage
    ) {
      setErrors({
        ...errors,
        addressAdminPost: "Endereço actual não deve ser igual ao anterior",
        addressVillage: "Endereço actual não deve se igual ao anterior",
      })

      return false
    }

    if (!retrievedAddressAdminPost) {
      setErrors({
        ...errors,
        addressAdminPost: "Posto Administrativo onde o produtor reside.",
      })
      return false
    }

    return {
      adminPost: retrievedAddressAdminPost,
      village: retrievedAddressVillage,
    }
  }

  if (dataToBeUpdated === "contact" && resourceName == "Farmer") {
    const retrievedPrimaryPhone = Number(parseInt(contact?.primaryPhone))
      ? Number(parseInt(contact?.primaryPhone))
      : 0
    const retrievedSecondaryPhone = Number(parseInt(contact?.secondaryPhone))
      ? Number(parseInt(contact?.secondaryPhone))
      : 0

    const retrievedOldPrimaryPhone = Number(parseInt(oldContact?.primaryPhone))
      ? Number(parseInt(oldContact?.primaryPhone))
      : 0
    const retrievedOldSecondaryPhone = Number(
      parseInt(oldContact?.secondaryPhone),
    )
      ? Number(parseInt(oldContact?.secondaryPhone))
      : 0

    if (
      retrievedPrimaryPhone === retrievedOldPrimaryPhone &&
      retrievedSecondaryPhone === retrievedOldSecondaryPhone &&
      retrievedPrimaryPhone === 0 &&
      retrievedSecondaryPhone === 0
    ) {
      setErrors({
        ...errors,
        primaryPhone: "Contacto actual não deve ser igual ao anterior.",
        secondaryPhone: "Contacto actual não deve ser igual ao anterior.",
      })
      return false
    }

    if (
      retrievedPrimaryPhone === retrievedOldPrimaryPhone &&
      retrievedSecondaryPhone === retrievedOldSecondaryPhone &&

      // @ts-expect-error TS(2367): This condition will always return 'true' since the... Remove this comment to see the full error message
      (retrievedPrimaryPhone !== 0 || retrievedPrimaryPhone !== "") &&

      // @ts-expect-error TS(2367): This condition will always return 'true' since the... Remove this comment to see the full error message
      (retrievedSecondaryPhone !== 0 || retrievedSecondaryPhone !== "")
    ) {
      setErrors({
        ...errors,
        primaryPhone: "Contacto actual não deve ser igual ao anterior.",
        secondaryPhone: "Contacto actual não deve ser igual ao anterior.",
      })
      return false
    }

    if (
      retrievedPrimaryPhone === retrievedOldPrimaryPhone &&

      // @ts-expect-error TS(2367): This condition will always return 'true' since the... Remove this comment to see the full error message
      (retrievedPrimaryPhone !== 0 || retrievedPrimaryPhone !== "") &&
      retrievedSecondaryPhone === retrievedOldSecondaryPhone
    ) {
      setErrors({
        ...errors,
        primaryPhone: "Contacto actual não deve ser igual ao anterior.",
        //  secondaryPhone: 'Contacto actual não deve ser igual ao anterior.'
      })
      return false
    }

    if (
      retrievedSecondaryPhone === retrievedOldSecondaryPhone &&

      // @ts-expect-error TS(2367): This condition will always return 'true' since the... Remove this comment to see the full error message
      (retrievedSecondaryPhone !== 0 || retrievedSecondaryPhone !== "") &&
      retrievedPrimaryPhone === retrievedOldPrimaryPhone
    ) {
      setErrors({
        ...errors,
        //  primaryPhone: 'Contacto actual não deve ser igual ao anterior.',
        secondaryPhone: "Contacto actual não deve ser igual ao anterior.",
      })
      return false
    }

    if (
      retrievedPrimaryPhone === retrievedSecondaryPhone &&
      retrievedPrimaryPhone !== 0
    ) {
      setErrors({
        ...errors,
        primaryPhone: "Contacto principal não deve ser igual ao alternativo.",
        secondaryPhone: "Contacto principal não deve ser igual ao alternativo.",
      })
      return false
    }

    if (
      (retrievedPrimaryPhone !== 0 || retrievedSecondaryPhone !== 0) &&
      retrievedOldPrimaryPhone === 0 &&
      retrievedOldSecondaryPhone === 0
    ) {
      if (
        retrievedPrimaryPhone !== 0 &&

        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        (!Number.isInteger(parseInt(retrievedPrimaryPhone)) ||
          retrievedPrimaryPhone?.toString().length !== 9 ||

          // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
          parseInt(retrievedPrimaryPhone?.toString()[0]) !== 8 ||
          [2, 3, 4, 5, 6, 7].indexOf(

            // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            parseInt(retrievedPrimaryPhone?.toString()[1]),
          ) < 0)
      ) {
        setErrors({ ...errors, primaryPhone: "Número de telefone inválido." })
        return false
      }

      if (
        retrievedSecondaryPhone !== 0 &&

        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        (!Number.isInteger(parseInt(retrievedSecondaryPhone)) ||
          retrievedSecondaryPhone?.toString().length !== 9 ||

          // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
          parseInt(retrievedSecondaryPhone?.toString()[0]) !== 8 ||
          [2, 3, 4, 5, 6, 7].indexOf(

            // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            parseInt(retrievedSecondaryPhone?.toString()[1]),
          ) < 0)
      ) {
        setErrors({ ...errors, secondaryPhone: "Número de telefone inválido." })
        return false
      }
    }

    if (
      retrievedPrimaryPhone !== 0 &&
      retrievedSecondaryPhone === 0 &&

      // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      (!Number.isInteger(parseInt(retrievedPrimaryPhone)) ||
        retrievedPrimaryPhone?.toString().length !== 9 ||

        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        parseInt(retrievedPrimaryPhone?.toString()[0]) !== 8 ||
        [2, 3, 4, 5, 6, 7].indexOf(

          // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
          parseInt(retrievedPrimaryPhone?.toString()[1]),
        ) < 0)
    ) {
      setErrors({ ...errors, primaryPhone: "Número de telefone inválido." })
      return false
    }

    if (
      retrievedSecondaryPhone !== 0 &&
      retrievedPrimaryPhone === 0 &&

      // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      (!Number.isInteger(parseInt(retrievedSecondaryPhone)) ||
        retrievedSecondaryPhone?.toString().length !== 9 ||

        // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        parseInt(retrievedSecondaryPhone?.toString()[0]) !== 8 ||
        [2, 3, 4, 5, 6, 7].indexOf(

          // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
          parseInt(retrievedSecondaryPhone?.toString()[1]),
        ) < 0)
    ) {
      setErrors({ ...errors, secondaryPhone: "Número de telefone inválido." })
      return false
    }
    return {
      primaryPhone: retrievedPrimaryPhone

        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        ? Number(parseInt(retrievedPrimaryPhone))
        : 0,
      secondaryPhone: retrievedSecondaryPhone

        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        ? Number(parseInt(retrievedSecondaryPhone))
        : 0,
    }
  }

  if (dataToBeUpdated === "idDocument" && resourceName == "Farmer") {
    const retrievedDocType = idDocument?.docType
    const retrievedDocNumber = idDocument?.docNumber
    const retrievedNuit = idDocument?.nuit

    const retrievedOldDocType = oldIdDocument?.docType
    const retrievedOldDocNumber = oldIdDocument?.docNumber
    const retrievedOldNuit = oldIdDocument?.nuit


    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log("new doc:", JSON.stringify(idDocument))

    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log("old doc:", JSON.stringify(oldIdDocument))

    if (
      retrievedDocType === retrievedOldDocType &&
      retrievedDocNumber === retrievedOldDocNumber &&
      retrievedNuit === retrievedOldNuit
    ) {
      setErrors({
        ...errors,
        docType: "Os documentos actuais não devem ser iguais aos anteriores.",
        docNumber: "Os documentos actuais não devem ser iguais aos anteriores.",
        nuit: "Os documentos actuais não devem ser iguais aos anteriores.",
      })
      return false
    }

    if (retrievedDocNumber && !retrievedDocType) {
      setErrors({ ...errors, docType: "Tipo de documento do produtor." })
      return false
    } else if (!retrievedDocNumber && retrievedDocType !== "Não tem") {
      setErrors({ ...errors, docType: "Número de documento do produtor." })
      return false
    }

    if (
      (retrievedNuit &&
        (!Number.isInteger(parseInt(retrievedNuit)) ||
          retrievedNuit?.toString().length !== 9)) ||
      containsNonNumeric(retrievedNuit)
    ) {
      setErrors({ ...errors, nuit: "NUIT inválido." })
      return false
    }
    return {
      docType: retrievedDocType ? retrievedDocType : "Nenhum",
      docNumber: retrievedDocNumber ? retrievedDocNumber : "Nenhum",
      nuit: retrievedNuit ? parseInt(retrievedNuit) : 0,
    }
  }
}

export default validateIndividualFarmerData
