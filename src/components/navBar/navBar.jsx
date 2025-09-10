import { FaSearch, FaUser, FaCaretDown } from "react-icons/fa";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "../../store/user.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Login from "../login-reg/login.jsx";
import "../../css/nav-sideBar/navBar.css";
import CartPreview from "../cart/cartPreview.jsx";

const NavBar = ({ profile }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const cartItems = useSelector(state => state.cart.items);
    const [showCartPreview, setShowCartPreview] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userProfile");
        dispatch(setProfile(null));
        navigate("/");
    };

    useEffect(() => {
        setShowDropdown(false);
    }, [location.pathname]);


    const handleCartPreviewClose = () => setShowCartPreview(false);
    const handleLoginFromClose = () => setShowLogin(false);

    const handleShowCartPreview = () => {
        setShowCartPreview(prev => !prev);
        setShowDropdown(false);
        setShowLogin(false);
    }

    const handleLoginFormOpen = () => {
        setShowLogin(true);
        setShowCartPreview(false);
    }

    const handleDropdownToggle = () => {
        setShowDropdown(prev => !prev);
        setShowCartPreview(false);
    };

    const handleOpenUserProfile = () => {
        navigate("/userProfile");
        setShowDropdown(false);
    }

    const handleOpenOrderByUser = () => {
        navigate("/orderOfUser");
        setShowDropdown(false);
    }

    const check = () => {
        if (!showLogin) {
            return handleLoginFormOpen();
        } else {
            return handleLoginFromClose();
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setShowCartPreview(false);
            setShowDropdown(false);
        }
    };


    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate("/")}>
                <img
                    src="/logo.png"
                    alt="Hải Nam Mobile"
                    style={{ cursor: "pointer" }}
                />
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />
                <button className="btnSearch" onClick={handleSearch}>
                    <FaSearch className="search-icon" />
                </button>
            </div>
            <div className="nav-icons">
                {showLogin && <Login onClose={handleLoginFromClose} />}
                {profile ? (
                    <div className="user-info" onClick={handleDropdownToggle}>
                        <span>{profile.email}</span>
                        <span className="icon-dropdow">
                            <FaCaretDown />
                        </span>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <button onClick={handleOpenUserProfile}>Chỉnh sửa thông tin</button>
                                <button onClick={handleOpenOrderByUser}>đơn hàng đã đặt của bạn</button>
                                <button onClick={handleLogout}>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="btnShowFormLogin" onClick={check}>
                        <FaUser className="icon" />
                        <div className="login">
                            <span>Đăng nhập/Đăng ký</span>
                            <span>Tài khoản của tôi</span>
                        </div>
                    </button>
                )}
                <div className="cart-icon" onClick={handleShowCartPreview}>
                    <span className="icon-cart"></span>
                    <span className="cart-count">{cartItems.length}</span>
                </div>
                {showCartPreview && <CartPreview onClose={handleCartPreviewClose} />}
            </div>
        </nav>
    );
};

export default NavBar;
