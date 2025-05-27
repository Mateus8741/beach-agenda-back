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
var import_cookie = __toESM(require("@fastify/cookie"));
var import_swagger = __toESM(require("@fastify/swagger"));
var import_swagger_ui = __toESM(require("@fastify/swagger-ui"));
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");

// src/middleware/verify-jwt.ts
var import_fastify_plugin = __toESM(require("fastify-plugin"));
var auth = (0, import_fastify_plugin.default)(async (app2) => {
  app2.addHook("preHandler", async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify();
        return sub;
      } catch {
        throw new Error("Unauthorized");
      }
    };
  });
});

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "info", "warn", "error"]
});

// src/schemas/agenda.ts
var import_zod = require("zod");
var createAgendaSchema = import_zod.z.object({
  title: import_zod.z.string(),
  description: import_zod.z.string(),
  date: import_zod.z.string(),
  timeSlots: import_zod.z.array(
    import_zod.z.object({
      time: import_zod.z.string(),
      isAvailable: import_zod.z.boolean()
    })
  ),
  location: import_zod.z.string(),
  userId: import_zod.z.string().uuid()
});
var updateAgendaSchema = createAgendaSchema.partial();
var agendaParamsSchema = import_zod.z.object({
  id: import_zod.z.string().uuid()
});

// src/routes/agenda.ts
async function agendaRoutes(app2) {
  app2.withTypeProvider().post(
    "/agenda",
    {
      schema: {
        body: createAgendaSchema,
        summary: "Create a new agenda item",
        tags: ["Agenda"]
      }
    },
    async (request, reply) => {
      try {
        const userId = await request.getCurrentUserId();
        const { title, description, date, timeSlots } = request.body;
        const agenda = await prisma.agenda.create({
          data: {
            title,
            description,
            date: new Date(date),
            timeSlots: {
              create: timeSlots.map((slot) => ({
                time: slot.time,
                isAvailable: slot.isAvailable
              }))
            },
            userId
          },
          include: {
            timeSlots: true
          }
        });
        return agenda;
      } catch {
        return reply.status(401).send({ error: "Unauthorized" });
      }
    }
  );
  app2.withTypeProvider().get(
    "/agenda",
    {
      schema: {
        summary: "List all agenda items",
        tags: ["Agenda"]
      }
    },
    async (request, reply) => {
      try {
        const userId = await request.getCurrentUserId();
        const agenda = await prisma.agenda.findMany({
          where: { userId },
          include: {
            timeSlots: true
          },
          orderBy: {
            date: "asc"
          }
        });
        return agenda;
      } catch (error) {
        return reply.status(401).send({ error: error.message });
      }
    }
  );
  app2.withTypeProvider().put(
    "/agenda/:id",
    {
      schema: {
        params: agendaParamsSchema,
        body: updateAgendaSchema,
        summary: "Update an agenda item",
        tags: ["Agenda"]
      }
    },
    async (request, reply) => {
      try {
        const userId = await request.getCurrentUserId();
        const { id } = request.params;
        const { title, description, date, timeSlots } = request.body;
        if (timeSlots) {
          await prisma.timeSlot.deleteMany({
            where: {
              agendaId: id
            }
          });
        }
        const agenda = await prisma.agenda.update({
          where: {
            id,
            userId
          },
          data: {
            title,
            description,
            date: date ? new Date(date) : void 0,
            timeSlots: timeSlots ? {
              create: timeSlots.map((slot) => ({
                time: slot.time,
                isAvailable: slot.isAvailable
              }))
            } : void 0
          },
          include: {
            timeSlots: true
          }
        });
        return agenda;
      } catch {
        return reply.status(401).send({ error: "Unauthorized" });
      }
    }
  );
  app2.withTypeProvider().delete(
    "/agenda/:id",
    {
      schema: {
        params: agendaParamsSchema,
        summary: "Delete an agenda item",
        tags: ["Agenda"]
      }
    },
    async (request, reply) => {
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
    }
  );
}

// src/routes/user.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/schemas/user.ts
var import_zod2 = require("zod");
var createUserSchema = import_zod2.z.object({
  name: import_zod2.z.string().min(3),
  email: import_zod2.z.string().email(),
  password: import_zod2.z.string().min(6)
});
var loginSchema = import_zod2.z.object({
  email: import_zod2.z.string().email(),
  password: import_zod2.z.string()
});
var updateUserSchema = import_zod2.z.object({
  name: import_zod2.z.string().min(3).optional(),
  email: import_zod2.z.string().email().optional(),
  password: import_zod2.z.string().min(6).optional()
});

// src/routes/user.ts
async function userRoutes(app2) {
  app2.withTypeProvider().post(
    "/users",
    {
      schema: {
        body: createUserSchema,
        summary: "Create a new user",
        tags: ["Users"]
      }
    },
    async (request, reply) => {
      const { name, email, password } = request.body;
      const hashedPassword = await import_bcryptjs.default.hash(password, 10);
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
  app2.withTypeProvider().post(
    "/users/login",
    {
      schema: {
        body: loginSchema,
        summary: "Authenticate user",
        tags: ["Users"]
      }
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }
      const validPassword = await import_bcryptjs.default.compare(password, user.password);
      if (!validPassword) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }
      const token = app2.jwt.sign({ id: user.id });
      return { user, token };
    }
  );
  app2.withTypeProvider().get(
    "/users/profile",
    {
      schema: {
        summary: "Get user profile",
        tags: ["Users"]
      }
    },
    async (request, reply) => {
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
    }
  );
}

// src/server.ts
var app = (0, import_fastify.default)().withTypeProvider();
app.register(import_cookie.default);
app.register(import_jwt.default, {
  secret: process.env.JWT_SECRET ?? "your-super-secret-jwt-key-change-this-in-production"
});
app.register(import_cors.default, {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
});
app.register(import_swagger.default, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Beach Agenda API",
      description: "API para gerenciamento de agendamentos de arenas",
      version: "1.0.0"
    }
  },
  transform: import_fastify_type_provider_zod.jsonSchemaTransform
});
app.register(import_swagger_ui.default, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.register(auth);
app.register(userRoutes);
app.register(agendaRoutes);
app.get("/health", async () => {
  return { status: "ok" };
});
app.listen(
  {
    port: 3100,
    host: "0.0.0.0"
  },
  () => console.log("Server is running on port 3100")
);
