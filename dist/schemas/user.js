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

// src/schemas/user.ts
var user_exports = {};
__export(user_exports, {
  createUserSchema: () => createUserSchema,
  loginSchema: () => loginSchema,
  updateUserSchema: () => updateUserSchema
});
module.exports = __toCommonJS(user_exports);
var import_zod = require("zod");
var createUserSchema = import_zod.z.object({
  name: import_zod.z.string().min(3),
  email: import_zod.z.string().email(),
  password: import_zod.z.string().min(6)
});
var loginSchema = import_zod.z.object({
  email: import_zod.z.string().email(),
  password: import_zod.z.string()
});
var updateUserSchema = import_zod.z.object({
  name: import_zod.z.string().min(3).optional(),
  email: import_zod.z.string().email().optional(),
  password: import_zod.z.string().min(6).optional()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUserSchema,
  loginSchema,
  updateUserSchema
});
