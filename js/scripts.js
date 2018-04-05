"use strict";

// Setting focus on the first text field
const firstTextField = document.querySelector("input[type='text']");
firstTextField.focus();

// Showing new text field when "other" job role is selected
const jobSelect = document.querySelector("#title")

jobSelect.addEventListener("change", e => {
  const otherTextField = document.querySelector("#other-title");
  if (otherTextField) {
    otherTextField.remove();
  }
  else if (e.target.value === "other" && !otherTextField) {
    console.log("Adding the field");
    const otherTextField = "<input type='text' id='other-title' name='other_job' placeholder='Your Job Role'>";
    jobSelect.insertAdjacentHTML("afterend", otherTextField);
  }
});

// Only displaying the color options that match the design
// selected in the "Design" menu
const designSelect = document.querySelector("#design")
const colorOptions = document.querySelectorAll("#color option");

designSelect.addEventListener("change", e => {
  const theme = e.target.value;
  let re;
  if (theme === "js puns") {
    re = /JS Puns shirt only/;
  } else {
    re = /I ♥ JS shirt only/;
  }
  colorOptions.forEach(color => {
    const colorInfo = color.textContent;
    const match = re.test(colorInfo);
    color.removeAttribute("selected");
    if (match) {
      color.style.display = "block";
    } else {
      color.style.display = "none";
    }
  });
  const firstMatch = document.querySelector('#color option[style="display: block;"]');
  firstMatch.setAttribute("selected", true);
});

// As a user selects activities, a running total displays
// below the list of checkboxes
const activityField = document.querySelector(".activities")
const activityOptions = document.querySelectorAll(".activities input");
console.log(activityField);
console.log(activityOptions);

let total = 0;

activityField.addEventListener("change", e => {
  const activity = e.target;
  if (activity.name === "all") {
    if (activity.checked) {
      total += 200;
    } else {
      total -= 200;
    }
  }
  else {
    if (activity.checked) {
      total += 100;
    } else {
      total -= 100;
    }
  }

  let totalHTML = document.querySelector("span.total");
  if (totalHTML) {
    totalHTML.remove();
  }
  totalHTML = `<span class="total">${total}</span>`;
  activityField.insertAdjacentHTML("afterend", totalHTML);
});




















//
