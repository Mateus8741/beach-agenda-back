import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";

import { prisma } from "../prisma/prisma-client";

export async function userRoutes(app: FastifyInstance) {
	app.post("/users", async (request, reply) => {
		const { name, email, password } = request.body as {
			name: string;
			email: string;
			password: string;
		};

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	const token = app.jwt.sign({ id: user.id });

	return { user, token };
}
)

app.post("/users/login", async (request, reply) => {
		const { email, password } = request.body as {
			email: string;
			password: string;
		};

const user = await prisma.user.findUnique({
	where: { email },
});

if (!user) {
	return reply.status(401).send({ error: "Invalid credentials" });
}

const validPassword = await bcrypt.compare(password, user.password);

if (!validPassword) {
	return reply.status(401).send({ error: "Invalid credentials" });
}

const token = app.jwt.sign({ id: user.id });

return { user, token };
})

app.get("/users/profile", async (request, reply) => {
	try {
		const userId = await request.getCurrentUserId();
		
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			return reply.status(404).send({ error: "User not found" });
		}

		return user;
	} catch {
		return reply.status(401).send({ error: "Unauthorized" });
	}
});
}
