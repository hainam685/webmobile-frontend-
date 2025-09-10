import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeFromCartAsync } from "../../store/cart";
import "../../css/home/cartPreview.css";

const CartPreview = ({ onClose }) => {
  const cartItems = useSelector(state => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.price * item.quantity;
    return total + price;
  }, 0);


  const handleRemove = (productId, color, rom) => {
    dispatch(removeFromCartAsync({ productId, color, rom }));
  };

  const handleClickOpenCartPage = () => {
    navigate("/cart");
    onClose();
  };

  return (
    <div className="cart-preview">
      <h3>Giỏ hàng</h3>
      {cartItems.length === 0 ? (
        <>
          <div className="cart-empty">
            <svg className="svg-cart" width="81" height="70" viewBox="0 0 81 70"><g transform="translate(0 2)" strokeWidth="4" fill="none" fillRule="evenodd"><circle strokeLinecap="square" cx="34" cy="60" r="6"></circle><circle strokeLinecap="square" cx="67" cy="60" r="6"></circle><path d="M22.9360352 15h54.8070373l-4.3391876 30H30.3387146L19.6676025 0H.99560547"></path></g></svg>
          </div>
          <div className="no-item-cart">
            <span>Hiện chưa có sản phẩm nào</span>
          </div>
        </>
      ) : (
        <div>
          {cartItems.map(item => (
            <div className="product-in-cart" key={`${item.productId}-${item.color}`}>
              <img src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`} alt={item.name} />
              <p className="product-line">
                {item.name} / {item.color} / {item.rom} / SL: {item.quantity} / Giá: {(item.price).toLocaleString()}₫
              </p>
              <button className="btn-remove-to-cart" onClick={() => handleRemove(item.productId, item.color, item.rom)}>✖</button>
            </div>
          ))}
        </div>
      )
      }
      <div className="total-price-tr">
        <span className="total-price-text">TỔNG TIỀN:</span>
        <span className="total-price-number">{totalPrice.toLocaleString()}₫</span>
      </div>
      <button className="show-cart-page" onClick={handleClickOpenCartPage}>Xem giỏ hàng</button>
    </div >
  );
};

export default CartPreview;
