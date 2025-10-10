import { useState } from "react";
import styles from "../../styles/Login.module.css";
import { loginUser, signUpUser } from "../../services/auth.js"; // Assuming these functions are defined in authService.js
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme.js";
import { useTranslation } from "react-i18next";
import LoginRequerments from "./LoginRequerments.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        navigate("/dashboard");
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
          {theme === "light" ? t("login.dark_mode") : t("login.light_mode")}
        </button>
      </div>
      {isSignUp ? (
        <div className={styles.form}>
          <h2 className={styles.h2}>{t("login.sign_up")}</h2>
          <form onSubmit={handleSubmitSignUp}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <label className={styles.label}>
              {t("login.email")}:
              <input
                type="email"
                name="email"
                placeholder={t("login.email")}
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              {t("login.username")}:
              <input
                type="text"
                name="username"
                placeholder={t("login.username")}
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              {t("login.password")}:
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t("login.password")}
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className={styles.passwordToggleIcon}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </label>

            <label className={styles.label}>
              {t("login.confirm_password")}:
              <div className={styles.passwordInputContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder={t("login.confirm_password")}
                  className={styles.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEye : faEyeSlash}
                  className={styles.passwordToggleIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
            </label>

            <button type="submit" className={styles.button}>
              {t("login.sign_up")}
            </button>
          </form>
          <p className={styles.p}>
            {t("login.already_have_an_account")}{" "}
            <button
              type="button"
              onClick={handleToggleForm}
              className={styles.toggleButton}
            >
              {t("login.login")}
            </button>
          </p>
          <LoginRequerments password={password} />
        </div>
      ) : (
        <div className={styles.form}>
          <h2 className={styles.h2}>{t("login.login")}</h2>
          <form onSubmit={handleSubmitLogin}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <label className={styles.label}>
              {t("login.username")} :
              <input
                type="username"
                name="username"
                placeholder={t("login.username")}
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              {t("login.password")}:
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t("login.password")}
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className={styles.passwordToggleIcon}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </label>

            <button type="submit" className={styles.button}>
              {t("login.login")}
            </button>
          </form>
          <p className={styles.p}>
            {t("login.dont_have_an_account")}{" "}
            <button
              type="button"
              onClick={handleToggleForm}
              className={styles.toggleButton}
            >
              {t("login.sign_up")}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}