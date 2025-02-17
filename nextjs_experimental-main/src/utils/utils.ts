export interface Territory {
  id: string;
  territory: string;
  level?: number;
  children?: Territory[];
}

// Fungsi untuk menambahkan level ke setiap node rekursif
export const augmentTerritoryData = (
  territories: Territory[],
  currentLevel = 1
): Territory[] => {
  return territories.map((territory) => ({
    ...territory,
    level: currentLevel, // Tetapkan level
    children:
      Array.isArray(territory.children) && territory.children.length > 0
        ? augmentTerritoryData(territory.children, currentLevel + 1)
        : undefined, // Gunakan `undefined` bukan `[]` agar tidak menghapus struktur
  }));
};
