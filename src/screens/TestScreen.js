import React from "react";
import { testLink1234, testLink4321 } from "../libs/auth";
import { Button } from "antd";


function TestScreen() {
  const testLink1 = async (e) => {
    e.preventDefault();
    try {
      await testLink1234();
    } catch (error) {}
  };

  const testLink2 = async (e) => {
    e.preventDefault();
    try {
      await testLink4321();
    } catch (error) {}
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-6">
          <Button type="info" onClick={(e) => testLink1(e)}>
            Test 1234
          </Button>
        </div>
        <div className="col-lg-6">
          <Button type="primary" onClick={(e) => testLink2(e)}>
            Test 4321
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TestScreen;
