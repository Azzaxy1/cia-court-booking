"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Product {
  id: number;
  name: string;
}

const Home = () => {
  const fetchData = async () => {
    const res = await axios.get("api/about");
    return res.data;
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: fetchData,
  });
  console.log(data);

  if (isLoading)
    return (
      <p className="flex justify-center items-center h-screen">Loading...</p>
    );
  if (isError) return <p>Error fetching data!</p>;

  return (
    <div>
      <h1 className="text-2xl text-blue-700 text-center flex justify-center items-center font-bold">
        {/* {data} */}
        Home Page
      </h1>
      <ol>
        {data.map((item: Product) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ol>
    </div>
  );
};

export default Home;

