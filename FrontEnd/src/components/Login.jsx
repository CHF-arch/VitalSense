import { useState } from "react";
import styles from "../styles/Login.module.css";
import { loginUser, signUpUser } from "../services/auth.js"; // Assuming these functions are defined in authService.js
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
// import commonStyles from "../styles/common.module.css";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      if (data.accessToken) {
        setUsername("");
        setPassword("");
        navigate("/clients");
      } else {
        throw new Error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signUpUser(username, email, password, confirmPassword);
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setIsSignUp(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.themeButtonWrapper}>
        <button onClick={toggleTheme} className={styles.button}>
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
      {isSignUp ? (
        <div className={styles.form}>
          <h2 className={styles.h2}>Sign Up</h2>
          <form onSubmit={handleSubmitSignUp}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <label className={styles.label}>
              Email:
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              Username:
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              Password:
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </form>
          <p className={styles.p}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleToggleForm}
              className={styles.toggleButton}
            >
              Login
            </button>
          </p>
        </div>
      ) : (
        <div className={styles.form}>
          <h2 className={styles.h2}>Login</h2>
          <form onSubmit={handleSubmitLogin}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <label className={styles.label}>
              UserName :
              <input
                type="username"
                name="username"
                placeholder="Username"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              Password:
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
          <p className={styles.p}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleToggleForm}
              className={styles.toggleButton}
            >
              Sign Up
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
