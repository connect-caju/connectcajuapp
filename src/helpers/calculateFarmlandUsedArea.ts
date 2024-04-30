/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
export const calculateFarmlandUsedArea = (item: any) => {
    if (!item?.blocks || item?.blocks?.length === 0) {
        return "0.0";
    }
    const totalUsedArea = item?.blocks
        ?.map((block: any) => block.usedArea)
        .reduce((acc: any, cur: any) => acc + cur, 0);
    return totalUsedArea;
};
