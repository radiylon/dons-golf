"use client";

import { useRef, type ReactNode } from "react";

export default function CollapsibleRow({ isExpanded, colSpan, children }: { isExpanded: boolean; colSpan: number; children: ReactNode }) {
  const hasExpanded = useRef(false);
  if (isExpanded) hasExpanded.current = true;

  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <div className={`grid transition-[grid-template-rows] duration-200 ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className={`overflow-hidden transition-opacity duration-200 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
            {hasExpanded.current && children}
          </div>
        </div>
      </td>
    </tr>
  );
}
