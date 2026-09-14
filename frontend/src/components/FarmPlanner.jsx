import React, { useState } from "react";
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Filter,
  Tag,
  X,
  AlertCircle,
  CheckSquare
} from "lucide-react";

export default function FarmPlanner({ tasks, onToggleTask, onCreateTask, onDeleteTask, t }) {
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "general",
    due_date: "Today",
    priority: "medium",
    notes: ""
  });

  const categories = [
    { id: "all", label: "All Activities" },
    { id: "irrigation", label: "Irrigation" },
    { id: "fertilizer", label: "Fertilizer" },
    { id: "pest_control", label: "Pest & Disease" },
    { id: "sowing", label: "Sowing / Weeding" },
    { id: "harvest", label: "Harvest" },
    { id: "general", label: "General" }
  ];

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.category === filter;
  });

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    await onCreateTask(newTask);
    setNewTask({ title: "", category: "general", due_date: "Today", priority: "medium", notes: "" });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header (Leaf Neon) */}
      <div className="card card-leaf p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-[var(--c-leaf-neon)] border border-emerald-400/30">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-display">
                {t?.planner?.title || "Agronomic Schedule & Work Planner"}
                <span className="badge badge-leaf text-xs font-tech">
                  {completedCount} / {tasks.length} Completed
                </span>
              </h1>
              <p className="text-xs text-emerald-200/80 mt-0.5 font-sans">
                Seasonal field task orchestration, phenological milestones, and input scheduling
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary text-xs py-2 px-4 shadow-md font-tech"
          >
            <Plus className="w-4 h-4" />
            <span>{t?.planner?.addTask || "Schedule Activity"}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Card (Indigo Theme) */}
      <div className="card card-indigo p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white flex items-center gap-1.5 font-tech">
            <CheckSquare className="w-4 h-4 text-[var(--c-indigo-neon)]" /> Activity Completion Index
          </span>
          <span className="font-mono font-bold text-[var(--c-indigo-neon)] text-sm">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin font-tech">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filter === c.id
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tasks List (Multi-Color Cards per Category) */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="card p-12 text-center text-xs text-[var(--text-muted)]">
            No activities scheduled in this category. Click "+ Schedule Activity" to plan your farm milestones.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === "completed";
            const taskCategory = task.category?.toLowerCase() || "";
            const cardTheme =
              taskCategory === "irrigation" ? "card-sky" :
              taskCategory === "fertilizer" ? "card-gold" :
              taskCategory === "pest_control" ? "card-pink" :
              taskCategory === "sowing" || taskCategory === "harvest" ? "card-leaf" : "card-indigo";

            return (
              <div
                key={task.id}
                className={`card ${cardTheme} p-4 flex items-center justify-between gap-4 transition-all ${
                  isCompleted ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                    title={isCompleted ? "Mark incomplete" : "Mark completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[var(--c-leaf-neon)]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[var(--text-muted)]" />
                    )}
                  </button>

                  <div>
                    <h4 className={`text-sm font-bold text-white font-display ${isCompleted ? "line-through text-[var(--text-muted)]" : ""}`}>
                      {task.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1 text-[var(--c-sky-neon)] font-mono">
                        <Clock className="w-3 h-3" />
                        {task.due_date}
                      </span>
                      <span>•</span>
                      <span className="capitalize text-[var(--c-leaf-neon)] font-medium font-tech">{task.category}</span>
                      <span>•</span>
                      <span className={`badge text-[10px] py-0.2 px-1.5 font-tech ${
                        task.priority === "high"
                          ? "badge-critical"
                          : task.priority === "medium"
                          ? "badge-warning"
                          : "badge-emerald"
                      }`}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-950/20 transition-colors"
                    title="Delete Activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-bold text-white">Schedule New Farm Activity</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">Activity Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., Apply second split of Urea at Crown Root Initiation (CRI)"
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                  >
                    <option value="irrigation">Irrigation</option>
                    <option value="fertilizer">Fertilizer</option>
                    <option value="pest_control">Pest & Disease</option>
                    <option value="sowing">Sowing / Weeding</option>
                    <option value="harvest">Harvest</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">Due Date / Timeline</label>
                <input
                  type="text"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  placeholder="e.g., Tomorrow morning, In 3 days, 2026-09-22"
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs py-2 px-4"
                >
                  Schedule Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
