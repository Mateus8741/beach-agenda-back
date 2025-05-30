import bcrypt from "bcryptjs";
import { prisma } from "./prisma-client";

async function main() {
	await prisma.timeSlot.deleteMany();
	await prisma.booking.deleteMany();
	await prisma.agenda.deleteMany();
	await prisma.arena.deleteMany();
	await prisma.user.deleteMany();

	const password = await bcrypt.hash("123456", 10);

	const admin = await prisma.user.create({
		data: {
			name: "Admin User",
			email: "admin@beachagenda.com",
			password,
		},
	});

	const copacabana = await prisma.arena.create({
		data: {
			name: "Copacabana Arena Complex",
			location: "Copacabana Beach",
			tags: ["Beach Tennis", "Volleyball"],
		},
	});

	const ipanema = await prisma.arena.create({
		data: {
			name: "Ipanema Sports Center",
			location: "Ipanema Beach",
			tags: ["Footvolley", "Volleyball"],
		},
	});

	const today = new Date();
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
					{ time: "12:00", isAvailable: false },
				],
			},
		},
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
					{ time: "15:00", isAvailable: true },
				],
			},
		},
	});

	const footvolleyAgenda = await prisma.agenda.create({
		data: {
			title: "Futevôlei - Quadra 2",
			description: "Reserva de quadra para Futevôlei",
			date: today,
			userId: admin.id,
			arenaId: ipanema.id,
			tags: ["Footvolley"],
			timeSlots: {
				create: [
					{ time: "15:00", isAvailable: false },
					{ time: "16:00", isAvailable: true },
					{ time: "17:00", isAvailable: true },
					{ time: "18:00", isAvailable: true },
				],
			},
		},
	});

	await prisma.booking.create({
		data: {
			userId: admin.id,
			agendaId: beachTennisAgenda.id,
		},
	});

	await prisma.booking.create({
		data: {
			userId: admin.id,
			agendaId: volleyballAgenda.id,
		},
	});

	await prisma.booking.create({
		data: {
			userId: admin.id,
			agendaId: footvolleyAgenda.id,
		},
	});

	console.log("Seed completed successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
