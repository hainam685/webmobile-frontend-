import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import AdminLogin from './components/login-reg/logad.jsx';
import AdminDashboard from './components/admin/userProfile/userProfile.jsx';
import AdminOrdersByUser from './components/admin/order/order.jsx';
import ProductList from './components/admin/products/product.jsx';
import UserProfile from './components/userProfile/userProfile.jsx';
import CartPages from './components/cart/cartPage.jsx';
import PaymentSuccess from './components/order/order.jsx';
import OrderList from './components/order/showOrder.jsx';
import ProductDetailPage from './components/productDetails/productDetailPage.jsx';
import ProductListPage from './components/productCategory/productCategory.jsx';
import AppLayout from './components/applayout.jsx';
import PromotionManagement from './components/admin/promotions/PromotionManagement.jsx';
import AdminCommentsByUser from './components/admin/comment/comment.jsx';
import SearchResults from './components/searchResult/searchResult.jsx';
import RegisterForm from './components/login-reg/reg.jsx';
import AllDiscountedProducts from './components/discountedProducts/allDiscontedProduct.jsx';
import axios from 'axios';
import { setProfile } from "../src/store/user.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          dispatch(setProfile(response.data));
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/cart" element={<CartPages />} />
          <Route path="/paymentSuccess" element={<PaymentSuccess />} />
          <Route path="/orderOfUser" element={<OrderList />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/category/:category" element={<ProductListPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/discounts" element={<AllDiscountedProducts />} />
        </Route>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/orders" element={<AdminOrdersByUser />} />
        <Route path="/admin/promotions" element={<PromotionManagement />} />
        <Route path="/admin/comments" element={<AdminCommentsByUser />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  )
}

export default App
