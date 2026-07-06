// src/store.js
import { create } from 'zustand';
import db from './db';

const useTasksStore = create((set, get) => ({
  tasks: [],
  loading: true,

  // Cargar datos desde IndexedDB al iniciar la app
  loadTasks: async () => {
    set({ loading: true });
    const tasksFromDB = await db.tasks.toArray();
    set({ tasks: tasksFromDB, loading: false });
  },

  // Agregar tarea: Guarda en DB y actualiza el estado
  addTask: async (title) => {
    const newTask = {
      title,
      completed: false,
      createdAt: new Date()
    };
    
    // 1. Guardar en IndexedDB (retorna el ID generado)
    const id = await db.tasks.add(newTask);
    
    // 2. Actualizar el estado de Zustand
    set((state) => ({
      tasks: [...state.tasks, { ...newTask, id }]
    }));
  },

  // Toggle completada
  toggleTask: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    const newState = !task.completed;
    
    // 1. Actualizar en DB
    await db.tasks.update(id, { completed: newState });
    
    // 2. Actualizar en Zustand
    set((state) => ({
      tasks: state.tasks.map(t => 
        t.id === id ? { ...t, completed: newState } : t
      )
    }));
  },

  // Borrar tarea
  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }));
  }
}));

export default useTasksStore;