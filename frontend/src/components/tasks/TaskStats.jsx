import { HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationCircle } from 'react-icons/hi';
import { useTasks } from '../../hooks/useTasks';

const TaskStats = () => {
  const { stats } = useTasks();

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: <HiOutlineClipboardList />,
      iconClass: 'total',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <HiOutlineCheckCircle />,
      iconClass: 'completed',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <HiOutlineClock />,
      iconClass: 'pending',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: <HiOutlineExclamationCircle />,
      iconClass: 'overdue',
    },
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item) => (
        <div key={item.label} className="stat-card">
          <div className={`stat-icon ${item.iconClass}`}>{item.icon}</div>
          <div className="stat-value">{item.value}</div>
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
