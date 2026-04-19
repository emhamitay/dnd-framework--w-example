import { useState } from "react";
import type { ReactNode, RefObject } from "react";
import { DndProvider } from "@lib/context/DndProvider";
import { GhostLayer } from "@lib/GhostLayer";
import { Draggable } from "@lib/wrappers/Draggable";
import { Droppable } from "@lib/wrappers/Droppable";
import type { DndItem } from "@lib/index";

const CODE = `import { useState } from 'react';
import type { DndItem } from '@emhamitay/ghostdrop';
import { DndProvider, GhostLayer, Draggable, Droppable } from '@emhamitay/ghostdrop';

type Toast = { message: string; color: string } | null;

const EMAILS = [
  { id: 'email-1', subject: 'Q4 Report', from: 'alice@acme.com' },
  { id: 'email-2', subject: 'Team Lunch?', from: 'bob@acme.com' },
  { id: 'email-3', subject: 'Invoice #8821', from: 'finance@acme.com' },
];

function App() {
  const [emails, setEmails] = useState(EMAILS);
  const [toast, setToast] = useState<Toast>(null);

  const remove = (id: string) => setEmails(e => e.filter(x => x.id !== id));

  return (
    <DndProvider>
      <GhostLayer />

      {/* Draggable emails */}
      {emails.map(email => (
        <Draggable key={email.id} id={email.id} data={email}>
          <div className="email-card">{email.subject}</div>
        </Draggable>
      ))}

      {/* Drop zones — each zone sets a different toast message on hover */}
      <Droppable
        id="archive"
        onHoverEnter={(item: DndItem) =>
          setToast({ message: \`📦 Archive "\${item.data.subject}"?\`, color: 'blue' })}
        onHoverLeave={() => setToast(null)}
        onDrop={(item: DndItem) => { remove(item.id); setToast(null); }}
      >
        <div className="zone">📦 Archive</div>
      </Droppable>

      <Droppable
        id="send"
        onHoverEnter={(item: DndItem) =>
          setToast({ message: \`📤 Send "\${item.data.subject}" now?\`, color: 'green' })}
        onHoverLeave={() => setToast(null)}
        onDrop={(item: DndItem) => { remove(item.id); setToast(null); }}
      >
        <div className="zone">📤 Send</div>
      </Droppable>

      <Droppable
        id="delete"
        onHoverEnter={(item: DndItem) =>
          setToast({ message: \`🗑️ Delete "\${item.data.subject}"?\`, color: 'red' })}
        onHoverLeave={() => setToast(null)}
        onDrop={(item: DndItem) => { remove(item.id); setToast(null); }}
      >
        <div className="zone">🗑️ Delete</div>
      </Droppable>

      {/* Toast lives outside all zones — only possible with callbacks, not isHover */}
      {toast && (
        <div className={\`toast toast--\${toast.color}\`}>
          {toast.message}
        </div>
      )}
    </DndProvider>
  );
}`;

const EMAILS_DATA = [
  { id: "email-1", subject: "Q4 Report", from: "alice@acme.com", icon: "📊" },
  { id: "email-2", subject: "Team Lunch?", from: "bob@acme.com", icon: "🍕" },
  { id: "email-3", subject: "Invoice #8821", from: "finance@acme.com", icon: "💰" },
];

type Toast = { message: string; colorClass: string } | null;

const ZONES = [
  {
    id: "archive",
    label: "Archive",
    icon: "📦",
    hoverBorder: "border-blue-400 bg-blue-50 scale-105",
    idleBorder: "border-blue-200 bg-blue-50/40",
    toastColor: "bg-blue-50 border-blue-200 text-blue-700",
    makeMsg: (subject: string) => `📦 Archive "${subject}"?`,
  },
  {
    id: "send",
    label: "Send",
    icon: "📤",
    hoverBorder: "border-emerald-400 bg-emerald-50 scale-105",
    idleBorder: "border-emerald-200 bg-emerald-50/40",
    toastColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
    makeMsg: (subject: string) => `📤 Send "${subject}" now?`,
  },
  {
    id: "delete",
    label: "Delete",
    icon: "🗑️",
    hoverBorder: "border-red-400 bg-red-50 scale-105",
    idleBorder: "border-red-200 bg-red-50/40",
    toastColor: "bg-red-50 border-red-200 text-red-700",
    makeMsg: (subject: string) => `🗑️ Delete "${subject}"?`,
  },
];

function Demo() {
  const [emails, setEmails] = useState(EMAILS_DATA);
  const [toast, setToast] = useState<Toast>(null);
  const [done, setDone] = useState<{ subject: string; action: string; icon: string }[]>([]);

  const remove = (id: string) => setEmails((e) => e.filter((x) => x.id !== id));

  return (
    <DndProvider>
      <GhostLayer />
      <div className="flex flex-col gap-4 py-2">
        {/* Email inbox */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Inbox — drag an email to a zone
          </p>
          <div className="flex flex-col gap-2 min-h-8">
            {emails.length === 0 ? (
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 italic">Inbox zero! 🎉</p>
                <button
                  onClick={() => { setEmails(EMAILS_DATA); setDone([]); }}
                  className="text-xs text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  ↺ Reset
                </button>
              </div>
            ) : (
              emails.map((email) => (
                <Draggable key={email.id} id={email.id} data={email}>
                  <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 shadow-sm select-none cursor-grab hover:shadow-md transition-shadow flex items-center gap-3">
                    <span className="text-lg">{email.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{email.subject}</p>
                      <p className="text-xs text-slate-400 truncate">{email.from}</p>
                    </div>
                  </div>
                </Draggable>
              ))
            )}
          </div>
        </div>

        {/* Three drop zones */}
        <div className="grid grid-cols-3 gap-2">
          {ZONES.map((zone) => (
            <Droppable
              key={zone.id}
              id={zone.id}
              onHoverEnter={(item: DndItem) =>
                setToast({
                  message: zone.makeMsg((item.data as { subject: string }).subject),
                  colorClass: zone.toastColor,
                })
              }
              onHoverLeave={() => setToast(null)}
              onDrop={(item: DndItem) => {
                remove(item.id);
                setDone((d) => [
                  ...d,
                  { subject: (item.data as { subject: string }).subject, action: zone.label, icon: zone.icon },
                ]);
                setToast(null);
              }}
            >
              {(isHover: boolean, ref: RefObject<HTMLElement | null>) => (
                <div
                  ref={ref as RefObject<HTMLDivElement>}
                  className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 py-4 text-center transition-all duration-150 ${
                    isHover ? zone.hoverBorder : zone.idleBorder
                  }`}
                >
                  <span className="text-xl">{zone.icon}</span>
                  <span className="text-xs font-semibold text-slate-600">{zone.label}</span>
                </div>
              )}
            </Droppable>
          ))}
        </div>

        {/* Toast — lives outside all drop zones */}
        <div
          className={`transition-all duration-200 rounded-xl px-4 py-2.5 text-sm font-medium border ${
            toast ? `${toast.colorClass} opacity-100` : "opacity-0 h-0 py-0 overflow-hidden border-transparent"
          }`}
        >
          {toast?.message ?? "\u200b"}
        </div>

        {/* Action log */}
        {done.length > 0 && (
          <div className="bg-slate-950 rounded-xl p-3 font-mono space-y-1">
            {done.map((entry, i) => (
              <p key={i} className="text-xs text-slate-300">
                onDrop called → {entry.icon} {entry.action}: &quot;{entry.subject}&quot;
              </p>
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export function Example5Toast({
  CodeBlock,
}: {
  CodeBlock: (props: { code: string; label: string }) => ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 items-start">
      {/* Left column: demo + explainer stacked */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <Demo />
        </div>
        {/* Explainer */}
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          {/* isHover row */}
          <div className="bg-blue-50 border-b border-slate-200 px-5 py-4">
            <p className="font-bold text-blue-700 text-sm mb-1 flex items-center gap-1.5">
              <code className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-xs">isHover</code>
              — inline zone styling
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Best for changing the zone's own appearance: border colour, background, scale, "Release!" text.
              Zero boilerplate — the render prop gives you a boolean and a ref, nothing else needed.
            </p>
          </div>
          {/* callbacks row */}
          <div className="bg-violet-50 px-5 py-4">
            <p className="font-bold text-violet-700 text-sm mb-1 flex items-center gap-1.5">
              <code className="font-mono bg-violet-100 px-1.5 py-0.5 rounded text-xs">onHoverEnter</code>
              <span className="text-violet-400">/</span>
              <code className="font-mono bg-violet-100 px-1.5 py-0.5 rounded text-xs">onHoverLeave</code>
              — side-effects anywhere
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Use when the reaction lives <strong>outside</strong> the zone — a toast, a preview panel, a log.
              The callback receives the dragged <code className="font-mono text-xs bg-violet-100 px-1 rounded">item</code>{" "}
              so you know <em>which</em> item is hovering, not just that something is.
            </p>
          </div>
        </div>
      </div>
      {/* Right column: code */}
      <CodeBlock code={CODE} label="Example5.tsx" />
    </div>
  );
}
