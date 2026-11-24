import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Sparkles,
    Check,
} from "lucide-react";

import { registerUser } from "../services/authService";


function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
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
            await registerUser(form);

            navigate("/login");

        } catch (error) {
            console.error(error);

            if (error.response?.data) {
                console.log(
                    "Backend error:",
                    error.response.data
                );
            }

            setError(
                "Registration failed. Please check your details."
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

                        Start your AI journey
                    </div>


                    <h1 className="auth-title">

                        Become
                        <br />

                        <span className="gradient-text">
                            interview ready.
                        </span>

                    </h1>


                    <p className="auth-description">

                        Build confidence through realistic
                        AI-powered mock interviews and
                        personalized feedback.

                    </p>


                    <div className="auth-features">

                        <div className="auth-feature">

                            <div className="feature-check">
                                <Check size={13} />
                            </div>

                            Technical interviews

                        </div>


                        <div className="auth-feature">

                            <div className="feature-check">
                                <Check size={13} />
                            </div>

                            HR interviews

                        </div>


                        <div className="auth-feature">

                            <div className="feature-check">
                                <Check size={13} />
                            </div>

                            AI performance analysis

                        </div>

                    </div>

                </div>

            </div>


            <div className="auth-right">

                <div className="auth-card">

                    <div className="auth-card-header">

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Start practicing smarter today.
                        </p>

                    </div>


                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        <div className="form-row">

                            <div className="form-group">

                                <label className="form-label">
                                    First name
                                </label>

                                <input
                                    className="form-input"
                                    type="text"
                                    name="first_name"
                                    placeholder="John"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label className="form-label">
                                    Last name
                                </label>

                                <input
                                    className="form-input"
                                    type="text"
                                    name="last_name"
                                    placeholder="Doe"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label className="form-label">
                                Username
                            </label>

                            <input
                                className="form-input"
                                type="text"
                                name="username"
                                placeholder="johndoe"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label className="form-label">
                                Email
                            </label>

                            <input
                                className="form-input"
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                value={form.email}
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
                                placeholder="Minimum 8 characters"
                                value={form.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />

                        </div>


                        <button
                            className="primary-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create account"}
                        </button>

                    </form>


                    <div className="auth-switch">

                        Already have an account?{" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Sign in
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Register;