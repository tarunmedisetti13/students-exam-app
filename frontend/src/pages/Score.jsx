import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Score = () => {
    const { user, token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [score, setScore] = useState(null);
    const [total, setTotal] = useState(10); // default, can update after fetch
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScore = async () => {
            if (!user || !token) {
                navigate("/"); // redirect to login if not logged in
                return;
            }

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URI}/user/get-score`,
                    { userId: user.id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setScore(response.data.score);
                setTotal(response.data.total || 30);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch score");
            } finally {
                setLoading(false);
            }
        };

        fetchScore();
    }, [user, token, navigate]);

    const handleLogout = () => {
        logout(); // call context logout
        navigate("/");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500">{error}</p>
                <button
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded mt-4"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-gray-100 p-6 rounded shadow-md text-center">
                <h1 className="text-3xl font-bold mb-4">Exam Completed</h1>
                <p className="text-xl mb-6">
                    Your Score: <span className="font-bold">{score}</span> / {total}
                </p>
                <button
                    className="cursor-pointer bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Score;
