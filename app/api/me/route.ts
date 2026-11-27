import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

export const GET = async (req: NextRequest) => {
  const authorization = req.headers.get("Authorization")
  if (!authorization  || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const token = await authorization.substring(7)
  const user = await db.query.users.findFirst({
    where: eq(users.token, token),
    columns: { id: true, username: true, name: true },
    with: { blogs: true }
  })
  if(!user){
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
  return NextResponse.json(user)
}
