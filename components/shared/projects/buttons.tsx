import { Button } from '@/components/ui/button'
import { DeleteButton } from '@/components/shared/DeleteButton';
import { deleteProject } from '@/lib/actions/project.actions'
// import { updateProject } from '@/lib/actions/project.actions'
import { PencilIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'

export function UpdateProject({ id }: { id: string }) {
  return (
    <Button variant="outline" asChild>
      <Link href={`/dashboard/projects/${id}/edit`}>
        <PencilIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function DeleteProject({ id }: { id: string }) {
  return <DeleteButton action={deleteProject} id={id} />;
}