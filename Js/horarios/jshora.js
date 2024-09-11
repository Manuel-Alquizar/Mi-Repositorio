document.addEventListener("DOMContentLoaded", function() {
    recopilar_datos();
});

var horarios = [];
var celdas = [];
const horas = ["", "07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
const dias = ["", "LU","MA","MI","JU","VI","SA","DO"];

document.getElementById("select").addEventListener('change',recopilar_datos);

function recopilar_datos(){

    limpiar_tabla()

    fetch('Datos/horarios.json')
    .then(function(dat){
        return dat.json();
    })
    .then(function(resp){

        let semestre = document.getElementById("select").value;
        
        resp.forEach(data => {
            if(data.codDocente == 8161078 && data.semestre == semestre){
                horarios.push(data);
            }
        });
        console.log(horarios);
        cal_tabla();
    })
}

function cal_tabla(){

    let carga = 0;

    horarios.forEach(datos =>{

        let fil = horas.indexOf(datos.hora.slice(0,2));
        let col = dias.indexOf(datos.dia);
        let limi = horas.indexOf(datos.hora.slice(3));
        let cant = limi - fil;

        carga+=cant;

        let tabla = document.getElementById("hora");
        let celda = tabla.rows[fil].cells[col];

        console.log(celda);

        celda.rowSpan = cant;

        for (let n=(fil+1); n < limi; n++){
            tabla.rows[n].deleteCell(col);
        }

        celda.classList.add("hors");

        let sentence = `<div><p><span class='material-icons'>person</span>(${datos.tope}) `+
        `${datos.codCurso}-${datos.secCurso} /[${datos.codAula}](${datos.teopra}) </p></div>`;

        celda.innerHTML = sentence;

        celdas.push([celda,tabla, fil, limi]);
    });

    document.getElementById("CH").innerHTML = carga;

    horarios=[];

}

function limpiar_tabla(){
    
    for(const cel of celdas){
        cel[0].classList.remove("hors");
        cel[0].innerHTML = "";
        cel[0].rowSpan=1;

        for (let n=(cel[2]+1); n < cel[3]; n++){
            cel[1].rows[n].insertCell();
        }

    }

    celdas = [];
}
