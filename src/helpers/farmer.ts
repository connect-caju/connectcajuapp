const farmer = {
  // @ts-expect-error TS(2304): Cannot find name 'uuidv4'.
  _id: uuidv4(), // unique id
  names: {
    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    surname: farmerData.names?.surname,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    otherNames: farmerData.names?.otherNames,
  },

  // @ts-expect-error TS(2304): Cannot find name 'generateUUID'.
  ufid: generateUUID({
    // @ts-expect-error TS(2304): Cannot find name 'generateFormattedSurname'.
    surname: generateFormattedSurname(farmerData.names?.surname),

    // @ts-expect-error TS(2304): Cannot find name 'generateFormattedDate'.
    birthDate: generateFormattedDate(farmerData.birthDate),

    // @ts-expect-error TS(2304): Cannot find name 'generateFormattedAdminPost'.
    birthAdminPost: generateFormattedAdminPost(
      // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
      farmerData.birthPlace?.birthAdminPost,
    ),
  }),

  // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
  isSprayingAgent: farmerData?.isSprayingAgent,

  // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
  gender: farmerData.gender,

  // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
  birthDate: new Date(farmerData.birthDate),
  address: {
    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    province: farmerData.address?.province,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    district: farmerData.address?.district,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    adminPost: farmerData.address?.adminPost,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    village: farmerData.address?.village,
  },
  birthPlace: {
    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    province: farmerData.birthPlace?.province,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    district: farmerData.birthPlace?.district,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    adminPost: farmerData.birthPlace?.adminPost,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    village: farmerData.birthPlace?.village,
  },
  contact: {
    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    primaryPhone: farmerData.contact?.primaryPhone,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    secondaryPhone: farmerData.contact?.secondaryPhone,
  },
  idDocument: {
    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    docType: farmerData.idDocument?.docType,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    docNumber: farmerData.idDocument?.docNumber,

    // @ts-expect-error TS(2304): Cannot find name 'farmerData'.
    nuit: farmerData.idDocument?.nuit,
  },
};
