// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
  // 1) Lazy‐initialize tasks from localStorage ONCE
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('todoTasks');
    return stored ? JSON.parse(stored) : [];
  });

  // For new‐task input
  const [inputValue, setInputValue] = useState('');

  // Filter: "all" | "completed" | "pending"
  const [filter, setFilter] = useState('all');

  // Sort: "newest" | "oldest"
  const [sortOrder, setSortOrder] = useState('newest');

  // Search term: string to filter task.text
  const [searchTerm, setSearchTerm] = useState('');

  // 2) Save to localStorage whenever `tasks` changes
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handler: Add a new task (with validation)
  const handleAddTask = () => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      alert('Please enter a non‐empty task.');
      return;
    }
    const newTask = {
      id: Date.now(),                           // unique ID
      text: trimmed,                            // task text
      completed: false,                         // default
      createdAt: new Date().toISOString(),      // timestamp
    };
    setTasks(prev => [newTask, ...prev]);
    setInputValue('');
  };

  // Handler: Remove a task by ID
  const handleRemoveTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Handler: Toggle completion status
  const handleToggleComplete = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Derived: apply filter, search, then sort
  const getVisibleTasks = () => {
    let visible = [...tasks];

    // 1) Filter by completion status
    if (filter === 'completed') {
      visible = visible.filter(t => t.completed);
    } else if (filter === 'pending') {
      visible = visible.filter(t => !t.completed);
    }

    // 2) Filter by search term (case‐insensitive substring)
    if (searchTerm.trim() !== '') {
      const lower = searchTerm.trim().toLowerCase();
      visible = visible.filter(t => t.text.toLowerCase().includes(lower));
    }

    // 3) Sort by createdAt
    visible.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });

    return visible;
  };

  // Pressing “Enter” in the new‐task input
  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') handleAddTask();
  };

  // Pressing “Enter” in the search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') e.preventDefault(); // no form‐submit
  };

  return (
    <div className="todo-container">
      <h2>My To-Do List</h2>

      {/* ── New‐Task Input Group ─────────────────────────────────────────────── */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Add a new task…"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleInputKeyPress}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      {/* ── Controls: Filter, Sort, Search ──────────────────────────────────── */}
      <div className="controls">
        {/* Filter by completion */}
        <div className="filter-group">
          <label htmlFor="filter-select">Filter:</label>
          <select
            id="filter-select"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Sort by newest/oldest */}
        <div className="sort-group">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Search by text */}
        <div className="search-group">
          <label htmlFor="search-input">Search:</label>
          <input
            id="search-input"
            type="text"
            placeholder="Search tasks…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
        </div>
      </div>

      {/* ── Task List ────────────────────────────────────────────────────────── */}
      <ul className="task-list">
        {getVisibleTasks().length === 0 && (
          <li className="no-tasks">No tasks to display.</li>
        )}
        {getVisibleTasks().map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span
              className="task-text"
              onClick={() => handleToggleComplete(task.id)}
              title="Click to toggle complete"
            >
              {task.text}
            </span>
            <button
              className="delete-btn"
              onClick={() => handleRemoveTask(task.id)}
              title="Delete task"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
