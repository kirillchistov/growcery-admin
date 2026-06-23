import { Button } from '@/components/ui/button'
import { DeleteButton } from '@/components/shared/DeleteButton'
import { deleteCustomer } from '@/lib/actions/customer.actions'
import { PencilIcon } from 'lucide-react'
import Link from 'next/link'

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Button variant="outline" asChild>
      <Link href={`/dashboard/customers/${id}/edit`}>
        <PencilIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function DeleteCustomerButton({ id }: { id: string }) {
  return <DeleteButton action={deleteCustomer} id={id} />
}
