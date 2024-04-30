/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable semi */
import categories from "../consts/categories"

export default function getFarmerCategory(assetsArray: any) {
    return assetsArray.filter((asset: any) => asset.category === categories.farmer.category)[0]?.subcategory;
}
