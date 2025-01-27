import React, { useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import {useDispatch,useSelector} from "react-redux";
import { signInStart, signInSuccess, signInFailure } from '../features/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loginLoading, loginError } = useSelector((state) => state.user);

    const handleLogin =  async (e) => {
        e.preventDefault();

        // Add login logic here
        dispatch(signInStart());
        try{
            const response = await axios.post('/api/users/login',{email,password});
            const {token,user} = response.data;
            localStorage.setItem('authToken',token);
            dispatch(signInSuccess(user));
            navigate('/dashboard');
        } catch(err){
             dispatch(signInFailure(err.response?.data?.message || 'Login failed'));
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white p-6 rounded shadow-md"
            >

                <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
                {
                    loginError && (
                        <p className="text-sm text-center mb-4 text-red-600">{error}</p>
                    )
                }
                <div className="mb-4">
                    <Label htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                        className="mt-1"
                    />
                </div>
                <div className="mb-6">
                    <Label htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                        className="mt-1"
                    />
                </div>
                <Button type="submit" gradientDuoTone="cyanToBlue" className="w-full"
                        disabled={loginLoading}
                >
                {loginLoading ? 'Logging in...' : 'Login'}
                </Button>
                <p className="text-sm text-center mt-4">
                    Don’t have an account?{' '}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
