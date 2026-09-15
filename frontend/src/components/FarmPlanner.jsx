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
import { toHindiDigits } from "../translations";

export default function FarmPlanner({ tasks, onToggleTask, onCreateTask, onDeleteTask, t, language, isHindi: propIsHindi }) {
  const isHindi = propIsHindi || language === "hi" || Boolean(t?.liveTelemetry?.includes("सजीव"));
  const num = (v) => (isHindi ? toHindiDigits(v) : String(v));

  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "general",
    due_date: isHindi ? "आज" : "Today",
    priority: "medium",
    notes: ""
  });

  const categories = [
    { id: "all", label: isHindi ? "सभी कार्य" : "All Activities" },
    { id: "irrigation", label: isHindi ? "सिंचाई" : "Irrigation" },
    { id: "fertilizer", label: isHindi ? "उर्वरक / खाद" : "Fertilizer" },
    { id: "pest_control", label: isHindi ? "कीट एवं रोग" : "Pest & Disease" },
    { id: "sowing", label: isHindi ? "बुवाई / निराई" : "Sowing / Weeding" },
    { id: "harvest", label: isHindi ? "कटाई" : "Harvest" },
    { id: "general", label: isHindi ? "सामान्य" : "General" }
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
    setNewTask({
      title: "",
      category: "general",
      due_date: isHindi ? "आज" : "Today",
      priority: "medium",
      notes: ""
    });
    setShowAddModal(false);
  };

  const getLocalizedCategory = (cat) => {
    if (!isHindi) return cat;
    const map = {
      irrigation: "सिंचाई",
      fertilizer: "उर्वरक",
      pest_control: "कीट नियंत्रण",
      sowing: "बुवाई",
      harvest: "कटाई",
      general: "सामान्य"
    };
    return map[cat?.toLowerCase()] || cat;
  };

  const getLocalizedPriority = (p) => {
    if (!isHindi) return `${p} Priority`;
    if (p === "high") return "उच्च प्राथमिकता";
    if (p === "medium") return "मध्यम प्राथमिकता";
    return "सामान्य प्राथमिकता";
  };

  const formatDueDate = (dateStr) => {
    if (!isHindi) return dateStr;
    if (dateStr === "Today") return "आज";
    if (dateStr === "Tomorrow") return "कल";
    return toHindiDigits(dateStr);
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
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-display flex-wrap">
                {isHindi ? "कृषि कार्य एवं मील का पत्थर योजनाकार" : (t?.planner?.title || "Agronomic Schedule & Work Planner")}
                <span className="badge badge-leaf text-xs font-tech">
                  {num(completedCount)} / {num(tasks.length)} {isHindi ? "पूर्ण" : "Completed"}
                </span>
              </h1>
              <p className="text-xs text-emerald-200/80 mt-0.5 font-sans">
                {isHindi
                  ? "मौसमी बुवाई, खाद, सिंचाई और कटाई के कार्यों का वैज्ञानिक समय-प्रबंधन"
                  : "Seasonal field task orchestration, phenological milestones, and input scheduling"}
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
            <span>{isHindi ? "+ नया कार्य जोड़ें" : (t?.planner?.addTask || "Schedule Activity")}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Card (Indigo Theme) */}
      <div className="card card-indigo p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white flex items-center gap-1.5 font-tech">
            <CheckSquare className="w-4 h-4 text-[var(--c-indigo-neon)]" />{" "}
            {isHindi ? "कार्य पूर्णता सूचकांक" : "Activity Completion Index"}
          </span>
          <span className="font-mono font-bold text-[var(--c-indigo-neon)] text-sm">{num(progressPercent)}%</span>
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
            {isHindi
              ? "इस श्रेणी में कोई कार्य निर्धारित नहीं है। नया कार्य जोड़ने के लिए ऊपर '+ नया कार्य जोड़ें' पर क्लिक करें।"
              : "No activities scheduled in this category. Click \"+ Schedule Activity\" to plan your farm milestones."}
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
                    title={isCompleted ? (isHindi ? "अपूर्ण के रूप में चिह्नित करें" : "Mark incomplete") : (isHindi ? "पूर्ण चिह्नित करें" : "Mark completed")}
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
                        {formatDueDate(task.due_date)}
                      </span>
                      <span>•</span>
                      <span className="capitalize text-[var(--c-leaf-neon)] font-medium font-tech">
                        {getLocalizedCategory(task.category)}
                      </span>
                      <span>•</span>
                      <span className={`badge text-[10px] py-0.2 px-1.5 font-tech ${
                        task.priority === "high"
                          ? "badge-critical"
                          : task.priority === "medium"
                          ? "badge-warning"
                          : "badge-emerald"
                      }`}>
                        {getLocalizedPriority(task.priority)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-950/20 transition-colors"
                    title={isHindi ? "कार्य हटाएं" : "Delete Activity"}
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
              <h3 className="text-base font-bold text-white">
                {isHindi ? "नया कृषि कार्य जोड़ें" : "Schedule New Farm Activity"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                  {isHindi ? "कार्य का नाम / विवरण" : "Activity Title"}
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder={
                    isHindi
                      ? "जैसे: कल्ले फूटने पर यूरिया का दूसरा छिड़काव करें"
                      : "e.g., Apply second split of Urea at Crown Root Initiation (CRI)"
                  }
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                    {isHindi ? "श्रेणी" : "Category"}
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                  >
                    <option value="irrigation">{isHindi ? "सिंचाई" : "Irrigation"}</option>
                    <option value="fertilizer">{isHindi ? "उर्वरक / खाद" : "Fertilizer"}</option>
                    <option value="pest_control">{isHindi ? "कीट एवं रोग" : "Pest & Disease"}</option>
                    <option value="sowing">{isHindi ? "बुवाई / निराई" : "Sowing / Weeding"}</option>
                    <option value="harvest">{isHindi ? "कटाई" : "Harvest"}</option>
                    <option value="general">{isHindi ? "सामान्य" : "General"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                    {isHindi ? "प्राथमिकता" : "Priority"}
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                  >
                    <option value="high">{isHindi ? "उच्च प्राथमिकता" : "High Priority"}</option>
                    <option value="medium">{isHindi ? "मध्यम प्राथमिकता" : "Medium Priority"}</option>
                    <option value="low">{isHindi ? "सामान्य प्राथमिकता" : "Low Priority"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-medium">
                  {isHindi ? "नियत तिथि / समय" : "Due Date / Timeline"}
                </label>
                <input
                  type="text"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  placeholder={isHindi ? "जैसे: आज, कल सुबह, ३ दिनों में" : "e.g., Tomorrow morning, In 3 days, 2026-09-22"}
                  className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3.5 py-2 text-white focus:outline-none focus:border-[var(--primary)] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary text-xs py-2 px-3"
                >
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs py-2 px-4"
                >
                  {isHindi ? "कार्य जोड़ें" : "Schedule Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
