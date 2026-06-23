// This file contains type definitions for your data.

export type FormattedCustomersTable = {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: string
  total_paid: string
}

export type CustomerForm = {
  id: string
  name: string
  email: string
  image_url: string
  phone: string
}

export type CustomerField = {
  id: string
  name: string
}

export type InvoiceForm = {
  id: string
  customer_id: string
  amount: number
  status: 'pending' | 'paid'
}

export type ProjectForm = {
  id: string
  name: string
  customer_id: string
  dash_url: string
  // amount: number
  status: 'pending' | 'ready'
}

export type DashboardForm = {
  id: string
  name: string
  dash_url: string
  project_id: string
  status: 'pending' | 'ready'
}

