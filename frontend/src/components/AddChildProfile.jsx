import React, { useState } from 'react';
import axios from 'axios';

const AddChildProfile = () => {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');

      await axios.post(
        '/api/children/createChildProfile',
        {
          name,
          dateOfBirth,
          gender,
          height,
          weight,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setSuccess('Child profile created successfully');
      setName('');
      setDateOfBirth('');
      setGender('');
      setHeight('');
      setWeight('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Child Profile</h2>
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 mb-4 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded-lg">
          {success}
        </div>
      )}
      <form onSubmit={handleAddChild}>
        {/* Child's Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Child's Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter child's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Height */}
        <div className="mb-4">
          <label
            htmlFor="height"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Height (in cm)
          </label>
          <input
            type="number"
            id="height"
            placeholder="Enter child's height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Weight */}
        <div className="mb-4">
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Weight (in kg)
          </label>
          <input
            type="number"
            id="weight"
            placeholder="Enter child's weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        >
          Add Child
        </button>
      </form>
    </div>
  );
};

export default AddChildProfile;
