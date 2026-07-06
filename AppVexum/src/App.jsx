import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// src/App.jsx
import { useEffect, useState } from 'react';
import useTasksStore from './store';

function App() {
  const { tasks, loading, loadTasks, addTask, toggleTask, deleteTask } = useTasksStore();
  const [newTask, setNewTask] = useState('');

  // Load data from IndexedDB when the component mounts
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      await addTask(newTask.trim());
      setNewTask('');
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          My Tasks (IndexedDB)
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </form>

        {/* Task List */}
        <ul className="space-y-2">
          {tasks.length === 0 && (
            <p className="text-center text-gray-400">No tasks. Add one!</p>
          )}
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 font-bold text-xl"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
        
        <p className="text-xs text-gray-400 mt-6 text-center">
          * Data persists even if you close the browser (IndexedDB).
        </p>
      </div>
    </div>
  );
}

export default App;
