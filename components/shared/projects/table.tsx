import { fetchFilteredProjects } from '@/lib/actions/project.actions'
import Image from 'next/image'
import ProjectStatus from './status'
import { formatCurrency, formatDateToLocal } from '@/lib/utils'
import { DeleteProject, UpdateProject } from './buttons'

export default async function ProjectsTable({
  query,
  currentPage,
}: {
  query: string
  currentPage: number
}) {
  const projects = await fetchFilteredProjects(query, currentPage)

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden">
            {projects?.map((project) => (
              <div key={project.id} className="mb-2 w-full rounded-md  p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={project.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${project.name} фото профиля`}
                      />
                      <p>{project.name}</p>
                    </div>
                    <p className="text-sm text-muted">{project.email}</p>
                  </div>
                  <ProjectStatus status={project.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {project.name}
                    </p>
                    <p>{formatDateToLocal(project.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProject id={project.id} />
                    <DeleteProject id={project.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full   md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Клиент
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Сумма
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Дата
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Статус
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Редактировать</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((project) => (
                <tr
                  key={project.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={project.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${project.name} фото профиля`}
                      />
                      <p>{project.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {project.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {project.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(project.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <ProjectStatus status={project.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProject id={project.id} />
                      <DeleteProject id={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
