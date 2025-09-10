import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/admin-login`, {
                email: username,
                password,
            });

            localStorage.setItem("token", res.data.token);

            if (res.data.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                alert("Bạn không có quyền truy cập trang admin!");
            }

        } catch (err) {
            alert(err.response?.data?.message || "Đăng nhập thất bại!");
        }
    };

    return (
        <div className="admin-login">
            <h2>Đăng nhập Quản trị</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
