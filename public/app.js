$("#scrapeBtn").on("click", function (event) {
  event.preventDefault();

  $.ajax({
    method: "GET",
    url: "/scrape",
    success: () => location.reload()
  });
});

$("#clearArticlesBtn").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/clearall",
    success: location.reload()
  });
});

$("#clearSavedArticlesBtn").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/clearallsaved",
    success: location.reload()
  });
});

$(".saveBtn").on("click", function () {
  const thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/savearticle/" + thisId,
    success: function () {
      $.ajax({
        method: "GET",
        url: "/deletearticle/" + thisId,
        success: location.reload()
      });
    }
  });
});

$(".noteBtn").on("click", function () {
  $("#notesTitle").empty();
  $("#notesBody").empty();
  const thisId = $(this).attr("data-id");

  $("#saveNoteBtn").attr("data-id", thisId);

  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  })
    .then(function (data) {
      $("#notesTitle").append('Note for article: ' + data._id);
      $("#notesBody").append(data.note.noteBody);
    });
});

$("#saveNoteBtn").on("click", function () {
  const thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: { noteBody: $("#notesInput").val().trim() }
  })
    .then(data => $("#notesInput").val(''));
});

$(".deleteBtn").on("click", function () {
  event.preventDefault();
  const thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/deletesavedarticle/" + thisId,
    success: location.reload()
  });
});