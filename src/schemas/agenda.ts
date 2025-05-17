import { z } from 'zod'

export const createAgendaSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  date: z.string().datetime(),
  location: z.string(),
  userId: z.string().uuid(),
})

export const updateAgendaSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
  location: z.string().optional(),
})

export const agendaParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreateAgendaInput = z.infer<typeof createAgendaSchema>
export type UpdateAgendaInput = z.infer<typeof updateAgendaSchema>
export type AgendaParams = z.infer<typeof agendaParamsSchema>
