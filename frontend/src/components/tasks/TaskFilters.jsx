import { useState, useEffect, useRef } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { HiOutlineSearch } from 'react-icons/hi';

const TaskFilters = () => {
  const { filters, updateFilters, fetchTasks } = useTasks();
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef(null);

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
  ];

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilters({ search: searchInput });
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput, updateFilters]);

  // Fetch tasks when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters, fetchTasks]);

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="filter-pills">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              className={`filter-pill ${filters.status === opt.value ? 'active' : ''}`}
              onClick={() => updateFilters({ status: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="search-box">
          <HiOutlineSearch className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            id="task-search-input"
          />
        </div>
      </div>

      <div className="toolbar-right">
        <select
          className="sort-select"
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          id="task-sort-select"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
