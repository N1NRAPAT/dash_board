import TaskList from './components/TaskList'
import type { Task } from './api/tasks'

const DUMMY_TASKS: Task[] = [
  {
    id: 1,
    date: '2026-03-27',
    name: 'Morning workout',
    category: 'Health',
    start_time: '07:00:00',
    end_time: '08:00:00',
    is_completed: false,
  },
  {
    id: 2,
    date: '2026-03-27',
    name: 'Write report',
    category: 'Work',
    start_time: '09:00:00',
    end_time: '11:00:00',
    is_completed: true,
  },
]

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-medium text-gray-800 mb-1">N1N Daily Planner</h1>
      <p className="text-gray-500 text-sm mb-6">March 27, 2026</p>

      <div className="max-w-xl mx-auto">
        <TaskList
          tasks={DUMMY_TASKS}
          onComplete={(id, done) => console.log('complete', id, done)}
          onDelete={(id) => console.log('delete', id)}
        />
      </div>
    </div>
  )
}

export default App