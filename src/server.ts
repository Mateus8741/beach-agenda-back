import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify from 'fastify';

import { agendaRoutes } from './routes/agenda';
import { userRoutes } from './routes/user';

const app = Fastify();

app.register(cors, {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(jwt, {
  secret: process.env.JWT_SECRET ?? 'your-super-secret-jwt-key-change-this-in-production',
});

app.register(userRoutes);
app.register(agendaRoutes);

app.get('/health', async () => {
  return { status: 'ok' };
});

app.listen({
  port: 3100,
  host: "0.0.0.0",
}, () => console.log('Server is running on port 3100'));
