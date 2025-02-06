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

  const toggleSelect = (id: string) => {
    setSelectedTerritories((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
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

          {/* Wilayah */}
          <div className="territory-list">
            {territories.map((territory) => (
              <div key={territory.id} className="territory-item">
                <div className="territory-header">
                  <input
                    type="checkbox"
                    checked={selectedTerritories.includes(territory.id)}
                    onChange={() => toggleSelect(territory.id)}
                  />
                  <span onClick={() => toggleExpand(territory.id)}>
                    {territory.name}{" "}
                    {territory.children && (expanded[territory.id] ? "▲" : "▼")}
                  </span>
                </div>

                {/* Jika ada sub-wilayah (Provinsi), tampilkan di bawah */}
                {territory.children && expanded[territory.id] && (
                  <div className="territory-sublist">
                    {territory.children.map((province) => (
                      <div key={province.id} className="territory-item">
                        <div className="territory-header">
                          <input
                            type="checkbox"
                            checked={selectedTerritories.includes(province.id)}
                            onChange={() => toggleSelect(province.id)}
                          />
                          <span onClick={() => toggleExpand(province.id)}>
                            {province.name}{" "}
                            {province.children &&
                              (expanded[province.id] ? "▲" : "▼")}
                          </span>
                        </div>

                        {/* Jika ada sub-kota dalam provinsi, tampilkan */}
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
                                    onChange={() => toggleSelect(city.id)}
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
