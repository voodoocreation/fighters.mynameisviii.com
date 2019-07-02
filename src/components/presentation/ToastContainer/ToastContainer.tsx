import * as React from "react";

import NewVersionToast from "../../connected/NewVersionToast/NewVersionToast";

import "./ToastContainer.scss";

const ToastContainer: React.FC = () => (
  <section className="ToastContainer">
    <NewVersionToast />
  </section>
);

export default ToastContainer;
