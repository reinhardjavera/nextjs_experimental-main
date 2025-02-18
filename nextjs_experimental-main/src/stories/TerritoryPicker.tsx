import React, { useEffect, useState } from "react";
import "./TerritoryPicker.css";
import axios from "axios";
import { augmentTerritoryData } from "../utils/utils";

interface Territory {
  id: string;
  territory: string;
  level?: number;
  children?: Territory[];
}

interface TerritoryPickerProps {
  territories: Territory[];
}

/*
const augmentTerritoryData = (
  territories: Territory[],
  currentLevel = 1
): Territory[] => {
  return territories.map((territory) => ({
    ...territory,
    level: currentLevel, // Tetapkan level untuk debugging
    children:
      Array.isArray(territory.children) && territory.children.length > 0
        ? augmentTerritoryData(territory.children, currentLevel + 1) // Rekursi tanpa batas level
        : [], // Set array kosong jika tidak ada children untuk menghindari undefined
  }));
};
*/

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
    if (activeSource === "B") {
      if (externalTerritories.length === 0) {
        axios
          //.get("http://192.168.68.53:5000/api/territory_data")
          .get(
            "https://dev.braincodetech.id/inap/api/availability-dashboard/bc_territory2?end_date=20240930"
          )
          .then((response) => {
            console.log("API Response (Raw):", response.data);

            if (response.data && Array.isArray(response.data.tsel)) {
              const fetchedTerritories = response.data.tsel[0]?.children || [];

              console.log(
                "Fetched Territories (before augment):",
                fetchedTerritories
              );

              const processedTerritories =
                augmentTerritoryData(fetchedTerritories);

              console.log(
                "Processed Territories (after augment):",
                processedTerritories
              );

              setExternalTerritories(processedTerritories);
              setAugmentedTerritories(processedTerritories);
            } else {
              console.warn("Unexpected response structure:", response.data);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch external territories", error);
          });
      } else {
        setAugmentedTerritories(externalTerritories);
      }
    } else {
      setAugmentedTerritories(augmentTerritoryData(territories));
    }
  }, [activeSource, territories, externalTerritories]);

  // Reset selectedTerritories dan expanded state saat berpindah source
  useEffect(() => {
    setSelectedTerritories([]); // Reset checkbox selection
    setExpanded({}); // Reset expand state agar tertutup kembali
  }, [activeSource]);

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

  const filterTerritories = (territories: Territory[]): Territory[] => {
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
              province.children ||
              province.territory
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          ),
      }))
      .filter(
        (territory) =>
          territory.children ||
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

  const renderTerritories = (territories: Territory[], level = 1) => {
    return territories.map((territory) => (
      <div key={territory.id} className="territory-item">
        <div className="territory-header">
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
          {territory.children && territory.children.length > 0 && (
            <span
              className="expand-icon"
              onClick={() => toggleExpand(territory.id)}
            >
              {expanded[territory.id] ? "▲" : "▼"}
            </span>
          )}
        </div>

        {territory.children &&
          territory.children.length > 0 &&
          expanded[territory.id] && (
            <div
              className="territory-sublist"
              style={{ paddingLeft: `${level * 10}px` }} // Indentasi berdasarkan level
            >
              {renderTerritories(territory.children, level + 1)}
            </div>
          )}
      </div>
    ));
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
                {renderTerritories(filterTerritories(augmentedTerritories))}
              </div>

              {/*
              <div className="territory-list">
                {filterTerritories(augmentedTerritories).map((territory) => (
                  <div key={territory.id} className="territory-item">
                    <div className="territory-header">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
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
              */}
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
