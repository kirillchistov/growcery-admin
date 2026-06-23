import { Badge } from '@/components/ui/badge'
import { CheckIcon, ClockIcon } from 'lucide-react'

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <Badge variant={status === 'ready' ? 'secondary' : 'default'}>
      {status === 'pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4" />
        </>
      ) : null}
      {status === 'ready' ? (
        <>
          Ready
          <CheckIcon className="ml-1 w-4" />
        </>
      ) : null}
    </Badge>
  )
}
