import axios from "axios";
import AdminMenu from "../adminMenu/AdminMenu";
import { MdOutlineEmail } from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { FaAngleLeft } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineVpnKeyOff } from "react-icons/md";
import { BiDetail } from "react-icons/bi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const UpdateStore = () => {
  const MySwal = withReactContent(Swal);
  const { update_id: id } = useParams();
  const [name, set_name] = useState("");
  const [address, set_address] = useState("");
  const [phone, set_phone] = useState("");
  const [company_number, set_company_number] = useState("");
  const [sub_address, set_sub_address] = useState("");
  const [introduce, set_introduce] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_API + `/store/stores/${id}`,
        headers: { }
      };
      
      axios.request(config)
      .then((response) => {
        set_name(response.data.name)
        set_address(response.data.address)
        set_phone(response.data.phone)
        set_company_number(response.data.company_number)
        set_sub_address(response.data.sub_address)
        set_introduce(response.data.introduce)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id])


  const handleEditStore = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("address", address);
    data.append("phone", phone);
    data.append("company_number", company_number);
    data.append("sub_address", sub_address);
    data.append("introduce", introduce);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API + `/store/stores/${id}/update`,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        MySwal.fire({
          text: "Store information has been updated successfully.",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/store-admin');
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          <form onSubmit={handleEditStore}>
            <div className="addAdminForm">
              <div className="boxhead_subminandtitle">
                <h2 className="titleaddmin">Update store</h2>
                <div>
                  <button type="submit" className="submit">
                    Update
                  </button>
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="store" className="titlelabel">
                  Store name:
                </label>
                <div className="boxiconnandinput">
                  <LuUser className="iconinput" />
                  <input
                    type="text"
                    id="store"
                    className="input"
                    placeholder="Store name..."
                    value={name}
                    onChange={(e) => set_name(e.target.value)}
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="location:" className="titlelabel">
                  Store location:
                </label>
                <div className="boxiconnandinput">
                  <CiLocationOn className="iconinput" />
                  <input
                    type="text"
                    id="location"
                    className="input"
                    placeholder="Store location:..."
                    value={address}
                    onChange={(e) => set_address(e.target.value)}
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="phone:" className="titlelabel">
                  Phone number:
                </label>
                <div className="boxiconnandinput">
                  <FiPhone className="iconinput" />
                  <input
                    type="tel"
                    id="phone"
                    className="input"
                    placeholder="Phone number:..."
                    value={phone}
                    onChange={(e) => set_phone(e.target.value)}
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="company:" className="titlelabel">
                  Company Registration Number:
                </label>
                <div className="boxiconnandinput">
                  <MdOutlineVpnKeyOff className="iconinput" />
                  <input
                    type="text"
                    id="company"
                    className="input"
                    placeholder="Company Registration Number:..."
                    value={company_number}
                    onChange={(e) => set_company_number(e.target.value)}
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="address:" className="titlelabel">
                  Store detailed address:
                </label>
                <div className="boxiconnandinput">
                  <CiLocationOn className="iconinput" />
                  <input
                    type="text"
                    id="address"
                    className="input"
                    placeholder="Store detailed address:..."
                    value={sub_address}
                    onChange={(e) => set_sub_address(e.target.value)}
                  />
                </div>
              </div>

              <div className="add-box">
                <label htmlFor="address:" className="titlelabel">
                  Desc:
                </label>
                <div className="boxiconnandinput">
                  <BiDetail className="iconinput" />
                  <input
                    type="text"
                    id="Desc"
                    className="input"
                    placeholder="Desc:..."
                    value={introduce}
                    onChange={(e) => set_introduce(e.target.value)}
                  />
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
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateStore;
