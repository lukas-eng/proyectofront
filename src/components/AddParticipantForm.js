import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/addparticipante.css"

function AddParticipantForm() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8000/api/olympics/events/list", {
          headers: { Authorization: token }
        });
        setEvents(res.data.data || []); 
      } catch (error) {
        alert("Error cargando eventos");
      }
    };

    fetchEvents();
  }, []);

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/olympics/participants/create", {
        fullname,
        email,
        phone,
        event_id: eventId,
      }, {
        headers: { Authorization: token },
      });
      alert("Participante añadido");
      setFullname("");
      setEmail("");
      setPhone("");
      setEventId("");
    } catch (error) {
      alert("Error al añadir participante");
    }
  };

  return (
    <form onSubmit={handleAddParticipant}>
      <h3>Add Participant</h3>
      <input value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="fullname" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" required />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="phone" required />
      <select value={eventId} onChange={(e) => setEventId(e.target.value)} required>
        <option value="Event">select</option>
        {Array.isArray(events) && events.map(event => (
          <option key={event.id} value={event.id}>{event.name}</option>
        ))}
      </select>
      <button type="submit" className="add">Add</button>
    </form>
  );
}

export default AddParticipantForm;
