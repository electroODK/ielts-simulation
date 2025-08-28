import { PrismaClient, Role, TestType, QuestionKind, AssignStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', role: Role.admin, passwordHash: adminHash },
  });

  const users = await prisma.user.createMany({
    data: [
      { username: 'alice', role: Role.user },
      { username: 'bob', role: Role.user },
      { username: 'carol', role: Role.user },
    ],
    skipDuplicates: true,
  });

  const listening = await prisma.test.create({
    data: {
      title: 'Demo Listening',
      type: TestType.listening,
      questions: {
        create: [
          { prompt: 'What is the color of the car?', kind: QuestionKind.text, options: [] },
          { prompt: 'Choose the day', kind: QuestionKind.mcq, options: ['Mon','Tue','Wed'], answerKey: 'Tue' },
        ],
      },
    },
  });

  const reading = await prisma.test.create({
    data: {
      title: 'Demo Reading',
      type: TestType.reading,
      questions: { create: [ { prompt: 'Main idea?', kind: QuestionKind.text, options: [] } ] },
    },
  });

  const writing = await prisma.test.create({
    data: {
      title: 'Demo Writing',
      type: TestType.writing,
      questions: { create: [ { prompt: 'Task 1', kind: QuestionKind.text, part: 1, options: [] }, { prompt: 'Task 2', kind: QuestionKind.text, part: 2, options: [] } ] },
    },
  });

  const speaking = await prisma.test.create({
    data: {
      title: 'Demo Speaking',
      type: TestType.speaking,
      questions: { create: [ { prompt: 'Part 1 Question', kind: QuestionKind.text, part: 1, options: [] }, { prompt: 'Part 2 Question', kind: QuestionKind.text, part: 2, options: [] } ] },
    },
  });

  const alice = await prisma.user.findUnique({ where: { username: 'alice' } });
  if (alice) {
    await prisma.assignment.createMany({ data: [
      { userId: alice.id, testId: listening.id, status: AssignStatus.assigned },
      { userId: alice.id, testId: reading.id, status: AssignStatus.assigned },
      { userId: alice.id, testId: writing.id, status: AssignStatus.assigned },
      { userId: alice.id, testId: speaking.id, status: AssignStatus.assigned },
    ]});
  }

  console.log('Seed done. Admin admin/admin123, users: alice, bob, carol');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});