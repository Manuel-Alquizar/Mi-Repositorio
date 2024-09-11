document.addEventListener("DOMContentLoaded", function() {
    recopilar_datos_asis();
});

var semestre;
const meses = ["","ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
    "JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

document.getElementById("select").addEventListener('change',recopilar_datos_asis);

function recopilar_datos_asis(){

    // limpiar_tabla()

    fetch('Datos/semestres.json')
    .then(function(dat){
        return dat.json();
    })
    .then(function(resp){

        let sem = document.getElementById("select").value;
        
        resp.forEach(data => {
            if(data.estado == 1 && data.semestre == sem){
                semestre = data;
            }
        });
        console.log(semestre);
        mostrar_boto();
    })
}

function mostrar_boto(){

    let mi = Number(semestre.fecInicio.slice(3,5));
    let mf = Number(semestre.fecFinal.slice(3,5));

    let año = semestre.semestre.slice(0,4);
    let botones = "";

    for(let n = mi; n<=mf; n++){

        botones += `<button>${meses[n]} ${año}</button><br><br>`;
    }

    document.getElementById("medio").innerHTML = botones;

}


