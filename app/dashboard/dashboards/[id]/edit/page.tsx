import Breadcrumbs from '@/components/shared/dashboards/breadcrumbs'
import EditDashboardForm from '@/components/shared/dashboards/edit-form'
import { fetchCustomers } from '@/lib/actions/customer.actions'
import { fetchDashboardById } from '@/lib/actions/dashboard.actions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Редактировать дашборд',
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const [dashboard, customers] = await Promise.all([
    fetchDashboardById(id),
    fetchCustomers(),
  ])

  if (!dashboard) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Проекты', href: '/dashboard/dashboards' },
          {
            label: 'Редактировать дашборд',
            href: `/dashboard/dashboards/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditDashboardForm dashboard={dashboard} customers={customers} />
    </main>
  )
}
