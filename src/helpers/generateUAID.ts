import { ceps } from "../consts/ceps"
// import { generateUniqueNumber } from './generateUniqueNumber';

export const generateUAID = ({
  names,
  birthDate,
  birthPlace
}: any) => {
  const fNameInitials = names.otherNames?.slice(0, 2).toLowerCase()
  const lNameInitials = names.surname?.slice(0, 2).toLowerCase()
  const date = new Date(birthDate).valueOf()

  // const dateDigits = JSON.stringify(date.slice(0,2) + date.slice(3,5) + date.slice(-2));
  let birthPlaceCode
  if (
    birthPlace?.province?.includes("Estrangeiro") ||
    birthPlace?.province === "Maputo" ||
    birthPlace?.district?.includes("Cidade")
  ) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    birthPlaceCode = ceps[`${birthPlace?.district}`]
  } else if (birthPlace?.province?.includes("Cidade")) {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    birthPlaceCode = ceps[`${birthPlace?.province}`]
  } else {
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    birthPlaceCode = ceps[`${birthPlace?.adminPost}`]
  }

  // generate for the farmer
  // const uniqueNumber = generateUniqueNumber(birthPlaceCode, 'farmer');

  // console.log('unique number:', uniqueNumber);

  return `${fNameInitials}.${date}.${birthPlaceCode}.${lNameInitials}`
}
