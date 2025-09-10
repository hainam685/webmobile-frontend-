import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "../../store/user";
import { useNavigate } from "react-router-dom";
import "../../css/home/userProfile.css";
import { Helmet } from "react-helmet-async";


const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useSelector((state) => state.profile.Profile);
    const [user, setUser] = useState({
        fullName: "",
        numberPhone: "",
        address: "",
        email: "",
        _id: "",
    });

    useEffect(() => {
        if (profile) {
            setUser({
                fullName: profile.fullName || "",
                numberPhone: profile.numberPhone || "",
                address: profile.address || "",
                email: profile.email || "",
                _id: profile._id || "",
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/updateUser/${user._id}`,
                user,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            dispatch(setProfile(res.data));
            alert("Cập nhật thành công");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Cập nhật thất bại");
        }
    };

    if (!profile) {
        return navigate("/");
    }
    return (
        <>
            <Helmet>
                <title>Cập nhật thông tin | Hải Nam Mobile</title>
                <meta
                    name="description"
                    content="Cập nhật họ tên, số điện thoại và địa chỉ giao hàng của bạn tại Hải Nam Mobile."
                />
            </Helmet>
            <div className="edit-profile-container">
                <h2>Thông tin tài khoản</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullName"
                        value={user.fullName}
                        onChange={handleChange}
                        placeholder="Họ tên"
                    />
                    <input
                        type="text"
                        name="numberPhone"
                        value={user.numberPhone}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                    />
                    <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        placeholder="Địa chỉ"
                    />
                    <input type="text" value={user.email} disabled />
                    <button type="submit">Cập nhật</button>
                </form>
            </div>
        </>
    );
};

export default EditProfile;
