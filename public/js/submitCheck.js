const startSubmission = document.getElementById("start-submission");
const formContainer = document.getElementById("form-container");
const errorContainer = document.getElementById("error-container");
const assignment = document.getElementById("assignment-id");
const assignmentId = assignment.innerHTML;

if (startSubmission) {
  startSubmission.addEventListener("click", function () {
    $("#start-submission").prop("disabled", true);
    const form = $("<form></form>");
    form.attr("id", "form");
    form.attr("enctype", "multipart/form-data");
    const fileLabel = $("<label></label>");
    fileLabel.html("File:");
    fileLabel.attr("for", "submitFile");
    const fileInput = $("<input></input>");
    fileInput.attr("type", "file");
    fileInput.attr("accpet", ".jpg, .jpeg, .png, .pdf, .zip, .doc");
    fileInput.attr("id", "submitFile");
    fileInput.attr("name", "submitFile");
    const submitButton = $("<button></button>");
    submitButton.attr("type", "submit");
    submitButton.text("Submit");

    form.append(fileLabel);
    form.append(fileInput);
    form.append(submitButton);
    formContainer.append($(form).get(0));

    const error = "<p>Please select a file</p>";
    errorContainer.append($(error).get(0));

    // add form submit event listener
    $("form").on("submit", function (event) {
      event.stopPropagation();
      event.preventDefault();
      $("#submitFile").removeClass("inputClass");
      $("#error-container").hide();

      const formData = new FormData();
      const inputForm = $("#submitFile")[0];

      formData.append("submitFile", inputForm.files[0]);

      if ($("#submitFile").val().trim()) {
        // set up AJAX request config
        let requestConfig = {
          method: "POST",
          url: `/submission/${assignmentId}/new`,
          contentType: false,
          processData: false,
          enctype: "multipart/form-data",
          data: formData,
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          console.log(responseMessage);
          let element = $(`<div id="start-submission-container">
                <p>Submitted</p>
                <p>Your File Link:</p>
                <a target="_blank" href="/submission/download/${responseMessage.submission.submitFile}"> DownLoad File</a>
            </div>`);
          $("#form-container").empty();
          $("#error-container").empty();
          $("#start-submission-container").replaceWith(element);
          $("#start-submission").prop("disabled", false);
          $("#start-submission").html("New Attempt");
        });
      } else {
        $("#error-container").show();
        $("#submitFile").addClass("inputClass");
        $("#submitFile").val("");
        $("#submitFile").focus();
      }
    });
  });
}
window.jQuery;
