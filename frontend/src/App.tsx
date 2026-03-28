import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import AddTaskForm from './components/AddTasks'
import type { Task } from './api/tasks'
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks'
import TaskPieChart from './components/PieChart' 

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    getTasks(today).then(data => setTasks(data))
  }, [today])

  const handleAdd = async (task: Omit<Task, 'id'>) => {
    const newTask = await createTask(task)
    setTasks(prev => [...prev, newTask])
  }

  const handleComplete = async (id: number, done: boolean) => {
    await updateTask(id, { is_completed: done })
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, is_completed: done } : t)
    )
  }

  const handleDelete = async (id: number) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#091413] mb-1"> Life + Style </h1>
      <p className="text-gray-700 text-sm mb-6"> Date : {today}</p>

      <div className="max-w-xl mx-auto">
        <AddTaskForm onAdd={handleAdd} />
        <TaskList
          tasks={tasks}
          onComplete={handleComplete}
          onDelete={handleDelete}
        />
      </div>
        <div className="max-w-2xl mx-auto mt-10">
          <TaskPieChart tasks={tasks} />
        </div>
      </div>
    
  )
}

export default App