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
      timeSlots: {
        create: [
          { time: '10:00', isAvailable: true },
          { time: '11:00', isAvailable: true },
          { time: '12:00', isAvailable: true },
          { time: '13:00', isAvailable: true },
          { time: '14:00', isAvailable: true },
          { time: '15:00', isAvailable: true },
          { time: '16:00', isAvailable: true },
          { time: '17:00', isAvailable: true },
          { time: '18:00', isAvailable: true },
          { time: '19:00', isAvailable: true },
          { time: '20:00', isAvailable: true },
          { time: '21:00', isAvailable: true },
          { time: '22:00', isAvailable: true },
        ],
      },
    },
  })

  await prisma.agenda.create({
    data: {
      title: 'Beach Volleyball - Quadra 3',
      description: 'Reserva de quadra para Beach Volleyball',
      date: tomorrow,
      userId: admin.id,
      timeSlots: {
        create: [
          { time: '10:00', isAvailable: true },
          { time: '11:00', isAvailable: true },
          { time: '12:00', isAvailable: true },
          { time: '13:00', isAvailable: true },
          { time: '14:00', isAvailable: true },
          { time: '15:00', isAvailable: true },
          { time: '16:00', isAvailable: true },
          { time: '17:00', isAvailable: true },
          { time: '18:00', isAvailable: true },
          { time: '19:00', isAvailable: true },
          { time: '20:00', isAvailable: true },
          { time: '21:00', isAvailable: true },
          { time: '22:00', isAvailable: true },
        ],
      },
    },
  })

  await prisma.agenda.create({
    data: {
      title: 'Futevôlei - Quadra 2',
      description: 'Reserva de quadra para Futevôlei',
      date: today,
      userId: admin.id,
      timeSlots: {
        create: [
          { time: '10:00', isAvailable: true },
          { time: '11:00', isAvailable: true },
          { time: '12:00', isAvailable: true },
          { time: '13:00', isAvailable: true },
          { time: '14:00', isAvailable: true },
          { time: '15:00', isAvailable: true },
          { time: '16:00', isAvailable: true },
          { time: '17:00', isAvailable: true },
          { time: '18:00', isAvailable: true },
          { time: '19:00', isAvailable: true },
          { time: '20:00', isAvailable: true },
          { time: '21:00', isAvailable: true },
          { time: '22:00', isAvailable: true },
        ],
      },
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
