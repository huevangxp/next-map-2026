export type Party = {
  name: string;
  color: string;
};

export interface ProvinceElectionData {
  id: string; // FIPS or HASC code or Name
  provinceName: string;
  totalVotes: number;
  winningParty: string;
  partyColor: string; // Hex color
  candidate: string;
}

export const electionData: ProvinceElectionData[] = [
  {
    id: "LA01",
    provinceName: "Attapeu",
    totalVotes: 45000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Somsavat Lengsavad",
  },
  {
    id: "LA22",
    provinceName: "Bokeo",
    totalVotes: 62000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Khamphoui Keoboualapha",
  },
  {
    id: "LA23",
    provinceName: "Bolikhamsai",
    totalVotes: 89000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Pany Yathotou",
  },
  {
    id: "LA02",
    provinceName: "Champasak",
    totalVotes: 210000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Sonexay Siphandone",
  },
  {
    id: "LA03",
    provinceName: "Houaphanh",
    totalVotes: 95000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Phankham Viphavanh",
  },
  {
    id: "LA15",
    provinceName: "Khammouane",
    totalVotes: 120000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Bounnhang Vorachith",
  },
  {
    id: "LA16",
    provinceName: "Luang Namtha",
    totalVotes: 58000,
    winningParty: "Independent",
    partyColor: "#002868",
    candidate: "Khampheng Saysompheng",
  },
  {
    id: "LA17",
    provinceName: "Luang Prabang",
    totalVotes: 180000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Choummaly Sayasone",
  },
  {
    id: "LA07",
    provinceName: "Oudomxay",
    totalVotes: 110000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Thongsing Thammavong",
  },
  {
    id: "LA18",
    provinceName: "Phongsaly",
    totalVotes: 65000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Asang Laoly",
  },
  {
    id: "LA19",
    provinceName: "Salavan",
    totalVotes: 135000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Boungnang Vorachit",
  },
  {
    id: "LA20",
    provinceName: "Savannakhet",
    totalVotes: 320000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Thongloun Sisoulith",
  },
  {
    id: "LA24",
    provinceName: "Vientiane Prefecture",
    totalVotes: 450000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Saysomphone Phomvihane",
  },
  {
    id: "LA27",
    provinceName: "Vientiane Province",
    totalVotes: 160000,
    winningParty: "Independent",
    partyColor: "#002868",
    candidate: "Xaysomphone Phomvihane",
  },
  {
    id: "LA28",
    provinceName: "Xaisomboun",
    totalVotes: 35000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Thongbanh Sengaphone",
  },
  {
    id: "LA26",
    provinceName: "Sekong",
    totalVotes: 40000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Khamtay Siphandone",
  },
  {
    id: "LA14",
    provinceName: "Xiangkhouang",
    totalVotes: 98000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Douangchay Phichit",
  },
  {
    id: "LA13", // Sainyabuli
    provinceName: "Sainyabuli",
    totalVotes: 140000,
    winningParty: "LPRP",
    partyColor: "#CE1126",
    candidate: "Saignabouli Leader",
  },
];
