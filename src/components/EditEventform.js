import React, { useState, useEffect } from "react";
import axios from "axios";
import '../CSS/edit.css'

function EditEventForm({ event, onBack, onUpdated }) {
  const [name, setName] = useState(event.name);
  const [date, setDate] = useState(event.date);
  const [venueId, setVenueId] = useState(event.venue_id);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/olympics/venues`, {
          headers: { Authorization: token }
        });
        setVenues(res.data.venues || res.data);
      } catch (error) {
        alert("Error cargando sedes");
      }
    };
    fetchVenues();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/olympics/events/edit/${event.id}`, {
        name,
        date,
        venue_id: venueId,
      }, {
        headers: { Authorization: token }
      });
      alert("Evento actualizado");
      if (onUpdated) onUpdated();
    } catch (err) {
      alert("Error al actualizar el evento");
    }
  };

  return (
    <div className="contenedor">
      <h3 className="titulo">Edit Event</h3>
      <form onSubmit={handleUpdate}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tennis" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <select value={venueId} onChange={(e) => setVenueId(e.target.value)} required>
          <option value="">select</option>
          {venues.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
        <div style={{ marginTop: "10px" }}>
          <button type="submit" className="add">Add</button>
          <button type="button" onClick={onBack} style={{ marginLeft: "10px" }} className="volver">Back to</button>
        </div>
      </form>
    </div>
  );
}

export default EditEventForm;
