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

// src/routes/arena.ts
var arena_exports = {};
__export(arena_exports, {
  arenaRoutes: () => arenaRoutes
});
module.exports = __toCommonJS(arena_exports);
var import_zod = require("zod");

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "info", "warn", "error"]
});

// src/routes/arena.ts
async function arenaRoutes(app) {
  app.get("/arenas", async (request, reply) => {
    const arenas = await prisma.arena.findMany();
    return arenas;
  });
  app.get("/arenas/:id", async (request, reply) => {
    const { id } = request.params;
    const arena = await prisma.arena.findUnique({
      where: { id },
      include: { agendas: true }
    });
    if (!arena) return reply.status(404).send({ error: "Arena not found" });
    return arena;
  });
  app.post("/arenas", async (request, reply) => {
    const bodySchema = import_zod.z.object({
      name: import_zod.z.string(),
      location: import_zod.z.string(),
      tags: import_zod.z.array(import_zod.z.string()).optional()
    });
    const { name, location, tags } = bodySchema.parse(request.body);
    const arena = await prisma.arena.create({
      data: { name, location, tags: tags ?? [] }
    });
    return arena;
  });
  app.put("/arenas/:id", async (request, reply) => {
    const { id } = request.params;
    const bodySchema = import_zod.z.object({
      name: import_zod.z.string().optional(),
      location: import_zod.z.string().optional(),
      tags: import_zod.z.array(import_zod.z.string()).optional()
    });
    const data = bodySchema.parse(request.body);
    const arena = await prisma.arena.update({
      where: { id },
      data
    });
    return arena;
  });
  app.delete("/arenas/:id", async (request, reply) => {
    const { id } = request.params;
    await prisma.arena.delete({ where: { id } });
    return { message: "Arena deleted" };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  arenaRoutes
});
