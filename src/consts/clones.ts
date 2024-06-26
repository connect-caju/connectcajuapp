export const clones = [
  "Desconhecido",
  " 1.3",
  "1.5R",
  "1.7VM",
  "103-68",
  "103-85",
  "11.2PA",
  "11.7PA",
  "11.8PA",
  "12.3PA",
  "12.6PA",
  "12.8PA",
  "2.11PG",
  "201A",
  "3.3ZM",
  "4.1AD",
  "42EM",
  "44EM",
  "49EM",
  "5.12PA",
  "5EM",
  "6.3",
  "6.7NASS",
  "7.10PA",
  "7EM",
  "AD4.1 PA",
  "ADPP103",
  "ADPP19.5",
  "ADPP5.59",
  "CCS-27",
  "CCS-114",
  "CM8",
  "H1",
  "M5",

  "MP77",
  "MU1",
  "MU18",
  "MU45",
  "NASS2",
  "NASS3",
  "2.5VM",
  "29EM",
  "IM5",
  "30EM",
  "CHP5",
  "CHP3",
  "CHP2",
  "CHP1",
  "CHP4",
  "CHP6",
  "CHKL3",
  "CHKL2",
  "CHKL1",
  "CHKL4",
  "MFS1",
  "JN",
  "Manhenje",
  "PJG02",
  "PJG03",
  "PJJEM15",
  "PJJEM1",
  "PJJEM2",
  "PJJEM6",
  "2.7NASS",
  "Outro",
];

const cloneList = clones.map((clone, index) => ({
  key: `${index}`,
  value: `${clone}`,
}));

export const cloneList2 = clones.map((clone, index) => ({
  id: `${clone}`,
  name: `${clone}`,
}));

export default cloneList;

