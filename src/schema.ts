import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const decksTable = pgTable("decks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const cardsTable = pgTable("cards", {
  id: serial("id").primaryKey(),
  deckId: serial("deck_id")
    .notNull()
    .references(() => decksTable.id, { onDelete: "cascade" }),
  front: text("front").notNull(),
  back: text("back").notNull(),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type InsertDeck = typeof decksTable.$inferInsert;
export type SelectDeck = typeof decksTable.$inferSelect;
export type InsertCard = typeof cardsTable.$inferInsert;
export type SelectCard = typeof cardsTable.$inferSelect;
