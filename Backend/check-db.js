import { db } from './src/config/drizzle.js';
import { workers, specializations, liveLocations } from './src/db/schema.js';

async function checkDatabase() {
    try {
        console.log('🔍 Checking database state...');

        // Check workers
        const allWorkers = await db.select().from(workers);
        console.log(`📊 Total workers: ${allWorkers.length}`);

        if (allWorkers.length > 0) {
            console.log('👥 Workers found:');
            allWorkers.forEach((worker, index) => {
                console.log(`  ${index + 1}. ${worker.firstName} ${worker.lastName} (${worker.id})`);
            });
        }

        // Check specializations
        const allSpecializations = await db.select().from(specializations);
        console.log(`🔧 Total specializations: ${allSpecializations.length}`);

        if (allSpecializations.length > 0) {
            console.log('🏷️ Specializations found:');
            allSpecializations.forEach((spec, index) => {
                console.log(`  ${index + 1}. Worker ${spec.workerId} - ${spec.category} (${spec.subCategory})`);
            });
        }

        // Check live locations
        const allLiveLocations = await db.select().from(liveLocations);
        console.log(`📍 Total live locations: ${allLiveLocations.length}`);

        if (allLiveLocations.length > 0) {
            console.log('🗺️ Live locations found:');
            allLiveLocations.forEach((location, index) => {
                console.log(`  ${index + 1}. Worker ${location.workerId} - (${location.lat}, ${location.lng})`);
            });
        }

        // Check for active workers with specializations and live locations
        const activeWorkers = await db
            .select({
                workerId: workers.id,
                firstName: workers.firstName,
                lastName: workers.lastName,
                isActive: workers.isActive,
                category: specializations.category,
                lat: liveLocations.lat,
                lng: liveLocations.lng
            })
            .from(workers)
            .leftJoin(specializations, workers.id === specializations.workerId)
            .leftJoin(liveLocations, workers.id === liveLocations.workerId);

        console.log(`🎯 Active workers with specializations and locations: ${activeWorkers.length}`);

        if (activeWorkers.length > 0) {
            console.log('✅ Active workers ready for jobs:');
            activeWorkers.forEach((worker, index) => {
                console.log(`  ${index + 1}. ${worker.firstName} ${worker.lastName} - ${worker.category || 'no category'} - Active: ${worker.isActive} - Location: ${worker.lat ? `(${worker.lat}, ${worker.lng})` : 'none'}`);
            });
        }

    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        process.exit(0);
    }
}

checkDatabase(); 