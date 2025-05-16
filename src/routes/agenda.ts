import type { FastifyInstance } from "fastify";
import { prisma } from "../prisma/prisma-client";

export async function agendaRoutes(app: FastifyInstance) {
	app.post("/agenda", async (request, reply) => {
		try {
			const userId = await request.getCurrentUserId();
			const { title, description, date } = request.body as {
				title: string;
				description?: string;
				date: string;
			};

			const agenda = await prisma.agenda.create({
				data: {
					title,
					description,
					date: new Date(date),
					userId,
				},
			});

			return agenda;
		} catch {
			return reply.status(401).send({ error: "Unauthorized" });
		}
})

	app.get("/agenda", async (request, reply) => {
		try {
			const userId = await request.getCurrentUserId();
			const agenda = await prisma.agenda.findMany({
				where: {userId},
				orderBy: {
					date: "asc",
				},
			});

			return agenda;
		} catch {
			return reply.status(401).send({ error: "Unauthorized" });
		}
	});

	app.put("/agenda/:id", async (request, reply) => {
		try {
			const userId = await request.getCurrentUserId();
			const { id } = request.params as { id: string };
			const { title, description, date } = request.body as {
				title: string;
				description?: string;
				date: string;
			};

			const agenda = await prisma.agenda.update({
				where: {
					id,
					userId,
				},
				data: {
					title,
					description,
					date: new Date(date),
				},
			});

			return agenda;
		} catch {
			return reply.status(401).send({ error: "Unauthorized" });
		}
	})

	app.delete("/agenda/:id", async (request, reply) => {
		try {
			const userId = await request.getCurrentUserId();
		const { id } = request.params as { id: string };

		await prisma.agenda.delete({
			where: {
				id,
				userId,
			},
		});

		return { message: "Agenda item deleted successfully" };
	} catch {
		return reply.status(401).send({ error: "Unauthorized" });
	}
});
}
