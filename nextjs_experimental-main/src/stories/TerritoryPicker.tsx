import React, { useEffect, useState } from "react";
import "./TerritoryPicker.css";
import axios from "axios";

interface Territory {
  id: string;
  territory: string;
  level?: number;
  children?: Territory[];
}

interface TerritoryPickerProps {
  territories: Territory[];
}

const augmentTerritoryData = (
  territories: Territory[],
  currentLevel: number = 1
): Territory[] => {
  if (!territories) return [];
  return territories.map((territory) => ({
    ...territory,
    level: currentLevel,
    children: territory.children
      ? augmentTerritoryData(territory.children, currentLevel + 1)
      : undefined,
  }));
};

export const TerritoryPicker: React.FC<TerritoryPickerProps> = ({
  territories,
}) => {
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [activeSource, setActiveSource] = useState<"A" | "B">("A");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [augmentedTerritories, setAugmentedTerritories] = useState<Territory[]>(
    augmentTerritoryData(territories)
  );
  const [externalTerritories, setExternalTerritories] = useState<Territory[]>(
    []
  );

  // Fetch data for Source B
  useEffect(() => {
    if (activeSource === "B" && externalTerritories.length === 0) {
      axios
        .get(
          "https://dev.braincodetech.id/inap/api/availability-dashboard/bc_territory2?end_date=20240930"
        )
        .then((response) => {
          console.log("API Response:", response.data); // cek isi response

          if (response.data && Array.isArray(response.data.tsel)) {
            const fetchedTerritories = response.data.tsel.map((item: any) => ({
              id: item.id || "",
              territory: item.territory || "",
              children: item.children
                ? augmentTerritoryData(item.children)
                : undefined,
            }));

            setExternalTerritories(fetchedTerritories);
            setAugmentedTerritories(augmentTerritoryData(fetchedTerritories));
          } else {
            console.warn("Unexpected response structure:", response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch external territories", error);
        });
    } else {
      setAugmentedTerritories(augmentTerritoryData(territories));
    }
  }, [activeSource, territories, externalTerritories.length]);

  const getLevel = (territory: Territory | undefined): number => {
    return territory?.level || 1;
  };

  const findTerritoryById = (
    id: string,
    territories: Territory[]
  ): Territory | undefined => {
    for (const territory of territories) {
      if (territory.id === id) return territory;
      if (territory.children) {
        const found = findTerritoryById(id, territory.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const toggleSelect = (id: string) => {
    const territory = findTerritoryById(id, augmentedTerritories);
    const level = getLevel(territory);

    setSelectedTerritories((prev) => {
      const selectedInSameLevel = prev.filter((tid) => {
        const t = findTerritoryById(tid, augmentedTerritories);
        return t && getLevel(t) === level;
      });

      const isSelected = selectedInSameLevel.includes(id);
      if (isSelected) {
        return selectedInSameLevel.filter((tid) => tid !== id);
      } else {
        return [...selectedInSameLevel, id];
      }
    });
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filterTerritories = (territories: Territory[]) => {
    if (!territories) return [];
    return territories
      .map((territory) => ({
        ...territory,
        children: territory.children
          ?.map((province) => ({
            ...province,
            children: province.children?.filter((city) =>
              city.territory.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter(
            (province) =>
              province.children?.length ||
              province.territory
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          ),
      }))
      .filter(
        (territory) =>
          territory.children?.length ||
          territory.territory.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const selectGorontaloTerritories = () => {
    const nationalwide = territories.find((t) => t.id === "Nationalwide");
    if (nationalwide) {
      const gorontaloNode = nationalwide.children?.find(
        (child) => child.id === "Gorontalo"
      );
      if (gorontaloNode?.children) {
        const gorontaloTerritories = gorontaloNode.children.map(
          (child) => child.id
        );
        setSelectedTerritories(gorontaloTerritories);
      }
    }
  };

  const selectSulawesiSelatanTerritories = () => {
    const nationalwide = territories.find((t) => t.id === "Nationalwide");
    if (nationalwide) {
      const sulawesiSelatanNode = nationalwide.children?.find(
        (child) => child.id === "Sulawesi Selatan"
      );
      if (sulawesiSelatanNode?.children) {
        const sulawesiSelatanTerritories = sulawesiSelatanNode.children.map(
          (child) => child.id
        );
        setSelectedTerritories(sulawesiSelatanTerritories);
      }
    }
  };

  return (
    <>
      <div className="territory-picker">
        <button onClick={() => setIsOpen(!isOpen)} className="territory-button">
          Filter Territory
        </button>

        {isOpen && (
          <div className="territory-dropdown-container">
            <div className="territory-dropdown">
              <div className="source-tabs">
                <button
                  className={activeSource === "A" ? "active" : ""}
                  onClick={() => setActiveSource("A")}
                >
                  Source A
                </button>
                <button
                  className={activeSource === "B" ? "active" : ""}
                  onClick={() => setActiveSource("B")}
                >
                  Source B
                </button>
              </div>

              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search territory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="territory-list">
                {filterTerritories(augmentedTerritories).map((territory) => (
                  <div key={territory.id} className="territory-item">
                    <div className="territory-header">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          id={`checkbox-${territory.id}`}
                          checked={selectedTerritories.includes(territory.id)}
                          onChange={() => toggleSelect(territory.id)}
                        />
                        <label
                          htmlFor={`checkbox-${territory.id}`}
                          className="territory-label"
                        >
                          {territory.territory}
                        </label>
                      </div>
                      {territory.children && (
                        <span
                          className="expand-icon"
                          onClick={() => toggleExpand(territory.id)}
                        >
                          {expanded[territory.id] ? "▲" : "▼"}
                        </span>
                      )}
                    </div>

                    {territory.children && expanded[territory.id] && (
                      <div className="territory-sublist">
                        {territory.children.map((province) => (
                          <div key={province.id} className="territory-item">
                            <div className="territory-header">
                              <input
                                type="checkbox"
                                id={`checkbox-${province.id}`}
                                checked={selectedTerritories.includes(
                                  province.id
                                )}
                                onChange={() => toggleSelect(province.id)}
                              />
                              <label
                                htmlFor={`checkbox-${province.id}`}
                                className="territory-label"
                              >
                                {province.territory}
                              </label>
                              {province.children && (
                                <span
                                  className="expand-icon"
                                  onClick={() => toggleExpand(province.id)}
                                >
                                  {expanded[province.id] ? "▲" : "▼"}
                                </span>
                              )}
                            </div>

                            {province.children && expanded[province.id] && (
                              <div className="territory-sublist">
                                {province.children.map((city) => (
                                  <div key={city.id} className="territory-item">
                                    <div className="territory-header">
                                      <input
                                        type="checkbox"
                                        id={`checkbox-${city.id}`}
                                        checked={selectedTerritories.includes(
                                          city.id
                                        )}
                                        onChange={() => toggleSelect(city.id)}
                                      />
                                      <label
                                        htmlFor={`checkbox-${city.id}`}
                                        className="territory-label"
                                      >
                                        {city.territory}
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="preset-buttons-container">
          <button
            className="preset-button"
            onClick={selectGorontaloTerritories}
          >
            Select Gorontalo
          </button>
          <button
            className="preset-button"
            onClick={selectSulawesiSelatanTerritories}
          >
            Select Sulawesi Selatan
          </button>
        </div>
      </div>
    </>
  );
};
