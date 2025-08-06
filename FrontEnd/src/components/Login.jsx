import { useState } from "react";
import styles from "../styles/Login.module.css";
import { loginUser, signUpUser } from "../services/auth.js"; // Assuming these functions are defined in authService.js

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const loginData = {
      username: username,
      password: password,
    };
    await loginUser(loginData.username, loginData.password);
    setUsername("");
    setPassword("");
  };
  const handleSubmitSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const signUpData = {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    signUpUser(
      signUpData.username,
      signUpData.email,
      signUpData.password,
      signUpData.confirmPassword
    );
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };
  return (
    <div className={styles.loginContainer}>
      {isSignUp ? (
        <div className={styles.form}>
          <h2 className={styles.h2}>Sign Up</h2>
          <form onSubmit={handleSubmitSignUp}>
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
