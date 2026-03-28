import type { Task } from '../api/tasks'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
  tasks: Task[]
}

const COLORS: Record<string, string> = {
  Work:         '#378ADD',
  Cooking:      '#F6B1CE',
  Exercise:     '#639922',
  Learning:     '#7F77DD',
  Personal:     '#D85A30',
  SelfReflect:  '#BA7517',
  Other:        '#888780',
}

function TaskPieChart({ tasks }: Props) {
  const data = Object.entries(
    tasks.reduce((acc, task) => {
      const hrs = (
        new Date(`2000-01-01T${task.end_time}`).getTime() -
        new Date(`2000-01-01T${task.start_time}`).getTime()
      ) / 3600000
      acc[task.category] = (acc[task.category] || 0) + hrs
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(1)) }))

  if (data.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">
        Add tasks to see your time breakdown!
      </p>
    )
  }

  return (
    <div className="bg-[#F2EAE0] border border-gray-200 rounded-xl p-4">
      <h2 className="text-XL font-bold text-gray-700 mb-4">Time breakdown</h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name] || COLORS.Other}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}h`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TaskPieChart