import React, { useState, useEffect } from 'react';

export default function TaskModal({ isOpen, onClose, onSave, categories, editingTask, viewMode, presetList }) {
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [time, setTime] = useState('');
  const [assignee, setAssignee] = useState('');
  const [list, setList] = useState(categories[0]?.name || '');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setSub(editingTask.sub || '');
      setTime(editingTask.time || '');
      setAssignee(editingTask.assignee || '');
      setList(editingTask.list || categories[0]?.name || '');
    } else {
      setTitle('');
      setSub('');
      setTime('');
      setAssignee('');
      setList(presetList || categories[0]?.name || '');
    }
  }, [editingTask, isOpen, categories, presetList]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({ title: trimmed, sub: sub.trim(), time: time.trim(), assignee: assignee.trim(), list });
  };

  return (
    <div className="overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3>{editingTask ? 'Edit Task' : 'New Task'}</h3>

        <label>What is to be done?</label>
        <input type="text" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />

        <label>Subtitle (optional)</label>
        <input type="text" placeholder="e.g. Shopping list: 2x Rolls" value={sub} onChange={e => setSub(e.target.value)} />

        <label>Time (optional)</label>
        <input type="text" placeholder="e.g. 12:00 - 13:00" value={time} onChange={e => setTime(e.target.value)} />

        {viewMode === "team" && (
          <div>
            <label>Assign to</label>
            <input type="text" placeholder="e.g. Sara" value={assignee} onChange={e => setAssignee(e.target.value)} />
          </div>
        )}

        <label>Category</label>
        <select value={list} onChange={e => setList(e.target.value)}>
          {categories.map(cat => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <div className="modal-actions">
          <button id="cancelBtn" onClick={onClose}>Cancel</button>
          <button id="confirmBtn" onClick={handleSubmit}>{editingTask ? 'Save Changes' : 'Add Task'}</button>
        </div>
      </div>
    </div>
  );
}
