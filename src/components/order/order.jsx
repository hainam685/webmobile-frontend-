import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCartAsync } from "../../store/cart";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const hasVerifiedRef = useRef(false); 


  useEffect(() => {
    if (hasVerifiedRef.current) return;
    const queryParams = new URLSearchParams(location.search);
    const vnp_TxnRef = queryParams.get("vnp_TxnRef");

    if (vnp_TxnRef) {
      setOrderId(vnp_TxnRef);
      hasVerifiedRef.current = true;
      const queryObj = {};
      queryParams.forEach((value, key) => {
        queryObj[key] = value;
      });
      const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
      if (vnp_ResponseCode !== "00") {
        setMessage("Thanh toán không thành công hoặc bị hủy!");
        return;
      };

      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/order/${vnp_TxnRef}?${location.search.slice(1)}`)
        .then((res) => {
          console.log("Thanh toán thành công:", res.data);
          dispatch(clearCartAsync());
          setMessage(res.data.message || "Đã lưu đơn hàng thành công");
        })
        .catch((err) => {
          console.error("Lỗi khi xác thực đơn hàng:", err);
          setMessage("Đã xảy ra lỗi khi xác thực đơn hàng!");
        });
    }
  }, [location.search]);

  return (
    <div>
      <h2>{message && <p>{message}</p>}</h2>
      {orderId && <p>Mã đơn hàng: {orderId}</p>}
      <p onClick={() => navigate("/orderOfUser")} style={{ cursor: "pointer" }}>xem đơn hàng của bạn</p>
    </div>
  );
};

export default PaymentSuccess;
