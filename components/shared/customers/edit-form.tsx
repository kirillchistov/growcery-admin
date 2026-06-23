'use client'

import { Button } from '@/components/ui/button'
import { State, updateCustomer } from '@/lib/actions/customer.actions'
import { CustomerForm } from '@/types'
import { ImageIcon, MailIcon, PhoneIcon, UserCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'

export default function EditCustomerForm({
  customer,
}: {
  customer: CustomerForm
}) {
  const initialState: State = { message: null, errors: {} }
  const updateCustomerWithId = updateCustomer.bind(null, customer.id)
  const [state, formAction] = useActionState(updateCustomerWithId, initialState)

  return (
    <form action={formAction}>
      <div className="rounded-md p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Имя клиента
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={customer.name}
              placeholder="Укажите имя"
              className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
              aria-describedby="name-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={customer.email}
              placeholder="client@example.com"
              className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
              aria-describedby="email-error"
            />
            <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Телефон
          </label>
          <div className="relative">
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={customer.phone}
              placeholder="+7 (999) 000-00-00"
              className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
              aria-describedby="phone-error"
            />
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
          <div id="phone-error" aria-live="polite" aria-atomic="true">
            {state.errors?.phone?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium">
            URL фото профиля
          </label>
          <div className="relative">
            <input
              id="imageUrl"
              name="imageUrl"
              type="text"
              defaultValue={customer.image_url}
              placeholder="/customers/a1.jpeg"
              className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
              aria-describedby="imageUrl-error"
            />
            <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
          <div id="imageUrl-error" aria-live="polite" aria-atomic="true">
            {state.errors?.imageUrl?.map((error) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/customers">Отмена</Link>
        </Button>
        <Button type="submit">Сохранить клиента</Button>
      </div>
    </form>
  )
}
