import type { FastifyInstance } from "fastify";
import { prisma } from "../prisma/prisma-client";

export async function agendaRoutes(app: FastifyInstance) {
	// Create new agenda item
	app.post("/agenda", async (request, reply) => {
		try {
			const token = await request.jwtVerify();
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
					userId: token.id as string,
				},
			});

			return agenda;
		} catch {
			return reply.status(401).send({ error: "Unauthorized" });
		}
})

// Get all agenda items for the authenticated user
app.get("/agenda", async (request, reply) => {
	try {
		const token = await request.jwtVerify();
		const agenda = await prisma.agenda.findMany({
			where: {
				userId: token.id as string,
			},
			orderBy: {
				date: "asc",
			},
		});

		return agenda;
	} catch {
		return reply.status(401).send({ error: "Unauthorized" });
	}
});

// Update agenda item
app.put("/agenda/:id", async (request, reply) => {
		try {
			const token = await request.jwtVerify();
			const { id } = request.params as { id: string };
			const { title, description, date } = request.body as {
				title: string;
				description?: string;
				date: string;
			};

			const agenda = await prisma.agenda.update({
				where: {
					id,
					userId: token.id as string,
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

// Delete agenda item
app.delete("/agenda/:id", async (request, reply) => {
	try {
		const token = await request.jwtVerify();
		const { id } = request.params as { id: string };

		await prisma.agenda.delete({
			where: {
				id,
				userId: token.id as string,
			},
		});

		return { message: "Agenda item deleted successfully" };
	} catch {
		return reply.status(401).send({ error: "Unauthorized" });
	}
});
}
