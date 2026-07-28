import React from 'react';
import TaskCard from './TaskCard';

export default function TaskColumn({ category, tasks, viewMode, categories, onToggleDone, onTogglePause, onDelete, onEdit, onDragStart, onDragEnd, onDrop, onAddTask, onMoveTask }) {
  const activeTasks = tasks.filter(t => !t.completed && !t.paused);
  const pausedTasks = tasks.filter(t => !t.completed && t.paused);
  const doneTasks = tasks.filter(t => t.completed);

  return (
    <div className="column">
      <div className="col-header">
        <span className="col-dot" style={{ background: category.accent }}></span>
        <span className="col-title">{category.name}</span>
      </div>
      <div
        className="cards"
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; e.currentTarget.classList.add('drag-over'); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove('drag-over'); }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('drag-over');
          onDrop(category.name);
        }}
      >
        {tasks.length === 0 && <div className="empty-col">No tasks yet</div>}

        {activeTasks.map(task => (
          <TaskCard key={task.id} task={task} category={category} categories={categories} viewMode={viewMode}
            onToggleDone={onToggleDone} onTogglePause={onTogglePause}
            onDelete={onDelete} onEdit={onEdit}
            onDragStart={onDragStart} onDragEnd={onDragEnd}
            onMoveTask={onMoveTask} />
        ))}

        {pausedTasks.length > 0 && (
          <>
            <div className="done-label">PAUSED</div>
            {pausedTasks.map(task => (
              <TaskCard key={task.id} task={task} category={category} categories={categories} viewMode={viewMode}
                onToggleDone={onToggleDone} onTogglePause={onTogglePause}
                onDelete={onDelete} onEdit={onEdit}
                onDragStart={onDragStart} onDragEnd={onDragEnd}
                onMoveTask={onMoveTask} />
            ))}
          </>
        )}

        {doneTasks.length > 0 && (
          <>
            <div className="done-label">DONE</div>
            {doneTasks.map(task => (
              <TaskCard key={task.id} task={task} category={category} categories={categories} viewMode={viewMode}
                onToggleDone={onToggleDone} onTogglePause={onTogglePause}
                onDelete={onDelete} onEdit={onEdit}
                onDragStart={onDragStart} onDragEnd={onDragEnd}
                onMoveTask={onMoveTask} />
            ))}
          </>
        )}
      </div>
      <div className="col-footer">
        <div className="completed-text">Completed {doneTasks.length}/{tasks.length}</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: tasks.length ? (doneTasks.length / tasks.length * 100) + '%' : '0%', background: category.accent }}></div>
        </div>
        <div className="add-task-row" onClick={() => onAddTask(category.name)}>
          <button className="add-task-btn" style={{ background: category.accent }}>+</button>
          <span className="add-task-label">Add task</span>
        </div>
      </div>
    </div>
  );
}

