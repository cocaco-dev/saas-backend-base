import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { dbTables } from './db.config';
const baseFields = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deleted: boolean('deleted').default(false),
  status: boolean('status').default(false),
};

export const users = pgTable(dbTables.users, {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  refreshToken: text('refresh_token').notNull(),
  ...baseFields,
});
