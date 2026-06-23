'use server'

import db from '@/db/drizzle'
import { customers, projects } from '@/db/schema'
import { count, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { ITEMS_PER_PAGE } from '../constants'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { ProjectForm } from '@/types'

const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Пожалуйста, укажите название проекта.' }),
  customerId: z.string({
    invalid_type_error: 'Пожалуйста, выберите клиента.',
  }),
  dashUrl: z
    .string()
    .url({ message: 'Пожалуйста, укажите корректный URL.' })
    .optional()
    .or(z.literal('')),
  status: z.enum(['pending', 'ready'], {
    invalid_type_error: 'Пожалуйста, выберите статус проекта.',
  }),
  createdAt: z.string(),
})

const CreateProject = FormSchema.omit({ id: true, createdAt: true })
const UpdateProject = FormSchema.omit({ createdAt: true, id: true })

export type State = {
  errors?: {
    name?: string[]
    customerId?: string[]
    dashUrl?: string[]
    status?: string[]
  }
  message?: string | null
}

export async function createProject(prevState: State, formData: FormData) {
  const validatedFields = CreateProject.safeParse({
    name: formData.get('name'),
    customerId: formData.get('customerId'),
    dashUrl: formData.get('dashUrl'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не заполнены обязательные поля. Проект не был создан.',
    }
  }

  const { name, customerId, dashUrl, status } = validatedFields.data

  try {
    await db.insert(projects).values({
      name,
      customer_id: customerId,
      dash_url: dashUrl || null,
      status,
    })
  } catch (error) {
    return {
      message: 'Ошибка БД: Не удалось создать проект.',
    }
  }

  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}

export async function updateProject(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateProject.safeParse({
    name: formData.get('name'),
    customerId: formData.get('customerId'),
    dashUrl: formData.get('dashUrl'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не заполнены обязательные поля. Проект не был обновлен.',
    }
  }

  const { name, customerId, dashUrl, status } = validatedFields.data

  try {
    await db
      .update(projects)
      .set({
        name,
        customer_id: customerId,
        dash_url: dashUrl || null,
        status,
      })
      .where(eq(projects.id, id))
  } catch (error) {
    return { message: 'Ошибка БД: Не удалось обновить проект.' }
  }

  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}

export async function deleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id))
    revalidatePath('/dashboard/projects')
    return { message: 'Проект удален' }
  } catch (error) {
    return { message: 'Ошибка БД: Не удалось удалить проект.' }
  }
}

export async function fetchProjectById(id: string) {
  try {
    const data = await db
      .select({
        id: projects.id,
        name: projects.name,
        customer_id: projects.customer_id,
        dash_url: projects.dash_url,
        status: projects.status,
        created_at: projects.created_at,
      })
      .from(projects)
      .where(eq(projects.id, id))

    const project = data[0]
    if (!project) return undefined

    return {
      ...project,
      dash_url: project.dash_url ?? '',
      status: project.status === 'ready' ? 'ready' : 'pending',
    } as ProjectForm
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить проект.')
  }
}

export async function fetchFilteredProjects(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  try {
    const data = await db
      .select({
        id: projects.id,
        name: projects.name,
        customer_name: customers.name,
        email: customers.email,
        image_url: customers.image_url,
        dash_url: projects.dash_url,
        status: projects.status,
        created_at: projects.created_at,
      })
      .from(projects)
      .innerJoin(customers, eq(projects.customer_id, customers.id))
      .where(
        or(
          ilike(projects.name, sql`${`%${query}%`}`),
          ilike(customers.name, sql`${`%${query}%`}`),
          ilike(customers.email, sql`${`%${query}%`}`),
          ilike(projects.status, sql`${`%${query}%`}`)
        )
      )
      .orderBy(desc(projects.created_at))
      .limit(ITEMS_PER_PAGE)
      .offset(offset)

    return data
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить проекты')
  }
}

export async function fetchProjectsPages(query: string) {
  try {
    const data = await db
      .select({
        count: count(),
      })
      .from(projects)
      .innerJoin(customers, eq(projects.customer_id, customers.id))
      .where(
        or(
          ilike(projects.name, sql`${`%${query}%`}`),
          ilike(customers.name, sql`${`%${query}%`}`),
          ilike(customers.email, sql`${`%${query}%`}`),
          ilike(projects.status, sql`${`%${query}%`}`)
        )
      )
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить количество проектов.')
  }
}

export async function fetchAllProjects() {
  try {
    const data = await db
      .select({
        id: projects.id,
        name: projects.name,
      })
      .from(projects)
      .orderBy(desc(projects.created_at))

    return data
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить список проектов.')
  }
}

export async function fetchLatestProjects() {
  try {
    const data = await db
      .select({
        id: projects.id,
        name: projects.name,
        customer_name: customers.name,
        image_url: customers.image_url,
        email: customers.email,
        status: projects.status,
      })
      .from(projects)
      .innerJoin(customers, eq(projects.customer_id, customers.id))
      .orderBy(desc(projects.created_at))
      .limit(5)

    return data.map((project) => ({
      ...project,
      amount: project.status === 'ready' ? 'Готов' : 'В работе',
    }))
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить последние проекты.')
  }
}
