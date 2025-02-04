import React, { useState } from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


/** Primary UI component for user interaction */
export const AgGridLegacy = () => {

  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ]);

  return (
    <div
      // define a height because the Data Grid will fill the size of the parent container
      style={{ height: 500, width: 500 }}
      className="ag-theme-balham"
    >
      hello aa
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
      />
    </div>
  );
};
