import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { prisma } from "../prisma/prisma-client";
import { bookingParamsSchema, createBookingSchema } from "../schemas/booking";

export async function bookingRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/booking",
		{
			schema: {
				body: createBookingSchema,
				summary: "Create a new booking",
				tags: ["Booking"],
			},
		},
		async (request, reply) => {
			try {
				const userId = await request.getCurrentUserId();
				const { agendaId } = request.body;

				const agenda = await prisma.agenda.findUnique({
					where: { id: agendaId },
					include: {
						timeSlots: true,
					},
				});

				if (!agenda) {
					return reply.status(404).send({ error: "Agenda not found" });
				}

				const hasAvailableSlots = agenda.timeSlots.some(
					(slot: { isAvailable: boolean }) => slot.isAvailable,
				);
				if (!hasAvailableSlots) {
					return reply.status(400).send({ error: "No available time slots" });
				}

				const booking = await prisma.booking.create({
					data: {
						userId,
						agendaId,
					},
					include: {
						Agenda: {
							include: {
								arena: true,
							},
						},
					},
				});

				return booking;
			} catch (error) {
				return reply.status(401).send({ error: (error as Error).message });
			}
		},
	);

	app.withTypeProvider<ZodTypeProvider>().get(
		"/booking",
		{
			schema: {
				summary: "List all bookings for the current user",
				tags: ["Booking"],
			},
		},
		async (request, reply) => {
			try {
				const userId = await request.getCurrentUserId();

				const bookings = await prisma.booking.findMany({
					where: { userId },
					include: {
						Agenda: {
							include: {
								arena: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				});

				return bookings;
			} catch (error) {
				return reply.status(401).send({ error: (error as Error).message });
			}
		},
	);

	app.withTypeProvider<ZodTypeProvider>().delete(
		"/booking/:id",
		{
			schema: {
				params: bookingParamsSchema,
				summary: "Delete a booking",
				tags: ["Booking"],
			},
		},
		async (request, reply) => {
			try {
				const userId = await request.getCurrentUserId();
				const { id } = request.params;

				await prisma.booking.delete({
					where: {
						id,
						userId,
					},
				});

				return { message: "Booking deleted successfully" };
			} catch (error) {
				return reply.status(401).send({ error: (error as Error).message });
			}
		},
	);
}
