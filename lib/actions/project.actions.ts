'use server'

import db from '@/db/drizzle'
import { customers, projects } from '@/db/schema'
import { count, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { ITEMS_PER_PAGE } from '../constants'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { ProjectForm } from '@/types'


export async function fetchLatestProjects() {
  try {
    const data = await db
      .select({
        name: projects.name,
        customers_name: customers.name,
        image_url: customers.image_url,
        email: customers.email,
        id: projects.id,
      })
      .from(projects)
      .innerJoin(customers, eq(projects.customer_id, customers.id))
      .orderBy(desc(projects.date))
      .limit(5)

    const latestProjects = data.map((project) => ({
      ...project,
      name: project.name,
    }))

    return latestProjects
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить последние проекты.')
  }
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
        customers_name: customers.name,
        email: customers.email,
        image_url: customers.image_url,
        status: projects.status,
        date: projects.date,
      })
      .from(projects)
      .innerJoin(customers, eq(projects.customer_id, customers.id))
      .where(
        or(
          ilike(customers.name, sql`${`%${query}%`}`),
          ilike(customers.email, sql`${`%${query}%`}`),
          ilike(projects.status, sql`${`%${query}%`}`)
        )
      )
      .orderBy(desc(projects.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset)

    return data
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить проекты')
  }
}

// export async function fetchProjectsPages(query: string) {
//   try {
//     const data = await db
//       .select({
//         count: count(),
//       })
//       .from(projects)
//       .innerJoin(customers, eq(projects.customer_id, customers.id))
//       .where(
//         or(
//           ilike(customers.name, sql`${`%${query}%`}`),
//           ilike(customers.email, sql`${`%${query}%`}`),
//           ilike(projects.status, sql`${`%${query}%`}`)
//         )
//       )
//     const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE)
//     return totalPages
//   } catch (error) {
//     console.error('Ошибка БД:', error)
//     throw new Error('Не удалось загрузить количество проектов.')
//   }
// }

export async function fetchProjectsPages(query: string) {
  try {
    // Получаем общее количество записей
    const result = await db
      .select({
        count: count(),
      })
      .from(projects)
      .innerJoin(customers, eq(projects.customer_id, customers.id))
      .where(
        or(
          ilike(customers.name, sql`${`%${query}%`}`),
          ilike(customers.email, sql`${`%${query}%`}`),
          ilike(projects.status, sql`${`%${query}%`}`)
        )
      );

    // Проверяем результат
    if (!result || result.length === 0) {
      return 0;
    }

    // Получаем значение count
    const totalCount = Number(result[0].count);
    
    // Рассчитываем количество страниц
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Ошибка при получении количества проектов:', error);
    throw new Error('Не удалось получить количество проектов.');
  }
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Пожалуйста, укажите название.',
  }),
  customerId: z.string({
    invalid_type_error: 'Пожалуйста, выберите клиента.',
  }),
  status: z.enum(['pending', 'ready'], {
    invalid_type_error: 'Пожалуйста, выберите статус проекта.',
  }),
  date: z.string(),
})
const CreateProject = FormSchema.omit({ id: true, date: true })
const UpdateProject = FormSchema.omit({ date: true, id: true })

export type State = {
  errors?: {
    customerId?: string[]
    name?: string[]
    status?: string[]
  }
  message?: string | null
}

export async function createProject(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateProject.safeParse({
    customerId: formData.get('customerId'),
    name: formData.get('name'),
    status: formData.get('status'),
  })

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не заполнены обязательные поля. Проект не был создан.',
    }
  }

  // Prepare data for insertion into the database
  const { customerId, name, status } = validatedFields.data
  // const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  // Insert data into the database
  try {
    await db.insert(projects).values({
      customer_id: customerId,
      name,
      status,
      date,
    })
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Ошибка БД: Не удалось создать проект.',
    }
  }
  // Revalidate the cache for the projects page and redirect the user.
  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}

export async function updateProject(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateProject.safeParse({
    customerId: formData.get('customerId'),
    name: formData.get('name'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не заполнены обязательные поля. Проект не был обновлен.',
    }
  }

  const { customerId, name, status } = validatedFields.data
  
  try {
    await db
      .update(projects)
      .set({
        customer_id: customerId,
        name,
        status,
      })
      .where(eq(projects.id, id))
  } catch (error) {
    return { message: 'Ошибка БД: Не удалось обновить проект.' }
  }
  revalidatePath('/dashboard/projects')
  redirect('/dashboard/projects')
}

export async function fetchProjectById(id: string) {
  try {
    const data = await db
      .select({
        id: projects.id,
        customer_id: projects.customer_id,
        name: projects.name,
        status: projects.status,
        date: projects.date,
      })
      .from(projects)
      .where(eq(projects.id, id))

    const project = data.map((project) => ({
      ...project,
      status: project.status === 'ready' ? 'ready' : 'pending',
      name: project.name,
    }))

    return project[0] as ProjectForm
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить проект.')
  }
}
