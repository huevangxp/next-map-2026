export interface City {
  name: string;
  provinceId: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export const cityData: City[] = [
  // Vientiane Prefecture (LA24)
  {
    name: "Vientiane Capital",
    provinceId: "LA24",
    coordinates: [102.6331, 17.9757],
  },
  { name: "Sikhottabong", provinceId: "LA24", coordinates: [102.55, 17.98] },
  { name: "Chanthabuly", provinceId: "LA24", coordinates: [102.6, 17.96] },
  { name: "Sisattanak", provinceId: "LA24", coordinates: [102.62, 17.94] },

  // Luang Prabang (LA17)
  {
    name: "Luang Prabang",
    provinceId: "LA17",
    coordinates: [102.1347, 19.8893],
  },
  { name: "Xieng Ngeun", provinceId: "LA17", coordinates: [102.18, 19.75] },
  { name: "Nan", provinceId: "LA17", coordinates: [102.05, 19.55] },

  // Champasak (LA02)
  { name: "Pakse", provinceId: "LA02", coordinates: [105.8203, 15.1205] },
  { name: "Paksong", provinceId: "LA02", coordinates: [106.23, 15.18] },
  { name: "Champasak", provinceId: "LA02", coordinates: [105.88, 14.89] },

  // Savannakhet (LA20)
  {
    name: "Kaysone Phomvihane",
    provinceId: "LA20",
    coordinates: [104.8, 16.55],
  },
  { name: "Outhoumphone", provinceId: "LA20", coordinates: [104.98, 16.6] },
  { name: "Phine", provinceId: "LA20", coordinates: [106.1, 16.68] },

  // Vientiane Province (LA27)
  { name: "Phonhong", provinceId: "LA27", coordinates: [102.42, 18.5] },
  { name: "Vang Vieng", provinceId: "LA27", coordinates: [102.4495, 18.9225] },

  // Xiengkhouang (LA14)
  { name: "Phonsavan", provinceId: "LA14", coordinates: [103.2167, 19.4625] },

  // Khammouane (LA15)
  { name: "Thakhek", provinceId: "LA15", coordinates: [104.83, 17.4] },

  // Luang Namtha (LA16)
  { name: "Luang Namtha", provinceId: "LA16", coordinates: [101.4, 20.95] },

  // Oudomxay (LA07)
  { name: "Muang Xay", provinceId: "LA07", coordinates: [101.98, 20.69] },

  // Bokeo (LA22)
  { name: "Huay Xai", provinceId: "LA22", coordinates: [100.41, 20.27] },

  // Attapeu (LA01)
  { name: "Attapeu", provinceId: "LA01", coordinates: [106.83, 14.8] },

  // Bolikhamxay (LA23)
  { name: "Paksan", provinceId: "LA23", coordinates: [103.66, 18.38] },

  // Houaphanh (LA03)
  { name: "Xam Neua", provinceId: "LA03", coordinates: [104.05, 20.41] },

  // Phongsaly (LA18)
  { name: "Phongsaly", provinceId: "LA18", coordinates: [102.1, 21.68] },

  // Salavan (LA19)
  { name: "Salavan", provinceId: "LA19", coordinates: [106.41, 15.71] },

  // Sekong (LA26)
  { name: "Sekong", provinceId: "LA26", coordinates: [106.72, 15.34] },

  // Xnysomboun (LA25)
  { name: "Anouvong", provinceId: "LA25", coordinates: [103.08, 18.88] },

  // Sainyabuli (LA13)
  { name: "Sainyabuli", provinceId: "LA13", coordinates: [101.71, 19.25] },
];
