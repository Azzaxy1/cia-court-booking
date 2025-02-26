"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const About = () => {
  const getProducts = async () => {
    const res = await axios.get("https://fakestoreapi.com/products");
    return res.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data!</p>;

  return (
    <div>
      <h1 className="text-2xl text-blue-700 text-center font-bold">
        Product Data
      </h1>
      <div>
        {data.map((item: Product) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.price}</p>
            <p>{item.description}</p>
            <p>{item.category}</p>
            <img src={item.image} alt={item.title} width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
