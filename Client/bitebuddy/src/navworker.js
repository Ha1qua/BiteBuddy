/* eslint-disable no-restricted-globals */

self.onmessage = function () {
  const navLinks = ["Home", "Login", "Chef", "TestCaseResult", "FAQ"];
  let delay = 2000;

  navLinks.forEach((link, index) => {
    setTimeout(() => {
      self.postMessage(link); // Send the link to the main thread
    }, delay * index);
  });
};
