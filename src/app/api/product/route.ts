// import { NextApiRequest } from "next";

import { NextResponse } from "next/server";

const product = [
  {
    id: 1,
    name: "Product 1",
  },
  {
    id: 2,
    name: "Product 2",
  },
  {
    id: 3,
    name: "Product 3",
  },
];

export const GET = async () => {
  return NextResponse.json(product);
};
