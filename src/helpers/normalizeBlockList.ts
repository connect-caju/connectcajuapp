export const normalizeBlockList = (list: any) => {
  let count = 0;
  let newList = list?.map((block: any) => {
    block["position"] = count;
    count += 1;
    return block;
  });
  return newList;
};
