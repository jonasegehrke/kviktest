const slideBtn = document.querySelector(".mobile_swap_btn");
const chosenContainer = document.querySelector(".chosen_centers_container")
const allContainer = document.querySelector(".all_centers_container")
const slideIcon = document.querySelector(".mobile_swap_icon")

let showingLeft = true;

console.log("hello")
slideBtn.addEventListener('click', ()=>{
    
    if(!showingLeft){
        slideBtn.classList.add('left')
        slideIcon.classList.remove('uil-angle-double-left');
        slideIcon.classList.add('uil-angle-double-right')
        slideBtn.classList.remove('right');
        allContainer.classList.add('open')
        chosenContainer.classList.remove('open')
        showingLeft = true;
        
    }else{
        slideBtn.classList.add('right')
        slideIcon.classList.remove('uil-angle-double-right');
        slideIcon.classList.add('uil-angle-double-left')
        slideBtn.classList.remove('left');
        chosenContainer.classList.add('open')
        allContainer.classList.remove('open')
        showingLeft = false;
    }
})


