import React, { useEffect, useState } from "react";
import axios from "axios";
import '../CSS/list.css'

function ParticipantList({ event, onBack }) {
  const [participants, setParticipants] = useState([]);

const fetchParticipants = async () => {
  try{
  const token = localStorage.getItem("token");
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/olympics/participants/list/${event.id}`, {
    headers: { Authorization: token }
  });

  const list = res?.data?.data ?? [];

  if (Array.isArray(list)) {
    setParticipants(list.sort((a, b) => a.fullname.localeCompare(b.fullname)));
  } else {
    setParticipants([]);
  }
  }catch{
  alert("No hay participantes en este evento 😔")
}

};
  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleDelete = async (id) => {
    try{
    const token = localStorage.getItem("token");
    await axios.delete(`${process.env.REACT_APP_API_URL}/olympics/participants/delete/${id}`, {
      headers: { Authorization: token }
    });
    fetchParticipants();
    alert("Participante eliminado");
  } catch{
    alert ("No se pudo eliminar 😔")
  }
  };

  return (
    <div className="content-list">
    <div className="par-list">
    <h3 >Participant List – Event: {event.name}</h3>
    </div>
      <div className="tablee">
      <table border="1" className="tab-list">
        <thead>
          <tr>
            <th>Id</th><th>FullName</th><th>Email</th><th>Phone</th><th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {participants.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.fullname}</td>
              <td>{p.email}</td>
              <td>{p.phone}</td>
              <td><button onClick={() => handleDelete(p.id)} className="delete">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button onClick={onBack} className="backto">🔙</button>
    </div>
  );
}

export default ParticipantList;
