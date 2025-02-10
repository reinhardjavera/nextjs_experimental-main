import React, { useState } from "react";
import "./TerritoryPicker.css";

interface Territory {
  id: string;
  name: string;
  children?: Territory[];
}

interface TerritoryPickerProps {
  territories: Territory[];
}

export const TerritoryPicker: React.FC<TerritoryPickerProps> = ({
  territories,
}) => {
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [activeSource, setActiveSource] = useState<"A" | "B">("A");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State untuk search bar

  const toggleSelect = (id: string, level: number) => {
    setSelectedTerritories((prev) => {
      const selectedInSameLevel = prev.filter((tid) => getLevel(tid) === level);
      const isSelected = selectedInSameLevel.includes(id);

      if (isSelected) {
        return selectedInSameLevel.filter((tid) => tid !== id); // Unselect if already selected
      } else {
        return [...selectedInSameLevel, id]; // Add to selection if not selected
      }
    });
  };

  // Helper function to get level of a territory
  const getLevel = (id: string): number => {
    if (id === "nationalwide") return 1; // Level 1
    if (["gorontalo", "sulawesi-selatan"].includes(id)) return 2; // Level 2
    return 3; // Assume others are Level 3
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter wilayah berdasarkan input search
  const filterTerritories = (territories: Territory[]) => {
    return territories
      .map((territory) => ({
        ...territory,
        children: territory.children
          ?.map((province) => ({
            ...province,
            children: province.children?.filter(
              (city) =>
                city?.name &&
                city.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter(
            (province) =>
              province.children?.length ||
              (province.name &&
                province.name.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
      }))
      .filter(
        (territory) =>
          territory.children?.length ||
          (territory.name &&
            territory.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  };

  return (
    <div className="territory-picker">
      <button onClick={() => setIsOpen(!isOpen)} className="territory-button">
        Filter Territory
      </button>

      {isOpen && (
        <div className="territory-dropdown">
          {/* Tabs Source A & B */}
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

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search territory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Wilayah */}
          <div className="territory-list">
            {filterTerritories(territories).map((territory) => (
              <div key={territory.id} className="territory-item">
                <div className="territory-header">
                  <input
                    type="checkbox"
                    id={`checkbox-${territory.id}`}
                    checked={selectedTerritories.includes(territory.id)}
                    onChange={() => toggleSelect(territory.id, 1)}
                  />
                  <label
                    htmlFor={`checkbox-${territory.id}`}
                    onClick={() => toggleExpand(territory.id)}
                    className="territory-label"
                  >
                    {territory.name}{" "}
                    {territory.children && (expanded[territory.id] ? "▲" : "▼")}
                  </label>
                </div>

                {/* provinsi*/}
                {territory.children && expanded[territory.id] && (
                  <div className="territory-sublist">
                    {territory.children.map((province) => (
                      <div key={province.id} className="territory-item">
                        <div className="territory-header">
                          <input
                            type="checkbox"
                            checked={selectedTerritories.includes(province.id)}
                            onChange={() => toggleSelect(province.id, 2)}
                          />
                          <span onClick={() => toggleExpand(province.id)}>
                            {province.name}{" "}
                            {province.children &&
                              (expanded[province.id] ? "▲" : "▼")}
                          </span>
                        </div>

                        {/* sub kota dalam provinsi*/}
                        {province.children && expanded[province.id] && (
                          <div className="territory-sublist">
                            {province.children.map((city) => (
                              <div key={city.id} className="territory-item">
                                <div className="territory-header">
                                  <input
                                    type="checkbox"
                                    checked={selectedTerritories.includes(
                                      city.id
                                    )}
                                    onChange={() => toggleSelect(city.id, 3)}
                                  />
                                  {city.name}
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
      )}
    </div>
  );
};
