import Breadcrumbs from '@/components/shared/customers/breadcrumbs'
import EditCustomerForm from '@/components/shared/customers/edit-form'
import { fetchCustomerById } from '@/lib/actions/customer.actions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Редактировать клиента',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await fetchCustomerById(id)

  if (!customer) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Клиенты', href: '/dashboard/customers' },
          {
            label: 'Редактировать клиента',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCustomerForm customer={customer} />
    </main>
  )
}
