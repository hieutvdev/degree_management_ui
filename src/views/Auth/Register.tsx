import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "../../assets/styles/Register.module.scss";
import { BsGoogle } from "react-icons/bs";
import { FaFacebook, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import logo from "../../assets/svgs/register.svg";
import { useNavigate } from "react-router-dom";
import AuthServices from "../../services/AuthServices";
import { Notifications } from "@mantine/notifications";
import Loader from "../../components/ui/loader";
const cx = classNames.bind(styles);

export default function Register() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onShowPassword, setOnShowPassword] = useState(false);

  const [onEmailFocus, setOnEmailFocus] = useState(false);
  const [onUserNameFocus, setOnUserNameFocus] = useState(false);
  const [onPasswordFocus, setOnPasswordFocus] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const handleShowPassword = () => {
    setOnShowPassword(!onShowPassword);
  };
  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await AuthServices.register({
        userName: email,
        fullName: userName,
        password: password,
      });
      console.log(response);
      setIsLoading(false);
      if (response && response.token) {
        Notifications.show({
          title: "Success",
          message: "Login successfully",
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
    <div className={cx("register-page")}>
      <div className={cx("register-form")}>
        <div className={cx("register-form-right")}>
          <img src={logo} alt="" />
        </div>
        <div className={cx("register-form-left")}>
          <div className={cx("register-form-create")}>
            <div className={cx("form-left-header")}>
              <span className={cx("header-title")}>Create your account</span>
              <span className={cx("header-des")}>No credit card needed</span>
            </div>
            <div className={cx("login-form-body")}>
              <div className={cx("login-field-email")}>
                <label
                  className={cx(
                    `${email || onEmailFocus ? "has-content" : ""}`
                  )}
                  htmlFor="email"
                >
                  Email address
                </label>
                <input
                  name="email"
                  onFocus={() => setOnEmailFocus(true)}
                  onBlur={() => setOnEmailFocus(false)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                />
              </div>
              <div className={cx("login-field-username")}>
                <label
                  className={cx(
                    `${userName || onUserNameFocus ? "has-content" : ""}`
                  )}
                  htmlFor="username"
                >
                  FullName
                </label>
                <input
                  name="username"
                  onFocus={() => setOnUserNameFocus(true)}
                  onBlur={() => setOnUserNameFocus(false)}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
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
                  name="password"
                  value={password}
                  onFocus={() => setOnPasswordFocus(true)}
                  onBlur={() => setOnPasswordFocus(false)}
                  onChange={(e) => setPassword(e.target.value)}
                  type={onShowPassword ? "text" : "password"}
                />
                <button
                  onClick={handleShowPassword}
                  className={cx("btn-showpass")}
                >
                  {onShowPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              <div className={cx("login-field-cardid-phonenumber")}></div>
              <div className={cx("register-btn")}>
                <button onClick={handleRegister}>
                  {" "}
                  {isLoading ? <Loader /> : "Login"}
                </button>
              </div>
            </div>
            <div className={cx("signup-with")}>
              <span>
                Have an account{" "}
                <b
                  onClick={handleNavigateToLogin}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  Login
                </b>
              </span>{" "}
            </div>
            <div className={cx("signup-with")}>
              <span>or sign in with</span>
            </div>
            <div className={cx("signup-providers")}>
              <div>
                <BsGoogle />
                <span>Google</span>
              </div>
              <div>
                <FaFacebook />
                <span>Facebook</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
