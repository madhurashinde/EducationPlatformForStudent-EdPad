let quizletForm = document.getElementById('quizlet-cat-form')
let quizletCategoryInput = document.getElementById('quizletCategoryInput')
let errorDiv = document.getElementById('qzlts-error');
if(quizletForm){
    quizletForm.addEventListener('submit',(event)=>{
        // submitFile.classList.remove("inputClass");
        errorDiv.hidden = true;
        if(!quizletCategoryInput || !quizletCategoryInput.value.trim){
            event.preventDefault();
            errorDiv.hidden = false;
            // submitFile.classList.add("inputClass");
            // submitFile.value = "";
            // submitFile.focus();
        }
    })
}
