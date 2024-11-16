"use client";

import { FC } from "react";

interface SimpleViewProps {
  data: Record<string, any>; // Data yang akan ditampilkan
  columns: string[]; // Kolom yang ingin ditampilkan
}

const SimpleView: FC<SimpleViewProps> = ({ data, columns }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Details</h2>
      <div className="grid grid-cols-2 gap-4">
        {columns.map((column) => (
          <div key={column}>
            <strong>{column.charAt(0).toUpperCase() + column.slice(1)}:</strong> {data[column] || "-"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleView;
