import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Clearing existing products...");
    await prisma.orderItem.deleteMany({});
    await prisma.product.deleteMany({});

    console.log("Seeding new products...");
    const products = [
        {
            name: "The Classic Pearl Necklace",
            slug: "classic-pearl-necklace",
            description: "A timeless string of cultured pearls, perfect for any elegant occasion.",
            price: 250.00,
            category: "necklaces",
            images: ["/images/product-necklace.jpg"],
            stock: 50,
            bestseller: true,
        },
        {
            name: "Diamond Embellished Ring",
            slug: "diamond-embellished-ring",
            description: "A stunning 18k gold ring featuring a halo of brilliant cut diamonds.",
            price: 890.00,
            category: "rings",
            images: ["/images/product-ring.jpg"],
            stock: 20,
            bestseller: true,
        },
        {
            name: "Gold Hoop Earrings",
            slug: "gold-hoop-earrings",
            description: "Minimalist and chic, these solid gold hoops are a staple for any collection.",
            price: 150.00,
            category: "earrings",
            images: ["/images/product-earrings.jpg"],
            stock: 100,
            bestseller: true,
        },
        {
            name: "Tennis Bracelet",
            slug: "tennis-bracelet",
            description: "An exquisite tennis bracelet lined with sparkling zirconia crystals.",
            price: 320.00,
            category: "bracelets",
            images: ["/images/product-bracelet.jpg"],
            stock: 45,
            bestseller: true,
        }
    ];

    for (const p of products) {
        await prisma.product.create({ data: p });
    }

    console.log("Database perfectly seeded with images!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
