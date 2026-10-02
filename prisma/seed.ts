import "dotenv/config";
import bcrypt from "bcryptjs";
// Relative rather than aliased: this runs under `tsx`, outside the Next build.
import { db as prisma } from "../lib/db";
import { roleService } from "../lib/auth/role.service";

const ADMIN_EMAIL = "admin@valbyskakklub.dk";
const ADMIN_PASSWORD = "valby1935";

/**
 * PLACEHOLDER: these follow the real Thursday cadence but have not been checked
 * against the club's Aug-Oct 2026 calendar. Replace before launch.
 */
const events = [
  { title: "Skakbowl", date: "2026-08-13", startTime: "19.00" },
  { title: "Grillaften", date: "2026-08-20", startTime: "18.00" },
  { title: "Grand Prix Lyn Finale", date: "2026-09-03", startTime: "19.00" },
  {
    title: "Simultan mod klubmesteren",
    date: "2026-09-17",
    startTime: "19.00",
  },
  {
    title: "Valbymesterskabet",
    date: "2026-10-01",
    endDate: "2026-11-05",
    startTime: "19.00",
  },
  {
    title: "Vinterturnering, 1. runde",
    date: "2026-10-29",
    startTime: "19.00",
  },
];

async function main() {
  const administrator = await roleService.ensureAdministratorRole();

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { roleId: administrator.id, status: "ACTIVE" },
    create: {
      name: "Klubadministrator",
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      status: "ACTIVE",
      roleId: administrator.id,
    },
  });

  for (const event of events) {
    const date = new Date(`${event.date}T00:00:00Z`);
    const endDate =
      "endDate" in event && event.endDate
        ? new Date(`${event.endDate}T00:00:00Z`)
        : undefined;
    const existing = await prisma.event.findFirst({
      where: { title: event.title, date },
    });

    if (existing) continue;

    await prisma.event.create({
      data: {
        title: event.title,
        date,
        endDate,
        startTime: event.startTime,
        published: true,
        modifiedByUserId: admin.id,
      },
    });
  }

  console.log(`Seed complete: admin ${ADMIN_EMAIL}, ${events.length} events.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
