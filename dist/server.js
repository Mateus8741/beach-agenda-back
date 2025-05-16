"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_cors = __toESM(require("@fastify/cors"));
var import_jwt = __toESM(require("@fastify/jwt"));
var import_fastify = __toESM(require("fastify"));

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "info", "warn", "error"]
});

// src/routes/agenda.ts
async function agendaRoutes(app2) {
  app2.post("/agenda", async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId();
      const { title, description, date } = request.body;
      const agenda = await prisma.agenda.create({
        data: {
          title,
          description,
          date: new Date(date),
          userId
        }
      });
      return agenda;
    } catch {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });
  app2.get("/agenda", async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId();
      const agenda = await prisma.agenda.findMany({
        where: { userId },
        orderBy: {
          date: "asc"
        }
      });
      return agenda;
    } catch {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });
  app2.put("/agenda/:id", async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId();
      const { id } = request.params;
      const { title, description, date } = request.body;
      const agenda = await prisma.agenda.update({
        where: {
          id,
          userId
        },
        data: {
          title,
          description,
          date: new Date(date)
        }
      });
      return agenda;
    } catch {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });
  app2.delete("/agenda/:id", async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId();
      const { id } = request.params;
      await prisma.agenda.delete({
        where: {
          id,
          userId
        }
      });
      return { message: "Agenda item deleted successfully" };
    } catch {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });
}

// src/routes/user.ts
var import_bcrypt = __toESM(require("bcrypt"));
async function userRoutes(app2) {
  app2.post(
    "/users",
    async (request, reply) => {
      const { name, email, password } = request.body;
      const hashedPassword = await import_bcrypt.default.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      });
      const token = app2.jwt.sign({ id: user.id });
      return { user, token };
    }
  );
  app2.post("/users/login", async (request, reply) => {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }
    const validPassword = await import_bcrypt.default.compare(password, user.password);
    if (!validPassword) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }
    const token = app2.jwt.sign({ id: user.id });
    return { user, token };
  });
  app2.get("/users/profile", async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId();
      const user = await prisma.user.findUnique({
        where: { id: userId }
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

// src/server.ts
var app = (0, import_fastify.default)();
app.register(import_cors.default, {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
});
app.register(import_jwt.default, {
  secret: process.env.JWT_SECRET ?? "your-super-secret-jwt-key-change-this-in-production"
});
app.register(userRoutes);
app.register(agendaRoutes);
app.get("/health", async () => {
  return { status: "ok" };
});
app.listen({
  port: 3100,
  host: "0.0.0.0"
}, () => console.log("Server is running on port 3100"));
