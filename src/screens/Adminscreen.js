import React from "react";
import { dashboardItems, dashboardModeItems } from "../data";
import { Card, Col, Row } from "antd";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAuthContext } from "../contexts/AuthContext";
import { lowerCase } from "../utils";

function Adminscreen() {
  const {
    authState: { user },
  } = useAuthContext();

  const isModerator = lowerCase(user.role) === "moderator" ? true : false;
  const content1 = dashboardItems.map((d) => (
    <Col span={8} key={d.name}>
      <Card
        title={d.name}
        extra={
          <Link to={`${d.link}`}>
            <button className="btn btn-success">&rarr;</button>
          </Link>
        }
      >
        <p>{d.subTitle}</p>
      </Card>
    </Col>
  ));
  const content2 = dashboardModeItems.map((d) => (
    <Col span={8} key={d.name}>
      <Card
        title={d.name}
        extra={
          <Link to={`${d.link}`}>
            <button className="btn btn-success">&rarr;</button>
          </Link>
        }
      >
        <p>{d.subTitle}</p>
      </Card>
    </Col>
  ));
  return (
    <div className="wrapper">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <div className="top-header">
        <h1 className="text-center pt-5 text-white adminText">
          <strong>Admin Dashboard</strong>
        </h1>
      </div>

      <div className="content-body site-card-wrapper">
        <div className="container-fluid">
          <Row gutter={[16, 16]}>{isModerator ? content2 : content1}</Row>
        </div>
      </div>
    </div>
  );
}
export default Adminscreen;
