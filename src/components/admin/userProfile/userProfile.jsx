import { useEffect, useState } from 'react';
import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setProfile } from '../../../store/user.js';
import { useSelector, useDispatch } from "react-redux";
import SideBar from "../../sidebar/sideBar.jsx";
import AddProfile from './add.jsx';
import UpdateProfile from './update.jsx';
import "../../../css/admin/indexAdmin.css";
import usePagination from '../../../hook/usePagination.js';
import { toast } from 'react-toastify';


const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(null);
    const userProfile = useSelector((state) => state.profile.Profile);
    const [loading, setLoading] = useState(true);
    const [emailFilter, setEmailFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");

    const menuItems = [
        { label: "Tài khoản", path: "/admin/dashboard", icon: "person" },
        { label: "Sản phẩm", path: "/admin/products", icon: "inventory_2" },
        { label: "Đơn hàng", path: "/admin/orders", icon: "receipt_long" },
        { label: "Khuyến mãi", path: "/admin/promotions", icon: "local_offer" },
        { label: "Bình luận", path: "/admin/comments", icon: "chat" },
    ];

    const itemsPerPage = 10;

    const filteredUsers = Array.isArray(userProfile)
        ? userProfile.filter((user) =>
            user.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
            user.fullName.toLowerCase().includes(nameFilter.toLowerCase()))
        : [];

    const {
        currentPage,
        totalPages,
        setCurrentPage,
        currentData: currentUsers
    } = usePagination(filteredUsers, itemsPerPage);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin-login");
    };

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/admin-login");
                return;
            }

            try {
                await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/admin/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                navigate("/admin-login");
            }
        };

        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getUser`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                dispatch(setProfile(response.data));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                setLoading(false);
            });
    }, []);

    const toggleLock = (id, currentStatus) => {
        const confirmText = currentStatus
            ? "Bạn có chắc chắn muốn mở khóa tài khoản này?"
            : "Bạn có chắc chắn muốn khóa tài khoản này?";
        if (!window.confirm(confirmText)) return;

        axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/toggleLockUser/${id}`, {
            isLocked: !currentStatus
        })
            .then(() => {
                const updatedList = userProfile.map((user) =>
                    user._id === id ? { ...user, isLocked: !currentStatus } : user
                );
                dispatch(setProfile(updatedList));
                toast.success("Đã khóa/mở khóa tài khoản thành công!");
            })
            .catch((error) => {console.error('Lỗi khi khóa/mở khóa user:', error);
                toast.error("Thất bại khi khóa/mở khóa tài khoản!")
            });
    };

    const toggleRole = (id, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!window.confirm(`Bạn có chắc muốn chuyển quyền thành ${newRole}?`)) return;

        axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/toggleUserRole/${id}`, {
            role: newRole
        })
            .then(() => {
                const updatedList = userProfile.map((user) =>
                    user._id === id ? { ...user, role: newRole } : user
                );
                dispatch(setProfile(updatedList));
                toast.success(`Chuyển quyền ${newRole} cho tài khoản!`);
            })
            .catch((error) => {console.error('Lỗi khi thay đổi role:', error);
                toast.error("Chuyển quyền thất bại!");
            });
    };

    function deleteUser(id) {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?");
        if (!confirmDelete) return;

        axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/deleteUser/${id}`)
            .then(() => {
                const deleteUser = userProfile.filter((user) => user._id !== id);
                dispatch(setProfile(deleteUser));
                toast.success("Xóa tài khoản thành công!");
            })
            .catch((error) => { console.error('Error deleting User:', error);
                toast.error("Xóa tài khoản thất bại!")
            });
    }

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <SideBar menuItems={menuItems} onLogout={handleLogout} />
            <div className='showUserProfilesList'>
                {isAddFormOpen && <AddProfile onClose={() => setIsAddFormOpen(false)} />}
                {isEditFormOpen && <UpdateProfile profileData={isEditFormOpen} onClose={() => setIsEditFormOpen(null)} />}
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                <h2 className='head'>Danh sách tài khoản</h2>
                <div className="btn-container">
                    <button className='btnShowAddForm' onClick={() => setIsAddFormOpen(true)}>
                        <span className="material-icons">add</span>
                    </button>
                </div>

                <table className='tableUserProfileList'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>
                                <div className="column-header">
                                    <span>Email</span>
                                    <input
                                        type="text"
                                        placeholder="Lọc email..."
                                        value={emailFilter}
                                        onChange={(e) => setEmailFilter(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="column-header">
                                    <span>Họ và tên</span>
                                    <input
                                        type="text"
                                        placeholder="Lọc tên..."
                                        value={nameFilter}
                                        onChange={(e) => setNameFilter(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                            <th>Loại</th>
                            <th><span className="material-icons">settings</span></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            currentUsers.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{user.email}</td>
                                    <td>{user.fullName}</td>
                                    <td>{user.address}</td>
                                    <td>{user.numberPhone}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button
                                            className='btnEdit'
                                            id='btnEdit' onClick={() => setIsEditFormOpen(user)}>
                                            <span className="material-icons">edit</span>
                                        </button>
                                        <button
                                            className='btnLock'
                                            id='btnLock'
                                            onClick={() => toggleLock(user._id, user.isLocked)}
                                            title={user.isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                                        >
                                            <span className="material-icons">
                                                {user.isLocked ? "lock_open" : "lock"}
                                            </span>
                                        </button>
                                        <button
                                            className='btnRole'
                                            id='btnRole'
                                            onClick={() => toggleRole(user._id, user.role)}
                                            title="Chuyển quyền"
                                        >
                                            <span className="material-icons">admin_panel_settings</span>
                                        </button>
                                        <button
                                            className='btnDelete'
                                            id='btnDelete' onClick={() => deleteUser(user._id)}>
                                            <span className="material-icons">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <div className="paginationAdmin">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={currentPage === i + 1 ? "active-page" : ""}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div >
        </>
    );
};

export default AdminDashboard;
