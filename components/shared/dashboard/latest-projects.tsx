import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { fetchLatestProjects } from '@/lib/actions/project.actions'
import { inter } from '../fonts'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { RefreshCcw } from 'lucide-react'

export default async function LatestProjects() {
  const latestProjects = await fetchLatestProjects()

  return (
    <Card className="flex w-full flex-col md:col-span-4">
      <CardHeader>
        <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
          Последние проекты
        </h2>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            {latestProjects.map((project, i) => {
              return (
                <div
                  key={project.id}
                  className={cn(
                    'flex flex-row items-center justify-between py-4',
                    {
                      'border-t': i !== 0,
                    }
                  )}
                >
                  <div className="flex items-center">
                    <Image
                      src={project.image_url}
                      alt={`${project.customer_name} фото профиля`}
                      className="mr-4 rounded-full"
                      width={32}
                      height={32}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold md:text-base">
                        {project.name}
                      </p>
                      <p className="hidden text-sm text-gray-500 sm:block">
                        {project.customer_name}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`${inter.className} truncate text-sm font-medium md:text-base`}
                  >
                    {project.amount}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="flex items-center pb-2 pt-6">
            <RefreshCcw className="h-5 w-5 text-gray-500" />
            <h3 className="ml-2 text-sm text-gray-500 ">Обновлено только что</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
