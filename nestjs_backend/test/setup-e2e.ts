import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(database: string) {
  const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASS } =
    process.env

  if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_USER || !DATABASE_PASS) {
    throw new Error(
      'Please provide a DATABASE_HOST, DATABASE_PORT, DATABASE_USER and DATABASE_PASS environment variables',
    )
  }

  const connectionUrl = `mysql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${database}`
  const url = new URL(connectionUrl)

  return url.toString()
}

const testDatabase = `test_${randomUUID()}`

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(testDatabase)

  process.env.DATABASE_URL = databaseURL

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS \`${testDatabase}\`;`)
  await prisma.$disconnect()
})
