import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [devices, setDevices] = useState([]);
    const [newDevice, setNewDevice] = useState({
        device_id: '',
        name: '',
        type: '',
        state_topic: '',
        command_topic: '',
        payload_on: '',
        payload_off: '',
        qos: 1,
        retain: 0
    });

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const res = await axios.get('/api/devices');
            setDevices(res.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        }
    };

    const handleInputChange = (e) => {
        setNewDevice({
            ...newDevice,
            [e.target.name]: e.target.value
        });
    };

    const handleAddDevice = async () => {
        try {
            await axios.post('/api/devices', newDevice);
            fetchDevices();
            setNewDevice({
                device_id: '',
                name: '',
                type: '',
                state_topic: '',
                command_topic: '',
                payload_on: '',
                payload_off: '',
                qos: 1,
                retain: 0
            });
        } catch (error) {
            console.error('Error adding device:', error);
        }
    };

    const handleDeleteDevice = async (device_id) => {
        try {
            await axios.delete(`/api/devices/${device_id}`);
            fetchDevices();
        } catch (error) {
            console.error('Error deleting device:', error);
        }
    };

    return (
        <div>
            <h1>Device Management</h1>
            <ul>
                {devices.map(device => (
                    <li key={device.device_id}>
                        {device.name} ({device.type}) - Owned by: {device.username || 'No owner'}
                        <button onClick={() => handleDeleteDevice(device.device_id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h2>Add New Device</h2>
            <input
                type="text"
                name="device_id"
                value={newDevice.device_id}
                onChange={handleInputChange}
                placeholder="Device ID"
            />
            <input
                type="text"
                name="name"
                value={newDevice.name}
                onChange={handleInputChange}
                placeholder="Device Name"
            />
            <input
                type="text"
                name="type"
                value={newDevice.type}
                onChange={handleInputChange}
                placeholder="Device Type"
            />
            <button onClick={handleAddDevice}>Add Device</button>
        </div>
    );
}

export default App;
