import { prismaClient } from "./src";

async function seed() {
    // Create test users
    const user1 = await prismaClient.user.create({
        data: {
            email: "test1@example.com"
        }
    });

    const user2 = await prismaClient.user.create({
        data: {
            email: "test2@example.com"
        }
    });

    // Create test validators
    const validator1 = await prismaClient.validator.create({
        data: {
            publicKey: "val1pubkey123",
            location: "US-East",
            ip: "192.168.1.1"
        }
    });

    const validator2 = await prismaClient.validator.create({
        data: {
            publicKey: "val2pubkey456",
            location: "US-West",
            ip: "192.168.1.2"
        }
    });

    // Create test websites
    const website1 = await prismaClient.website.create({
        data: {
            url: "https://example.com",
            userId: user1.id
        }
    });

    const website2 = await prismaClient.website.create({
        data: {
            url: "https://test.com",
            userId: user1.id
        }
    });

    // Create test ticks for the last hour
    const now = new Date();
    for (let i = 0; i < 60; i++) {
        const timestamp = new Date(now.getTime() - (i * 60 * 1000)); // Every minute for last hour
        
        // Website 1 ticks
        await prismaClient.websiteTick.create({
            data: {
                websiteId: website1.id,
                validatorId: validator1.id,
                createdAt: timestamp,
                status: Math.random() > 0.1 ? "Good" : "Bad", // 90% uptime
                latency: Math.random() * 500 // Random latency between 0-500ms
            }
        });

        // Website 2 ticks
        await prismaClient.websiteTick.create({
            data: {
                websiteId: website2.id,
                validatorId: validator2.id,
                createdAt: timestamp,
                status: Math.random() > 0.05 ? "Good" : "Bad", // 95% uptime
                latency: Math.random() * 500
            }
        });
    }

    console.log("Seed data created successfully!");
}

seed()
    .catch((error) => {
        console.error("Error seeding data:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });