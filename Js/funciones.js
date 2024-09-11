document.addEventListener("DOMContentLoaded", function() {
    let boto = document.getElementById("General");
    boto.click();
});
    
function toggleMenu() {
    let menu = document.getElementById("menuv");
    let cab = document.getElementById("cabeza");
    let conte = document.getElementById("contenedor");

    if (menu.classList.contains("menu-close")) {
        menu.classList.remove("menu-close");
        cab.classList.remove("menu-close");
        conte.classList.remove("menu-close");
        cab.style.width="calc(100vw - 250px);";
        conte.style.width="calc(100vw - 300px)";
    } else {
        menu.classList.add("menu-close");
        cab.classList.add("menu-close");
        conte.classList.add("menu-close");
        conte.style.width="100vw";
        cab.style.width="calc(100vw + 50px)";
    }
}

function subm(event){
    let pre = event.currentTarget.parentElement;
    let opc = pre.querySelector('.submenu');
    if (opc) {
        if(opc.style.maxHeight == '800px'){
            opc.style.maxHeight = '0px';
        }else{
            opc.style.maxHeight = '800px';
        }
    }

    let fle = pre.querySelector(".flech");
    if(fle){
        if(fle.style.transform == `rotate(180deg)`){
            fle.style.transform = `rotate(0deg)`;
        }else{
            fle.style.transform = `rotate(180deg)`;
        }
    }

}
