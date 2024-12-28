import React from 'react';
import { Button, Label, TextInput } from 'flowbite-react';

const LoginPage = () => {
    const handleLogin = (e) => {
        e.preventDefault();
        // Add login logic here
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white p-6 rounded shadow-md"
            >
                <h1 className="text-2xl font-semibold text-center mb-4">Login</h1>
                <div className="mb-4">
                    <Label htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        placeholder="Enter your email"
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
                        required={true}
                        className="mt-1"
                    />
                </div>
                <Button type="submit" gradientDuoTone="cyanToBlue" className="w-full">
                    Login
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
