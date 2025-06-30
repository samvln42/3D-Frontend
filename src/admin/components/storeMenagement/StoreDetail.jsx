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
import { FaPencilAlt } from "react-icons/fa";
import { FaStore } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

const StoreDetail = () => {
  const { detail_id } = useParams();
  const [store_detail, setStore_detail] = useState([]);
  const [is3dMode, setIs3dMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // get store detail
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_API}/store/${detail_id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setStore_detail(result))
      .catch((error) => console.error(error));
  }, [detail_id]);

  // get 3d mode
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_API}/store/${detail_id}/mode-3d`, requestOptions)
      .then((response) => response.json())
      .then((result) => setIs3dMode(result.is_enabled))
      .catch((error) => console.error(error));
  }, [detail_id]);

  // edit store detail
  const [isEdit, setIsEdit] = useState(false);
  const [editField, setEditField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore_detail(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEdit = (field) => {
    if (isEdit && editField) {
      setStore_detail(prevState => {
        if (originalData) {
          return {
            ...prevState,
            [editField]: originalData[editField]
          };
        }
        return prevState;
      });
    }
    
    if (!isEdit || field !== editField) {
      setOriginalData(store_detail);
    }
    
    setIsEdit(!isEdit);
    setEditField(field);
  };

  useEffect(() => {
    if (isEdit === false) {
      setEditField(null);
      if (originalData && editField) {
        setStore_detail(prevState => ({
          ...prevState,
          [editField]: originalData[editField]
        }));
      }
    }
  }, [isEdit]);

  const handleSave = (e) => {
    e.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);

    const formdata = new FormData();
    formdata.append(editField, store_detail[editField]);

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_API}/store/${detail_id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setIsEdit(false);
        setEditField(null);
        setEditValue(null);
      })
      .catch((error) => console.error(error));
  }

  const handle3dMode = () => {
    setIs3dMode(!is3dMode);
    setTimeout(() => {
      save3dMode(!is3dMode);
    }, 0);
  }

  const save3dMode = (newMode) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem('token')}`);

    const formdata = new FormData();
    formdata.append("is_enabled", newMode ? "true" : "false");

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_API}/store/${detail_id}/mode-3d`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

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
                    <div className="box_3d_mode">
                      <label htmlFor="3d_mode">enable 3D mode</label>
                      <input
                        type="checkbox"
                        id="3d_mode"
                        className="input_3d_mode"
                        onChange={handle3dMode}
                        checked={is3dMode}
                      />
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="store" className="titlelabel">
                      Email:
                    </label>
                    <div className="boxiconnandinput">
                      <MdOutlineEmail className="iconinput" />
                      <div className="input">{store_detail.email}</div>
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="store" className="titlelabel">
                      Store name:
                    </label>
                    <div className="boxiconnandinput">
                      <FaStore className="iconinput" />
                      <div className="input">
                        {isEdit && editField === 'name' ?
                          <input
                            type="text"
                            name="name"
                            value={store_detail.name}
                            className="input"
                            onChange={(e) => handleChange(e)}
                          />
                          : store_detail.name}
                        <FaPencilAlt
                          className="icon_edit"
                          onClick={() => handleEdit('name')}
                        />
                        {isEdit && editField === 'name' && <FaCheck className="icon_check" onClick={handleSave} />}
                      </div>
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="location:" className="titlelabel">
                      Store location:
                    </label>
                    <div className="boxiconnandinput">
                      <CiLocationOn className="iconinput" />
                      <div className="input">
                        {isEdit && editField === 'address' ?
                          <input
                            type="text"
                            name="address"
                            value={store_detail.address}
                            className="input"
                            onChange={(e) => handleChange(e)}
                          /> : store_detail.address}
                        <FaPencilAlt
                          className="icon_edit"
                          onClick={() => handleEdit('address')}
                        /> {isEdit && editField === 'address' && <FaCheck className="icon_check" onClick={handleSave} />}
                      </div>
                    </div>
                  </div>

                  <div className="add-box">
                    <label htmlFor="phone:" className="titlelabel">
                      Phone number:
                    </label>
                    <div className="boxiconnandinput">
                      <FiPhone className="iconinput" />
                      <div className="input">
                        {isEdit && editField === 'phone' ?
                          <input
                            type="text"
                            name="phone"
                            value={store_detail.phone}
                            className="input"
                            onChange={(e) => handleChange(e)}
                          /> : store_detail.phone}
                        <FaPencilAlt
                          className="icon_edit"
                          onClick={() => handleEdit('phone')}
                        /> {isEdit && editField === 'phone' && <FaCheck className="icon_check" onClick={handleSave} />}
                      </div>
                    </div>
                  </div>

                  {/* <div className="add-box">
                    <label htmlFor="company:" className="titlelabel">
                      Company Registration Number:
                    </label>
                    <div className="boxiconnandinput">
                      <MdOutlineVpnKeyOff className="iconinput" />
                      <div className="input">{store_detail.company_number}</div>
                    </div>
                  </div> */}

                  {/* <div className="add-box">
                    <label htmlFor="address:" className="titlelabel">
                      Store detailed address:
                    </label>
                    <div className="boxiconnandinput">
                      <CiLocationOn className="iconinput" />
                      <div className="input">{store_detail.sub_address}</div>
                    </div>
                  </div> */}

                  <div className="add-box">
                    <label htmlFor="introduce:" className="titlelabel">
                      Desc:
                    </label>
                    <div className="boxiconnandinput">
                      <BiDetail className="iconinput" />
                      <div className="input">
                        {isEdit && editField === 'introduce' ?
                          <input
                            type="text"
                            name="introduce"
                            value={store_detail.introduce}
                            className="input"
                            onChange={(e) => handleChange(e)}
                          /> : store_detail.introduce}
                        <FaPencilAlt
                          className="icon_edit"
                          onClick={() => handleEdit('introduce')}
                        /> {isEdit && editField === 'introduce' && <FaCheck className="icon_check" onClick={handleSave} />}
                      </div>
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
