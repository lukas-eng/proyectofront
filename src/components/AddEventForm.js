import React, { useState, useEffect } from "react";
import axios from "axios";

function AddEventForm({ onEventAdded }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [venueId, setVenueId] = useState("");
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8000/api/olympics/venues", {
          headers: { Authorization: token }
        });
        setVenues(res.data.venues || res.data);
      } catch (err) {
        alert("Error cargando los lugares");
      }
    };

    fetchVenues();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:8000/api/olympics/events/create", {
        name,
        date,
        venue_id: venueId
      }, {
        headers: { Authorization: token }
      });

      alert("Evento creado");
      setName("");
      setDate("");
      setVenueId("");
      if (onEventAdded) onEventAdded();
    } catch (err) {
      alert("Error al crear el evento");
    }
  };

  return (
    <form onSubmit={handleAddEvent}>
      <h3>Add Event</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <select value={venueId} onChange={(e) => setVenueId(e.target.value)} required>
        <option value="">select</option>
        {venues.map(v => (
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default AddEventForm;
