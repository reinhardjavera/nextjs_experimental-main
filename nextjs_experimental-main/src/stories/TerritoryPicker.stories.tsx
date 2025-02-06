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
    name: "Nationalwide",
    children: [
      {
        id: "gorontalo",
        name: "Gorontalo",
        children: [
          { id: "kota-gorontalo", name: "Kota Gorontalo" },
          { id: "gorontalo-utara", name: "Gorontalo Utara" },
          { id: "bone-bolango", name: "Bone Bolango" },
          { id: "boalemo", name: "Boalemo" },
          { id: "pohuwato", name: "Pohuwato" },
        ],
      },
      {
        id: "sulawesi-selatan",
        name: "Sulawesi Selatan",
        children: [
          { id: "makassar", name: "Makassar" },
          { id: "parepare", name: "Parepare" },
          { id: "palopo", name: "Palopo" },
          { id: "gowa", name: "Gowa" },
          { id: "maros", name: "Maros" },
          { id: "bone", name: "Bone" },
          { id: "sinjai", name: "Sinjai" },
          { id: "bulukumba", name: "Bulukumba" },
          { id: "barru", name: "Barru" },
          { id: "soppeng", name: "Soppeng" },
          { id: "jeneponto", name: "Jeneponto" },
          { id: "takalar", name: "Takalar" },
          { id: "toraja-utara", name: "Toraja Utara" },
          { id: "tana-toraja", name: "Tana Toraja" },
          { id: "luwu", name: "Luwu" },
          { id: "luwu-utara", name: "Luwu Utara" },
          { id: "luwu-timur", name: "Luwu Timur" },
          { id: "pinrang", name: "Pinrang" },
          { id: "enrekang", name: "Enrekang" },
          { id: "wajo", name: "Wajo" },
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
