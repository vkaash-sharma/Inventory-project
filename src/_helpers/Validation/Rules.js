import { validateEmailList } from "../helper";
export function Rules(field, ruleObj) {
  var errorMsg = "";

  if (
    field === "" ||
    field === undefined ||
    field === null ||
    (Array.isArray(field) && field.length === 0)
  ) {
    errorMsg = ruleObj.label + " is Required.";
  } else {
    if (field && field.toString().charAt(0) === " ") {
      errorMsg = "Space is not Allowed in Starting of " + ruleObj.label;
    } else if (
      ruleObj["removeSpecialCharacter"] !== undefined &&
      ruleObj["removeSpecialCharacter"] === true
    ) {
      let fieldDataS = field ? field.toString().split("-") : [];
      if (fieldDataS.length > 1) {
        errorMsg = "Minus not Allowed";
      }

      var format = /[`!@#$%&*()_+\-=\[\]{};':"\\|,.<>?~]/;
      if (format.test(field.toString())) {
        errorMsg = "Special Character not Allowed";
      }
    } else if (ruleObj.type === "password") {
      var password = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
      var specialCharacter = /^(?=.*[!@#$%^&*])/;
      var len = /^(?=.{8,})/;
      var number = /^(?=.*[0-9])/;
      var caps = /^(?=.*[a-zA-Z])/;
      if (password.test(field) === false) {
        {
          errorMsg = "Please enter valid password";
        }
        if (specialCharacter.test(field) === false) {
          {
            errorMsg = "Please enter at least one special character";
          }
        }
        if (len.test(field) === false) {
          {
            errorMsg = "Min length 8 is required";
          }
        }
        if (number.test(field) === false) {
          {
            errorMsg = "Please enter at least one Number";
          }
        }
        if (caps.test(field) === false) {
          {
            errorMsg = "Please enter at least one  Letter";
          }
        }
      }
    } else if (ruleObj.type === "number") {
      if (
        ruleObj["max"] !== undefined &&
        field.toString().length > ruleObj.max
      ) {
        errorMsg = "Max " + ruleObj.max + " digit required";
      }
      if (
        ruleObj["maxNumber"] !== undefined &&
        !isNaN(field) &&
        field > ruleObj.maxNumber
      ) {
        errorMsg = "Max Number must be " + ruleObj.maxNumber + "!";
      }
      if (
        ruleObj["minNumber"] !== undefined &&
        !isNaN(field) &&
        field < ruleObj.minNumber
      ) {
        errorMsg = "Min Number must be " + ruleObj.minNumber + "!";
      }
      if (ruleObj["toFixed"] !== undefined && !isNaN(field)) {
        let temp = field.toString().split(".");
        let toFixedVal = ruleObj["toFixedVal"] ? ruleObj["toFixedVal"] : 2;
        if (temp.length > 1 && temp[temp.length - 1].length > toFixedVal)
          errorMsg = "Only " + toFixedVal + " Decimal Values are Allowed!";
      }
      if (
        ruleObj["min"] !== undefined &&
        field.toString().length < ruleObj.min
      ) {
        errorMsg = "Min " + ruleObj.min + " digit required";
      }
      if (
        ruleObj["nonNegative"] !== undefined &&
        ruleObj["nonNegative"] === true &&
        field < 0
      ) {
        errorMsg = "Please Enter Non Negative Value";
      }
      let fieldData = field ? field.toString().split(".") : [];
      if (
        ruleObj["integer"] !== undefined &&
        ruleObj["integer"] === true &&
        fieldData.length > 1
      ) {
        errorMsg = "Please Enter a Valid Integer Number";
      }
      if (isNaN(field)) {
        errorMsg = "Please enter a valid number";
      }
      if (ruleObj.zero) {
        if (field == 0) {
          errorMsg = "Value must be greater than 0";
        }
      }
    } else if (ruleObj.type === "email") {
      var regEmail =
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (regEmail.test(field) === false) {
        // errorMsg = ruleObj.label + " is invalid email"
        errorMsg = "Please Enter valid email";
      }
    } else if (ruleObj.type === "multiEmail") {
      if (!validateEmailList(field)) {
        errorMsg = "Please Enter valid email";
      }
      // } else if (ruleObj.type === "userId") {
      //     let regEmail = /^[A-Za-z0-9_-]+$/;
      //     if (regEmail.test(field) === false) {
      //         // errorMsg = ruleObj.label + " is invalid email"
      //         errorMsg = "Please Enter valid userId";
      //     }
    } else if (ruleObj.type === "date") {
      var pattern =
        /(0[1-9]|[12][0-9]|3[01])[- -.](0[1-9]|1[012])[- -.](19|20)\d\d/;
      if (pattern.test(field) === false) {
        errorMsg = "Date pattern should be dd-mm-yyyy";
      }
    } else if (ruleObj.type === "ifsc") {
      if (field.toString().length != 11) {
        errorMsg = "Enter 11 Digit Code";
      }
    } else if (ruleObj.type === "string") {
      errorMsg = "";
      let fieldLength = field.length;

      if (
        ruleObj["maxLength"] !== undefined &&
        fieldLength > ruleObj["maxLength"]
      ) {
        errorMsg =
          ruleObj.label + ": " + ruleObj["maxLength"] + " Character Limit";
      }

      if (
        ruleObj["minLength"] !== undefined &&
        fieldLength < ruleObj.minLength
      ) {
        errorMsg =
          ruleObj.label +
          ": " +
          "Min " +
          ruleObj.minLength +
          " Character required";
      }
    } else if (ruleObj.type === "gstin") {
      var gst_number = field;

      if (gst_number.toString().length < 15) {
        return (errorMsg = "Minimum 15 digit required");
      }
      if (gst_number.toString().length > 15) {
        return (errorMsg = "Maximun 15 digit required");
      }

      if (gst_number.charAt(13) !== "Z") {
        return (errorMsg = "Provide a valid GST Number.");
      }

      var third_letter = gst_number.charAt(2);
      var fourth_letter = gst_number.charAt(3);
      var fifth_letter = gst_number.charAt(4);
      var thirteen_letter = gst_number.charAt(12);

      if (
        /\d/.test(parseInt(gst_number.charAt(0))) === false ||
        /\d/.test(parseInt(gst_number.charAt(1))) === false
      ) {
        return (errorMsg = "Provide a valid GSTIN Number.");
      }

      if (/\d/.test(parseInt(thirteen_letter)) === false) {
        return (errorMsg = "Provide a valid GSTIN Number.");
      }

      var regGST = /^[a-zA-Z]{1}$/i;

      if (
        !regGST.test(third_letter) ||
        !regGST.test(fourth_letter) ||
        !regGST.test(fifth_letter)
      ) {
        return (errorMsg = "Provide a valid GSTIN Number.");
      }

      var first_two = parseInt(gst_number.substring(0, 2));

      if (first_two > 37) {
        return (errorMsg = "Provide a valid GSTIN Number.");
      }
    } else if (ruleObj.type === "pan") {
      var panVal = field;
      var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

      if (!regpan.test(panVal)) {
        errorMsg = "Provide a valid PAN Number";
      }
    } else if (ruleObj.type === "volume") {
      if (
        ruleObj["max"] !== undefined &&
        field.toString().length > ruleObj.max
      ) {
        errorMsg = "Max " + ruleObj.max + " digit required";
      }
      if (
        ruleObj["min"] !== undefined &&
        field.toString().length < ruleObj.min
      ) {
        errorMsg = "Min " + ruleObj.min + " digit required";
      }
      if (field == 0) {
        errorMsg = "Volume must be greater than 0";
      }

      if (isNaN(field)) {
        errorMsg = "Please enter a valid number";
      }
    } else if (ruleObj.type === "time") {
      var time = field;
      var regpan = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/;

      if (!regpan.test(time)) {
        errorMsg = "Provide a valid Time";
      } else if (
        (ruleObj && ruleObj.field_name == "time_log_to") ||
        ruleObj.field_name == "time_log_from"
      ) {
        var timeFormatOne = /^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;
        if (timeFormatOne.test(field) === false) {
          errorMsg = "Time Format (HH:mm:ss) should be 24 hour";
        }
      } else if (ruleObj && ruleObj.field_name == "time") {
        // start with one digit /^(?:[01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/
        // start with two digit /^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/
        var timeFormat = /^(?:[01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;
        if (timeFormat.test(field) === false) {
          errorMsg = "Time Format should be 24 hour";
        }
      }
    } else if (ruleObj.type === "url") {
      var urlVal = field;

      var regpan =
        /(http|https)?:\/\/(www\.)?[-a-zA-Z0-9@:%_.+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

      // var regpan =
      // /(http|https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/;
      //var regpan = ((http|https):\/\/)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)
      if (!regpan.test(urlVal)) {
        errorMsg = "Provide a valid URL";
      }
    } else if (ruleObj.type === "folder") {
      var urlVal = field.toString();

      var regpan = /^[a-zA-Z0-9_-\s]+$/;

      if (!regpan.test(urlVal)) {
        errorMsg =
          "Invalid Characters in Folder (Only letters, numbers, '-' and '_' are allowed)";
      }
    } else {
    }
  }
  return errorMsg;
}
