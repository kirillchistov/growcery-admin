'use client'
import { Button } from '@/components/ui/button'
import { State, updateDashboard } from '@/lib/actions/dashboard.actions'
import { CustomerField, DashboardForm } from '@/types'
import {
  CheckIcon,
  ClockIcon,
  DollarSignIcon,
  UserCircleIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'

export default function EditDashboardForm({
  dashboard,
  customers,
}: {
  dashboard: DashboardForm
  customers: CustomerField[]
}) {
  const initialState: State = { message: null, errors: {} }
  const updateDashboardWithId = updateDashboard.bind(null, dashboard.id)
  const [state, formAction] = useActionState(updateDashboardWithId, initialState)

  return (
    <form action={formAction}>
      <div className="rounded-md   p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Выберите клиента
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border   py-2 pl-10 text-sm outline-2  "
              defaultValue={dashboard.customer_id}
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Выберите клиента
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
          </div>

          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Название дашборда */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Укажите название
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={'Новый проект 1021'}
                step="0.01"
                placeholder="Укажите название дашборда"
                className="peer block w-full rounded-md border   py-2 pl-10 text-sm outline-2  "
                aria-describedby="name-error"
              />
              {/* <DollarSignIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " /> */}
            </div>
          </div>

          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Dashboard Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Укажите статус дашборда
          </legend>
          <div className="rounded-md border  px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={dashboard.status === 'pending'}
                  className="h-4 w-4   focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full  px-3 py-1.5 text-xs font-medium  "
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="ready"
                  name="status"
                  type="radio"
                  value="ready"
                  defaultChecked={dashboard.status === 'ready'}
                  className="h-4 w-4  focus:ring-2"
                />
                <label
                  htmlFor="ready"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full   px-3 py-1.5 text-xs font-medium  "
                >
                  Ready <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="ghost">
          <Link href="/dashboard/dashboards">Отмена</Link>
        </Button>

        <Button type="submit">Редактировать дашборд</Button>
      </div>
    </form>
  )
}
