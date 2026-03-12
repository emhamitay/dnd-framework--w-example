import { useState } from "react";
import { CodeBlock as CodeBlockBase } from "../components/CodeBlock";
import { Example1BasicDrop } from "../examples/Example1BasicDrop";
import { Example2HoverFeedback } from "../examples/Example2HoverFeedback";
import { Example2Sortable } from "../examples/Example2Sortable";
import { Example3Mixed } from "../examples/Example3Mixed";
import { Example4MultiGroup } from "../examples/Example4MultiGroup";
import { Example5Toast } from "../examples/Example5Toast";

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
  return <CodeBlockBase code={code} label={label} stretch />;
}

export function Examples() {
  const [activeTab, setActiveTab] = useState("ex1");
  const active = TABS.find((t) => t.id === activeTab);

  return (
    <section id="examples" className="bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
          Examples
        </h2>
        <p className="text-slate-500 text-center mb-12 text-lg max-w-xl mx-auto">
          From a single drop to complex multi-group interactions — each example is live and interactive.
        </p>

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
    </section>
  );
}
