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

const activityField = document.querySelector(".activities")
const activityOptions = document.querySelectorAll(".activities input");
console.log(activityField);
console.log(activityOptions);

const getDate = () => {
  let options = document.querySelectorAll(".activities label");
  options = Array.from(options)
  options.shift();
  let dates = [];
  options.forEach(option => {
    const str = option.textContent
    const dayTimeCost = option.textContent.split("—")[1];
    const dayTime = dayTimeCost.split(",")[0].trim();
    dates.push({
      label: option,
      checkbox: option.firstElementChild,
      date: dayTime
    });
  });
  return dates;
};

let total = 0;
let datesSelected = [];
let datesDisabled = [];
let mainConference = false;

/* Activity Checkbox Events
      As a user selects activities, a running total displays
      below the list of checkboxes.
      Disable the dates that collide while
      keeping overlapping ones as a possibility.
*/
activityField.addEventListener("change", e => {
  const activity = e.target;
  const str = e.target.parentElement.textContent;
  const dayTimeCost = str.split("—")[1];
  const dayTime = dayTimeCost.split(",")[0].trim();

  if (activity.name === "all") {
    if (activity.checked) {
      total += 200;
      mainConference = true;
    } else {
      total -= 200;
      mainConference = false;
    }
  }
  else {
    // If checked, add the cost to total, add the date to datesSelected
    // Else remove the cost/date
    if (activity.checked) {
      total += 100;
      datesSelected.push(dayTime);
    } else {
      total -= 100;
      const index = datesSelected.indexOf(dayTime);
      if (index > -1) {
        datesSelected.splice(index, 1);
      }
      // If user unchecks date, remove it from datesDisabled if it's there
      let indexDisabled = -1;
      for (let i = 0; i < datesDisabled.length; i++) {
        const disabled = datesDisabled[i].date;
        if (disabled === dayTime) {
          indexDisabled = i;
          datesDisabled.splice(indexDisabled, 1);
          break;
        }
      }
    }
  }
  const dates = getDate();
  // If a date collides and has not been disabled yet, add it to the datesDisabled
  datesSelected.forEach(selected => {
    dates.forEach(date => {
      if (date.date === selected && !date.checkbox.checked) {
        let exists = false;
        for (let i = 0; i < datesDisabled.length; i++) {
          if (datesDisabled[i].checkbox === date.checkbox) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          datesDisabled.push(date);
        }
      }
    });
  });

  // Enable all dates by default - refactor later maybe
  dates.forEach(date => {
    date.label.style.backgroundColor = "";
    date.checkbox.removeAttribute("disabled");
  });

  // Disable the dates that would collide
  datesDisabled.forEach(date => {
    date.label.style.backgroundColor = "red";
    date.checkbox.setAttribute("disabled", "true");
  });

  // display: total
  let totalHTML = document.querySelector("span.total");
  if (totalHTML) {
    totalHTML.remove();
  }
  totalHTML = `<span class="total">total: $${total}</span>`;
  activityField.insertAdjacentHTML("afterend", totalHTML);

  // Validating checkboxes: at least 1
  let activityCount = datesSelected.length;
  if (mainConference) {
    activityCount++;
  }
  if (activityCount > 0) {
    submit.removeAttribute("disabled");
  } else {
    submit.setAttribute("disabled", "disabled");
  }
});

// Payment Info section
// Display the credit card by default
const defaultPayment = document.querySelector("#payment option[value='credit card']");
const creditInfo = document.querySelector("#credit-card");
defaultPayment.setAttribute("selected", "true");
creditInfo.style.display = "block";

// Display the selected payment information, hide the other
const paymentSelect = document.querySelector("#payment");
paymentSelect.addEventListener("change", e => {
  const payment = e.target.value;
  const creditInfo = document.querySelector("#credit-card");
  const paypalInfo = document.querySelectorAll("fieldset div p")[0];
  const bitcoinInfo = document.querySelectorAll("fieldset div p")[1];

  switch (payment) {
    case "credit card":
      creditInfo.style.display = "block";
      paypalInfo.style.display = "none";
      bitcoinInfo.style.display = "none";
      break;
    case "paypal":
      creditInfo.style.display = "none";
      paypalInfo.style.display = "block";
      bitcoinInfo.style.display = "none";
      break;
    case "bitcoin":
      creditInfo.style.display = "none";
      paypalInfo.style.display = "none";
      bitcoinInfo.style.display = "block";
      break;
    default:
      creditInfo.style.display = "none";
      paypalInfo.style.display = "none";
      bitcoinInfo.style.display = "none";
  }
});

// Validation
const submit = document.querySelector("button[type='submit']");
const name = document.querySelector("#name");
const email = document.querySelector("#mail");
const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Validating name: filled
name.setAttribute("required", "true");

// Validating email: correct format, filled
email.setAttribute("required", "true");
email.addEventListener("change", e => {
  const input = e.target.value;
  const validEmail = reEmail.test(input);
  if (!validEmail) {
    submit.setAttribute("disabled", "disabled");
  } else {
    submit.removeAttribute("disabled");
  }
});

// Validating checkboxes: at least 1
// 0 on load so disabled submit by default
const activity = datesSelected.length;
if (!activity) {
  submit.setAttribute("disabled", "disabled");
}













//
