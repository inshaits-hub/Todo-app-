import React from 'react';
import { Check, Pause, Play, X, User } from 'lucide-react';

export default function TaskCard({ task, category, viewMode, onToggleDone, onTogglePause, onDelete, onEdit, onDragStart, onDragEnd }) {
  const assigneeHtml = viewMode === "team" && task.assignee ? (
    <span className="task-assignee"><User size={11} /> {task.assignee}</span>
  ) : null;

  const reviewHtml = viewMode === "team" && task.completed && task.needsReview ? (
    <span className="review-tag">Pending review</span>
  ) : null;

  const pausedHtml = !task.completed && task.paused ? (
    <span className="paused-tag"><Pause size={10} /> Paused</span>
  ) : null;

  const pauseBtnHtml = !task.completed ? (
    <button className="pause-btn" title={task.paused ? 'Resume' : 'Pause'} onClick={(e) => { e.stopPropagation(); onTogglePause(task.id); }}>
      {task.paused ? <Play size={11} /> : <Pause size={11} />}
    </button>
  ) : null;

  return (
    <div
      className={`task-card${task.completed ? ' done-card' : ''}${!task.completed && task.paused ? ' paused-card' : ''}`}
      style={{ '--accent': category.accent, '--accent-soft': category.soft }}
      data-id={task.id}
      draggable
      onDragStart={(e) => { onDragStart(task.id); e.currentTarget.classList.add('dragging'); }}
      onDragEnd={(e) => { onDragEnd(); e.currentTarget.classList.remove('dragging'); }}
      onClick={(e) => {
        if (e.target.closest('.task-actions') || e.target.closest('.check-circle')) return;
        onEdit(task);
      }}
    >
      <div className="check-circle" onClick={(e) => { e.stopPropagation(); onToggleDone(task.id); }}>
        <Check size={11} />
      </div>
      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.sub && <p className="task-sub">{task.sub}</p>}
        {task.time && <p className="task-time">{task.time}</p>}
        {assigneeHtml}{reviewHtml}{pausedHtml}
      </div>
      <div className="task-actions">
        <button className="complete-btn" title={task.completed ? 'Mark as not done' : 'Mark as done'} onClick={(e) => { e.stopPropagation(); onToggleDone(task.id); }}>
          <Check size={11} />
        </button>
        {pauseBtnHtml}
        <button className="task-delete" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}>
          <X size={11} />
        </button>
      </div>
    </div>
  );
}

