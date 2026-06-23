import CustomersTable from '@/components/shared/customers/table'
import Search from '@/components/shared/search'
import { Button } from '@/components/ui/button'
import { fetchFilteredCustomers } from '@/lib/actions/customer.actions'
import { inter } from '@/components/shared/fonts'
import { PlusIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Клиенты',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const query = params?.query || ''

  const customers = await fetchFilteredCustomers(query)

  return (
    <main className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-2xl`}>Клиенты</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Поиск клиентов..." />
        <Button asChild>
          <Link href="/dashboard/customers/create">
            <span className="hidden md:block">Создать клиента</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </Button>
      </div>
      <CustomersTable customers={customers} />
    </main>
  )
}
