/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
export const calculateFarmlandUsedArea = (item) => {
    if (!item?.blocks || item?.blocks?.length === 0) {
        return "0.0";
    }
    const totalUsedArea = item?.blocks
        ?.map((block) => block.usedArea)
        .reduce((acc, cur) => acc + cur, 0);
    return totalUsedArea;
};
