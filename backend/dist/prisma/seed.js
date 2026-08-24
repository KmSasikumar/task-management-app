"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const u1 = await prisma.user.upsert({
        where: { email: 'dexter@gmail.com' },
        update: {},
        create: {
            id: 'u1',
            name: 'Dexter',
            email: 'dexter@gmail.com',
            title: 'Designer',
            username: 'Dexuser',
            initials: 'DX'
        }
    });
    const u2 = await prisma.user.upsert({
        where: { email: 'ankit@gmail.com' },
        update: {},
        create: { id: 'u2', name: 'Ankit Dutta', email: 'ankit@gmail.com', title: 'Developer', username: 'ankit', initials: 'AD' }
    });
    const p1 = await prisma.project.upsert({
        where: { id: 'p1' },
        update: {},
        create: {
            id: 'p1',
            name: 'Design Homepage',
            priority: 'high',
            leadId: u1.id,
            dueDate: new Date('2026-09-12'),
        }
    });
    await prisma.task.upsert({
        where: { id: 't1' },
        update: {},
        create: {
            id: 't1',
            title: 'Write API Documentation',
            description: 'Create clear and detailed API documentation.',
            status: 'todo',
            priority: 'urgent',
            reporterId: u1.id,
            projectId: p1.id,
            dueDate: new Date('2026-07-29'),
            labels: 'Research,Design,Development'
        }
    });
    console.log('Database seeded!');
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map