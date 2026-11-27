import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { readingList } from "@/db/schema"

// Returns true if the entry was added, false if it was already in the reading list
export const addEntry = async (userId: number, blogId: number ) => {
  const inserted = await db
    .insert(readingList)
    .values({ userId, blogId })
    .onConflictDoNothing()
    .returning({ id: readingList.id })
  return inserted.length > 0
}

export const markEntryRead = async (userId: number, blogId: number ) => {
  await db.update(readingList).set({ read: true }).where(and(eq(readingList.userId, userId), eq(readingList.blogId, blogId)))
}
