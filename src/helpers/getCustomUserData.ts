import { useApp, useUser } from "@realm/react";
import { secrets } from "../secrets";

// @ts-expect-error TS(7030): Not all code paths return a value.
export const getCustomUserData = async () => {
  const user = useUser();

  const mongo = user.mongoClient(secrets.serviceName);

  try {
    const collection = mongo
      .db(secrets.databaseName)
      .collection(secrets.userCollectionName);

    const userData = await collection.findOne({ userId: user.id });
    // console.log('userData', JSON.stringify(userData));

    return {
      // @ts-expect-error TS(2339): Property 'name' does not exist on type 'Document<a... Remove this comment to see the full error message
      name: userData?.name,
      // @ts-expect-error TS(2339): Property 'email' does not exist on type 'Document<... Remove this comment to see the full error message
      email: userData?.email,
      // @ts-expect-error TS(2339): Property 'userId' does not exist on type 'Document... Remove this comment to see the full error message
      userId: userData?.userId,
      // @ts-expect-error TS(2339): Property 'userDistrict' does not exist on type 'Do... Remove this comment to see the full error message
      district: userData?.userDistrict,
      // @ts-expect-error TS(2339): Property 'userProvince' does not exist on type 'Do... Remove this comment to see the full error message
      province: userData?.userProvince,
    };
  } catch (error) {
    // @ts-expect-error TS(2584): Cannot find name 'console'. Do you need to change ... Remove this comment to see the full error message
    console.log("Failed to fetch user", { cause: error });
  }
};
