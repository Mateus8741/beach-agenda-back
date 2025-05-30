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

// src/prisma/seed.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "info", "warn", "error"]
});

// src/prisma/seed.ts
async function main() {
  await prisma.timeSlot.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.agenda.deleteMany();
  await prisma.arena.deleteMany();
  await prisma.user.deleteMany();
  const password = await import_bcryptjs.default.hash("123456", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@beachagenda.com",
      password
    }
  });
  const copacabana = await prisma.arena.create({
    data: {
      name: "Copacabana Arena Complex",
      location: "Copacabana Beach",
      tags: ["Beach Tennis", "Volleyball"]
    }
  });
  const ipanema = await prisma.arena.create({
    data: {
      name: "Ipanema Sports Center",
      location: "Ipanema Beach",
      tags: ["Footvolley", "Volleyball"]
    }
  });
  const today = /* @__PURE__ */ new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const beachTennisAgenda = await prisma.agenda.create({
    data: {
      title: "Beach Tennis - Quadra 1",
      description: "Reserva de quadra para Beach Tennis",
      date: today,
      userId: admin.id,
      arenaId: copacabana.id,
      tags: ["Beach Tennis"],
      timeSlots: {
        create: [
          { time: "10:00", isAvailable: true },
          { time: "11:00", isAvailable: true },
          { time: "12:00", isAvailable: false }
        ]
      }
    },
    include: {
      timeSlots: true
    }
  });
  const volleyballAgenda = await prisma.agenda.create({
    data: {
      title: "Beach Volleyball - Quadra 3",
      description: "Reserva de quadra para Beach Volleyball",
      date: tomorrow,
      userId: admin.id,
      arenaId: copacabana.id,
      tags: ["Volleyball"],
      timeSlots: {
        create: [
          { time: "13:00", isAvailable: true },
          { time: "14:00", isAvailable: false },
          { time: "15:00", isAvailable: true }
        ]
      }
    },
    include: {
      timeSlots: true
    }
  });
  const footvolleyAgenda = await prisma.agenda.create({
    data: {
      title: "Futev\xF4lei - Quadra 2",
      description: "Reserva de quadra para Futev\xF4lei",
      date: today,
      userId: admin.id,
      arenaId: ipanema.id,
      tags: ["Footvolley"],
      timeSlots: {
        create: [
          { time: "15:00", isAvailable: false },
          { time: "16:00", isAvailable: true },
          { time: "17:00", isAvailable: true },
          { time: "18:00", isAvailable: true }
        ]
      }
    },
    include: {
      timeSlots: true
    }
  });
  await prisma.booking.create({
    data: {
      userId: admin.id,
      agendaId: beachTennisAgenda.id,
      timeSlots: {
        connect: [{ id: beachTennisAgenda.timeSlots[0].id }]
      }
    }
  });
  await prisma.booking.create({
    data: {
      userId: admin.id,
      agendaId: volleyballAgenda.id,
      timeSlots: {
        connect: [{ id: volleyballAgenda.timeSlots[0].id }]
      }
    }
  });
  await prisma.booking.create({
    data: {
      userId: admin.id,
      agendaId: footvolleyAgenda.id,
      timeSlots: {
        connect: [{ id: footvolleyAgenda.timeSlots[1].id }]
      }
    }
  });
  await prisma.timeSlot.update({
    where: { id: beachTennisAgenda.timeSlots[0].id },
    data: { isAvailable: false }
  });
  await prisma.timeSlot.update({
    where: { id: volleyballAgenda.timeSlots[0].id },
    data: { isAvailable: false }
  });
  await prisma.timeSlot.update({
    where: { id: footvolleyAgenda.timeSlots[1].id },
    data: { isAvailable: false }
  });
  console.log("Seed completed successfully!");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
