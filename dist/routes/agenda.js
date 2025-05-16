"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/agenda.ts
var agenda_exports = {};
__export(agenda_exports, {
  agendaRoutes: () => agendaRoutes
});
module.exports = __toCommonJS(agenda_exports);

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "info", "warn", "error"]
});

// src/routes/agenda.ts
async function agendaRoutes(app) {
  app.post("/agenda", async (request, reply) => {
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
  app.get("/agenda", async (request, reply) => {
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
  app.put("/agenda/:id", async (request, reply) => {
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
  app.delete("/agenda/:id", async (request, reply) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  agendaRoutes
});
