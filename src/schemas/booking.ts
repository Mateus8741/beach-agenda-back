import { z } from "zod";

export const bookingParamsSchema = z.object({
	id: z.string().uuid(),
});

export const createBookingSchema = z.object({
	agendaId: z.string().uuid(),
});

export const bookingResponseSchema = z.object({
	id: z.string().uuid(),
	userId: z.string().uuid(),
	agendaId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
	Agenda: z.object({
		title: z.string(),
		description: z.string(),
		date: z.date(),
		arena: z.object({
			name: z.string(),
			location: z.string(),
		}),
	}),
});
