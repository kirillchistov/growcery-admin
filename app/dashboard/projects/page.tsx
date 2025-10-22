import { inter } from '@/components/shared/fonts'
import Pagination from '@/components/shared/projects/pagination'
import ProjectsTable from '@/components/shared/projects/table'
import Search from '@/components/shared/search'
import { InvoicesTableSkeleton } from '@/components/shared/skeletons'
import { Button } from '@/components/ui/button'
import { fetchProjectsPages } from '@/lib/actions/project.actions'
import { PlusIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Проекты',
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
  const currentPage = Number(searchParams?.page) || 1

  const totalPages = await fetchProjectsPages(query)

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-2xl`}>Биллинг</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Поиск счета..." />
        <Button asChild>
          <Link href="/dashboard/projects/create">
            <span className="hidden md:block">Создать счет</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </Button>
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <ProjectsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
