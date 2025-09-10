import { useState } from "react";
import "../../../css/admin/addProduct.css";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { updateProfile } from "../../../store/user";
import { toast } from 'react-toastify';


const UpdateProfile = ({ onClose, profileData }) => {
    const [user, setUser] = useState(profileData || []);
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
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/updateUser/${profileData._id}`, user);
            dispatch(updateProfile(response.data));
            onClose();
            toast.success("Cập nhật tài khoản thành công!");
        } catch (error) {
            console.error("Lỗi khi Cập nhật tài khoản:", error);
            toast.error("Cập nhật tài khoản thất bại.");
        }
    };


    return (
        <div className="overlay">
            <div className="add-product-container">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>Cập nhật tài khoản</h2>
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
                    <button type="submit" className="submit-btn">Cập nhật</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
