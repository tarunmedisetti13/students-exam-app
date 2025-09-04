import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Instructions = () => {
    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);

    const [showInstructions, setShowInstructions] = useState(true);
    const [choice, setChoice] = useState();
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);

    // Check if user is logged in
    useEffect(() => {
        if (!token || !user) {
            setUnauthorized(true);
            setLoading(false);
            return;
        }
        setLoading(false);
    }, [token, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (unauthorized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-gray-700">404 - Page Not Found</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            {showInstructions ? (
                <div className="p-5 max-w-2xl w-full bg-gray-100 rounded shadow flex flex-col gap-4">
                    <h2 className="text-2xl font-bold mb-2 text-center">Exam Instructions</h2>
                    <ul className="list-disc ml-5 space-y-2">
                        <li>Read each question carefully.</li>
                        <li>You can navigate between questions using Prev/Next buttons.</li>
                        <li>Only one option can be selected per question.</li>
                        <li>You can jump to any question using the question navigator.</li>
                        <li>Click Submit when you have completed all questions.</li>
                        <li>Total 30 minutes to complete the exam.</li>
                        <li>When the timer ends, the exam is automatically submitted.</li>
                    </ul>
                    <button
                        className="cursor-pointer self-end bg-green-500 px-4 py-2 rounded hover:bg-green-400 duration-100"
                        onClick={() => setShowInstructions(false)}
                    >
                        Next
                    </button>
                </div>
            ) : (
                <div className="p-5 max-w-2xl w-full bg-gray-100 rounded shadow flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center">Technology Stack</h2>
                    <ul className="list-disc ml-5 space-y-2">
                        <li>Frontend: <strong>React.js</strong></li>
                        <li>
                            Backend API:
                            <label className="ml-2 cursor-pointer">
                                <strong>
                                    <input
                                        type="radio"
                                        value="django"
                                        checked={choice === 'django'}
                                        onChange={() => setChoice('django')}
                                    /> Django
                                </strong>
                            </label>
                            <label className="ml-2 cursor-pointer">
                                <strong>
                                    <input
                                        type="radio"
                                        value="node"
                                        checked={choice === 'node'}
                                        onChange={() => setChoice('node')}
                                    /> Node.js
                                </strong>
                            </label>
                        </li>
                        <li>Database: <strong>MongoDB</strong></li>
                    </ul>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            className="bg-green-500 px-4 py-2 rounded hover:bg-green-400 duration-100 cursor-pointer"
                            onClick={() => setShowInstructions(true)}
                        >
                            Prev
                        </button>
                        <button
                            className="bg-blue-400 px-4 py-2 rounded hover:bg-blue-300 duration-100 cursor-pointer"
                            onClick={() => navigate(`/quiz?choice=${choice}`)}
                            disabled={!choice}
                        >
                            Start Exam
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Instructions;
