import { useState } from "react";
import { CodeBlockReact } from "./CodeBlockReact";
import { Example1BasicDrop } from "./Example1BasicDrop";
import { Example2HoverFeedback } from "./Example2HoverFeedback";
import { Example2Sortable } from "./Example2Sortable";
import { Example3Mixed } from "./Example3Mixed";
import { Example4MultiGroup } from "./Example4MultiGroup";
import { Example5Toast } from "./Example5Toast";

const TABS = [
  {
    id: "ex1",
    label: "1 · Drop with callback",
    sublabel: "Simplest possible drag + drop",
    Component: Example1BasicDrop,
  },
  {
    id: "ex2",
    label: "2 · Hover feedback",
    sublabel: "React to what's being dragged",
    Component: Example2HoverFeedback,
  },
  {
    id: "ex3",
    label: "3 · Sortable list",
    sublabel: "Reorder items by dragging",
    Component: Example2Sortable,
  },
  {
    id: "ex4",
    label: "4 · Drag into sortable",
    sublabel: "Combine drop zones with sorting",
    Component: Example3Mixed,
  },
  {
    id: "ex5",
    label: "5 · Multiple groups",
    sublabel: "Independent zones, different callbacks",
    Component: Example4MultiGroup,
  },
  {
    id: "ex6",
    label: "6 · Hover callbacks",
    sublabel: "onHoverEnter/Leave for side-effects",
    Component: Example5Toast,
  },
];

// CodeBlock passed to each example — stretched to fill the column height
function CodeBlock({ code, label }: { code: string; label: string }) {
  return <CodeBlockReact code={code} label={label} stretch />;
}

export function ExamplesIsland() {
  const [activeTab, setActiveTab] = useState("ex1");
  const active = TABS.find((t) => t.id === activeTab);

  return (
    <div>
      {/* Tab bar */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center text-center w-full px-4 py-3 rounded-xl border transition-all text-sm font-semibold cursor-pointer ${
              activeTab === tab.id
                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            <span>{tab.label} </span>
            <span className={`text-xs font-normal mt-1.5 ${activeTab === tab.id ? "text-indigo-300" : "text-slate-500"}`}>
              {tab.sublabel}
            </span>
          </button>
        ))}
      </div>

      {/* Active example */}
      {active && <active.Component CodeBlock={CodeBlock} />}
    </div>
  );
}
