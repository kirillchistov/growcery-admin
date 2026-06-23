'use server'

import db from '@/db/drizzle'
import { customers, dashboards, projects } from '@/db/schema'
import { count, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { ITEMS_PER_PAGE } from '../constants'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { DashboardForm } from '@/types'


export async function fetchLatestDashboards() {
  try {
    const data = await db
      .select({
        name: customers.name,
        image_url: customers.image_url,
        email: customers.email,
        id: dashboards.id,
        dash_url: dashboards.dash_url,
      })
      .from(dashboards)
      .innerJoin(customers, eq(dashboards.project_id, projects.id))
      .orderBy(desc(dashboards.date))
      .limit(5)

    const latestDashboards = data.map((dashboard) => ({
      ...dashboard,
      name: dashboard.name,
    }))

    return latestDashboards
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить последние дашборды.')
  }
}

export async function deleteDashboard(id: string) {
  try {
    await db.delete(dashboards).where(eq(dashboards.id, id))
    revalidatePath('/dashboard/dashboards')
    return { message: 'Дашборд удален' }
  } catch (error) {
    return { message: 'Ошибка БД: Не удалось удалить дашборд.' }
  }
}

export async function fetchFilteredDashboards(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  try {
    const data = await db
      .select({
        id: dashboards.id,
        name: customers.name,
        email: customers.email,
        dash_url: dashboards.dash_url,
        image_url: customers.image_url,
        status: dashboards.status,
        date: dashboards.date,
      })
      .from(dashboards)
      .innerJoin(projects, eq(dashboards.project_id, projects.id))
      .where(
        or(
          ilike(customers.name, sql`${`%${query}%`}`),
          ilike(customers.email, sql`${`%${query}%`}`),
          ilike(dashboards.status, sql`${`%${query}%`}`)
        )
      )
      .orderBy(desc(dashboards.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset)

    return data
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить дашборды')
  }
}

export async function fetchDashboardsPages(query: string) {
  try {
    const data = await db
      .select({
        count: count(),
      })
      .from(dashboards)
      .innerJoin(projects, eq(projects.customer_id, projects.id))
      .where(
        or(
          ilike(customers.name, sql`${`%${query}%`}`),
          ilike(customers.email, sql`${`%${query}%`}`),
          ilike(dashboards.status, sql`${`%${query}%`}`)
        )
      )
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE)
    return totalPages
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить количество дашбордов.')
  }
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Пожалуйста, укажите название дашборда.',
  }),
  dash_url: z.string({
    invalid_type_error: 'Пожалуйста, укажите URL дашборда.',
  }),
  projectId: z.string({
    invalid_type_error: 'Пожалуйста, выберите проект.',
  }),
  status: z.enum(['Pending', 'Ready'], {
    invalid_type_error: 'Пожалуйста, выберите статус дашборда.',
  }),
  date: z.string(),
})
const CreateDashboard = FormSchema.omit({ id: true, date: true })
const UpdateDashboard = FormSchema.omit({ date: true, id: true })

export type State = {
  errors?: {
    customerId?: string[]
    projectId?: string[]
    name?: string[]
    status?: string[]
  }
  message?: string | null
}

export async function createDashboard(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateDashboard.safeParse({
    customerId: formData.get('customerId'),
    projectId: formData.get('projectId'),
    name: formData.get('name'),
    dash_url: formData.get('dash_url'),
    status: formData.get('status'),
  })

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не заполнены обязательные поля. Дашборд не был создан.',
    }
  }

  // Prepare data for insertion into the database
  const { projectId, name, dash_url, status } = validatedFields.data
  // const amountInCents = amount * 100
  const date = new Date().toISOString().split('T')[0]

  // Insert data into the database
  try {
    await db.insert(dashboards).values({
      project_id: projectId,
      name,
      dash_url,
      status,
      date,
    })
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Ошибка БД: Не удалось создать дашборд.',
    }
  }
  // Revalidate the cache for the Dashboards page and redirect the user.
  revalidatePath('/dashboard/dashboards')
  redirect('/dashboard/dashboards')
}

export async function updateDashboard(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateDashboard.safeParse({
    customerId: formData.get('customerId'),
    projectId: formData.get('projectId'),
    name: formData.get('name'),
    status: formData.get('status'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не заполнены обязательные поля. Дашборд не был обновлен.',
    }
  }

  const { projectId, name, status } = validatedFields.data
  
  try {
    await db
      .update(dashboards)
      .set({
        project_id: projectId,
        name,
        status,
      })
      .where(eq(dashboards.id, id))
  } catch (error) {
    return { message: 'Ошибка БД: Не удалось обновить проект.' }
  }
  revalidatePath('/dashboard/dashboards')
  redirect('/dashboard/dashboards')
}

export async function fetchDashboardById(id: string) {
  try {
    const data = await db
      .select({
        id: dashboards.id,
        project_id: dashboards.project_id,
        name: dashboards.name,
        dash_url: dashboards.dash_url,
        status: dashboards.status,
        date: dashboards.date,
      })
      .from(dashboards)
      .where(eq(dashboards.id, id))

    const dashboard = data.map((dashboard) => ({
      ...dashboard,
      status: dashboard.status === 'ready' ? 'ready' : 'pending',
      name: dashboard.name,
    }))

    return dashboard[0] as DashboardForm
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить дашборд.')
  }
}
