let annForm = document.getElementById('new-ann');
let annDescription = document.getElementById('ann_description');
let annTitle = document.getElementById('ann_title');
let annsubmit = document.getElementById('ann-submit');
if(annForm){
    annForm.addEventListener("submit",(event)=>{
        
        try{
        let annTitleError = document.getElementById('no-title');
        let annDescError = document.getElementById('no-desc');
        annTitle.classList.remove("inputClass");
        annDescription.classList.remove("inputClass");

        annTitleError.hidden = true;
        annDescError.hidden = true;
        if(!annDescription.value.trim() || !annTitle.value.trim()){
            event.preventDefault();

        
        if (!annTitle.value.trim()) {
            annTitle.classList.add("inputClass");
            annTitleError.hidden = false;
        }
        if (!annDescription.value.trim()) {
            annDescription.classList.add("inputClass");
            annDescError.hidden = false;
        }
        }
        }catch (e) {
            const message = typeof e === 'string' ? e : e.message;
            
    }   
    })
}
