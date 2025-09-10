import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../sidebar/sideBar.jsx';
import "../../../css/admin/showOrderAdmin.css";
import UserCommentsPopup from './UserCommentsPopup.jsx';
import { toast } from 'react-toastify';

const AdminCommentsByUser = () => {
    const [commentsByUser, setCommentsByUser] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [filterName, setFilterName] = useState("");
    const [filterEmail, setFilterEmail] = useState("");


    const menuItems = [
        { label: "Tài khoản", path: "/admin/dashboard", icon: "person" },
        { label: "Sản phẩm", path: "/admin/products", icon: "inventory_2" },
        { label: "Đơn hàng", path: "/admin/orders", icon: "receipt_long" },
        { label: "Khuyến mãi", path: "/admin/promotions", icon: "local_offer" },
        { label: "Bình luận", path: "/admin/comments", icon: "chat" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin-login");
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/comments/groupByUser`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCommentsByUser(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy bình luận:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);


    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCommentsByUser(prev => {
                const newCommentsByUser = { ...prev };
                for (const userId in newCommentsByUser) {
                    newCommentsByUser[userId].comments = newCommentsByUser[userId].comments.filter(c => c._id !== commentId);
                }
                return newCommentsByUser;
            });
            toast.success("Xóa bình luận thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa bình luận:", error);
            toast.error("Xóa bình luận thất bại!");
        }
    };


    if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;

    return (
        <>
            <SideBar menuItems={menuItems} onLogout={handleLogout} />
            <link
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet"
            />
            <div className="showOrders">
                <h2>Quản lý bình luận khách hàng</h2>
                <table className="tableShowOrders">
                    <thead>
                        <tr>
                            <th>Khách hàng <br />
                                <input
                                    type="text"
                                    placeholder="Lọc theo tên khách hàng..."
                                    value={filterName}
                                    onChange={(e) => setFilterName(e.target.value)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                        width: "250px",
                                        fontSize: "16px",
                                    }}
                                /></th>
                            <th>Email<br />
                                <input
                                    type="text"
                                    placeholder="Lọc theo email..."
                                    value={filterEmail}
                                    onChange={(e) => setFilterEmail(e.target.value)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                        width: "250px",
                                        fontSize: "16px",
                                    }}
                                />
                            </th>
                            <th>Số bình luận</th>
                            <th><span className="material-icons">settings</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(commentsByUser).map(([userId, userData]) => (
                            <tr key={userId}>
                                <td>{userData.user.fullName}</td>
                                <td>{userData.user.email}</td>
                                <td>{userData.comments.length}</td>
                                <td>
                                    <button
                                        className="btn-detail"
                                        onClick={() => setSelectedUserData(userData)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUserData && (
                <UserCommentsPopup
                    userData={selectedUserData}
                    onClose={() => setSelectedUserData(null)}
                    onDelete={handleDeleteComment}
                />
            )}
        </>
    );
};
export default AdminCommentsByUser;
