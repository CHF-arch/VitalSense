import { useState } from "react";
import styles from "../styles/Login.module.css";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className={styles.loginContainer}>
      {isSignUp ? (
        <div className={styles.form}>
          <h2 className={styles.h2}>Sign Up</h2>
          <form>
            <label className={styles.label}>
              Email:
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Username:
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Password:
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={styles.input}
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
          <form>
            <label className={styles.label}>
              Email:
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Password:
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
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
