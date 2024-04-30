export const getPlantingYears = (blocks: any) => {
  if (blocks?.length > 0) {
    return blocks
      ?.map((block: any) => {
        return block.plantingYear
      })
      .join("; ");
  } else {
    return "Desconhecido"
  }
}
