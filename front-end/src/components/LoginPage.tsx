import React, { useState } from "react";
import "./LoginPage.css";

interface FormErrors {
  email?: string;
  password?: string;
  captcha?: string;
}

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // 生成验证码
  const generateCaptcha = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 初始化验证码
  React.useEffect(() => {
    setCaptchaCode(generateCaptcha());
  }, []);

  // 刷新验证码
  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptcha('');
    if (errors.captcha) {
      setErrors(prev => ({ ...prev, captcha: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证邮箱
    if (!email) {
      newErrors.email = "请输入邮箱地址";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }

    // 验证密码
    if (!password) {
      newErrors.password = "请输入密码";
    } else if (password.length < 6) {
      newErrors.password = "密码至少需要6个字符";
    }

    // 验证验证码
    if (!captcha) {
      newErrors.captcha = "请输入验证码";
    } else if (captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      newErrors.captcha = "验证码错误";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("登录成功:", { email, password });
      // 登录成功后跳转到首页
      onLogin();
    } catch (error) {
      console.error("登录失败:", error);
      alert("登录失败，请重试");
      // 登录失败时刷新验证码
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">欢迎使用 测试网站</h1>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="请输入邮箱"
              className={`login-input ${errors.email ? "error" : ""}`}
              disabled={isLoading}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="请输入密码"
              className={`login-input ${errors.password ? "error" : ""}`}
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.45703 12C3.73128 7.94288 7.52159 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C20.2672 16.0571 16.4769 19 11.9992 19C7.52159 19 3.73128 16.0571 2.45703 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <div className="input-group captcha-group">
            <div className="captcha-container">
              <input
                type="text"
                value={captcha}
                onChange={(e) => {
                  setCaptcha(e.target.value);
                  if (errors.captcha) {
                    setErrors(prev => ({ ...prev, captcha: undefined }));
                  }
                }}
                placeholder="请输入验证码"
                className={`login-input captcha-input ${errors.captcha ? "error" : ""}`}
                disabled={isLoading}
                maxLength={4}
              />
              <div className="captcha-display" onClick={refreshCaptcha}>
                <span className="captcha-text">{captchaCode}</span>
                <button type="button" className="captcha-refresh" title="点击刷新验证码">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            {errors.captcha && (
              <div className="error-message">{errors.captcha}</div>
            )}
          </div>

          <div className="forgot-password">
            <a href="#" className="forgot-link">
              忘记密码？
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <div className="loading-spinner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="31.416"
                    strokeDashoffset="31.416"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      dur="2s"
                      values="0 31.416;15.708 15.708;0 31.416"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      dur="2s"
                      values="0;-15.708;-31.416"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
                登录中...
              </div>
            ) : (
              "登录"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
