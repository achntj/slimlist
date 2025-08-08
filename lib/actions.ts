'use server'

import { revalidatePath } from 'next/cache';
import { createList, updateList, deleteList } from './database';

export async function createListAction(formData: FormData) {
  const name = formData.get('name') as string;
  const content = formData.get('content') as string;
  const dueDate = formData.get('dueDate') as string;
  const tagsString = formData.get('tags') as string;
  
  const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
  
  if (!name.trim()) {
    throw new Error('List name is required');
  }
  
  const id = createList(name, content, dueDate || null, tags);
  revalidatePath('/');
  revalidatePath('/due');
  return { success: true, id };
}

export async function updateListAction(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const name = formData.get('name') as string;
  const content = formData.get('content') as string;
  const dueDate = formData.get('dueDate') as string;
  const tagsString = formData.get('tags') as string;
  
  const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
  
  if (!name.trim()) {
    throw new Error('List name is required');
  }
  
  updateList(id, name, content, dueDate || null, tags);
  revalidatePath('/');
  revalidatePath('/due');
  return { success: true };
}

export async function deleteListAction(id: number) {
  deleteList(id);
  revalidatePath('/');
  revalidatePath('/due');
  return { success: true };
}
