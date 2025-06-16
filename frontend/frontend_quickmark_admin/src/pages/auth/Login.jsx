// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { GanttChartSquare, Eye, EyeOff } from 'lucide-react';

// --- SVG Icon for Google ---
const GoogleIcon = (props) => (
    <svg viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (email && password) {
            console.log('Logging in...');
            onLogin();
        } else {
            // A non-blocking notification is better than alert()
            console.error('Please enter both email and password.');
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white p-4 sm:p-8">
            {/* Logo Section */}
            <div className="flex items-center justify-center mb-10 ">
                <GanttChartSquare className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold ml-2 text-text-primary text-left">QuickMark</h1>
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-text-primary">Login</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your college email"
                            className="w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="text-center w-full px-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-4 flex items-center text-text-secondary"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Login
                    </button>
                </form>

                {/* --- Divider --- */}
                <div className="my-8 flex items-center">
                    <div className="flex-grow border-t border-border-color"></div>
                    <span className="flex-shrink mx-4 text-text-secondary text-sm">Or continue with</span>
                    <div className="flex-grow border-t border-border-color"></div>
                </div>

                {/* --- Google Login Button --- */}
                <button
                    onClick={onLogin} // In a real app, this would trigger the Google OAuth flow
                    className="w-full flex justify-center items-center py-3 px-4 border border-border-color rounded-lg text-text-primary bg-white hover:bg-gray-50 transition-colors duration-300"
                >
                    <GoogleIcon className="h-6 w-6 mr-3" />
                    <span className="font-medium">Sign in with Google</span>
                </button>
            </div>
        </div>
    );
};

// Corrected export
export default Login;
