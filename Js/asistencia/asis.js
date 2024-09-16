document.addEventListener("DOMContentLoaded", function() {
    recopilar_datos_asis();
    actualizarHora();
});

function actualizarHora() {
    let fecha = new Date();
    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getSeconds();

    minutos = minutos < 10 ? '0' + minutos : minutos;
    segundos = segundos < 10 ? '0' + segundos : segundos;

    let horaActual = horas + ":" + minutos + ":" + segundos;
    
    document.getElementById('reloj').innerText = horaActual;
}

setInterval(actualizarHora, 1000);

var semestre;
var asistencia;
var horarios = [];
const meses = ["","ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
    "JULIO","AGOSTO","SETIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

document.getElementById("select").addEventListener('change',recopilar_datos_asis);

async function recopilar_datos_asis(){

    await fetch('Datos/asis_clase.json')
    .then(function(dat){
        return dat.json();
    })
    .then(function(resp){

        let sem = document.getElementById("select").value;
        
        resp.forEach(data => {
            if(data.semestre == sem){
                asistencia = data;
            }
        });

    })

    await fetch('Datos/horarios.json')
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

    })

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
        mostrar_boto();
    })
}

function mostrar_boto(){

    let mi = Number(semestre.fecInicio.slice(3,5));
    let mf = Number(semestre.fecFinal.slice(3,5));

    //Limitar los meses
    let fecha = new Date();
    let ma = fecha.getMonth()+1;
    
    mf = (ma<mf) ? ma : mf;

    let año = semestre.semestre.slice(0,4);
    let botones = "";

    for(let n = mf; n>=mi; n--){
        botones += `<div><button id="mesboto" class="mesboto">${meses[n]} ${año}</button><br><br>
        <div class="minic"></div></div>`;
    }

    document.getElementById("medio").innerHTML = botones;

    var bots = document.querySelectorAll("#mesboto");

    crea_tablas(bots);

    bots.forEach(boton=>{
        boton.addEventListener("click", mostrar_ocultar);
    });
}

function crea_tablas(botones){

    //variables para resumen asis. semestre
    let puntualS = 0;
    let tardeS = 0;
    let faltaS = 0;

    botones.forEach(boton=>{

        let puntualM = 0;
        let tardeM = 0;
        let faltaM = 0;
        
        let conteUp = boton.parentElement;
        let conte = conteUp.querySelector(".minic");

        let mes = boton.innerText.slice(0,-5).toLowerCase();

        let tabla = `<table class='minit'>
        <thead>
        <td>Día</td>
        <td>Curso</td>
        <td>Horario</td>
        <td>Marcación</td>
        <td>Est</td>
        </thead>`;

        let filas = "";
        
        let mesAsis = asistencia[mes];

        for(let n = 0; n<mesAsis.asis.length; n++){

            let codHor = mesAsis.codHorario[n];
            let codCur ="";
            let secCur ="";
            let teopra ="";
            let horCur ="";

            horarios.forEach(datos=>{
                if(datos.codHorario === codHor){
                    codCur = datos.codCurso;
                    secCur = datos.secCurso;
                    teopra = (datos.teopra == "T") ? "TEO" : "PRA";
                    horCur = datos.hora; 
                }
            });

            filas = `<tr>
            <td>${mesAsis.dia[n]}</td>
            <td>${codCur}-${secCur} (${teopra})</td>
            <td>${horCur}</td>
            <td>${mesAsis.entradaH[n]} - ${mesAsis.salidaH[n]}</td>
            <td><span>${mesAsis.asis[n]}<span></td>
            </tr>\n`+
            filas;

            puntualM += (mesAsis.asis[n]=="P") ? 1 : 0;
            tardeM += (mesAsis.asis[n]=="T") ? 1 : 0;
            faltaM += (mesAsis.asis[n]=="F") ? 1 : 0;

        }

        puntualS += puntualM;
        tardeS += tardeM;
        faltaS += faltaM;

        tabla += filas+"</table>";

        conte.innerHTML = tabla + `<div class="ReAsiMen"><p>resumen de asistencia mensual</p>
                <p>P:${puntualM} T:${tardeM} F:${faltaM}</p></div>`;


    });

    document.getElementById("pun").innerText = puntualS;
    document.getElementById("tar").innerText = tardeS;
    document.getElementById("fal").innerText = faltaS;

}

function mostrar_ocultar(event){

    let conteUp = event.target.parentElement;
    let conte = conteUp.querySelector(".minic");

    if(conte.style.maxHeight == '800px'){
        conte.style.maxHeight = '0px';
    }else{
        conte.style.maxHeight = '800px';
    } 

}

function TomarAsistencia(){

}


