import React, { useState } from "react";
import styles from "../../assets/styles/Login.module.scss";
import classNames from "classnames/bind";
import { BsGoogle, BsTwitter } from "react-icons/bs";
import { FaFacebook, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/loader";
import AuthServices from "../../services/AuthServices";
import { Notifications } from "@mantine/notifications";

const cx = classNames.bind(styles);

export default function Login() {
  const [email, setEmail] = useState("");
  const [onEmailFocus, setOnEmailFocus] = useState(false);
  const [password, setPassword] = useState("");
  const [onPasswordFocus, setOnPasswordFocus] = useState(false);
  const [onShowPassword, setOnShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToSignup = () => {
    navigate("/register");
  };

  const handleShowPassword = () => {
    setOnShowPassword(!onShowPassword);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await AuthServices.login({ email, password });
      console.log(response);
      setIsLoading(false);
      if (response && response.token) {
        Notifications.show({
          title: "Success",
          message: "Đăng nhập thành công !",
          color: "green",
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className={cx("login-page")}>
      <div className={cx("login-form")}>
        <div className={cx("login-form-header")}>
          <span className={cx("form-header-title")}>Sign in to Degree</span>
          <span className={cx("form-header-subtitle")}>
            Don&apos;t have an account?{" "}
            <a
              onClick={handleNavigateToSignup}
              className={cx("navigate-signup")}
            >
              Get started
            </a>
          </span>
        </div>
        <div className={cx("login-with-provider")}>
          <div>
            <BsGoogle />
          </div>
          <div>
            <FaFacebook />
          </div>
          <div>
            <BsTwitter />
          </div>
        </div>
        <div className={cx("space-login-ep")}>
          <hr />
          <span>OR</span>
          <hr />
        </div>
        <div className={cx("login-form-body")}>
          <div className={cx("login-field-email")}>
            <label
              className={cx(`${email || onEmailFocus ? "has-content" : ""}`)}
              htmlFor="email"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              onFocus={() => setOnEmailFocus(true)}
              onBlur={() => setOnEmailFocus(false)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            />
          </div>
          <div className={cx("login-field-password")}>
            <label
              className={cx(
                `${password || onPasswordFocus ? "has-content" : ""}`
              )}
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              value={password}
              onFocus={() => setOnPasswordFocus(true)}
              onBlur={() => setOnPasswordFocus(false)}
              onChange={(e) => setPassword(e.target.value)}
              type={onShowPassword ? "text" : "password"}
            />
            <button onClick={handleShowPassword} className={cx("btn-showpass")}>
              {onShowPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          <div className={cx("forgot-pass")}>
            <a>Forgot password?</a>
          </div>
          <div className={cx("login-btn")}>
            <button onClick={handleLogin} style={{ cursor: "pointer" }}>
              {isLoading ? <Loader /> : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
