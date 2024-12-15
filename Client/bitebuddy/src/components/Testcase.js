import React, { useState, useEffect } from "react";
import axios from "axios";

const Testcase = () => {
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    // Fetch test case data from the backend
    axios
      .get("http://localhost:5000/api/testcases") // Make sure this matches your backend URL
      .then((response) => {
        setTestCases(response.data); // Update the state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching test cases:", error);
      });
  }, []); // Empty array ensures the effect runs once when the component mounts

  return (
    <div>
      <h1>Test Case Results</h1>
      <table>
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
              <td>{testCase.result ? "Passed" : "Failed"}</td>
              <td>{new Date(testCase.test_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Testcase;
