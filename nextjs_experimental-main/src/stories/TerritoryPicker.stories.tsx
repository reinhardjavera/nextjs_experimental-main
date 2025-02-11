import { Meta, StoryObj } from "@storybook/react";
import { TerritoryPicker } from "./TerritoryPicker";

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

// Data provinsi & kota dipindah ke story
const territoryData = [
  {
    id: "nationalwide",
    territory: "Nationalwide",
    children: [
      {
        id: "gorontalo",
        territory: "Gorontalo",
        children: [
          { id: "kota-gorontalo", territory: "Kota Gorontalo" },
          { id: "gorontalo-utara", territory: "Gorontalo Utara" },
          { id: "bone-bolango", territory: "Bone Bolango" },
          { id: "boalemo", territory: "Boalemo" },
          { id: "pohuwato", territory: "Pohuwato" },
        ],
      },
      {
        id: "sulawesi-selatan",
        territory: "Sulawesi Selatan",
        children: [
          { id: "makassar", territory: "Makassar" },
          { id: "parepare", territory: "Parepare" },
          { id: "palopo", territory: "Palopo" },
          { id: "gowa", territory: "Gowa" },
          { id: "maros", territory: "Maros" },
          { id: "bone", territory: "Bone" },
          { id: "sinjai", territory: "Sinjai" },
          { id: "bulukumba", territory: "Bulukumba" },
          { id: "barru", territory: "Barru" },
          { id: "soppeng", territory: "Soppeng" },
          { id: "jeneponto", territory: "Jeneponto" },
          { id: "takalar", territory: "Takalar" },
          { id: "toraja-utara", territory: "Toraja Utara" },
          { id: "tana-toraja", territory: "Tana Toraja" },
          { id: "luwu", territory: "Luwu" },
          { id: "luwu-utara", territory: "Luwu Utara" },
          { id: "luwu-timur", territory: "Luwu Timur" },
          { id: "pinrang", territory: "Pinrang" },
          { id: "enrekang", territory: "Enrekang" },
          { id: "wajo", territory: "Wajo" },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    territories: territoryData,
  },
};
