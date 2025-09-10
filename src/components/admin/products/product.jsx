import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setProduct } from "../../../store/product.js";
import SideBar from "../../sidebar/sideBar.jsx";
import AddProduct from "./add.jsx";
import UpdateProduct from "./update.jsx";
import "../../../css/admin/product.css";
import usePagination from "../../../hook/usePagination.js";
import { toast } from 'react-toastify';


const ProductList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const product = useSelector((state) => state.product.Product);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(null);

    const [filters, setFilters] = useState({
        name: "",
        category: "",
        color: "",
        rom: "",
        isDiscount: ""
    });

    const flatProductList = product.flatMap((p) =>
        p.roms.flatMap((rom) =>
            rom.variants.map((variant) => ({
                _id: p._id,
                name: p.name,
                category: p.category,
                rom: rom.rom,
                price: rom.price,
                isDiscount: rom.isDiscount,
                discountPrice: rom.discountPrice,
                color: variant.color,
                image: variant.image,
                quantity: variant.quantity,
                sold: variant.sold,
            }))
        )
    );

    const filteredData = flatProductList.filter(item => {
        return (
            item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
            item.category.toLowerCase().includes(filters.category.toLowerCase()) &&
            item.color.toLowerCase().includes(filters.color.toLowerCase()) &&
            item.rom.toLowerCase().includes(filters.rom.toLowerCase()) &&
            (filters.isDiscount === ""
                || (filters.isDiscount === "true" && item.isDiscount)
                || (filters.isDiscount === "false" && !item.isDiscount))
        );
    });

    const {
        currentPage,
        totalPages,
        setCurrentPage,
        currentData
    } = usePagination(filteredData, 10);

    const menuItems = [
        { label: "Tài khoản", path: "/admin/dashboard", icon: "person" },
        { label: "Sản phẩm", path: "/admin/products", icon: "inventory_2" },
        { label: "Đơn hàng", path: "/admin/orders", icon: "receipt_long" },
        { label: "Khuyến mãi", path: "/admin/promotions", icon: "local_offer" },
        { label: "Bình luận", path: "/admin/comments", icon: "chat" },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getProduct`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                dispatch(setProduct(response.data));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                setLoading(false);
            });
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin-login");
    };

    function deleteProduct(productId, rom, color) {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
        if (!confirmDelete) {
            return;
        }
        axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}/rom/${rom}/variant/${color}`)
            .then(() => {
                const updatedProduct = product.filter((p) => p._id !== productId);
                dispatch(setProduct(updatedProduct));
                toast.success("Đã xóa sản phẩm thành công!");
            })
            .catch((error) => {console.error('Error deleting product:', error);
                toast.error("Xóa sản phẩm thất bại!", error)
            });
    }

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <SideBar menuItems={menuItems} onLogout={handleLogout} />
            <div className="showProductList">
                {isAddOpen && <AddProduct onClose={() => setIsAddOpen(false)} />}
                {isUpdateOpen && <UpdateProduct productData={isUpdateOpen} onClose={() => setIsUpdateOpen(null)} />}
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
                <h2>Danh sách sản phẩm</h2>
                <div className="btn-container">
                    <button className='btnShowAddForm' onClick={() => setIsAddOpen(true)}><span className="material-icons">add</span></button>
                </div>
                <table className='tableProductList'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>
                                Tên sản phẩm<br />
                                <input
                                    type="text"
                                    placeholder="Tìm tên"
                                    value={filters.name}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                    className="filter-input"
                                />
                            </th>
                            <th>
                                Loại<br />
                                <input
                                    type="text"
                                    placeholder="Tìm loại"
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    className="filter-input"
                                />
                            </th>
                            <th>
                                Màu<br />
                                <input
                                    type="text"
                                    placeholder="Tìm màu"
                                    value={filters.color}
                                    onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                                    className="filter-input"
                                />
                            </th>
                            <th>
                                ROM<br />
                                <select
                                    value={filters.rom}
                                    onChange={(e) => setFilters({ ...filters, rom: e.target.value })}
                                    className="filter-input"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="64GB">64GB</option>
                                    <option value="128GB">128GB</option>
                                    <option value="256GB">256GB</option>
                                    <option value="512GB">512GB</option>
                                    <option value="1T">1T</option>
                                </select>
                            </th>
                            <th>Ảnh</th>
                            <th>Giá</th>
                            <th>
                                Khuyến mãi?<br />
                                <select
                                    value={filters.isDiscount}
                                    onChange={(e) => setFilters({ ...filters, isDiscount: e.target.value })}
                                    className="filter-input"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="true">Có</option>
                                    <option value="false">Không</option>
                                </select>
                            </th>
                            <th>Số lượng</th>
                            <th>Đã bán</th>
                            <th><span className="material-icons">settings</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={`${item._id}-${item.rom}-${item.color}`}>
                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.color}</td>
                                <td>{item.rom}</td>
                                <td><img src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`} width={50} alt={item.color} /></td>
                                <td>{item.price.toLocaleString()}đ</td>
                                <td>
                                    {item.isDiscount
                                        ? `${(item.price - item.discountPrice).toLocaleString()}đ`
                                        : "Không có"}
                                </td>
                                <td>{item.quantity}</td>
                                <td>{item.sold}</td>
                                <td>
                                    <button
                                        className="btnEditProduct"
                                        id='btnEdit' onClick={() => setIsUpdateOpen(item)}>
                                        <span className="material-icons">edit</span>
                                    </button>
                                    <button 
                                        className="btnDeleteProduct"
                                        id='btnDelete' onClick={() => deleteProduct(item._id, item.rom, item.color)}>
                                        <span className="material-icons">delete</span>
                                    </button>
                                </td>
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

export default ProductList;
