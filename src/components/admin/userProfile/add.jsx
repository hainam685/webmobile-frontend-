import { useState } from "react";
import "../../../css/admin/addProduct.css";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { addProfile } from "../../../store/user";
import { toast } from 'react-toastify';


const AddProfile = ({ onClose }) => {
    const [user, setUser] = useState({
        email: "",
        password: "",
        address: "",
        numberPhone: "",
        fullName: "",
        role: "",
    });
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/addUser`, user);
            dispatch(addProfile(response.data));
            onClose();
            toast.success("Thêm tài khoản thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm tài khoản:", error);
            toast.error("Thêm tài khoản thất bại.", error);
        }
    };


    return (
        <div className="overlay">
            <div className="add-product-container">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Thêm tài khoản</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Địa chỉ"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Số điện thoại"
                        name="numberPhone"
                        value={user.numberPhone}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        name="fullName"
                        value={user.fullName}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">--chọn quyền--</option>
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                    </select>
                    <button type="submit" className="submit-btn">Thêm</button>
                </form>
            </div>
        </div>
    );
};

export default AddProfile;
