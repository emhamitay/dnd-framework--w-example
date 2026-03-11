const FEATURES = [
  {
    icon: "🎯",
    title: "Dynamic drag with any callback",
    desc: "Every drop zone runs your own callback. Log, toast, mutate state, call an API — the framework doesn't dictate what happens on drop.",
  },
  {
    icon: "↕️",
    title: "Sorting — with or without drag-out",
    desc: "Add sortable reordering to any list. Items can be sorted within the group, or dragged out to a separate zone entirely.",
  },
  {
    icon: "🗂️",
    title: "Multiple independent groups",
    desc: "Define as many groups as you need, each with its own items, sort logic, and callback. They stay completely isolated.",
  },
  {
    icon: "👻",
    title: "Bring your own ghost",
    desc: "Use the built-in GhostLayer for instant visual feedback, or skip it and build your own custom drag preview. Fully optional.",
  },
  {
    icon: "🧱",
    title: "No DOM layering issues",
    desc: "Built specifically to avoid z-index, portal, and stacking-context bugs that plague other DnD libraries. The ghost renders at body level via a React portal.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
          Why this framework?
        </h2>
        <p className="text-slate-500 text-center mb-14 text-lg max-w-xl mx-auto">
          Built from scratch to solve real problems — not a wrapper around another DnD library.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-slate-50 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-slate-100"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-slate-900 font-bold mb-2 text-base">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
