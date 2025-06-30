import { db } from "./src/config/drizzle";
import { workers, specializations, liveLocations } from "./src/db/schema";

async function seedWorkers() {
  try {
    console.log("🌱 Seeding database with test workers...");

    // Create test workers
    const testWorkers = [
      {
        firstName: "Rahul",
        lastName: "Kumar",
        email: "rahul.kumar@test.com",
        password: "password123",
        phoneNumber: "+919876543210",
        dateOfBirth: "1990-01-15",
        gender: "male" as const,
        experienceYears: 5,
        isActive: true,
        address: "Kolkata, West Bengal",
      },
      {
        firstName: "Priya",
        lastName: "Singh",
        email: "priya.singh@test.com",
        password: "password123",
        phoneNumber: "+919876543211",
        dateOfBirth: "1988-03-20",
        gender: "female" as const,
        experienceYears: 3,
        isActive: true,
        address: "Kolkata, West Bengal",
      },
      {
        firstName: "Amit",
        lastName: "Das",
        email: "amit.das@test.com",
        password: "password123",
        phoneNumber: "+919876543212",
        dateOfBirth: "1992-07-10",
        gender: "male" as const,
        experienceYears: 4,
        isActive: true,
        address: "Kolkata, West Bengal",
      },
    ];

    console.log("👥 Creating workers...");
    const createdWorkers = [];

    for (const workerData of testWorkers) {
      const worker = await db.insert(workers).values(workerData).returning();
      createdWorkers.push(worker[0]);
      console.log(
        `✅ Created worker: ${worker[0].firstName} ${worker[0].lastName} (${worker[0].id})`
      );
    }

    // Create specializations for workers
    const workerSpecializations = [
      {
        workerId: createdWorkers[0].id,
        category: "plumber" as const,
        subCategory: "tape_repair" as const,
        isPrimary: true,
        proficiency: 5,
      },
      {
        workerId: createdWorkers[0].id,
        category: "plumber" as const,
        subCategory: "pipe_installation" as const,
        isPrimary: false,
        proficiency: 4,
      },
      {
        workerId: createdWorkers[1].id,
        category: "electrician" as const,
        subCategory: "electrical_repair" as const,
        isPrimary: true,
        proficiency: 4,
      },
      {
        workerId: createdWorkers[2].id,
        category: "mechanic" as const,
        subCategory: "car_service" as const,
        isPrimary: true,
        proficiency: 5,
      },
    ];

    console.log("🔧 Creating specializations...");
    for (const specData of workerSpecializations) {
      const spec = await db
        .insert(specializations)
        .values(specData)
        .returning();
      console.log(
        `✅ Created specialization: ${spec[0].category} - ${spec[0].subCategory} for worker ${spec[0].workerId}`
      );
    }

    // Create live locations for workers (near Kolkata)
    const workerLocations = [
      {
        workerId: createdWorkers[0].id,
        lat: 22.6734289 + 0.01, // Slightly north of job location
        lng: 88.3743036 + 0.01,
      },
      {
        workerId: createdWorkers[1].id,
        lat: 22.6734289 - 0.01, // Slightly south of job location
        lng: 88.3743036 - 0.01,
      },
      {
        workerId: createdWorkers[2].id,
        lat: 22.6734289 + 0.005, // Very close to job location
        lng: 88.3743036 + 0.005,
      },
    ];

    console.log("📍 Creating live locations...");
    for (const locationData of workerLocations) {
      const location = await db
        .insert(liveLocations)
        .values(locationData)
        .returning();
      console.log(
        `✅ Created live location: (${location[0].lat}, ${location[0].lng}) for worker ${location[0].workerId}`
      );
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log(
      `📊 Created ${createdWorkers.length} workers with specializations and live locations`
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seedWorkers();
