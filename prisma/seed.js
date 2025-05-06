// const { PrismaClient } = require("../src/app/generated/prisma/index.js");
import { PrismaClient } from "../src/app/generated/prisma/index.js";

const prisma = new PrismaClient();
// Help seed data for Booking and Transaction
async function main() {
  // Seed data for Booking and Transaction
  const user = await prisma.user.create({
    data: {
      name: "Azis",
      email: "azis@gmail.com",
      password: "azis123",
      phone: "08123456789",
      role: "CUSTOMER",
    },
  });

  const court = await prisma.court.create({
    data: {
      name: "Lapangan Futsal 1",
      type: "Futsal",
      surfaceType: "Rumput",
      available: true,
      prices: {
        create: [
          {
            dayType: "Weekday",
            timeSlot: "Pagi",
            price: 100000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Siang",
            price: 130000,
          },
          {
            dayType: "Weekday",
            timeSlot: "Malam",
            price: 165000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Pagi",
            price: 130000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Siang",
            price: 160000,
          },
          {
            dayType: "Weekend",
            timeSlot: "Malam",
            price: 165000,
          },
        ],
      },
      description:
        "Lapangan Futsal 1 adalah lapangan futsal dengan permukaan interlok yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
      capacity: 10,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
    },
  });

  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      courtId: court.id,
      startTime: new Date("2025-10-01T08:00:00"),
      endTime: new Date("2025-10-01T09:00:00"),
      courtType: "Futsal",
      duration: 1,
      date: new Date("2025-10-01"),
      paymentMethod: "BankTransfer",
      isConfirmed: true,
      amount: 100000,
      status: "Paid",
    },
  });

  const transaction = await prisma.transaction.create({
    data: {
      bookingId: booking.id,
      paymentMethod: "BankTransfer",
      amount: 100000,
      status: "Paid",
      transactionId: "TRX123456",
    },
  });

  console.log("Seeding completed successfully!");
  console.log("User:", user);
  console.log("Court:", court);
  console.log("Booking:", booking);
  console.log("Transaction:", transaction);
}

// async function main() {
//   await prisma.court.create({
//     data: {
//       name: "Lapangan Futsal 1",
//       type: "Futsal",
//       surfaceType: "Rumput",
//       available: true,
//       prices: {
//         create: [
//           {
//             dayType: "Weekday",
//             timeSlot: "Pagi",
//             price: 100000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Siang",
//             price: 130000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Malam",
//             price: 165000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Pagi",
//             price: 130000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Siang",
//             price: 160000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Malam",
//             price: 165000,
//           },
//         ],
//       },
//       description:
//         "Lapangan Futsal 1 adalah lapangan futsal dengan permukaan interlok yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
//       capacity: 10,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
//     },
//   });

//   await prisma.court.create({
//     data: {
//       name: "Lapangan Futsal 2",
//       type: "Futsal",
//       surfaceType: "Interlok",
//       available: true,
//       prices: {
//         create: [
//           {
//             dayType: "Weekday",
//             timeSlot: "Pagi",
//             price: 85000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Siang",
//             price: 105000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Malam",
//             price: 145000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Pagi",
//             price: 95000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Siang",
//             price: 140000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Malam",
//             price: 145000,
//           },
//         ],
//       },
//       description:
//         "Lapangan Futsal 2 adalah lapangan futsal dengan permukaan interlok yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
//       capacity: 10,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
//     },
//   });

//   await prisma.court.create({
//     data: {
//       name: "Lapangan Futsal 3",
//       type: "Futsal",
//       surfaceType: "Rumput",
//       available: true,
//       prices: {
//         create: [
//           {
//             dayType: "Weekday",
//             timeSlot: "Pagi",
//             price: 90000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Siang",
//             price: 115000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Malam",
//             price: 155000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Pagi",
//             price: 115000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Siang",
//             price: 150000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Malam",
//             price: 155000,
//           },
//         ],
//       },
//       description:
//         "Lapangan Futsal 3 adalah lapangan futsal dengan permukaan rumput yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
//       capacity: 10,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
//     },
//   });

//   await prisma.court.create({
//     data: {
//       name: "Lapangan Futsal 4",
//       type: "Futsal",
//       surfaceType: "Semen",
//       available: true,
//       prices: {
//         create: [
//           {
//             dayType: "Weekday",
//             timeSlot: "Pagi",
//             price: 70000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Siang",
//             price: 90000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Malam",
//             price: 120000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Pagi",
//             price: 85000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Siang",
//             price: 110000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Malam",
//             price: 125000,
//           },
//         ],
//       },
//       description:
//         "Lapangan Futsal 4 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
//       capacity: 10,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
//     },
//   });

//   await prisma.court.create({
//     data: {
//       name: "Lapangan Futsal 5",
//       type: "Futsal",
//       surfaceType: "Semen",
//       available: true,
//       prices: {
//         create: [
//           {
//             dayType: "Weekday",
//             timeSlot: "Pagi",
//             price: 70000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Siang",
//             price: 90000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Malam",
//             price: 120000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Pagi",
//             price: 85000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Siang",
//             price: 110000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Malam",
//             price: 125000,
//           },
//         ],
//       },
//       description:
//         "Lapangan Futsal 5 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
//       capacity: 10,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
//     },
//   });

//   await prisma.court.create({
//     data: {
//       name: "Lapangan Futsal 6",
//       type: "Futsal",
//       surfaceType: "Semen",
//       available: true,
//       prices: {
//         create: [
//           {
//             dayType: "Weekday",
//             timeSlot: "Pagi",
//             price: 70000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Siang",
//             price: 90000,
//           },
//           {
//             dayType: "Weekday",
//             timeSlot: "Malam",
//             price: 120000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Pagi",
//             price: 85000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Siang",
//             price: 110000,
//           },
//           {
//             dayType: "Weekend",
//             timeSlot: "Malam",
//             price: 125000,
//           },
//         ],
//       },
//       description:
//         "Lapangan Futsal 6 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan futsal yang seru.",
//       capacity: 10,
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
//     },
//   });

//   // Seed data for Badminton courts
//   for (let i = 1; i <= 7; i++) {
//     await prisma.court.create({
//       data: {
//         name: `Lapangan Badminton ${i}`,
//         type: "Badminton",
//         available: true,
//         prices: {
//           create: [
//             { dayType: "Weekday", timeSlot: "Pagi", price: 20000 },
//             { dayType: "Weekday", timeSlot: "Siang", price: 25000 },
//             { dayType: "Weekday", timeSlot: "Malam", price: 30000 },
//             { dayType: "Weekend", timeSlot: "Pagi", price: 20000 },
//             { dayType: "Weekend", timeSlot: "Siang", price: 25000 },
//             { dayType: "Weekend", timeSlot: "Malam", price: 30000 },
//           ],
//         },
//         description: `Lapangan Badminton ${i} adalah lapangan badminton yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan badminton yang seru.`,
//         capacity: 4,
//         image:
//           "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
//       },
//     });
//   }

//   // Seed data for Table Tennis courts
//   for (let i = 1; i <= 2; i++) {
//     await prisma.court.create({
//       data: {
//         name: `Lapangan Tenis Meja ${i}`,
//         type: "TenisMeja",
//         available: true,
//         prices: {
//           create: [
//             { dayType: "Weekday", timeSlot: "Pagi", price: 15000 },
//             { dayType: "Weekday", timeSlot: "Siang", price: 20000 },
//             { dayType: "Weekday", timeSlot: "Malam", price: 25000 },
//             { dayType: "Weekend", timeSlot: "Pagi", price: 15000 },
//             { dayType: "Weekend", timeSlot: "Siang", price: 20000 },
//             { dayType: "Weekend", timeSlot: "Malam", price: 25000 },
//           ],
//         },
//         description: `Lapangan Tenis Meja ${i} adalah lapangan tenis meja yang nyaman dan berkualitas tinggi. Cocok untuk pertandingan tenis meja yang seru.`,
//         capacity: 2,
//         image:
//           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKHRUU9ivOFc3ofK0kfEYAt2aDqOBpl1R08A&s",
//       },
//     });
//   }

//   console.log("Seeding completed successfully!");
// }

//

//

// Help seed data for Booking and Transaction

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
