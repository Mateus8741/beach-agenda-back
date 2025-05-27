import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../prisma/prisma-client";

export async function arenaRoutes(app: FastifyInstance) {
	app.get("/arenas", async (request, reply) => {
		const arenas = await prisma.arena.findMany();
		return arenas;
	});

	app.get("/arenas/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		const arena = await prisma.arena.findUnique({
			where: { id },
			include: { agendas: true },
		});
		if (!arena) return reply.status(404).send({ error: "Arena not found" });
		return arena;
	});

	app.post("/arenas", async (request, reply) => {
		const bodySchema = z.object({
			name: z.string(),
			location: z.string(),
			tags: z.array(z.string()).optional(),
		});
		const { name, location, tags } = bodySchema.parse(request.body);
		const arena = await prisma.arena.create({
			data: { name, location, tags: tags ?? [] },
		});
		return arena;
	});

	app.put("/arenas/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		const bodySchema = z.object({
			name: z.string().optional(),
			location: z.string().optional(),
			tags: z.array(z.string()).optional(),
		});
		const data = bodySchema.parse(request.body);
		const arena = await prisma.arena.update({
			where: { id },
			data,
		});
		return arena;
	});

	app.delete("/arenas/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		await prisma.arena.delete({ where: { id } });
		return { message: "Arena deleted" };
	});
}
