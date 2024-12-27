import "./homePage.css";
import Header from "../header/Header";
import Menu from "../menuFooter/Menu";
import Banner from "../header/Banner";
import ProductHome from "../products/ProductHome";
import Category from "./Category";

const HomePage = () => {

  return (
    <div>
      <Header />
      <Banner />
      {/* <Category /> */}
      <ProductHome />
      <Menu />
    </div>
  );
};

export default HomePage;
