// sum all the numbers of the trees
export const sumTreesOrAreas = (farmlands: any, flag: any) => {
  if (flag === "trees") {
    // get all the numbers of trees from all the farmlands
    const trees = farmlands?.map((farmland: any) => farmland.trees)

    // sum all the numbers
    return trees?.reduce((acc: any, value: any) => acc + value, 0);
  } else if (flag === "declaredAreas") {
    // get all the numbers of declaredAreas from all the farmlands
    const declaredAreas = farmlands?.map((farmland: any) => farmland.totalArea)

    // sum all the numbers
    return declaredAreas?.reduce((acc: any, value: any) => acc + value, 0);
  } else if (flag === "auditedAreas") {
    // get all the numbers of auditedareas from all the farmlands
    const auditedAreas = farmlands?.map((farmland: any) => farmland.auditedArea)

    // sum all the numbers
    return auditedAreas?.reduce((acc: any, value: any) => acc + value, 0);
  }
}
