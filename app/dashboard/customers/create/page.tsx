import Breadcrumbs from '@/components/shared/customers/breadcrumbs'
import CreateCustomerForm from '@/components/shared/customers/create-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Создать клиента',
}

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Клиенты', href: '/dashboard/customers' },
          {
            label: 'Создать клиента',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <CreateCustomerForm />
    </main>
  )
}
