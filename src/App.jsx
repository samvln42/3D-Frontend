import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./app.css";

//------ Login-SignUp Page ------//
import LoginUser from "./components/loginAndSignup/LoginUser";
import RegisterUser from "./components/loginAndSignup/RegisterUser";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import SigupGoogle from "./components/sigupforGoogle/SigupGoogle";

import Signup1 from "./components/loginAndSignup/Signup1";
import Signup2 from "./components/loginAndSignup/Signup2";
import ChangeSeller from "./components/loginAndSignup/ChangeSeller";
import AdditionalSeller from "./components/loginAndSignup/AdditionalSeller";

//------ Profile Page ------//
import ProfileEdit from "./components/profile/ProfileEdit";
import Terms from "./components/termsandprivacy/Terms";
import Privacy from "./components/termsandprivacy/Privacy";
import More from "./components/more/More";
import AddPoint from "./admin/components/products/AddPoint";

//------ Home Page ------//
import Home from "./components/homePage/HomePage";
import ProductDetails from "./components/products/ProductDetails";
import Cart from "./components/cart/Cart";
import SuccessfulBuy from "./components/cart/SuccessfulBuy";
import Chats from "./components/chat/Chats";
import ChatListPage from "./components/chat/ChatListPage";
import ChatRoomPage from "./components/chat/ChatRoomPage";

import Chat_Details from "./components/chat/Chat_Details";

import Address from "./components/cart/Address";
import Payment from "./components/cart/Payment";
import Order from "./components/order/Order";
import Bill from "./components/order/Bill";

import Contact from "./components/contact/Contact";
import Search from "./components/header/Search";

//------ Seller ------//
import Stores from "./components/seller/stores/Store";
import Store_management from "./components/seller/store_management/Store_management";
import AddProduct from "./components/seller/addProduct/AddProduct";
import EditProduct from "./components/seller/editProduct/EditProduct";
import ReviewStore from "./components/seller/reviewStore/ReviewStore";
// import Payment_store from "./components/seller/payment_store/PaymentStore";
// import AddPaymentStore from "./components/seller/payment_store/AddPaymentStore";
import Dashboard_seller from "./components/seller/stores/Dashboard_seller";
// import OrderStore from "./components/seller/orderStore/OrderStore";
import PendingOrder from "./components/seller/orderStore/PendingOrder";
import ProcessingOrder from "./components/seller/orderStore/ProcessingOrder";
import ShippedOrder from "./components/seller/orderStore/ShippedOrder";
import DeliveredOrder from "./components/seller/orderStore/DeliveredOrder";
import BillStore from "./components/seller/orderStore/BillStore";

//------ Admin ------//
import Dashboard from "./admin/Dashboard";
import Product_admin from "./admin/components/products/Product_Admin";
import Addproduct_admin from "./admin/components/products/AddProduct";
import Users from "./admin/components/menagerUser/Users";
import User_details from "./admin/components/menagerUser/User_details";
import OrderBill_Admin from "./admin/components/orderPage/OrderBill";
import Admins from "./admin/components/menagerAdmin/Admins";
import Add_Admin from "./admin/components/menagerAdmin/AddAdmin";
import StoreAdmin from "./admin/components/storeMenagement/StoreAdmin";
import Account_Admin from "./admin/components/accountAdmin/AccountAdmin";
import OrderPending from "./admin/components/orderPage/OrderPending";
import OrderProcess from "./admin/components/orderPage/OrderProcess";
import OrderShipped from "./admin/components/orderPage/OrderShipped";
import OrderDelivered from "./admin/components/orderPage/OrderDelivered";
import Payment_store from "./admin/components/payment_store/PaymentStore";
import AddPaymentStore from "./admin/components/payment_store/AddPaymentStore";
// import Edit_Admin from "./admin/components/menagerAdmin/EditAdmin";
// import Edit_Account from "./admin/components/accountAdmin/EditAccount";
import EditAdmin from "./admin/components/menagerAdmin/EditAdmin";
import AccountAdmin from "./admin/components/accountAdmin/AccountAdmin";
import { CartProvider } from "./components/cart/CartContext";
import Addcategory from "./admin/components/products/Addcategory";
import DeletePoint from "./admin/components/products/DeletePoint";
import StoreDetail from "./admin/components/storeMenagement/StoreDetail";
import UpdateStore from "./admin/components/storeMenagement/UpdateStore";

import P3D from "./components/products/P3D";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* --------- Login-Signup page---------- */}
          <Route path="/loginuser" Component={LoginUser} />
          <Route path="/registeruser" Component={RegisterUser} />
          <Route path="/forgotpassword" Component={ForgotPassword} />
          <Route path="/sigupgoogle" Component={SigupGoogle} />

          <Route path="/signup1" Component={Signup1} />
          <Route path="/signup" Component={Signup1} />
          <Route path="/signup2" Component={Signup2} />
          <Route path="/change-seller" Component={ChangeSeller} />
          <Route path="/additional-seller" Component={AdditionalSeller} />

          {/* --------- Profile page---------- */}
          <Route path="/profileedit" Component={ProfileEdit} />
          {/* <Route path="/profile" Component={Profile} /> */}
          {/* <Route path="/selleredit" Component={SellerEdit} /> */}
          <Route path="/more" Component={More} />
          <Route path="/terms" Component={Terms} />
          <Route path="/privacy" Component={Privacy} />

          <Route path="/contact" Component={Contact} />

          {/* --------- Home Page ---------- */}
          <Route path="/" exact Component={P3D} />
          {/* <Route path="/" exact Component={Home} /> */}
          <Route path="/goods/:goods_id" Component={ProductDetails} />

          <Route path="/cart" Component={Cart} />
          <Route path="/successfulbuy" Component={SuccessfulBuy} />
          <Route path="/address" Component={Address} />
          <Route path="/chats" Component={Chats} />
          <Route path="/chat-list" Component={ChatListPage} />
          <Route path="/chats-room" Component={ChatRoomPage} />

          <Route path="/chat-details" Component={Chat_Details} />

          <Route path="/payment" Component={Payment} />
          <Route path="/order" Component={Order} />
          <Route path="/bill/:bill_id" Component={Bill} />
          <Route path="/search" Component={Search} />
          {/* --------- Seller ---------- */}
          <Route path="/stores" Component={Stores} />
          <Route path="/store-management" Component={Store_management} />
          <Route path="/add-product" Component={AddProduct} />
          <Route path="/edit-product/:product_id" Component={EditProduct} />
          <Route path="/eview-store" Component={ReviewStore} />
          <Route path="/payment-store" Component={Payment_store} />
          <Route path="/add-payment-store" Component={AddPaymentStore} />
          <Route path="/dashboard-seller" Component={Dashboard_seller} />
          <Route path="/store_detail_edit/:detail_id" Component={StoreDetail} />
          <Route path="/update_store/:update_id" Component={UpdateStore} />
          {/* <Route path="/order-store" Component={OrderStore} /> */}
          <Route path="/order-pending" Component={PendingOrder} />
          <Route path="/order-processing" Component={ProcessingOrder} />
          <Route path="/order-shipped" Component={ShippedOrder} />
          <Route path="/order-delivered" Component={DeliveredOrder} />
          <Route path="/bill-store/:id" Component={BillStore} />

          {/* --------- Admin ---------- */}
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/product-admin" Component={Product_admin} />
          <Route path="/addproduct-admin" Component={Addproduct_admin} />
          <Route path="/users" Component={Users} />
          <Route path="/user-details/:id" Component={User_details} />
          <Route path="/orderbill-admin/:bill_id" Component={OrderBill_Admin} />
          <Route path="/admins" Component={Admins} />
          <Route path="/add-admin" Component={Add_Admin} />
          <Route path="/edit-admin/:id" Component={EditAdmin} />
          <Route path="/store-admin" Component={StoreAdmin} />
          <Route path="/account-admin" Component={Account_Admin} />
          <Route path="/edit-account" Component={AccountAdmin} />
          <Route path="/order/pending" Component={OrderPending} />
          <Route path="/order/processing" Component={OrderProcess} />
          <Route path="/order/shipped" Component={OrderShipped} />
          <Route path="/order/delivered" Component={OrderDelivered} />
          <Route path="/addcategory-admin" Component={Addcategory} />
          <Route path="/add_point" Component={AddPoint} />
          <Route path="/delete_point" Component={DeletePoint} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
export default App;
