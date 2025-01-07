import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Testcase.css"; // Import the CSS file

const Testcase = () => {
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    axios
      .get("https://bitebuddy-3.onrender.com/api/testcases")
      .then((response) => {
        setTestCases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching test cases:", error);
      });
  }, []);

  return (
    <div className="testcase-container">
      <h1 className="testcase-heading">Test Case Results</h1>
      <table className="testcase-table">
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Result</th>
            <th>Test Time</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase) => (
            <tr key={testCase.id}>
              <td>{testCase.test_name}</td>
              <td
                className={
                  testCase.result
                    ? "testcase-result-passed"
                    : "testcase-result-failed"
                }
              >
                {testCase.result ? "Passed" : "Failed"}
              </td>
              <td>{new Date(testCase.test_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Testcase;
