import React from "react";
import { Modal } from "antd";
import FadeLoader from "react-spinners/FadeLoader";

const VerifyBookingModal = ({ isModalVisible }) => {
  return (
    <>
      <Modal
        title="Verifying Payment"
        visible={isModalVisible}
        centered
        footer={null}
      >
        <div className="container text-center ">
          <div className="row">
            <div className="col-md-12 mb-5">
              <p>Verifying payment, please wait...</p>
              <FadeLoader />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VerifyBookingModal;
