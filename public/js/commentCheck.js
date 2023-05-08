for (let i = 0; i < $(".form").length; i++) {
  $(".add-comment")
    .eq(i)
    .on("click", function () {
      $(".form").eq(i).show();
      $(".form :input").eq(i).prop("disabled", false);
      $(".add-comment").eq(i).hide();
    });
}
for (let i = 0; i < $(".form").length; i++) {
  $(".form")
    .eq(i)
    .on("submit", function (event) {
      event.stopPropagation();
      event.preventDefault();
      $(".comment").eq(i).removeClass("inputClass");
      $(".error").eq(i).hide();

      let comment = $(".comment").eq(i).val().trim();
      let assignmentId = $(".assignmentId").eq(i).html().trim();

      console.log(assignmentId);
      if (comment) {
        // set up AJAX request config
        let requestConfig = {
          method: "POST",
          url: `/submission/${assignmentId}/newcomment`,
          contentType: "application/json",
          data: JSON.stringify({ comment: comment }),
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          $(".content").eq(i).html(`Comment: ${responseMessage.comment}`);
          $(".content").show();
          $(".form :input").eq(i).prop("disabled", true);
          $(".form").eq(i).hide();
          $(".error").eq(i).hide();
          $(".add-comment").eq(i).show();
          $(".add-comment").eq(i).html("Edit Comment");
        });
      } else {
        $(".error").eq(i).show();
        if (!comment) {
          $(".comment").eq(i).addClass("inputClass");
          $(".comment").eq(i).focus();
        }
      }
    });
}
