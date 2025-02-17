import { Meta, StoryObj } from "@storybook/react";
import { TerritoryPicker } from "./TerritoryPicker";
import { augmentTerritoryData } from "../utils/utils";

const meta: Meta<typeof TerritoryPicker> = {
  title: "Example/TerritoryPicker",
  component: TerritoryPicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/*
const augmentTerritoryData = (
  territories: any[],
  currentLevel: number = 1
): any[] => {
  return territories.map((territory) => ({
    ...territory,
    level: currentLevel, // Set level saat ini
    children:
      Array.isArray(territory.children) && territory.children.length > 0
        ? augmentTerritoryData(territory.children, currentLevel + 1) // Rekursi tanpa batas level
        : [], // Set array kosong jika tidak ada children
  }));
};
*/

// Data provinsi & kota dipindah ke story
const territoryData = [
  {
    id: "Nationalwide",
    territory: "Nationalwide",
    children: [
      {
        id: "Gorontalo",
        territory: "Gorontalo",
        children: [
          { id: "Kota Gorontalo", territory: "Kota Gorontalo" },
          { id: "Gorontalo Utara", territory: "Gorontalo Utara" },
          { id: "Bone Bolango", territory: "Bone Bolango" },
          { id: "Boalemo", territory: "Boalemo" },
          { id: "Pohuwato", territory: "Pohuwato" },
        ],
      },
      {
        id: "Sulawesi Selatan",
        territory: "Sulawesi Selatan",
        children: [
          { id: "Makassar", territory: "Makassar" },
          { id: "Parepare", territory: "Parepare" },
          { id: "Palopo", territory: "Palopo" },
          { id: "Gowa", territory: "Gowa" },
          { id: "Maros", territory: "Maros" },
          { id: "Bone", territory: "Bone" },
          { id: "Sinjai", territory: "Sinjai" },
          { id: "Bulukumba", territory: "Bulukumba" },
          { id: "Barru", territory: "Barru" },
          { id: "Soppeng", territory: "Soppeng" },
          { id: "Jeneponto", territory: "Jeneponto" },
          { id: "Takalar", territory: "Takalar" },
          { id: "Toraja Utara", territory: "Toraja Utara" },
          { id: "Tana Toraja", territory: "Tana Toraja" },
          { id: "Luwu", territory: "Luwu" },
          { id: "Luwu Utara", territory: "Luwu Utara" },
          { id: "Luwu Timur", territory: "Luwu Timur" },
          { id: "Pinrang", territory: "Pinrang" },
          { id: "Enrekang", territory: "Enrekang" },
          { id: "Wajo", territory: "Wajo" },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    territories: augmentTerritoryData(territoryData), // Gunakan fungsi yang sudah diperbaiki
  },
};
