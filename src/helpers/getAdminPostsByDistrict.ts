/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

import administrativePosts from "../consts/administrativePosts";

export const getAdminPostsByDistrict = (district: any) => {

    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return administrativePosts[`${district}`];
};
