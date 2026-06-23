'use server'

import db from '@/db/drizzle'
import { customers, invoices } from '@/db/schema'
import { asc, eq, ilike, or, sql } from 'drizzle-orm'
import { formatCurrency } from '../utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { CustomerForm } from '@/types'

const DEFAULT_IMAGE_URL = '/customers/a1.jpeg'

const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Пожалуйста, укажите имя клиента.' }),
  email: z.string().email({ message: 'Пожалуйста, укажите корректный email.' }),
  imageUrl: z
    .string()
    .min(1, { message: 'Пожалуйста, укажите URL изображения.' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
})

const CreateCustomer = FormSchema.omit({ id: true })
const UpdateCustomer = FormSchema.omit({ id: true })

export type State = {
  errors?: {
    name?: string[]
    email?: string[]
    imageUrl?: string[]
    phone?: string[]
  }
  message?: string | null
}

export async function fetchCustomers() {
  try {
    const data = await db
      .select({
        id: customers.id,
        name: customers.name,
      })
      .from(customers)
      .orderBy(customers.name)
    return data
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch all customers.')
  }
}

export async function fetchFilteredCustomers(query: string) {
  const data = await db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      image_url: customers.image_url,
      total_invoices: sql<number>`count(${invoices.id})`,
      total_pending: sql<number>`SUM(CASE WHEN ${invoices.status} = 'pending' THEN ${invoices.amount} ELSE 0 END)`,
      total_paid: sql<number>`SUM(CASE WHEN ${invoices.status} = 'paid' THEN ${invoices.amount} ELSE 0 END)`,
    })
    .from(customers)
    .leftJoin(invoices, eq(customers.id, invoices.customer_id))
    .where(
      or(
        ilike(customers.name, sql`${`%${query}%`}`),
        ilike(customers.email, sql`${`%${query}%`}`)
      )
    )
    .groupBy(customers.id, customers.name, customers.email, customers.image_url)
    .orderBy(asc(customers.id))

  return data.map((row) => ({
    ...row,
    total_invoices: row.total_invoices ?? 0,
    total_pending: formatCurrency(row.total_pending ?? 0),
    total_paid: formatCurrency(row.total_paid ?? 0),
  }))
}

export async function fetchCustomerById(id: string) {
  try {
    const data = await db
      .select({
        id: customers.id,
        name: customers.name,
        email: customers.email,
        image_url: customers.image_url,
        phone: customers.phone,
      })
      .from(customers)
      .where(eq(customers.id, id))

    const customer = data[0]
    if (!customer) return undefined

    return {
      ...customer,
      phone: customer.phone ?? '',
    } as CustomerForm
  } catch (error) {
    console.error('Ошибка БД:', error)
    throw new Error('Не удалось загрузить клиента.')
  }
}

export async function createCustomer(prevState: State, formData: FormData) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    imageUrl: formData.get('imageUrl'),
    phone: formData.get('phone'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не заполнены обязательные поля. Клиент не был создан.',
    }
  }

  const { name, email, imageUrl, phone } = validatedFields.data

  try {
    await db.insert(customers).values({
      name,
      email,
      image_url: imageUrl || DEFAULT_IMAGE_URL,
      phone: phone || null,
    })
  } catch (error) {
    return {
      message: 'Ошибка БД: Не удалось создать клиента.',
    }
  }

  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}

export async function updateCustomer(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    imageUrl: formData.get('imageUrl'),
    phone: formData.get('phone'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Не заполнены обязательные поля. Клиент не был обновлен.',
    }
  }

  const { name, email, imageUrl, phone } = validatedFields.data

  try {
    await db
      .update(customers)
      .set({
        name,
        email,
        image_url: imageUrl || DEFAULT_IMAGE_URL,
        phone: phone || null,
      })
      .where(eq(customers.id, id))
  } catch (error) {
    return { message: 'Ошибка БД: Не удалось обновить клиента.' }
  }

  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}

export async function deleteCustomer(id: string) {
  try {
    await db.delete(customers).where(eq(customers.id, id))
    revalidatePath('/dashboard/customers')
    return { message: 'Клиент удален' }
  } catch (error) {
    return {
      message:
        'Ошибка БД: Не удалось удалить клиента. Возможно, есть связанные записи.',
    }
  }
}
