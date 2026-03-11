export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-indigo-400 font-black text-xl">⚡</span>
          <span className="font-bold text-white text-lg">DnD Framework</span>
        </div>
        <p className="text-sm mb-6 text-slate-400">
          A lightweight, flexible drag-and-drop library built from scratch for React.
        </p>
        <div className="flex justify-center gap-8 text-sm mb-8">
          <a
            href="https://github.com/yourusername/react-dnd-framework"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://npmjs.com/package/react-dnd-framework"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            npm
          </a>
        </div>
        <p className="text-xs text-slate-600">MIT License · Built with React & Vite</p>
      </div>
    </footer>
  );
}
