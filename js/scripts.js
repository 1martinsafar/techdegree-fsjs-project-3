"use strict";

/* ======================================================================
                        Functions
========================================================================= */

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

const limit = (input, max) => {
  console.log("length:", input.value.length);
  if (input.value.length > max) {
    console.log("too long:", input.value);
    input.value = input.value.substr(0, max);
    return input.value;
  }
};

const validateLength = (length, min) => {
  if (length < min) {
    console.log("too short:", length);
    return false;
  } else {
    return true;
  }
};

const validateNumber = number => {
  if (!Number.isInteger(number)) {
    console.log("not an integer");
    return false;;
  } else {
    return true;
  }
};

const validateForm = validForm => {
  for (const validSection in validForm) {
    console.log(validForm[validSection]);
    if (!validForm[validSection]) {
      console.log("!invalid form section detected");
      submit.setAttribute("disabled", "disabled");
      return false;
    }
    console.log(">>> all valid <<<");
    submit.removeAttribute("disabled");
  }
};

const validateSection = (section, sectionName) => {
  if (!validForm[sectionName]) {
    section.style.border = "2px solid red";
    // section.style.borderColor = "red";
  } else {
    section.style.border = "2px solid green";
    // section.style.borderColor = "green";
  }
};

const changeValidForm = (properties, newValue) => {
  console.log("___changeValidForm___");
  properties.forEach(property => {
    validForm[property] = newValue;
  });
  console.log("validForm:", validForm);
};

/* ======================================================================
                        Main Code
========================================================================= */

// Setting focus on the first text field
const firstTextField = document.querySelector("input[type='text']");
firstTextField.focus();

// Hidding the other job role field by default
const otherTextField = document.querySelector("#other-title");
otherTextField.style.display = "none";

// Showing new text field when "other" job role is selected
const jobSelect = document.querySelector("#title")
// NEW: to be visible when JavaScript is disabled, it was added to the HTML
// so now only its display property needs to change
jobSelect.addEventListener("change", e => {
  const otherTextField = document.querySelector("#other-title");
  if (e.target.value === "other") {
    console.log("Displaying the field");
    otherTextField.style.display = "block";
  } else {
    otherTextField.style.display = "none";
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

// validation status of the form
const validForm = {
  userName: false,
  email: false,
  checkbox: false,
  cardNumber: false,
  zip: false,
  cvv: false
};

/* Activity Checkbox Events
      As a user selects activities, a running total displays
      below the list of checkboxes.
      Disable the dates that collide while
      keeping overlapping ones as a possibility.
*/
let total = 0;
let datesSelected = [];
let datesDisabled = [];
let mainConference = false;

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
  console.log("ACTIVITY COUNT:", activityCount);
  const activityLegend = document.querySelector(".activities legend");
  const missingActivity = document.querySelector("#missing-activity");
  if (activityCount > 0) {
    if (missingActivity) {
      missingActivity.remove();
    }
    validForm.checkbox = true;
    console.log(validForm);
    validateForm(validForm);
  } else {
    console.log(">>> no activities selected!");
    const missingActivity = "<h2 id='missing-activity' style='color: red;'>Choose at least 1 activity.</h2>";
    activityLegend.insertAdjacentHTML("afterend", missingActivity);
    validForm.checkbox = false;
    console.log(validForm);
    validateForm(validForm);
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
      changeValidForm(["cardNumber", "zip", "cvv"], false);
      break;
    case "paypal":
      creditInfo.style.display = "none";
      paypalInfo.style.display = "block";
      bitcoinInfo.style.display = "none";
      changeValidForm(["cardNumber", "zip", "cvv"], true);
      break;
    case "bitcoin":
      creditInfo.style.display = "none";
      paypalInfo.style.display = "none";
      bitcoinInfo.style.display = "block";
      changeValidForm(["cardNumber", "zip", "cvv"], true);
      break;
    default:
      creditInfo.style.display = "none";
      paypalInfo.style.display = "none";
      bitcoinInfo.style.display = "none";
      changeValidForm(["cardNumber", "zip", "cvv"], false);
  }
});

//
// Validation
//
const submit = document.querySelector("button[type='submit']");
const userName = document.querySelector("#name");
const email = document.querySelector("#mail");
const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Validating userName: filled
userName.setAttribute("required", "true");
userName.addEventListener("focusout", e => {
  const input = e.target.value;
  if (input.length > 0) {
    validForm.userName = true;
  } else {
    validForm.userName = false;
  }
  console.log(validForm);
  validateForm(validForm);
  validateSection(userName, "userName");
});

// Validating email: correct format, filled
// email.setAttribute("required", "true");
email.addEventListener("input", e => {
  const input = e.target.value;
  const validEmail = reEmail.test(input);
  if (validEmail) {
    validForm.email = true;
  } else {
    validForm.email = false;
  }
  console.log(validForm);
  validateForm(validForm);
  validateSection(email, "email");
});

// Validating payment
const cardNumber = document.querySelector("#cc-num");
const zip = document.querySelector("#zip");
const cvv = document.querySelector("#cvv");

// Credit card field should only accept a number between 13 and 16 digits
cardNumber.addEventListener("input", e => {
  const input = e.target;
  const max = 16;
  const min = 13;
  const number = parseInt(e.target.value);
  limit(input, max);
  const length = e.target.value.length;

  if (validateNumber(number) && validateLength(length, min)) {
    validForm.cardNumber = true;
  } else {
    validForm.cardNumber = false;
  }
  console.log(validForm);
  validateForm(validForm);
  validateSection(cardNumber, "cardNumber");
});
// The zipcode field should accept a 5-digit number
zip.addEventListener("input", e => {
  const input = e.target;
  const max = 5;
  const min = 5;
  const number = parseInt(e.target.value);
  limit(input, max);
  const length = e.target.value.length;

  if (validateNumber(number) && validateLength(length, min)) {
    validForm.zip = true;
  } else {
    validForm.zip = false;
  }
  console.log(validForm);
  validateForm(validForm);
  validateSection(zip, "zip");
});
// The CVV should only accept a number that is exactly 3 digits long
cvv.addEventListener("input", e => {
  const input = e.target;
  const max = 3;
  const min = 3;
  const number = parseInt(e.target.value);
  limit(input, max);;
  const length = e.target.value.length;

  if (validateNumber(number) && validateLength(length, min)) {
    validForm.cvv = true;
  } else {
    validForm.cvv = false;
  }
  console.log(validForm);
  validateForm(validForm);
  validateSection(cvv, "cvv");
});





//
