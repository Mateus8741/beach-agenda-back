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

// src/schemas/agenda.ts
var agenda_exports = {};
__export(agenda_exports, {
  agendaParamsSchema: () => agendaParamsSchema,
  createAgendaSchema: () => createAgendaSchema,
  updateAgendaSchema: () => updateAgendaSchema
});
module.exports = __toCommonJS(agenda_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  agendaParamsSchema,
  createAgendaSchema,
  updateAgendaSchema
});
