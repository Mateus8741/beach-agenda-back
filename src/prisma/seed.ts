import bcrypt from 'bcryptjs'
import { prisma } from './prisma-client'

async function main() {
  await prisma.agenda.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('123456', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@beachagenda.com',
      password,
    },
  })

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  await prisma.agenda.create({
    data: {
      title: 'Beach Tennis - Quadra 1',
      description: 'Reserva de quadra para Beach Tennis',
      date: today,
      userId: admin.id,
    },
  })

  await prisma.agenda.create({
    data: {
      title: 'Beach Volleyball - Quadra 3',
      description: 'Reserva de quadra para Beach Volleyball',
      date: tomorrow,
      userId: admin.id,
    },
  })

  await prisma.agenda.create({
    data: {
      title: 'Futevôlei - Quadra 2',
      description: 'Reserva de quadra para Futevôlei',
      date: today,
      userId: admin.id,
    },
  })

  console.log('Seed completed successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
