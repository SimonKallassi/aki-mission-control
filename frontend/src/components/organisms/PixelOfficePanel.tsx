"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";

// ─── Aki Industries Agent Roster ────────────────────────────────────────────

export interface AkiAgent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  color: string;
  deskRow: number;
  deskCol: number;
}

export interface AkiTask {
  id: string | number;
  title: string;
  agent?: string | null;
}

export const AKI_AGENTS: AkiAgent[] = [
  { id: "aki",     name: "Aki",     emoji: "🧞",  role: "CEO / Orchestrator",  color: "#7C3AED", deskRow: 0, deskCol: 0 },
  { id: "ghabash", name: "Ghabash", emoji: "🛠️", role: "Engineering",          color: "#2563EB", deskRow: 0, deskCol: 1 },
  { id: "basma",   name: "Basma",   emoji: "📋",  role: "Operations",           color: "#059669", deskRow: 0, deskCol: 2 },
  { id: "nader",   name: "Nader",   emoji: "🔎",  role: "Research",             color: "#D97706", deskRow: 0, deskCol: 3 },
  { id: "layla",   name: "Layla",   emoji: "✍️",  role: "Growth & Content",     color: "#DB2777", deskRow: 0, deskCol: 4 },
  { id: "rami",    name: "Rami",    emoji: "🕸️", role: "Data & Scraping",      color: "#0891B2", deskRow: 1, deskCol: 0 },
  { id: "mira",    name: "Mira",    emoji: "🎬",  role: "Media & Creative",     color: "#9333EA", deskRow: 1, deskCol: 1 },
  { id: "omar",    name: "Omar",    emoji: "📈",  role: "Sales Systems",        color: "#16A34A", deskRow: 1, deskCol: 2 },
  { id: "dina",    name: "Dina",    emoji: "🧭",  role: "Process & SOPs",       color: "#EA580C", deskRow: 1, deskCol: 3 },
  { id: "sami",    name: "Sami",    emoji: "🛡️", role: "QA / Audit",           color: "#DC2626", deskRow: 1, deskCol: 4 },
  { id: "noor",    name: "Noor",    emoji: "⚙️",  role: "Automation",           color: "#6366F1", deskRow: 1, deskCol: 5 },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Desk({ x, y, agent }: { x: number; y: number; agent: AkiAgent }) {
  return (
    <div className="absolute flex flex-col items-center" style={{ left: x, top: y, width: 72 }}>
      <div
        className="w-10 h-7 rounded-sm border-2 flex items-center justify-center relative"
        style={{ borderColor: agent.color + "80", backgroundColor: agent.color + "15" }}
      >
        <div className="w-6 h-4 rounded-sm bg-gray-900 flex items-center justify-center">
          <div className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: agent.color + "40" }}>
            <div className="grid grid-cols-3 gap-0.5 p-0.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-0.5 rounded-full bg-current opacity-60" style={{ color: agent.color }} />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1.5 w-3 h-1.5 border-b-2 border-x-2 rounded-b-sm" style={{ borderColor: agent.color + "60" }} />
      </div>
      <div className="w-16 h-3 rounded-sm mt-1 border" style={{ backgroundColor: agent.color + "20", borderColor: agent.color + "40" }} />
      <div
        className="mt-1 font-mono px-1.5 py-0.5 rounded text-center"
        style={{ backgroundColor: agent.color + "30", color: agent.color, fontSize: "9px" }}
      >
        {agent.name}
      </div>
    </div>
  );
}

interface AgentState {
  id: string;
  x: number;
  y: number;
  state: "working" | "idle" | "walking";
}

function Character({
  agent,
  agentState,
  inProgressTasks,
  onClick,
}: {
  agent: AkiAgent;
  agentState: AgentState;
  inProgressTasks: AkiTask[];
  onClick: (agent: AkiAgent, e: React.MouseEvent) => void;
}) {
  const isWorking = agentState.state === "working";
  const currentTask = inProgressTasks.find((t) => t.agent === agent.id) ?? null;

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{ width: 36, height: 44 }}
      animate={{ x: agentState.x, y: agentState.y }}
      transition={{ type: "tween", duration: agentState.state === "walking" ? 2.5 : 0.3, ease: "linear" }}
      onClick={(e) => onClick(agent, e)}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={
          isWorking
            ? { scaleY: [1, 0.97, 1], y: [0, 1, 0] }
            : { y: [0, -2, 0] }
        }
        transition={{ duration: isWorking ? 0.4 : 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xl border-2 shadow-lg relative"
          style={{
            backgroundColor: agent.color + "25",
            borderColor: agent.color + "80",
            boxShadow: `0 0 12px ${agent.color}40`,
          }}
        >
          <span style={{ fontSize: "18px" }}>{agent.emoji}</span>
          {isWorking && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-gray-900"
              style={{ backgroundColor: "#22c55e" }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          {!isWorking && !currentTask && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-gray-900" style={{ backgroundColor: "#6b7280" }} />
          )}
        </div>
        {!isWorking && (
          <div className="flex gap-1 mt-0.5">
            <motion.div
              className="w-1.5 h-3 rounded-full"
              style={{ backgroundColor: agent.color + "60" }}
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.div
              className="w-1.5 h-3 rounded-full"
              style={{ backgroundColor: agent.color + "60" }}
              animate={{ rotate: [8, -8, 8] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main PixelOffice component ──────────────────────────────────────────────

function PixelOfficeCanvas({ inProgressTasks }: { inProgressTasks: AkiTask[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(900);
  const [agentStates, setAgentStates] = useState<AgentState[]>([]);
  const [popup, setPopup] = useState<{ agent: AkiAgent; task: AkiTask | null; x: number; y: number } | null>(null);

  const getDeskPositions = useCallback((width: number) => {
    const row1Y = 30;
    const row2Y = 150;
    const deskW = 80;
    return AKI_AGENTS.map((agent) => {
      const isRow1 = agent.deskRow === 0;
      const total = isRow1 ? 5 : 6;
      const spacing = (width - 40) / total;
      const x = 20 + agent.deskCol * spacing + spacing / 2 - deskW / 2;
      const y = isRow1 ? row1Y : row2Y;
      return { agentId: agent.id, x: x + 4, y: y + 10, deskX: x, deskY: y };
    });
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const deskPositions = getDeskPositions(containerWidth);
    setAgentStates(
      AKI_AGENTS.map((agent) => {
        const desk = deskPositions.find((d) => d.agentId === agent.id)!;
        const isWorking = inProgressTasks.some((t) => t.agent === agent.id);
        return { id: agent.id, x: desk.x, y: desk.y, state: isWorking ? "working" : "idle" };
      })
    );
  }, [containerWidth, getDeskPositions]);

  // Wander idle agents
  useEffect(() => {
    if (agentStates.length === 0) return;
    const deskPositions = getDeskPositions(containerWidth);
    const interval = setInterval(() => {
      setAgentStates((prev) =>
        prev.map((s) => {
          const isWorking = inProgressTasks.some((t) => t.agent === s.id);
          if (isWorking) {
            const desk = deskPositions.find((d) => d.agentId === s.id)!;
            return { ...s, state: "working", x: desk.x, y: desk.y };
          }
          if (Math.random() > 0.6) {
            const wanderX = 30 + Math.random() * (containerWidth - 80);
            const wanderY = 80 + Math.random() * 60;
            return { ...s, state: "walking", x: wanderX, y: wanderY };
          }
          return { ...s, state: "idle" };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [agentStates.length, containerWidth, inProgressTasks, getDeskPositions]);

  const deskPositions = getDeskPositions(containerWidth);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gray-950 overflow-hidden"
      style={{ height: 280 }}
      onClick={() => setPopup(null)}
    >
      {/* Grid floor */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Header */}
      <div className="absolute top-2 left-4 flex items-center gap-2 z-20">
        <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">
          🏢 Aki Industries — Floor 1
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      </div>
      {/* Row labels */}
      <div className="absolute font-mono text-gray-700 uppercase tracking-widest" style={{ top: 32, left: 4, fontSize: 9 }}>ROW A</div>
      <div className="absolute font-mono text-gray-700 uppercase tracking-widest" style={{ top: 152, left: 4, fontSize: 9 }}>ROW B</div>
      {/* Walkway */}
      <div className="absolute w-full border-t border-dashed border-gray-800" style={{ top: 130 }} />
      {/* Desks */}
      {deskPositions.map((pos) => {
        const agent = AKI_AGENTS.find((a) => a.id === pos.agentId)!;
        return <Desk key={pos.agentId} x={pos.deskX} y={pos.deskY} agent={agent} />;
      })}
      {/* Characters */}
      {agentStates.map((state) => {
        const agent = AKI_AGENTS.find((a) => a.id === state.id)!;
        return (
          <Character
            key={state.id}
            agent={agent}
            agentState={state}
            inProgressTasks={inProgressTasks}
            onClick={(ag, e) => {
              e.stopPropagation();
              const task = inProgressTasks.find((t) => t.agent === ag.id) ?? null;
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const cRect = containerRef.current?.getBoundingClientRect();
              setPopup({ agent: ag, task, x: rect.left - (cRect?.left ?? 0), y: rect.top - (cRect?.top ?? 0) });
            }}
          />
        );
      })}
      {/* Popup */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-52 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl p-4"
            style={{
              left: Math.min(popup.x, containerWidth - 220),
              top: popup.y > 140 ? popup.y - 140 : popup.y + 50,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2"
                style={{ backgroundColor: popup.agent.color + "20", borderColor: popup.agent.color + "60" }}
              >
                {popup.agent.emoji}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{popup.agent.name}</div>
                <div className="text-gray-400 text-xs">{popup.agent.role}</div>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-2">
              <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-mono">Current Task</div>
              {popup.task ? (
                <div className="bg-blue-950/50 border border-blue-800/40 rounded-lg p-2">
                  <div className="text-blue-300 text-xs font-medium">{popup.task.title}</div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-blue-500 text-xs font-mono">IN PROGRESS</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-xs bg-gray-800/50 rounded-lg p-2 border border-gray-700/50">
                  Idle — wandering the office
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Collapsible Panel wrapper ───────────────────────────────────────────────

export function PixelOfficePanel({ inProgressTasks = [] }: { inProgressTasks?: AkiTask[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 bg-white">
      {/* Toggle bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-indigo-500" />
          <span className="font-medium">Pixel Office</span>
          <span className="text-xs text-slate-400 font-mono">
            {inProgressTasks.length > 0
              ? `${inProgressTasks.length} agent${inProgressTasks.length !== 1 ? "s" : ""} working`
              : "all idle"}
          </span>
          {inProgressTasks.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {/* Animated panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="pixel-office-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <PixelOfficeCanvas inProgressTasks={inProgressTasks} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
