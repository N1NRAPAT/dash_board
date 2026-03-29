import { useState, useEffect, useRef, useCallback } from 'react'
import type { Task } from '../api/tasks'

interface Props {
  tasks: Task[]
  onAdd: (task: Omit<Task, 'id'>) => void
}

const COLORS: Record<string, string> = {
  Work:        'bg-blue-400 border-blue-500',
  Cooking:     'bg-pink-400 border-pink-500',
  Exercise:    'bg-green-400 border-green-500',
  Learning:    'bg-purple-400 border-purple-500',
  Personal:    'bg-orange-400 border-orange-500',
  SelfReflect: 'bg-yellow-400 border-yellow-500',
  Other:       'bg-gray-400 border-gray-500',
}

const CATEGORIES = ['Work', 'Cooking', 'Exercise', 'Learning', 'Personal', 'SelfReflect', 'Other']
const HOUR_WIDTH = 120
const ROW_HEIGHT = 96
const LABEL_WIDTH = 140
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS_BACK = 10
const DAYS_FORWARD = 10

function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
}

function getDayLabel(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  const today = formatDate(new Date())
  if (dateStr === today) return 'Today'
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

// Modal component
function AddTaskModal({
  date, startMin, onConfirm, onClose
}: {
  date: string
  startMin: number
  onConfirm: (task: Omit<Task, 'id'>) => void
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Work')
  const [startTime, setStartTime] = useState(minutesToTime(startMin))
  const [endTime, setEndTime] = useState(minutesToTime(Math.min(startMin + 60, 1439)))
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) return
    onConfirm({
      date,
      name,
      category,
      start_time: startTime,
      end_time: endTime,
      is_completed: false,
      note,           
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-80 flex flex-col gap-3"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-sm font-medium text-gray-700">Add task — {getDayLabel(date)}</h3>

        <input
          autoFocus
          type="text"
          placeholder="Task name..."
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">Start</p>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">End</p>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        <textarea
            placeholder="Add a note... (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none resize-none"
            />

        <div className="flex gap-2 mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg text-sm text-white bg-gray-800 hover:bg-gray-700"
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  )
}

function ScheduleView({ tasks, onAdd }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [modal, setModal] = useState<{ date: string; startMin: number } | null>(null)

  // Generate days array
  const today = new Date()
  const days = Array.from({ length: DAYS_BACK + DAYS_FORWARD + 1 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - DAYS_BACK + i)
    return formatDate(d)
  })

  const todayIndex = DAYS_BACK

  // Scroll to today on mount — snapped to 07:00
 useEffect(() => {
  if (scrollRef.current) {
    const now = new Date()
    const currentMin = now.getHours() * 60 + now.getMinutes()
    const scrollLeft = Math.max(((currentMin - 60) / 60) * HOUR_WIDTH, 0)
    const scrollTop = todayIndex * (ROW_HEIGHT + 1)
    scrollRef.current.scrollTop = scrollTop
    scrollRef.current.scrollLeft = scrollLeft
  }
}, [])

  const handleSlotClick = useCallback((date: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clickedMin = Math.floor((x / HOUR_WIDTH) * 60 / 15) * 15
    setModal({ date, startMin: clickedMin })
  }, [])

  const handleConfirm = (task: Omit<Task, 'id'>) => {
    onAdd(task)
    setModal(null)
  }

  const tasksByDate = tasks.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = []
    acc[t.date].push(t)
    return acc
  }, {} as Record<string, Task[]>)

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

      {/* Sticky top-left corner */}
      <div className="flex">
        <div
          style={{ width: `${LABEL_WIDTH}px`, flexShrink: 0 }}
          className="bg-white border-b border-r border-gray-100 py-2"
        />

        {/* Hour header — scrolls horizontally only */}
        <div className="overflow-x-hidden flex-1 border-b border-gray-100">
          <div style={{ width: `${HOUR_WIDTH * 24}px` }} className="flex">
            {HOURS.map(h => (
              <div
                key={h}
                style={{ width: `${HOUR_WIDTH}px`, flexShrink: 0 }}
                className="text-xs text-gray-400 text-center py-2 border-r border-gray-100 last:border-r-0"
              >
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div
        ref={scrollRef}
        className="overflow-auto"
        style={{ maxHeight: '70vh' }}
        onScroll={e => {
          // sync horizontal scroll to hour header
          const header = e.currentTarget.previousElementSibling?.querySelector('.overflow-x-hidden') as HTMLElement
          if (header) header.scrollLeft = e.currentTarget.scrollLeft
        }}
      >
        <div style={{ width: `${LABEL_WIDTH + HOUR_WIDTH * 24}px` }}>
          {days.map(dateStr => {
            const isToday = dateStr === formatDate(today)
            const dayTasks = tasksByDate[dateStr] || []

            return (
              <div
                key={dateStr}
                className="flex border-b border-gray-100 last:border-b-0"
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                {/* Day label */}
                <div
                  style={{ width: `${LABEL_WIDTH}px`, flexShrink: 0 }}
                  className={`flex flex-col justify-center px-3 border-r border-gray-100 ${
                    isToday ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className={`text-xs font-medium truncate ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {getDayLabel(dateStr)}
                  </p>
                  {dayTasks.length > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">{dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}</p>
                  )}
                </div>

                {/* Time slots */}
                <div
                  style={{ width: `${HOUR_WIDTH * 24}px`, position: 'relative' }}
                  className={`cursor-pointer ${isToday ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                  onClick={e => handleSlotClick(dateStr, e)}
                >
                  {/* Hour grid lines */}
                  {HOURS.map(h => (
                    <div
                      key={h}
                      style={{
                        position: 'absolute',
                        left: `${h * HOUR_WIDTH}px`,
                        top: 0, bottom: 0, width: '1px'
                      }}
                      className="bg-gray-100"
                    />
                  ))}

                  {/* Today line */}
                  {isToday && (() => {
                    const now = new Date()
                    const min = now.getHours() * 60 + now.getMinutes()
                    return (
                      <div
                        style={{
                          position: 'absolute',
                          left: `${(min / 60) * HOUR_WIDTH}px`,
                          top: 0, bottom: 0, width: '2px'
                        }}
                        className="bg-blue-400 z-10"
                      />
                    )
                  })()}

                  {/* Task blocks */}
                  {dayTasks.map(task => {
                    const startMin = timeToMinutes(task.start_time)
                    const endMin = timeToMinutes(task.end_time)
                    const left = (startMin / 60) * HOUR_WIDTH
                    const width = Math.max(((endMin - startMin) / 60) * HOUR_WIDTH, 20)

                    return (
                      <div
                        key={task.id}
                        style={{
                          position: 'absolute',
                          left: `${left}px`,
                          width: `${width}px`,
                          top: '8px',
                          height: `${ROW_HEIGHT - 20}px`,
                        }}
                        onClick={e => e.stopPropagation()}
                        className={`rounded-md border-l-4 px-1.5 py-1 text-white text-xs overflow-hidden ${
                          COLORS[task.category] || COLORS.Other
                        } ${task.is_completed ? 'opacity-40' : ''}`}
                      >
                        <p className="font-medium truncate leading-tight">{task.name}</p>
                        <p className="opacity-80 text-xs mt-0.5">
                          {task.start_time.slice(0, 5)}–{task.end_time.slice(0, 5)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <AddTaskModal
          date={modal.date}
          startMin={modal.startMin}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

export default ScheduleView