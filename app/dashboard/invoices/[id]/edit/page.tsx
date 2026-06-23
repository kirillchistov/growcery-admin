import Breadcrumbs from '@/components/shared/invoices/breadcrumbs'
import EditInvoiceForm from '@/components/shared/invoices/edit-form'
import { fetchCustomers } from '@/lib/actions/customer.actions'
import { fetchInvoiceById } from '@/lib/actions/invoice.actions'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Invoice',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ])

  if (!invoice) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Счета', href: '/dashboard/invoices' },
          {
            label: 'Редактировать счет',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditInvoiceForm invoice={invoice} customers={customers} />
    </main>
  )
}
