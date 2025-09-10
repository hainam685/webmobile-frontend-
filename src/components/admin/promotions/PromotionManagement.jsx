import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import CreatePromotion from "./createPromotions.jsx";
import SideBar from "../../sidebar/sideBar.jsx";
import usePagination from "../../../hook/usePagination.js";


const PromotionManagement = () => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]);
    const [isPromotionsOpen, setIsPromotionsOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const menuItems = [
        { label: "Tài khoản", path: "/admin/dashboard", icon: "person" },
        { label: "Sản phẩm", path: "/admin/products", icon: "inventory_2" },
        { label: "Đơn hàng", path: "/admin/orders", icon: "receipt_long" },
        { label: "Khuyến mãi", path: "/admin/promotions", icon: "local_offer" },
        { label: "Bình luận", path: "/admin/comments", icon: "chat" },
    ];

    const itemsPerPage = 10;
    const filteredPromotions = promotions.filter(promo =>
        promo.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        promo.applicableCategories.some(category =>
            category.toLowerCase().includes(categoryFilter.toLowerCase())
        )

    );


    const {
        currentPage,
        totalPages,
        setCurrentPage,
        currentData: currentPromotions,
    } = usePagination(filteredPromotions, itemsPerPage);


    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/promotions`);
            setPromotions(res.data.promotion);
        } catch (error) {
            console.error("Lỗi tải khuyến mãi:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin-login");
    };

    return (
        <>
            <SideBar menuItems={menuItems} onLogout={handleLogout} />
            {isPromotionsOpen && <CreatePromotion onClose={() => setIsPromotionsOpen(false)} />}
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            <div className="showOrders">
                <h2>Quản lý khuyến mãi</h2>
                <div className="btn-container">
                    <button
                        className='btnShowPromotionForm'
                        onClick={() => setIsPromotionsOpen(true)}
                        style={{ backgroundColor: "#007bff", color: "#fff" }}
                    >
                        Thêm khuyến mãi
                    </button>
                </div>
                <table className="tableShowOrders">
                    <thead>
                        <tr>
                            <th>
                                Tên chương trình <br />
                                <input
                                    type="text"
                                    placeholder="Lọc theo tên chương trình..."
                                    value={nameFilter}
                                    onChange={e => setNameFilter(e.target.value)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                        width: "250px",
                                        fontSize: "16px",
                                    }}
                                />
                            </th>
                            <th>Phần trăm giảm</th>
                            <th>
                                Loại sản phẩm được giảm <br />
                                <input
                                    type="text"
                                    placeholder="Lọc theo loại sản phẩm..."
                                    value={categoryFilter}
                                    onChange={e => setCategoryFilter(e.target.value)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                        width: "250px",
                                        fontSize: "16px",
                                    }}
                                />
                            </th>
                            <th>Ngày kết thúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPromotions.map((promo) => (
                            <tr key={promo._id} className="text-center border-t">
                                <td >{promo.name}</td>
                                <td >{promo.discountPercent}%</td>
                                <td>{promo.applicableCategories}</td>
                                <td >{new Date(promo.endDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
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
            </div>
        </>
    );
};

export default PromotionManagement;
