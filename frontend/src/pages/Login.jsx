import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // use context login
    const [signupUser, setSignupUser] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (signupUser) {
                if (formData.password.length < 6) {
                    setErrorMessage("Password must be at least 6 characters");
                    setLoading(false);
                    return;
                }

                const user = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/user/create-user`, formData);
                if (user.data.token) {
                    login(user.data.token); // save token and user info in context
                    navigate("/instructions"); // redirect to instructions page
                } else {
                    setErrorMessage(user.data.message);
                }
            } else {
                const user = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/user/login-user`, formData);
                if (user.data.token) {
                    login(user.data.token); // save token and user info in context
                    if (user.data.hasScore) {
                        navigate("/score");
                    } else {
                        navigate("/instructions");
                    }
                } else {
                    setErrorMessage(user.data.message);
                }
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Server error. Please try again later.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        alert("There is no forgot password logic. Use a new email instead.");
    };

    return (
        <div className="relative flex justify-center items-center h-screen overflow-hidden bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-96 p-8 rounded-2xl bg-white/70 backdrop-blur-md shadow-xl relative z-10"
            >
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    {signupUser ? "Sign Up" : "Login"}
                </h2>
                {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

                {signupUser && (
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="rounded border px-3 py-2 border-gray-300 focus:outline-blue-400"
                            required
                        />
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourmail@gmail.com"
                        className="rounded border px-3 py-2 border-gray-300 focus:outline-blue-400"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="rounded border px-3 py-2 border-gray-300 focus:outline-blue-400"
                        required
                    />
                </div>

                {!signupUser && (
                    <p
                        onClick={handleForgotPassword}
                        className="text-sm text-blue-600 cursor-pointer hover:underline text-right"
                    >
                        Forgot Password?
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg p-2 cursor-pointer bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                >
                    {loading ? "Processing..." : signupUser ? "Sign Up" : "Login"}
                </button>

                <p className="text-center text-sm mt-2 text-gray-700">
                    {signupUser ? "Already have an account?" : "Don’t have an account?"}{" "}
                    <span
                        onClick={() => {
                            if (!loading) {
                                setSignupUser(!signupUser);
                                setErrorMessage("");
                                setFormData({ name: "", email: "", password: "" });
                            }
                        }}
                        className="text-blue-600 cursor-pointer hover:underline"
                    >
                        {signupUser ? "Login" : "Sign Up"}
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
