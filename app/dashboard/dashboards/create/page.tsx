import Breadcrumbs from '@/components/shared/projects/breadcrumbs'
import Form from '@/components/shared/projects/create-form'
import { fetchCustomers } from '@/lib/actions/customer.actions'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Создать проект',
}

export default async function Page() {
  const customers = await fetchCustomers()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Проекты', href: '/dashboard/projects' },
          {
            label: 'Создать проект',
            href: '/dashboard/projects/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  )
}
