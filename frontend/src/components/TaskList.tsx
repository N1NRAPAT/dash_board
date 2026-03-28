import type { Task } from '../api/tasks'

interface Props {
  tasks: Task[]
  onComplete: (id: number, done: boolean) => void
  onDelete: (id: number) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  Work:         'bg-blue-100 text-blue-800',
  Exercise:     'bg-green-100 text-green-800',
  Learning:     'bg-purple-100 text-purple-800',
  Personal:     'bg-orange-100 text-orange-800',
  SelfReflect:  'bg-yellow-100 text-yellow-800',
  Cooking:      'bg-pink-100 text-pink-800',
  Other:        'bg-gray-100 text-gray-800',
}

function TaskList({ tasks, onComplete, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">
        No tasks yet — add one above!
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map(task => (
        <li
          key={task.id}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3"
        >
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={e => onComplete(task.id!, e.target.checked)}
            className="w-4 h-4 cursor-pointer accent-green-600"
          />

          <div className="flex-1">
            <p className={`text-sm font-medium ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {task.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {task.start_time.slice(0, 5)} — {task.end_time.slice(0, 5)}
            </p>
          </div>

          <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[task.category] || CATEGORY_COLORS.Other}`}>
            {task.category}
          </span>

          <button
            onClick={() => onDelete(task.id!)}
            className="text-gray-300 hover:text-red-400 text-lg leading-none"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TaskList