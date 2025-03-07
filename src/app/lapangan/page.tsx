import React from "react";

const courts = [
  { id: 1, name: "Court 1", location: "Location 1" },
  { id: 2, name: "Court 2", location: "Location 2" },
  { id: 3, name: "Court 3", location: "Location 3" },
];

const LapanganPage: React.FC = () => {
  return (
    <div className="min-h-screen p-4 flex justify-center items-center flex-col">
      <h1>List of Courts</h1>
      <ul>
        {courts.map((court) => (
          <li key={court.id}>
            <h2>{court.name}</h2>
            <p>{court.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LapanganPage;
