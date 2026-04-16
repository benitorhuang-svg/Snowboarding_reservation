import { PrismaClient, Role, CourseType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1. Create Admin Account
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      firebaseUid: 'test-admin-uid',
      role: Role.ADMIN,
      name: 'System Admin',
      language: 'zh-TW',
    },
  });

  // 2. Create Three Student Accounts
  const users = [
    {
      email: 'user1@test.com',
      uid: 'test-user1-uid',
      name: 'User Alpha',
      level: 'BEGINNER',
    },
    {
      email: 'user2@test.com',
      uid: 'test-user2-uid',
      name: 'User Beta',
      level: 'INTERMEDIATE',
    },
    {
      email: 'user3@test.com',
      uid: 'test-user3-uid',
      name: 'User Gamma',
      level: 'ADVANCED',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        firebaseUid: u.uid,
        role: Role.STUDENT,
        name: u.name,
        skillLevel: u.level,
        language: 'zh-TW',
      },
    });
  }

  // 3. Create a Coach User & Profile
  const coachUser = await prisma.user.upsert({
    where: { email: 'coach@test.com' },
    update: {},
    create: {
      email: 'coach@test.com',
      firebaseUid: 'test-coach-uid',
      role: Role.COACH,
      name: 'Master Coach',
      language: 'zh-TW',
    },
  });

  const coachProfile = await prisma.coach.upsert({
    where: { userId: coachUser.id },
    update: {},
    create: {
      userId: coachUser.id,
      certifications: ['SAJ Level 3', 'CASI Level 2'],
      baseLocation: 'Hakuba, Japan',
      bio: {
        'zh-TW': '專精粉雪與進階刻蝕',
        en: 'Specializes in powder and advanced carving',
      },
      rating: 5.0,
    },
  });

  // 4. Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: { 'zh-TW': '初階單板體驗 (4H)', en: 'Beginner SB' },
      description: { 'zh-TW': '新手推薦', en: 'For beginners' },
      type: CourseType.GROUP,
      basePrice: 5500,
    },
  });

  // 5. Create Sessions
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.courseSession.create({
    data: {
      courseId: course1.id,
      coachId: coachProfile.id,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000),
      capacity: 4,
      bookedCount: 0,
      locationId: 'Niseko',
    },
  });

  console.log('✅ Seed data created successfully!');
  console.log('--- TEST ACCOUNTS ---');
  console.log('Admin: admin@test.com (UID: test-admin-uid)');
  console.log('User 1: user1@test.com (UID: test-user1-uid)');
  console.log('User 2: user2@test.com (UID: test-user2-uid)');
  console.log('User 3: user3@test.com (UID: test-user3-uid)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
