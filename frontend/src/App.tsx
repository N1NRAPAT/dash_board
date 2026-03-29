import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks'
import type { Task } from './api/tasks'

import TaskList from './components/TaskList'
import AddTaskForm from './components/AddTasks'
import TaskPieChart from './components/PieChart' 
import ScheduleView from './components/ScheduleView'



type Tab = 'today' | 'schedule'

function App() {
  const todayStr = new Date().toISOString().split('T')[0]
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('today')
  const [selectedDate, setSelectedDate] = useState(todayStr)

  useEffect(() => {
    getTasks(selectedDate).then(data => setTasks(data))
  }, [selectedDate])

  const handleAdd = async (task: Omit<Task, 'id'>) => {
    const newTask = await createTask(task)
     if (task.date === selectedDate) {
      setTasks(prev => [...prev, newTask])
    }
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
    <div className="min-h-screen bg-moody-dark p-8">
      <h1 className="text-2xl font-medium text-forest-light mb-1">Life + Style</h1>
      <p className="text-moody-light text-sm mb-6"> Date : {todayStr}</p>

       {/* Tabs */}
      <div className="max-w-xl mx-auto mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'today'
              ? 'bg-forest-mid text-moody-darkest'
              : 'bg-moody-mid text-moody-light hover:bg-moody-muted border border-moody-muted'

          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'schedule'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Schedule
        </button>
      </div>

      {/* Tab content */}
       {activeTab === 'today' && (
        <div className="max-w-xl mx-auto">

          {/* Date picker */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                const d = new Date(selectedDate)
                d.setDate(d.getDate() - 1)
                setSelectedDate(d.toISOString().split('T')[0])
              }}
              className="px-3 py-1.5 rounded-lg border border-moody-muted bg-moody-mid text-moody-light hover:bg-moody-muted text-sm"            >
              ←
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none"
            />
            <button
              onClick={() => {
                const d = new Date(selectedDate)
                d.setDate(d.getDate() + 1)
                setSelectedDate(d.toISOString().split('T')[0])
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 text-sm"
            >
              →
            </button>
            {selectedDate !== todayStr && (
              <button
                onClick={() => setSelectedDate(todayStr)}
              className="px-3 py-1.5 rounded-lg bg-forest-dark text-forest-light text-sm hover:bg-forest-mid border border-forest-mid"
              >
                Today
              </button>
            )}
            <span className="text-sm text-moody-light ml-auto" >{selectedDate}</span>
          </div>

          <AddTaskForm onAdd={handleAdd} selectedDate={selectedDate} />
          <TaskList
            tasks={tasks}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
          <div className="mt-6">
            <TaskPieChart tasks={tasks} />
          </div>
        </div>
      )}
      {activeTab === 'schedule' && (
        <div className="max-w-6xl mx-auto">
          <ScheduleView tasks={tasks} onAdd={handleAdd} />
        </div>
      )}
    </div>
    )
}

export default App