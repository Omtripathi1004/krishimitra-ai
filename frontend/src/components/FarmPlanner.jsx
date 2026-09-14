import React, { useState } from "react";
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Filter,
  Tag
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
    { id: "harvest", label: "Harvest" }
  ];

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.category === filter;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    await onCreateTask(newTask);
    setNewTask({ title: "", category: "general", due_date: "Today", priority: "medium", notes: "" });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-[var(--border-cyan)]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[rgba(89,199,177,0.15)] flex items-center justify-center text-[var(--color-rain-glow)] border border-[var(--border-cyan)]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-[var(--text-primary)]">
              {t.planner.title}
            </h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.planner.subtitle}</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary text-xs self-start md:self-auto py-2.5 px-4"
        >
          <Plus className="h-4 w-4" />
          <span>{t.planner.addTask}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
              filter === c.id
                ? "bg-[var(--color-harvest)] text-[#10251E] shadow-sm font-extrabold"
                : "bg-[#183A2D]/80 text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="glass-card p-12 text-center text-xs text-[var(--text-muted)]">
            No activities scheduled in this category. Click "+ Add New Activity" to schedule a farm milestone.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === "completed";
            return (
              <div
                key={task.id}
                className={`glass-card p-4 flex items-center justify-between gap-4 transition-all ${
                  isCompleted ? "opacity-60 bg-[#183A2D]/40" : ""
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-[var(--color-rain-glow)]" />
                    ) : (
                      <Circle className="h-5 w-5 text-[var(--text-dim)]" />
                    )}
                  </button>

                  <div>
                    <h4 className={`text-sm font-heading font-bold text-[var(--text-primary)] ${isCompleted ? "line-through text-[var(--text-dim)]" : ""}`}>
                      {task.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1 text-[var(--color-rain-glow)]">
                        <Clock className="h-3 w-3" />
                        {task.due_date}
                      </span>
                      <span>•</span>
                      <span className="capitalize text-[var(--color-harvest)]">{task.category}</span>
                      <span>•</span>
                      <span className={`capitalize font-bold ${
                        task.priority === "high" ? "text-[var(--color-risk)]" : task.priority === "medium" ? "text-[var(--color-harvest)]" : "text-[var(--text-secondary)]"
                      }`}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="rounded-lg p-2 text-[var(--text-dim)] hover:text-[var(--color-risk)] hover:bg-[#224C3C] transition-colors"
                    title="Delete Activity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content space-y-4">
            <h3 className="text-lg font-heading font-extrabold text-[var(--text-primary)]">Schedule New Farm Activity</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">Activity Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., Apply second split of Urea at CRI stage"
                  className="w-full rounded-lg bg-[#10251E] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full rounded-lg bg-[#10251E] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
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
                  <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full rounded-lg bg-[#10251E] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-sans font-medium">Due Date / Timeline</label>
                <input
                  type="text"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  placeholder="e.g., Tomorrow, In 3 days, 2026-09-22"
                  className="w-full rounded-lg bg-[#10251E] border border-[var(--border-subtle)] px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-rain-glow)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary py-2 px-4 text-xs"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
