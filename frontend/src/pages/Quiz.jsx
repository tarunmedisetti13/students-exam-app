import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Quiz = () => {
    const { user, token, hasScore } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const choice = searchParams.get("choice");
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [show404, setShow404] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!isSubmitted) {
                // This triggers the browser's built-in confirmation dialog
                e.preventDefault();
                e.returnValue = "Are you sure you want to leave? Your exam will be submitted automatically.";
                return e.returnValue;
            }
        };

        const handleUnload = async () => {
            if (!isSubmitted) {
                setIsRefreshing(true);
                // Submit the exam when page is actually unloading
                await handleSubmitOnRefresh();
            }
        };

        const handlePopState = (e) => {
            if (!isSubmitted) {
                e.preventDefault();
                setShowConfirm(true);
                // Push the current state back to prevent navigation
                window.history.pushState(null, document.title, window.location.href);
            }
        };

        // Add event listeners
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("unload", handleUnload);
        window.addEventListener("popstate", handlePopState);

        // Push initial state so back button triggers popstate
        window.history.pushState(null, document.title, window.location.href);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("unload", handleUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isSubmitted, questions, answers, user]);

    // Handle page visibility change (for mobile browsers)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'hidden' && !isSubmitted && questions.length > 0) {
                // Page is being hidden (likely refresh or close)
                await handleSubmitOnRefresh();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isSubmitted, questions, answers, user]);

    // Fetch questions
    useEffect(() => {
        const checkAccess = async () => {
            if (!token || !user) {
                setShow404(true);
                setLoading(false);
                return;
            }
            const localHasScore = localStorage.getItem("hasScore") === "true";
            if (hasScore || localHasScore) {
                navigate("/score");
                return;
            }
            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URI}/questions/get-exam-questions`,
                    { choice }
                );
                setQuestions(data.questions);
                setAnswers(Array(data.questions.length).fill(null));
                setTimeLeft(data.questions.length * 30);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching questions:", err);
                setShow404(true);
                setLoading(false);
            }
        };
        checkAccess();
    }, [choice, token, user]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0 && questions.length > 0) handleSubmit(true);
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, questions]);


    const handleAnswers = (qIndex, selectedOptionIndex) => {
        const newAnswers = [...answers];
        newAnswers[qIndex] = selectedOptionIndex; // Store the index directly
        setAnswers(newAnswers);
    };

    const handleSubmit = async (force = false) => {
        if (isSubmitted) return;

        if (!force && !showConfirm) {
            setShowConfirm(true);
            return;
        }

        if (!questions.length) return;

        let scoreCount = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctOptionIndex) {
                scoreCount += 1;
            }
        });

        setScore(scoreCount);
        localStorage.setItem("hasScore", "true");
        setIsSubmitted(true);

        try {
            const payload = {
                userId: user.id,
                score: scoreCount,
            };

            await axios.post(`${import.meta.env.VITE_BACKEND_URI}/user/update-score`, payload);
        } catch (err) {
            console.error("Error saving score:", err);
        }

        navigate(`/score`);
    };


    const handleSubmitOnRefresh = async () => {
        if (isSubmitted || !questions.length) return;

        let scoreCount = 0;
        questions.forEach((q, idx) => {
            console.log(
                `Question ${idx + 1}: ${answers[idx]} === ${q.correctOptionIndex}?`,
                answers[idx] === q.correctOptionIndex
            );
            if (answers[idx] === q.correctOptionIndex) {
                scoreCount += 1;
            }
        });

        setScore(scoreCount);
        localStorage.setItem("hasScore", "true");
        setIsSubmitted(true);

        try {
            const payload = JSON.stringify({
                userId: user.id,
                score: scoreCount,
            });

            if (navigator.sendBeacon) {
                const blob = new Blob([payload], { type: "application/json" });
                const result = navigator.sendBeacon(
                    `${import.meta.env.VITE_BACKEND_URI}/user/update-score`,
                    blob
                );
                console.log("SendBeacon result:", result);
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URI}/user/update-score`, {
                    userId: user.id,
                    score: scoreCount,
                });
            }
        } catch (err) {
            console.error("Error saving score on refresh:", err);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );

    if (show404)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold text-gray-700">404 - Page Not Found</h1>
            </div>
        );

    return (
        <div className="flex flex-col items-center px-4 min-h-screen relative">
            {/* Header */}
            <div className="flex justify-between items-center w-full max-w-3xl mt-4 mb-2">
                <p className="text-lg font-bold">
                    Time Left: {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
                </p>
                <button
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={() => handleSubmit(false)}
                >
                    Submit
                </button>
            </div>

            {/* Questions */}
            {questions.length > 0 && score === null && (
                <div className="w-full max-w-3xl flex flex-col gap-6">
                    <div className="p-4 border rounded shadow">
                        <p className="text-xl font-semibold">
                            Q{currentIndex + 1}. {questions[currentIndex].question}
                        </p>
                        <ul className="mt-2">
                            {questions[currentIndex].options.map((opt, i) => (
                                <li key={i} className="my-1">
                                    <label className="cursor-pointer text-lg flex items-center">
                                        <input
                                            type="radio"
                                            name={`question-${currentIndex}`}
                                            value={i}
                                            checked={answers[currentIndex] === i} // ✅ index vs index
                                            onChange={() => handleAnswers(currentIndex, i)}
                                            className="mr-2"
                                        />

                                        {opt.option}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
                            onClick={() => setCurrentIndex(prev => prev - 1)}
                            disabled={currentIndex === 0}
                        >
                            Prev
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 cursor-pointer rounded disabled:opacity-50"
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            disabled={currentIndex === questions.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
                        <p className="mb-6 text-lg font-semibold">Are you sure you want to submit your exam?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded cursor-pointer"
                                onClick={() => {
                                    setShowConfirm(false);
                                    handleSubmit(true);
                                }}
                            >
                                Yes, Submit
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded cursor-pointer"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Warning message */}
            {!isSubmitted && (
                <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm max-w-sm">
                    ⚠️ Warning: Refreshing or closing this page will automatically submit your exam!
                </div>
            )}
        </div>
    );
};

export default Quiz;