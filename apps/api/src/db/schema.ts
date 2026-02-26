import { pgTable, text, timestamp, integer, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';

export * from './auth-schema'

// App tables
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  color: text('color').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('categories_slug_idx').on(table.slug),
]);

export const ideas = pgTable('ideas', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('published'),
  categoryId: text('category_id').notNull().references(() => categories.id),
  authorId: text('author_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  voteCount: integer('vote_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('ideas_category_idx').on(table.categoryId),
  index('ideas_author_idx').on(table.authorId),
  index('ideas_status_idx').on(table.status),
  index('ideas_created_at_idx').on(table.createdAt),
]);

export const votes = pgTable('votes', {
  id: text('id').primaryKey(),
  ideaId: text('idea_id').notNull().references(() => ideas.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('votes_idea_user_idx').on(table.ideaId, table.userId),
]);

export const comments = pgTable('comments', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  ideaId: text('idea_id').notNull().references(() => ideas.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('comments_idea_idx').on(table.ideaId),
  index('comments_author_idx').on(table.authorId),
]);
