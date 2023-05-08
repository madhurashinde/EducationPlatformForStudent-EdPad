let quizletForm = document.getElementById('quizlet-cat-form')
let quizletCategoryInput = document.getElementById('quizletCategoryInput')
let errorDiv = document.getElementById('qzlts-error');


if(quizletForm){
    quizletForm.addEventListener('submit',(event)=>{
        quizletCategoryInput.classList.remove("inputClass");
        errorDiv.hidden = true;
        if (!/^(9|10|19|20|21|22|23|24|25|27|28|30)$/.test(quizletCategoryInput.value)) {
            event.preventDefault();           
            errorDiv.hidden = false;
            quizletCategoryInput.classList.add("inputClass");
        }
    })
}
