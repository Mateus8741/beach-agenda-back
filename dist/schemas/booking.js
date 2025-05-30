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

// src/schemas/booking.ts
var booking_exports = {};
__export(booking_exports, {
  bookingParamsSchema: () => bookingParamsSchema,
  bookingResponseSchema: () => bookingResponseSchema,
  createBookingSchema: () => createBookingSchema
});
module.exports = __toCommonJS(booking_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bookingParamsSchema,
  bookingResponseSchema,
  createBookingSchema
});
