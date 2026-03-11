export function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-white py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-white/20">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Open Source · MIT License · No DnD dependencies
        </div>

        {/* Title */}
        <h1 className="text-6xl font-extrabold mb-5 tracking-tight leading-tight">
          React{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            DnD
          </span>{" "}
          Framework
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-slate-300 mb-5 max-w-2xl mx-auto leading-relaxed">
          A lightweight, flexible drag-and-drop library built from scratch for React.
          Free drag, droppable zones, and sortable lists — with a clean API that stays out of your way.
        </p>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto text-base leading-relaxed">
          Built to solve real DOM layering and z-index problems that existing libraries don't handle well.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#examples"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-7 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/30"
          >
            See Examples ↓
          </a>
          <a
            href="#quickstart"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3 rounded-xl transition-colors border border-white/20"
          >
            Quick Start
          </a>
          <a
            href="https://github.com/yourusername/react-dnd-framework"
            target="_blank"
            rel="noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3 rounded-xl transition-colors border border-white/20"
          >
            GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
