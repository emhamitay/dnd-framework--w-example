export function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-white py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-white/20">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          React drag-and-drop library · MIT · Zero dependencies
        </div>

        {/* Brand name */}
        <h1 className="text-7xl font-black mb-8 tracking-tight leading-none">
          <span className="text-white">Ghost </span><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Drop</span>
        </h1>

        {/* Why it's different */}
        <p className="text-base text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
          The drag preview renders via a React portal — above every
          {" "}<code className="text-indigo-300 font-mono text-sm">z-index</code>,
          never clipped by{" "}<code className="text-indigo-300 font-mono text-sm">overflow: hidden</code>.
          Clean API, full control over what you drag and where it lands.
        </p>
        <p className="text-sm text-slate-500 mb-10 max-w-xl mx-auto">
          Built from scratch because existing libraries don't solve this well.
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
            href="https://github.com/emhamitay/ghostdrop"
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
