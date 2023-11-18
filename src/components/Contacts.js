import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3005/api/contacts')
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
      });
  }, []);

  const handleCreateContact = () => {
    axios.post('http://localhost:3005/api/contacts', newContact)
      .then(response => {
        setContacts([...contacts, response.data]);
        setNewContact({ name: '', email: '', phone: '' });
      })
      .catch(error => {
        console.error('Error creating a contact:', error);
      });
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);

    // Populate the input fields with the selected contact's details
    setNewContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
  };

  const handleUpdateSelectedContact = () => {
    if (selectedContact) {
      axios
        .put(`http://localhost:3005/api/contacts/${selectedContact._id}`, newContact)
        .then(response => {
          const updatedContact = response.data;

          // Update the contacts list with the updated contact data
          const updatedList = contacts.map(c => (c._id === updatedContact._id ? updatedContact : c));
          setContacts(updatedList);
          // Clear the selected contact and input fields
          setSelectedContact(null);
          setNewContact({ name: '', email: '', phone: '' });
        })
        .catch(error => {
          console.error('Error updating a contact:', error);
        });
    }
  };

  const handleDeleteContact = (contact) => {
    axios.delete(`http://localhost:3005/api/contacts/${contact._id}`)
      .then(() => {
        const updatedList = contacts.filter(c => c._id !== contact._id);
        setContacts(updatedList);
      })
      .catch(error => {
        console.error('Error deleting a contact:', error);
      });
  };

  return (
    <div>
      <h1>Contacts</h1>

      <div>
        <h2>{selectedContact ? 'Edit Contact' : 'Create a New Contact'}</h2>
        <input
          type="text"
          placeholder="Name"
          value={newContact.name}
          onChange={e => setNewContact({ ...newContact, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newContact.email}
          onChange={e => setNewContact({ ...newContact, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={newContact.phone}
          onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
        />
        <button onClick={selectedContact ? handleUpdateSelectedContact : handleCreateContact}>
          {selectedContact ? 'Update Contact' : 'Create'}
        </button>
      </div>

      <ul>
        {contacts.map(contact => (
          <li key={contact._id}>
            <div style={{ border: '1px solid #000', padding: '10px', margin: '10px' }}>
              <h3>Name: {contact.name}</h3>
              <h3>Email: {contact.email}</h3>
              <h3>Phone: {contact.phone}</h3>
              <button onClick={() => handleDeleteContact(contact)}>Delete Contact</button>
              <button onClick={() => handleEditContact(contact)}>Edit Contact</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
