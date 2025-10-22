import Breadcrumbs from '@/components/shared/invoices/breadcrumbs'
import EditProjectForm from '@/components/shared/projects/edit-form'
import { fetchCustomers } from '@/lib/actions/customer.actions'
import { fetchProjectById } from '@/lib/actions/project.actions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Редактировать проект',
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const [project, customers] = await Promise.all([
    fetchProjectById(id),
    fetchCustomers(),
  ])

  if (!project) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Проекты', href: '/dashboard/projects' },
          {
            label: 'Редактировать проект',
            href: `/dashboard/projects/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditProjectForm project={project} customers={customers} />
    </main>
  )
}
