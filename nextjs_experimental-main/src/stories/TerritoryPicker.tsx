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
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelect = (id: string) => {
    const level = getLevel(id); // buat dapetin level of the current id
    setSelectedTerritories((prev) => {
      const selectedInSameLevel = prev.filter((tid) => getLevel(tid) === level);
      const isSelected = selectedInSameLevel.includes(id);

      if (isSelected) {
        return selectedInSameLevel.filter((tid) => tid !== id);
      } else {
        return [...selectedInSameLevel, id];
      }
    });
  };

  // determine level of territory
  const getLevel = (id: string): number => {
    if (id === "nationalwide") return 1; // Level 1
    if (["gorontalo", "sulawesi-selatan"].includes(id)) return 2; // Level 2
    return 3; // Level 3
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filterTerritories = (territories: Territory[]) => {
    return territories
      .map((territory) => ({
        ...territory,
        children: territory.children
          ?.map((province) => ({
            ...province,
            children: province.children?.filter((city) =>
              city.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter(
            (province) =>
              province.children?.length ||
              province.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
      }))
      .filter(
        (territory) =>
          territory.children?.length ||
          territory.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  return (
    <div className="territory-picker">
      <button onClick={() => setIsOpen(!isOpen)} className="territory-button">
        Filter Territory
      </button>

      {isOpen && (
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

          {/* Wilayah */}
          <div className="territory-list">
            {filterTerritories(territories).map((territory) => (
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
                    {territory.name}
                  </label>
                  {territory.children && (
                    <span
                      className="expand-icon"
                      onClick={() => toggleExpand(territory.id)}
                    >
                      {expanded[territory.id] ? "▲" : "▼"}
                    </span>
                  )}
                </div>

                {/* Provinsi */}
                {territory.children && expanded[territory.id] && (
                  <div className="territory-sublist">
                    {territory.children.map((province) => (
                      <div key={province.id} className="territory-item">
                        <div className="territory-header">
                          <input
                            type="checkbox"
                            id={`checkbox-${province.id}`}
                            checked={selectedTerritories.includes(province.id)}
                            onChange={() => toggleSelect(province.id)}
                          />
                          <label
                            htmlFor={`checkbox-${province.id}`}
                            className="territory-label"
                          >
                            {province.name}
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

                        {/* Kota */}
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
                                    {city.name}
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
      )}
    </div>
  );
};
