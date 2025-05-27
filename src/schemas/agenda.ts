import { z } from "zod";

export const createAgendaSchema = z.object({
	title: z.string(),
	description: z.string(),
	date: z.string(),
	timeSlots: z.array(
		z.object({
			time: z.string(),
			isAvailable: z.boolean(),
		}),
	),
	location: z.string(),
	userId: z.string().uuid(),
});

export const updateAgendaSchema = createAgendaSchema.partial();

export const agendaParamsSchema = z.object({
	id: z.string().uuid(),
});

export type CreateAgendaInput = z.infer<typeof createAgendaSchema>;
export type UpdateAgendaInput = z.infer<typeof updateAgendaSchema>;
export type AgendaParams = z.infer<typeof agendaParamsSchema>;
