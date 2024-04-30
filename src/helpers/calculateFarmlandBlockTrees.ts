/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
export const calculateFarmlandBlockTrees = (item: any) => {
    if (!item?.blocks || item?.blocks?.length === 0) {
        return 0;
    }
    const totalTrees = item?.blocks
        ?.map((block: any) => block.trees)
        .reduce((acc: any, cur: any) => acc + cur, 0);
    return totalTrees;
};
