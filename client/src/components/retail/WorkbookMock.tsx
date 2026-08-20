import React from "react";

/**
 * The workbook — the section that converts.
 *
 * This is the difference between "another AI thing" and "a tool that produced an
 * artifact I can use on Monday", so it is rendered as a spreadsheet rather than
 * as a web table: gridlines, column letters, row numbers, a formula bar with a
 * live formula in it, and a sheet tab. It should be unmistakably Excel.
 *
 * Built in markup rather than shipped as a screenshot. It stays sharp on any
 * screen, costs nothing to download on an in-app browser that abandons past
 * about three seconds, and the numbers stay selectable and readable.
 *
 * Deliberately unbranded — no logo, no SWiM colours, no footer. Outputs are the
 * retailer's own internal documents, and the fact that they are unbranded is
 * itself part of the pitch.
 *
 * Every figure here is illustrative and is labelled as such below the sheet.
 */

interface Row {
  category: string;
  receipt: string;
  vsLy?: string;
  vsLyPositive?: boolean;
  conf?: "H" | "L";
  total?: boolean;
}

const ROWS: Row[] = [
  { category: "Dresses", receipt: "$148,400", vsLy: "+12%", vsLyPositive: true, conf: "H" },
  { category: "Denim", receipt: "$86,200", vsLy: "−4%", vsLyPositive: false, conf: "H" },
  { category: "Knits", receipt: "$64,900", vsLy: "+9%", vsLyPositive: true, conf: "L" },
  { category: "Accessories", receipt: "$38,750", vsLy: "+6%", vsLyPositive: true, conf: "H" },
  { category: "Open-to-buy", receipt: "$338,250", total: true },
];

// Widths are tuned so all four columns — including Conf — fit inside a 390px
// viewport without horizontal scrolling. The H/L tag is the strongest claim on
// the page and the next section explains it, so she has to see the column
// before she gets there rather than discover it by swiping.
const COLUMNS = [
  { letter: "A", label: "Category", width: "w-[112px] sm:w-[190px]" },
  { letter: "B", label: "Receipt $", width: "w-[88px] sm:w-[128px]" },
  { letter: "C", label: "vs LY", width: "w-[58px] sm:w-[96px]" },
  { letter: "D", label: "Conf", width: "w-[46px] sm:w-[80px]" },
];

// Excel chrome. Light on purpose — a spreadsheet looks like a spreadsheet, and
// the contrast against the page is what makes it read as a real file.
const cellBase =
  "border-r border-b border-[#d4d4d4] px-1.5 sm:px-2 py-1.5 text-[12px] sm:text-[13px] leading-tight truncate";

const WorkbookMock: React.FC = () => (
  <div>
    <div className="rounded-lg overflow-hidden shadow-2xl bg-white text-[#1a1a1a] font-sans select-none">
      {/* Formula bar — the detail that makes it unmistakably a spreadsheet, and
          the point of the section: click any total and the formula is right
          there. */}
      <div className="flex items-stretch border-b border-[#d4d4d4] bg-[#f8f8f8]">
        <div className="px-2 py-1.5 text-[12px] font-medium text-[#444] border-r border-[#d4d4d4] w-[52px] flex items-center">
          B6
        </div>
        <div className="px-2 py-1.5 text-[12px] text-[#666] border-r border-[#d4d4d4] flex items-center italic">
          fx
        </div>
        <div className="px-2 py-1.5 text-[12px] font-mono text-[#1a1a1a] flex items-center overflow-x-auto whitespace-nowrap">
          =SUM(B2:B5)
        </div>
      </div>

      {/* The grid. Scrolls horizontally on a phone rather than forcing the page
          body sideways. */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Column letters */}
          <div className="flex bg-[#f3f3f3]">
            <div className="w-[26px] sm:w-[34px] flex-shrink-0 border-r border-b border-[#d4d4d4]" />
            {COLUMNS.map((col) => (
              <div
                key={col.letter}
                className={`${col.width} flex-shrink-0 border-r border-b border-[#d4d4d4] px-2 py-1 text-[11px] text-center text-[#666] font-medium`}
              >
                {col.letter}
              </div>
            ))}
          </div>

          {/* Header row (row 1) */}
          <div className="flex">
            <div className="w-[26px] sm:w-[34px] flex-shrink-0 bg-[#f3f3f3] border-r border-b border-[#d4d4d4] px-1 py-1.5 text-[11px] text-center text-[#666]">
              1
            </div>
            {COLUMNS.map((col) => (
              <div
                key={col.letter}
                className={`${col.width} flex-shrink-0 ${cellBase} font-semibold bg-[#fafafa]`}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {ROWS.map((row, i) => (
            <div key={row.category} className="flex">
              <div className="w-[26px] sm:w-[34px] flex-shrink-0 bg-[#f3f3f3] border-r border-b border-[#d4d4d4] px-1 py-1.5 text-[11px] text-center text-[#666]">
                {i + 2}
              </div>
              <div
                className={`${COLUMNS[0].width} flex-shrink-0 ${cellBase} ${
                  row.total ? "font-bold bg-[#fafafa]" : ""
                }`}
              >
                {row.category}
              </div>
              <div
                className={`${COLUMNS[1].width} flex-shrink-0 ${cellBase} text-right tabular-nums ${
                  row.total
                    ? "font-bold bg-[#e8f0e8] ring-1 ring-inset ring-[#217346]"
                    : ""
                }`}
              >
                {row.receipt}
              </div>
              <div
                className={`${COLUMNS[2].width} flex-shrink-0 ${cellBase} text-right tabular-nums ${
                  row.total
                    ? "bg-[#fafafa]"
                    : row.vsLyPositive
                      ? "text-[#217346]"
                      : "text-[#c0392b]"
                }`}
              >
                {row.vsLy ?? ""}
              </div>
              <div
                className={`${COLUMNS[3].width} flex-shrink-0 ${cellBase} text-center ${
                  row.total ? "bg-[#fafafa]" : ""
                }`}
              >
                {row.conf ? (
                  <span
                    className={`inline-block min-w-[20px] rounded px-1.5 py-0.5 text-[11px] font-bold ${
                      row.conf === "H"
                        ? "bg-[#d8ecd8] text-[#1c5c38]"
                        : "bg-[#fbe6c8] text-[#8a5a00]"
                    }`}
                  >
                    {row.conf}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sheet tab */}
      <div className="flex items-end bg-[#f3f3f3] border-t border-[#d4d4d4] px-2 pt-1.5">
        <div className="bg-white border border-b-0 border-[#d4d4d4] rounded-t px-3 py-1 text-[11px] font-medium text-[#217346]">
          Fall OTB
        </div>
        <div className="px-3 py-1 text-[11px] text-[#888]">Assumptions</div>
        <div className="px-3 py-1 text-[11px] text-[#888]">Vendor Split</div>
      </div>
    </div>

    <p className="text-white/50 font-inter text-xs mt-3 text-center">
      Illustrative figures. Your workbook is built from your own sales history.
    </p>
  </div>
);

export default WorkbookMock;
