import axios from "axios";
import AdminMenu from "../adminMenu/AdminMenu";
import { MdOutlineEmail } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { FaAngleLeft } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineVpnKeyOff } from "react-icons/md";
import { BiDetail } from "react-icons/bi";

const StoreDetail = () => {
  const { detail_id } = useParams();
  const [store_detail, setStore_detail] = useState([]);

  useEffect(() => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8000/store/stores/11',
        headers: { }
      };
      
      axios.request(config)
      .then((response) => {
        console.log("Hello Store=>>>>>>>>>>",response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <AdminMenu />
      <section id="addAmin">
        <div className="goback">
          <Link to="/store-admin" className="box_guopIconbAck">
            <FaAngleLeft id="box_icon_Back" />
            <p>Back</p>
          </Link>
        </div>
        <div className="box_addAdmin">
          <form>
            <div className="addAdminForm">
              {store_detail ? (
                <>
                  <div className="boxhead_subminandtitle">
                    <h2 className="titleaddmin">Detail store</h2>
                    <div>
                      <Link to="" className="submit">
                        Edit
                      </Link>
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="store" className="titlelabel">
                      Store name:
                    </label>
                    <div className="boxiconnandinput">
                      <LuUser className="iconinput" />
                      <div className="input">{store_detail.name}</div>
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="location:" className="titlelabel">
                      Store location:
                    </label>
                    <div className="boxiconnandinput">
                      <CiLocationOn className="iconinput" />
                      <div className="input">{store_detail.address}</div>
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="phone:" className="titlelabel">
                      Phone number:
                    </label>
                    <div className="boxiconnandinput">
                      <FiPhone className="iconinput" />
                      <div className="input">{store_detail.phone}</div>
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="company:" className="titlelabel">
                      Company Registration Number:
                    </label>
                    <div className="boxiconnandinput">
                      <MdOutlineVpnKeyOff className="iconinput" />
                      <div className="input">{store_detail.company_number}</div>
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="address:" className="titlelabel">
                      Store detailed address:
                    </label>
                    <div className="boxiconnandinput">
                      <CiLocationOn className="iconinput" />
                      <div className="input">{store_detail.sub_address}</div>
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="introduce:" className="titlelabel">
                      Desc:
                    </label>
                    <div className="boxiconnandinput">
                      <BiDetail className="iconinput" />
                      <div className="input">{store_detail.introduce} </div>
                    </div>
                  </div>
                
                  {/* <div className="add-box">
                    <label htmlFor="adminImage" className="titlelabel">
                      Profile image:
                    </label>
                    <div className="boxiconnandinput">
                      <CiImageOn className="iconinput" />
                      <input
                        type="file"
                        className="input"
                      />
                    </div>
                  </div> */}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default StoreDetail;
