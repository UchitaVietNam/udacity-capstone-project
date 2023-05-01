import { Todo } from '../types/todos/Todo'
import { CreateTodoRequest } from '../types/todos/CreateTodoRequest'
import baseAxios from './axios'
import { UpdateTodoRequest } from '../types/todos/UpdateTodoRequest'
import axios from 'axios'

export async function getTodos(): Promise<Todo[]> {
  const response = await baseAxios().get(`todos`)
  return response.data.items
}

export async function createTodo(newTodo: CreateTodoRequest): Promise<Todo> {
  const response = await baseAxios().post(`todos`, JSON.stringify(newTodo))
  return response.data.item
}

export async function patchTodo(
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await baseAxios().patch(`todos/${todoId}`, JSON.stringify(updatedTodo))
}

export async function deleteTodo(todoId: string): Promise<void> {
  await baseAxios().delete(`todos/${todoId}`)
}

export async function getUploadUrl(todoId: string): Promise<string> {
  const response = await baseAxios().post(`todos/${todoId}/attachment`, '')
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await axios.put(uploadUrl, file)
}
