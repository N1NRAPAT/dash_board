import { useState } from 'react'
import type { Task } from '../api/tasks'

interface Props {
  onAdd: (task: Omit<Task, 'id'>) => void
}

const CATEGORIES = ['Work', 'Exercise', 'Learning', 'Personal', 'Cooking', 'SelfReflect' ,'Other']

function AddTaskForm({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Learning')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = () => {
    if (!name.trim()) return
    onAdd({
      date: today,
      name,
      category,
      start_time: startTime,
      end_time: endTime,
      is_completed: false,
    })
    setName('')
    setStartTime('09:00')
    setEndTime('10:00')
  }

  return (
    <div className="bg-[#285A48] border border-blue-100 rounded-xl p-4 mb-6">
      <h1 className="text-bold font-medium text-[#FFF6F6] mb-3">Add New Task</h1>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Task name..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        <div className="flex gap-2">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none"
          />

          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#091413] text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + Add task
        </button>
      </div>
    </div>
  )
}

export default AddTaskForm