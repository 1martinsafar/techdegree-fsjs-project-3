"use strict";

// Setting focus on the first text field
const firstTextField = document.querySelector("input[type='text']");
firstTextField.focus();


const jobOptions = document.querySelector("#title")
const otherJob = document.querySelector("option[value='other']");

jobOptions.addEventListener("change", e => {
  if (e.target.value === "other") {
    const otherTextField = "<input type='text' id='other-title' name='other_job' placeholder='Your Job Role'>";
    jobOptions.insertAdjacentHTML("afterend", otherTextField);
  }
});
