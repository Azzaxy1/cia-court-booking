import { PrismaClient } from "../src/app/generated/prisma/index.js";
import { hash } from "bcryptjs";

// Import gambar dengan path lokal
const images = {
  Futsal: "/uploads/court/futsal.png",
  Badminton: "/uploads/court/badminton.jpg",
  TenisMeja: "/uploads/court/tenis-meja.jpg",
};

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
      password: await hash("azis123", 10),
      phone: "08123456789",
      role: "CUSTOMER",
    },
  });

  const cashier = await prisma.user.create({
    data: {
      name: "Cashier",
      email: "cashier@gmail.com",
      password: await hash("cashier123", 10),
      phone: "08123456790",
      role: "CASHIER",
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: "Owner",
      email: "owner@gmail.com",
      password: await hash("owner123", 10),
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
      image: images.Futsal,
      description:
        "Lapangan Futsal 1 adalah lapangan futsal dengan permukaan rumput yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 2",
      type: "Futsal",
      surfaceType: "Interlok",
      image: images.Futsal,
      description:
        "Lapangan Futsal 2 adalah lapangan futsal dengan permukaan interlok yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 3",
      type: "Futsal",
      surfaceType: "Rumput",
      image: images.Futsal,
      description:
        "Lapangan Futsal 3 adalah lapangan futsal dengan permukaan rumput yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 4",
      type: "Futsal",
      surfaceType: "Semen",
      image: images.Futsal,
      description:
        "Lapangan Futsal 4 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 5",
      type: "Futsal",
      surfaceType: "Semen",
      image: images.Futsal,
      description:
        "Lapangan Futsal 5 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
    {
      name: "Lapangan Futsal 6",
      type: "Futsal",
      surfaceType: "Semen",
      image: images.Futsal,
      description:
        "Lapangan Futsal 6 adalah lapangan futsal dengan permukaan semen yang nyaman dan berkualitas tinggi.",
      capacity: 10,
    },
  ];

  // Mapping harga sesuai gambar
  const priceTable = {
    weekday: {
      "07:00-13:00": [100000, 85000, 90000, 70000, 70000, 70000],
      "14:00-18:00": [130000, 105000, 115000, 90000, 90000, 90000],
      "19:00-23:00": [165000, 145000, 155000, 120000, 120000, 120000],
    },
    weekend: {
      "07:00-13:00": [130000, 95000, 115000, 85000, 85000, 85000],
      "14:00-18:00": [160000, 140000, 150000, 110000, 110000, 110000],
      "19:00-23:00": [165000, 145000, 155000, 125000, 125000, 125000],
    },
  };

  // Slot waktu sesuai tarif
  const slotGroups = [
    {
      label: "07:00-13:00",
      slots: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
    },
    {
      label: "14:00-18:00",
      slots: ["14:00", "15:00", "16:00", "17:00", "18:00"],
    },
    {
      label: "19:00-23:00",
      slots: ["19:00", "20:00", "21:00", "22:00", "23:00"],
    },
  ];

  let firstCourt;

  // Untuk setiap court futsal
  for (let courtIdx = 0; courtIdx < futsalCourts.length; courtIdx++) {
    const courtData = futsalCourts[courtIdx];
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
    if (courtIdx === 0) {
      firstCourt = court;
    }

    // Buat schedule untuk 30 hari ke depan
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const day = date.getDay();
      const isWeekend = day === 0 || day === 5 || day === 6; // Jumat(5), Sabtu(6), Minggu(0)
      const dayType = isWeekend ? "Weekend" : "Weekday";
      const priceSet = isWeekend ? priceTable.weekend : priceTable.weekday;

      for (const group of slotGroups) {
        const price = priceSet[group.label][courtIdx];
        for (const timeSlot of group.slots) {
          await prisma.schedule.create({
            data: {
              courtId: court.id,
              date: date,
              timeSlot: timeSlot,
              price: price,
              dayType: dayType,
              available: true,
            },
          });
        }
      }
    }
  }

  // Seed Badminton Courts
  const badmintonCourts = [
    {
      name: "Lapangan Badminton 1",
      type: "Badminton",
      image: images.Badminton,
      description:
        "Lapangan Badminton 1 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 2",
      type: "Badminton",
      image: images.Badminton,
      description:
        "Lapangan Badminton 2 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 3",
      type: "Badminton",
      image: images.Badminton,
      description:
        "Lapangan Badminton 3 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 4",
      type: "Badminton",
      image: images.Badminton,
      description:
        "Lapangan Badminton 4 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 5",
      type: "Badminton",
      image: images.Badminton,
      description:
        "Lapangan Badminton 5 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 6",
      type: "Badminton",
      image: images.Badminton,
      description:
        "Lapangan Badminton 6 adalah lapangan badminton yang nyaman dan berkualitas tinggi.",
      capacity: 4,
    },
    {
      name: "Lapangan Badminton 7",
      type: "Badminton",
      image: images.Badminton,
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
    for (let i = 0; i < 30; i++) {
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
        "22:00",
        "23:00",
      ];
      const today = new Date();

      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      for (const timeSlot of timeSlots) {
        let price = 20000; // Default price
        if (timeSlot >= "19:00") {
          price = 30000; // Night price
        } else if (timeSlot > "13:00") {
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
      image: images.TenisMeja,
      description:
        "Lapangan Tenis Meja 1 adalah lapangan tenis meja yang nyaman dan berkualitas tinggi.",
      capacity: 2,
    },
    {
      name: "Lapangan Tenis Meja 2",
      type: "TenisMeja",
      image: images.TenisMeja,
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
    for (let i = 0; i < 30; i++) {
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
        "22:00",
        "23:00",
      ];
      const today = new Date();

      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      for (const timeSlot of timeSlots) {
        let price = 15000; // Default price
        if (timeSlot >= "19:00") {
          price = 25000; // Night price
        } else if (timeSlot > "13:00") {
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

  // // Seed Booking
  // const booking = await prisma.booking.create({
  //   data: {
  //     userId: user.id,
  //     courtId: firstCourt.id,
  //     startTime: "08:00",
  //     endTime: "09:00",
  //     courtType: "Futsal",
  //     duration: 1,
  //     date: new Date("2024-03-20"),
  //     paymentMethod: "BankTransfer",
  //     isConfirmed: true,
  //     amount: 100000,
  //     status: "Paid",
  //   },
  // });

  // // Seed Transaction
  // const transaction = await prisma.transaction.create({
  //   data: {
  //     bookingId: booking.id,
  //     paymentMethod: "BankTransfer",
  //     transactionId: "TRX123456",
  //     amount: 100000,
  //     status: "Paid",
  //     midtransToken: "midtrans-token-123",
  //     midtransOrderId: "midtrans-order-123",
  //     paymentUrl: "https://app.midtrans.com/payment/123",
  //     expiredAt: new Date("2024-03-21T08:00:00"),
  //   },
  // });

  console.log("User:", user);
  console.log("Cashier:", cashier);
  console.log("Owner:", owner);
  // console.log("Booking:", booking);
  // console.log("Transaction:", transaction);
  console.log("Court Futsal Created:", firstCourt);
  console.log("Badminton Courts:", badmintonCourts);
  console.log("Table Tennis Courts:", tableTennisCourts);
  console.log("Seeding completed successfully!");
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
