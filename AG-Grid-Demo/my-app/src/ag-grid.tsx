"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ClientSideRowModelModule,
  AutoGroupColumnDef,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from 'ag-grid-enterprise';
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  RowGroupingModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);
import { useFetchJson } from "./useFetchJson";

export const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "athlete",
      filter: true,
    },
    {
      field: "country",
      filter: "agTextColumnFilter",
    },
    {
      field: "sport",
      filter: true,
      rowGroup: true,
      // hide: true
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);

  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const autoGroupColumnDef = useMemo<AutoGroupColumnDef>(() => {
    return {
      headerName: 'Sport',
      minWidth: 200,
    };
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <div style={containerStyle}>
        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            theme="legacy"
          />
        </div>
      </div>
    </div>
  );
};
