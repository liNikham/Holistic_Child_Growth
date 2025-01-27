import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChildProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const parentId = JSON.parse(localStorage.getItem('user'))._id;

        const response = await axios.get('http://localhost:5000/child-profile', {
          params: { parentId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfiles(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profiles');
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div>
      <h2>Child Profiles</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {profiles.length === 0 ? (
        <p>No profiles found</p>
      ) : (
        <ul>
          {profiles.map((profile) => (
            <li key={profile._id}>
              <p>Name: {profile.name}</p>
              <p>Date of Birth: {profile.dateOfBirth}</p>
              <p>Gender: {profile.gender}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChildProfiles;
