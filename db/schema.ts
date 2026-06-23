import {
  pgTable,
  uuid,
  varchar,
  unique,
  integer,
  text,
  date,
  timestamp,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const customers = pgTable('customers', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  image_url: varchar('image_url', { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow()
})

export const revenue = pgTable(
  'revenue',
  {
    month: varchar('month', { length: 4 }).notNull(),
    revenue: integer('revenue').notNull(),
  },
  (table) => {
    return {
      revenue_month_key: unique('revenue_month_key').on(table.month),
    }
  }
)

export const users = pgTable(
  'users',
  {
    id: uuid('id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
  },
  (table) => {
    return {
      users_email_key: unique('users_email_key').on(table.email),
    }
  }
)

export const invoices = pgTable('invoices', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  customer_id: uuid('customer_id').notNull(),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 255 }).notNull(),
  date: date('date').notNull(),
  project_id: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
})

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  customer_id: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  dash_url: varchar('dash_url', { length: 500 }),
  status: varchar('status', { length: 255 }).notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const dashboards = pgTable('dashboards', {
  id: uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey()
    .notNull(),
  project_id: uuid('project_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  dash_url: varchar('dash_url', { length: 255 }).notNull(),
  status: varchar('status', { length: 255 }).notNull(),
  date: date('date').notNull(),
})
