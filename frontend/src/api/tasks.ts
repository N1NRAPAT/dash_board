import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api'

export interface Task {
  id?: number
  date: string
  name: string
  category: string
  start_time: string
  end_time: string
  is_completed: boolean
  note : string
}
// Get tasks for a specific date
export const getTasks = async (date: string) => {
  const response = await axios.get(`${BASE_URL}/tasks/?date=${date}`)
  return response.data
}
// Create a new task
export const createTask = async (task: Task) => {
  const response = await axios.post(`${BASE_URL}/tasks/`, task)
  return response.data
}
// Update an existing task
export const updateTask = async (id: number, data: Partial<Task>) => {
  const response = await axios.patch(`${BASE_URL}/tasks/${id}/`, data)
  return response.data
}
// Delete a task
export const deleteTask = async (id: number) => {
  await axios.delete(`${BASE_URL}/tasks/${id}/`)
}