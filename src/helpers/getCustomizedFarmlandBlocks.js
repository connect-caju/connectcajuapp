/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
export const getCustomizedFarmlandBlocks = (item) => {
    if (!item?.blocks) {
        return "Pomar sem parcelas de cajueiros";
    }
    const blocks = item?.blocks.map((block) => ({
        _id: block?._id,
        plantingYear: block?.plantingYear,
        density: block?.density?.mode === "Irregular"
            ? block?.density?.mode
            : block?.density?.mode === "Regular"
                ? `${block?.density?.mode} (${block?.density.length} por ${block?.density?.width} metros)`
                : "",
        trees: block?.trees,
        usedArea: block?.usedArea?.toFixed(1),
        plantTypes: block?.plantTypes ? block?.plantTypes : "Sem tipos de plantas",
        sameTypeTrees: (block?.sameTypeTrees && block?.sameTypeTrees.length > 0) ? block?.sameTypeTrees : "Sem tipos de plantas",
        userName: block?.userName,
        createdAt: `${new Date(item?.createdAt).getDate()}/${new Date(item?.createdAt).getMonth() + 1
            }/${new Date(item?.createdAt).getFullYear()}`,
        sortingKey: item?.modifiedAt,
        modifiedAt: `${new Date(item?.modifiedAt).getDate()}/${new Date(item?.modifiedAt).getMonth() + 1
            }/${new Date(item?.modifiedAt).getFullYear()}`,
    }));
    return blocks;
};
