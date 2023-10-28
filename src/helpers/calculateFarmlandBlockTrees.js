/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
export const calculateFarmlandBlockTrees = (item) => {
    if (!item?.blocks || item?.blocks?.length === 0) {
        return 0;
    }
    const totalTrees = item?.blocks
        ?.map((block) => block.trees)
        .reduce((acc, cur) => acc + cur, 0);
    return totalTrees;
};
