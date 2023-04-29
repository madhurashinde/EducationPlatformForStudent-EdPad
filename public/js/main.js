const Form = document.getElementById("input-form");

const letter = (str) => {
  let s = str.toLowerCase();
  const letter = /[a-z]/;
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (letter.test(s[i])) {
      count += 1;
    }
  }
  return count;
};

const nonLetter = (str) => {
  let s = str.toLowerCase();
  const letter = /[a-z]/;
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (!letter.test(s[i])) {
      count += 1;
    }
  }
  return count;
};

const vowels = (str) => {
  let s = str.toLowerCase();
  const vowels = /[aeiou]/;
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (vowels.test(s[i])) {
      count += 1;
    }
  }
  return count;
};

const words = (str) => {
  let s = str.toLowerCase();
  const words = /[a-z]+/g;
  const wordL = s.match(words);
  if (wordL === null) {
    return 0;
  } else {
    return wordL.length;
  }
};

const unique = (str) => {
  let s = str.toLowerCase();
  const words = /[a-z]+/g;
  let wordL = s.match(words);
  if (wordL === null) {
    return 0;
  } else {
    let uniqueL = [];
    for (let i = 0; i < wordL.length; i++) {
      if (!uniqueL.includes(wordL[i])) {
        uniqueL.push(wordL[i]);
      }
    }
    return uniqueL.length;
  }
};

const long = (str) => {
  let s = str.toLowerCase();
  const words = /[a-z]+/g;
  let wordL = s.match(words);
  if (wordL === null) {
    return 0;
  } else {
    let count = 0;
    for (let i = 0; i < wordL.length; i++) {
      if (wordL[i].length >= 6) {
        count += 1;
      }
    }
    return count;
  }
};

const short = (str) => {
  let s = str.toLowerCase();
  const words = /[a-z]+/g;
  let wordL = s.match(words);
  if (wordL === null) {
    return 0;
  } else {
    let count = 0;
    for (let i = 0; i < wordL.length; i++) {
      if (wordL[i].length <= 3) {
        count += 1;
      }
    }
    return count;
  }
};

if (Form) {
  Form.addEventListener("submit", (event) => {
    event.preventDefault();

    if ($("#text_input").val().trim()) {
      $("#error").hide();
      $("#input-form").removeClass("error");
      $("#text_input").removeClass("inputClass");

      let dl = $("<dl></dl>").get(0);

      let dt = "<dt>Original Input:</dt>";
      dl.append($(dt).get(0));

      let dd = `<dd>${$("#text_input").val().trim()}</dd>`;
      dl.append($(dd).get(0));

      dt = `<dt>Total Letters</dt>`;
      dl.append($(dt).get(0));

      dd = `<dd>${letter($("#text_input").val().trim())}</dd>`;
      dl.append($(dd).get(0));

      dt = `<dt>Total Non-Letters</dt>`;
      dl.append($(dt).get(0));

      dd = `<dd>${nonLetter($("#text_input").val().trim())}</dd>`;
      dl.append($(dd).get(0));

      dt = `<dt>Total Vowels</dt>`;
      dl.append($(dt).get(0));

      dd = `<dd>${vowels($("#text_input").val().trim())}</dd>`;
      dl.append($(dd).get(0));

      dt = `<dt>Total Consonants</dt>`;
      dl.append($(dt).get(0));

      dd = `<dd>${
        letter($("#text_input").val().trim()) -
        vowels($("#text_input").val().trim())
      }</dd>`;
      dl.append($(dd).get(0));

      dt = `<dt>Total Words</dt>`;
      dl.append($(dt).get(0));

      dd = `<dd>${words($("#text_input").val().trim())}</dd>`;
      dl.append($(dd).get(0));

      dt = `<dt>Unique Words</dt>`;
      dl.append($(dt).get(0));

      dd = `<dd>${unique($("#text_input").val().trim())}</dd>`;
      dl.append($(dd).get(0));

      dt = `<dt>Long Words</dt>`;
      dl.append($(dt).get(0));

      dd = `<dd>${long($("#text_input").val().trim())}</dd>`;
      dl.append($(dd).get(0));

      dt = `<dt>Short Words</dt>`;
      dl.append($(dt).get(0));

      dd = `<dd>${short($("#text_input").val().trim())}</dd>`;
      dl.append($(dd).get(0));

      $("#results").append(dl);
      $("#input-form").trigger("reset");
      $("#text_input").focus();
    } else {
      $("#error").show();
      $("#error").html("You must enter an input value");
      $("#input-form").addClass("error");
      $("#text_input").addClass("inputClass");
      $("#text_input").val("");
      $("#text_input").focus();
    }
  });
}



//I dont know where to add this code part


// let annForm = document.getElementById('new-ann');
// let annTitleError = document.getElementById('no-desc');
// let annDescError = document.getElementById('no-desc')
// if(annForm){
//     annForm.addEventListener('submit',(event)=>{
//         event.preventDefault();
//         if(annTitleError && annDescError){
//             annDescError.hidden = true;
//             annTitleError.hidden = true;
//             annForm.submit();
//         }else if(!annTitleError && annDescError){
//             annTitleError.hidden = false;
//             annDescError.hidden = true;
//         }else if(annTitleError && !annDescError){
//             annTitleError.hidden = true;
//             annDescError.hidden = false;    
//         }else{
//             annTitleError.hidden = false;
//             annDescError.hidden = false;
//         }
//     })
// }


// let modForm = document.getElementById('new-mod');
// let modTitleError = document.getElementById('no-desc-mod');
// let modDescError = document.getElementById('no-desc-mod')
// if(modForm){
//     modForm.addEventListener('submit',(event)=>{
//         event.preventDefault();
//         if(modTitleError && modDescError){
//             modDescError.hidden = true;
//             modTitleError.hidden = true;
//             modForm.submit();
//         }else if(!modTitleError && modDescError){
//             modTitleError.hidden = false;
//             modDescError.hidden = true;
//         }else if(modTitleError && !modDescError){
//             modTitleError.hidden = true;
//             modDescError.hidden = false;    
//         }else{
//             modTitleError.hidden = false;
//             modDescError.hidden = false;
//         }
//     })
// }