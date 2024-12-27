import React from 'react';
import "./terms.css";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const Terms = () => {
  return (
    <>
      <div className="box_terms">
        <Link to="/more" className="box_iconBack_terms">
          <MdArrowBack id='iconBack_terms'/>
        </Link>
        <h2>Terms of Use</h2>
        <div className="container_terms">
          <p>Ex sint legimus prodesset vis, cum cu suas persequeris. 
          Eu qui essent option temporibus, aliquip adipiscing eu
          vel. Dicunt numquam torquatos an eos, utroque 
          rationibus at cum. An constituam scriptoreEx sint
          legimus prodesset vis, cum cu suas persequeris. Eu qui 
          essent option temporibus, aliquip adipiscing eu vel. 
          Dicunt numquam torquatos an eos, utroque rationibus
          at cum. An constituam scriptorem eoEx sint legimus
          prodesset vis, cum cu suas persequeris. Eu qui essent
          option temporibus, aliquip adipiscing eu vel. Dicunt
          numquam torquatos an eos, utroque rationibus at cum. 
          An constituam scriptorem eoEx sint legimus prodesset
          vis, cum cu suas persequeris. Eu qui essent option 
          temporibus, aliquip adipiscing eu vel. Dicunt numquam
          torquatos an eos, utroque rationibus at cum.</p>
        </div>
      </div>
    </>
  )
}

export default Terms