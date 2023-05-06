const startSubmission = document.getElementById("start-submission");
const formContainer = document.getElementById("form-container");
const errorContainer = document.getElementById("error-container");

if (startSubmission) {
  startSubmission.addEventListener("click", function () {
    $("#start-submission").prop("disabled", true);
    const form = $("<form></form>");
    form.attr("id", "form");
    const fileLabel = $("<label></label>");
    fileLabel.html("File:");
    fileLabel.attr("for", "submitFile");
    const fileInput = $("<input></input>");
    fileInput.attr("type", "text");
    fileInput.attr("id", "submitFile");
    fileInput.attr("name", "submitFile");
    const commentLabel = $("<label></label>");
    commentLabel.html("Comment (Optional):");
    commentLabel.attr("for", "comment");
    const commentInput = $("<textarea></textarea>");
    commentInput.attr("id", "comment");
    commentInput.attr("name", "comment");
    const submitButton = $("<button></button>");
    submitButton.attr("type", "submit");
    submitButton.text("Submit");

    form.append(fileLabel);
    form.append(fileInput);
    form.append(commentLabel);
    form.append(commentInput);
    form.append(submitButton);
    formContainer.append($(form).get(0));

    const error =
      "<p>Please enter valid input. File is the link to your uploaded file: www.example.com</p>";
    errorContainer.append($(error).get(0));

    // add form submit event listener
    $("form").on("submit", function (event) {
      event.stopPropagation();
      event.preventDefault();
      $("#submitFile").removeClass("inputClass");
      $("#error-container").hide();

      const web = /^www\..+\.com$/;
      if (
        $("#submitFile").val().trim() &&
        web.test($("#submitFile").val().trim())
      ) {
        // set up AJAX request config
        let requestConfig = {
          method: "POST",
          url: `/assignment/detail/${$("#assignment-id")
            .html()
            .trim()}/newSubmission`,
          contentType: "application/json",
          data: JSON.stringify({
            file: $("#submitFile").val(),
            comment: $("#comment").val(),
          }),
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          let element = $(`<div id="start-submission-container">
                <p>Submitted</p>
                <p>Your File Link:</p>
                <a target="_blank" href="//${responseMessage.submission.submitFile}"> ${responseMessage.submission.submitFile}</a>
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
