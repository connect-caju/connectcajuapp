/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

import villages from "../consts/villages";
import { getAdminPostsByDistrict } from "./getAdminPostsByDistrict";

// get all the villages of this district
export const getVillagesByDistrict = (district: any) => {
    const adminPosts = getAdminPostsByDistrict(district);
    let villagesByDistrict: any = [];
    adminPosts.forEach((adminPost: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const villagesByAdminPost = villages[`${adminPost}`];
        villagesByDistrict = villagesByDistrict.concat(villagesByAdminPost);
    });

    return villagesByDistrict;
};
