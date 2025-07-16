import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddEventForm from "./AddEventForm";
import AddParticipantForm from "./AddParticipantForm";
import EditEventForm from "./EditEventform";
import ParticipantList from "./ParticipantsList";
import "../CSS/adminpanel.css"; 

function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingParticipants, setViewingParticipants] = useState(null);

  const token = localStorage.getItem("token");

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/olympics/events/list", {
        headers: { Authorization: token }
      });
      setEvents(res.data.data || []);
    } catch (err) {
      alert("Error cargando eventos");
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const logout = async () => {
    await axios.post("http://localhost:8000/api/olympics/logout", {}, {
      headers: { Authorization: token }
    });
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (editingEvent) {
    return (
      <EditEventForm
        event={editingEvent}
        onBack={() => setEditingEvent(null)}
        onUpdated={() => {
          setEditingEvent(null);
          fetchEvents();
        }}
      />
    );
  }

  if (viewingParticipants) {
    return (
      <ParticipantList
        event={viewingParticipants}
        onBack={() => setViewingParticipants(null)}
      />
    );
  }

  return (
    <div className="panel-container">
      <div className="header">
        <h1>Admin Panel</h1>
              <button onClick={logout} className="cerrar-sesion">Close Session</button>
      </div>

      {!showAddEvent && !showAddParticipant && (
          <div className="boton-crear">
            <button className="boton1" onClick={() => {
              setShowAddParticipant(true);
              setShowAddEvent(false);
            }}>➕ Participant</button>

            <button className="boton2" onClick={() => {
              setShowAddEvent(true);
              setShowAddParticipant(false);
            }}>➕ Event</button>
          </div>
      )}

      {showAddEvent && (
        <>
          <AddEventForm
            onEventAdded={() => {
              fetchEvents();
              setShowAddEvent(false);
            }}
          />
          <button onClick={() => setShowAddEvent(false)} >← Back to</button>
        </>
      )}

  
      {showAddParticipant && (
        <>
          <AddParticipantForm />
          <button onClick={() => setShowAddParticipant(false)}>← Back to</button>
        </>
      )}

      {!showAddEvent && !showAddParticipant && (
        <div className="event-list">
          <h3>Events List</h3>
          <table border="1" cellPadding="2" cellSpacing="0">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Date</th>
                <th>Venue (ID)</th>
                <th>Edit</th>
                <th>Participants</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(events) && events.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td className="date">{event.date}</td>
                  <td>{event.venue_id}</td>
                  <td className="bot"><button onClick={() => setEditingEvent(event)} className="editar">✏️ Edit</button></td>
                  <td className="bot"><button onClick={() => setViewingParticipants(event)} className="participantes">👥 Participantes</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
