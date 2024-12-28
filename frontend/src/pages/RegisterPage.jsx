import React from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import {useDispatch, useSelector} from "react-redux";
import { registerStart, registerSuccess, registerFailure } from '../features/userSlice';
import axios from 'axios';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const { loading,error } = useSelector((state) => state.user);
    const [formData,setFormData] = React.useState({
      name : "",
      email : "",
      password : "",
      confirmPassword : ""
    });
    const { name, email, password, confirmPassword } = formData;
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
          dispatch(registerFailure("Passwords do not match"));
          return;
        }
        dispatch(registerStart());
        try{
          console.log(formData);
          const response = await axios.post('/api/users/register',{
             name,
             email,
             password
          });
          dispatch(registerSuccess(response.data));
        }catch(err){
          dispatch(registerFailure(err.response?.data?.message || 'Registration failed'));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-md bg-white p-6 rounded shadow-md"
            >
                <h1 className="text-2xl font-semibold text-center mb-4">Register</h1>
                <div className="mb-4">
                    <Label htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        type="text"
                         value={name}
                         onChange={handleInputChange}
                        placeholder="Enter your name"
                        required={true}
                        className="mt-1"
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        type="email"
                        placeholder="Enter your email"
                        required={true}
                        className="mt-1"
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        name='password'
                        value={password}
                        onChange={handleInputChange}
                        type="password"
                        placeholder="Enter your password"
                        required={true}
                        className="mt-1"
                    />
                </div>
                <div className="mb-6">
                    <Label htmlFor="confirm-password" value="Confirm Password" />
                    <TextInput
                        id="confirm-password"
                        type="password"
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        required={true}
                        className="mt-1"
                    />
                </div>
                <Button type="submit" gradientDuoTone="greenToBlue" className="w-full">
                    Register
                </Button>
                {loading && <p className="text-sm text-center mt-4">Loading...</p>}
                {error && <p className="text-sm text-center mt-4 text-red-500">{error}</p>}
                <p className="text-sm text-center mt-4">
                    Already have an account?{' '}
                    <a href="/" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
