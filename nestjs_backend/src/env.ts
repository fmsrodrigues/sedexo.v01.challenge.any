import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),

  DATABASE_HOST: z.string().optional().default('localhost'),
  DATABASE_PORT: z.coerce.number().optional().default(3306),
  DATABASE_USER: z.string(),
  DATABASE_PASS: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_ROOT_PASSWORD: z.string(),
  DATABASE_URL: z.string().url(),

  FRETE_RAPIDO_API_CNPJ: z.string(),
  FRETE_RAPIDO_API_TOKEN: z.string(),
  FRETE_RAPIDO_API_PLATAFORMA: z.string(),
  FRETE_RAPIDO_API_CEP: z.string().length(8),
})

export type Env = z.infer<typeof envSchema>
