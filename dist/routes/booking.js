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

// src/routes/booking.ts
var booking_exports = {};
__export(booking_exports, {
  bookingRoutes: () => bookingRoutes
});
module.exports = __toCommonJS(booking_exports);

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "info", "warn", "error"]
});

// src/schemas/booking.ts
var import_zod = require("zod");
var bookingParamsSchema = import_zod.z.object({
  id: import_zod.z.string().uuid()
});
var createBookingSchema = import_zod.z.object({
  agendaId: import_zod.z.string().uuid()
});
var bookingResponseSchema = import_zod.z.object({
  id: import_zod.z.string().uuid(),
  userId: import_zod.z.string().uuid(),
  agendaId: import_zod.z.string().uuid(),
  createdAt: import_zod.z.date(),
  updatedAt: import_zod.z.date(),
  Agenda: import_zod.z.object({
    title: import_zod.z.string(),
    description: import_zod.z.string(),
    date: import_zod.z.date(),
    arena: import_zod.z.object({
      name: import_zod.z.string(),
      location: import_zod.z.string()
    })
  })
});

// src/routes/booking.ts
async function bookingRoutes(app) {
  app.withTypeProvider().post(
    "/booking",
    {
      schema: {
        body: createBookingSchema,
        summary: "Create a new booking",
        tags: ["Booking"]
      }
    },
    async (request, reply) => {
      try {
        const userId = await request.getCurrentUserId();
        const { agendaId } = request.body;
        const agenda = await prisma.agenda.findUnique({
          where: { id: agendaId },
          include: {
            timeSlots: true
          }
        });
        if (!agenda) {
          return reply.status(404).send({ error: "Agenda not found" });
        }
        const hasAvailableSlots = agenda.timeSlots.some(
          (slot) => slot.isAvailable
        );
        if (!hasAvailableSlots) {
          return reply.status(400).send({ error: "No available time slots" });
        }
        const booking = await prisma.booking.create({
          data: {
            userId,
            agendaId
          },
          include: {
            Agenda: {
              include: {
                arena: true
              }
            }
          }
        });
        return booking;
      } catch (error) {
        return reply.status(401).send({ error: error.message });
      }
    }
  );
  app.withTypeProvider().get(
    "/booking",
    {
      schema: {
        summary: "List all bookings for the current user",
        tags: ["Booking"]
      }
    },
    async (request, reply) => {
      try {
        const userId = await request.getCurrentUserId();
        const bookings = await prisma.booking.findMany({
          where: { userId },
          include: {
            Agenda: {
              include: {
                arena: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        });
        return bookings;
      } catch (error) {
        return reply.status(401).send({ error: error.message });
      }
    }
  );
  app.withTypeProvider().delete(
    "/booking/:id",
    {
      schema: {
        params: bookingParamsSchema,
        summary: "Delete a booking",
        tags: ["Booking"]
      }
    },
    async (request, reply) => {
      try {
        const userId = await request.getCurrentUserId();
        const { id } = request.params;
        await prisma.booking.delete({
          where: {
            id,
            userId
          }
        });
        return { message: "Booking deleted successfully" };
      } catch (error) {
        return reply.status(401).send({ error: error.message });
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bookingRoutes
});
