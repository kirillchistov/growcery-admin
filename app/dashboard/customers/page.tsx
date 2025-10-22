import CustomersTable from '@/components/shared/customers/table'
import { fetchFilteredCustomers } from '@/lib/actions/customer.actions'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Клиенты',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''

  const customers = await fetchFilteredCustomers(query)

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  )
}
