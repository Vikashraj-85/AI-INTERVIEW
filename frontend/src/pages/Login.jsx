import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Sparkles,
    ShieldCheck,
    Brain,
    Target,
    Check,
} from "lucide-react";

import { loginUser } from "../services/authService";


function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(form);

            localStorage.setItem(
                "access_token",
                data.access
            );

            localStorage.setItem(
                "refresh_token",
                data.refresh
            );

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            setError(
                "Invalid username or password."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page">

            <div className="auth-background">
                <div className="auth-orb auth-orb-one" />
                <div className="auth-orb auth-orb-two" />
            </div>


            <div className="auth-left">

                <div className="auth-brand">
                    <div className="brand-icon">
                        <Sparkles size={21} />
                    </div>

                    <span>
                        InterviewAI
                    </span>
                </div>


                <div className="auth-content">

                    <div className="auth-badge">
                        <Sparkles size={14} />

                        AI-Powered Interview Coach
                    </div>


                    <h1 className="auth-title">
                        Ace your next
                        <br />

                        <span className="gradient-text">
                            interview with AI.
                        </span>
                    </h1>


                    <p className="auth-description">
                        Practice realistic interviews,
                        improve your answers, and get
                        instant AI-powered feedback designed
                        to help you land your dream job.
                    </p>


                    <div className="auth-features">

                        <div className="auth-feature">
                            <div className="feature-check">
                                <Check size={13} />
                            </div>

                            Personalized questions
                        </div>


                        <div className="auth-feature">
                            <div className="feature-check">
                                <Check size={13} />
                            </div>

                            AI feedback
                        </div>


                        <div className="auth-feature">
                            <div className="feature-check">
                                <Check size={13} />
                            </div>

                            Voice interviews
                        </div>

                    </div>

                </div>

            </div>


            <div className="auth-right">

                <div className="auth-card">

                    <div className="auth-card-header">

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to continue your
                            interview preparation.
                        </p>

                    </div>


                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label className="form-label">
                                Username
                            </label>

                            <input
                                className="form-input"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label className="form-label">
                                Password
                            </label>

                            <input
                                className="form-input"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <button
                            className="primary-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>

                    </form>


                    <div className="auth-switch">

                        Don't have an account?{" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create account
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Login;