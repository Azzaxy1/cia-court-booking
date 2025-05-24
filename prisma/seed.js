import { PrismaClient } from "../src/app/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.court.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const user = await prisma.user.create({
    data: {
      name: "Azis",
      email: "azis@gmail.com",
      password: "azis123",
      phone: "08123456789",
      role: "CUSTOMER",
    },
  });

  const cashier = await prisma.user.create({
    data: {
      name: "Cashier",
      email: "cashier@gmail.com",
      password: "cashier123",
      phone: "08123456790",
      role: "CASHIER",
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "Owner",
      email: "owner@gmail.com",
      password: "owner123",
      phone: "08123456791",
      role: "OWNER",
    },
  });

  // Seed Futsal Courts
  const futsalCourts = [
    {
      name: "Lapangan Futsal 1",
      type: "Futsal",
      surfaceType: "Rumput",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 1 adalah lapangan futsal dengan permukaan rumput yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 2",
      type: "Futsal",
      surfaceType: "Interlok",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 2 adalah lapangan futsal dengan permukaan interlok yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 3",
      type: "Futsal",
      surfaceType: "Rumput",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 3 adalah lapangan futsal dengan permukaan rumput yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 4",
      type: "Futsal",
      surfaceType: "Semen",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 4 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 5",
      type: "Futsal",
      surfaceType: "Semen",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 5 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 6",
      type: "Futsal",
      surfaceType: "Semen",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaoIccHsK66ybmwTzSKb8itHVh1WDJcUP3jQ&s",
      description:
        "Lapangan Futsal 6 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
  ];

  // Seed Futsal Courts
  let firstCourt;
  for (const courtData of futsalCourts) {
    const court = await prisma.court.create({
      data: {
        name: courtData.name,
        type: courtData.type,
        surfaceType: courtData.surfaceType,
        image: courtData.image,
        description: courtData.description,
        capacity: courtData.capacity,
      },
    });
    console.log(`Created court: ${court.name}`);

    if (!firstCourt) {
      firstCourt = court;
    }

    // Buat schedule untuk setiap court
    const timeSlots = [
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
    ];
    const today = new Date();

    // Buat schedule untuk 7 hari ke depan
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      for (const timeSlot of timeSlots) {
        // Tentukan harga berdasarkan waktu dan hari
        let price = 100000; // harga default
        if (isWeekend) {
          price = 130000; // harga weekend
        }
        if (timeSlot >= "17:00") {
          price += 30000; // tambahan harga malam
        }

        await prisma.schedule.create({
          data: {
            courtId: court.id,
            date: date,
            timeSlot: timeSlot,
            price: price,
            dayType: isWeekend ? "Weekend" : "Weekday",
            available: true,
          },
        });
      }
    }
  }

  // Seed Badminton Courts
  const badmintonCourts = [
    {
      name: "Lapangan Badminton 1",
      type: "Badminton",
      image:
        "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
      description:
        "Lapangan Badminton 1 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 2",
      type: "Badminton",
      image:
        "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
      description:
        "Lapangan Badminton 2 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 3",
      type: "Badminton",
      image:
        "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
      description:
        "Lapangan Badminton 3 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 4",
      type: "Badminton",
      image:
        "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
      description:
        "Lapangan Badminton 4 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 5",
      type: "Badminton",
      image:
        "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
      description:
        "Lapangan Badminton 5 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 6",
      type: "Badminton",
      image:
        "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
      description:
        "Lapangan Badminton 6 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 7",
      type: "Badminton",
      image:
        "https://centroflor.id/wp-content/uploads/2023/07/Karpet-Vinyl-Badminton.jpg",
      description:
        "Lapangan Badminton 7 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
  ];

  // Create badminton courts and their schedules
  for (const courtData of badmintonCourts) {
    const court = await prisma.court.create({
      data: courtData,
    });

    // Create schedules for each badminton court
    for (let i = 0; i < 7; i++) {
      // Buat schedule untuk setiap court
      const timeSlots = [
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
      ];
      const today = new Date();

      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      for (const timeSlot of timeSlots) {
        let price = 20000; // Default price
        if (timeSlot >= "17:00") {
          price = 30000; // Night price
        } else if (timeSlot >= "12:00") {
          price = 25000; // Afternoon price
        }

        await prisma.schedule.create({
          data: {
            courtId: court.id,
            date: date,
            timeSlot: timeSlot,
            price: price,
            dayType: isWeekend ? "Weekend" : "Weekday",
            available: true,
          },
        });
      }
    }
  }

  // Seed Table Tennis Courts
  const tableTennisCourts = [
    {
      name: "Lapangan Tenis Meja 1",
      type: "TenisMeja",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKHRUU9ivOFc3ofK0kfEYAt2aDqOBpl1R08A&s",
      description:
        "Lapangan Tenis Meja 1 adalah lapangan tenis meja yang nyaman dan berkualitas tinggi.",
      capacity: 2,
    },
    {
      name: "Lapangan Tenis Meja 2",
      type: "TenisMeja",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKHRUU9ivOFc3ofK0kfEYAt2aDqOBpl1R08A&s",
      description:
        "Lapangan Tenis Meja 2 adalah lapangan tenis meja yang nyaman dan berkualitas tinggi.",
      capacity: 2,
    },
  ];

  // Create table tennis courts and their schedules
  for (const courtData of tableTennisCourts) {
    const court = await prisma.court.create({
      data: courtData,
    });

    // Create schedules for each table tennis court
    for (let i = 0; i < 7; i++) {
      // Buat schedule untuk setiap court
      const timeSlots = [
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
      ];
      const today = new Date();

      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      for (const timeSlot of timeSlots) {
        let price = 15000; // Default price
        if (timeSlot >= "17:00") {
          price = 25000; // Night price
        } else if (timeSlot >= "12:00") {
          price = 20000; // Afternoon price
        }

        await prisma.schedule.create({
          data: {
            courtId: court.id,
            date: date,
            timeSlot: timeSlot,
            price: price,
            dayType: isWeekend ? "Weekend" : "Weekday",
            available: true,
          },
        });
      }
    }
  }

  // Seed Booking
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      courtId: firstCourt.id,
      startTime: new Date("2024-03-20T08:00:00"),
      endTime: new Date("2024-03-20T09:00:00"),
      courtType: "Futsal",
      duration: 1,
      date: new Date("2024-03-20"),
      paymentMethod: "BankTransfer",
      isConfirmed: true,
      amount: 100000,
      status: "Paid",
    },
  });

  // Seed Transaction
  const transaction = await prisma.transaction.create({
    data: {
      bookingId: booking.id,
      paymentMethod: "BankTransfer",
      transactionId: "TRX123456",
      amount: 100000,
      status: "Paid",
      midtransToken: "midtrans-token-123",
      midtransOrderId: "midtrans-order-123",
      paymentUrl: "https://app.midtrans.com/payment/123",
      expiredAt: new Date("2024-03-21T08:00:00"),
    },
  });

  console.log("Seeding completed successfully!");
  console.log("User:", user);
  console.log("Cashier:", cashier);
  console.log("Owner:", owner);
  console.log("Booking:", booking);
  console.log("Transaction:", transaction);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
