'use client'

import { Button } from '@/components/ui/button'
import { State, updateProject } from '@/lib/actions/project.actions'
import { CustomerField, ProjectForm } from '@/types'
import {
  CheckIcon,
  ClockIcon,
  LinkIcon,
  UserCircleIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'

export default function EditProjectForm({
  project,
  customers,
}: {
  project: ProjectForm
  customers: CustomerField[]
}) {
  const initialState: State = { message: null, errors: {} }
  const updateProjectWithId = updateProject.bind(null, project.id)
  const [state, formAction] = useActionState(updateProjectWithId, initialState)

  return (
    <form action={formAction}>
      <div className="rounded-md p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Выберите клиента
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2"
              defaultValue={project.customer_id}
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
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
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

        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Название проекта
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={project.name}
            placeholder="Укажите название проекта"
            className="peer block w-full rounded-md border py-2 px-3 text-sm outline-2"
            aria-describedby="name-error"
          />

          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="dashUrl" className="mb-2 block text-sm font-medium">
            URL дашборда
          </label>
          <div className="relative">
            <input
              id="dashUrl"
              name="dashUrl"
              type="url"
              defaultValue={project.dash_url}
              placeholder="https://example.com/dashboard"
              className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
              aria-describedby="dashUrl-error"
            />
            <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>

          <div id="dashUrl-error" aria-live="polite" aria-atomic="true">
            {state.errors?.dashUrl &&
              state.errors.dashUrl.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Статус проекта
          </legend>
          <div className="rounded-md border px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={project.status === 'pending'}
                  className="h-4 w-4 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                >
                  В работе <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="ready"
                  name="status"
                  type="radio"
                  value="ready"
                  defaultChecked={project.status === 'ready'}
                  className="h-4 w-4 focus:ring-2"
                />
                <label
                  htmlFor="ready"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                >
                  Готов <CheckIcon className="h-4 w-4" />
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
        <Button variant="outline" asChild>
          <Link href="/dashboard/projects">Отмена</Link>
        </Button>

        <Button type="submit">Сохранить проект</Button>
      </div>
    </form>
  )
}
