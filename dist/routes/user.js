"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/user.ts
var user_exports = {};
__export(user_exports, {
  userRoutes: () => userRoutes
});
module.exports = __toCommonJS(user_exports);
var import_bcrypt = __toESM(require("bcrypt"));

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "info", "warn", "error"]
});

// src/routes/user.ts
async function userRoutes(app) {
  app.post(
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
      const token = app.jwt.sign({ id: user.id });
      return { user, token };
    }
  );
  app.post("/users/login", async (request, reply) => {
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
    const token = app.jwt.sign({ id: user.id });
    return { user, token };
  });
  app.get("/users/profile", async (request, reply) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userRoutes
});
