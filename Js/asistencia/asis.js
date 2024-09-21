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
const meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO",
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

    let mi = Number(semestre.fecInicio.slice(3,5)) -1;
    let mf = Number(semestre.fecFinal.slice(3,5)) -1;

    //Limitar los meses
    let fecha = new Date();
    let ma = fecha.getMonth();
    
    mf = (ma<mf) ? ma : mf;

    let año = semestre.semestre.slice(0,4);
    let botones = "";

    botones += `<div><button id="mesActual" class="mesboto">${meses[mf]} ${año}</button><br><br>
        <div class="minic"></div></div>`;

    for(let n = (mf-1); n>=mi; n--){
        botones += `<div><button id="mesboto" class="mesboto">${meses[n]} ${año}</button><br><br>
        <div class="minic"></div></div>`;
    }

    document.getElementById("medio").innerHTML = botones;

    var bots = document.querySelectorAll(".mesboto");

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
        <thead class="cabezaT">
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
            <td><span id="spanss">${mesAsis.asis[n]}</span></td>
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


        let spanss = conte.querySelectorAll("#spanss");

        spanss.forEach(spa=>{
            if(spa.innerText=="P"){
                spa.style.backgroundColor="rgb(40, 167, 69)";
            }else if(spa.innerText=="T"){
                spa.style.backgroundColor="rgb(255, 129, 0)"
            }else{
                spa.style.backgroundColor="rgb(255, 50, 50)"
            }
        });

    });

    document.getElementById("pun").innerText = puntualS;
    document.getElementById("tar").innerText = tardeS;
    document.getElementById("fal").innerText = faltaS;

}

function mostrar_ocultar(event){

    let conteUp = event.target.parentElement;
    let conte = conteUp.querySelector(".minic");

    if(conte.style.maxHeight == '1000px'){
        conte.style.maxHeight = '0px';
    }else{
        let todos = document.querySelectorAll(".minic");

        todos.forEach(unConte=>{
            unConte.style.maxHeight = '0px';
        });
        conte.style.maxHeight = '1000px';
    } 

}

const diasCort = ["DO", "LU","MA","MI","JU","VI","SA"];
const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
var entrada = true;

document.getElementById("btnAsistencia").addEventListener("click", TomarAsistencia);

function TomarAsistencia(){

    //tener la fecha y hora actual
    let fecha = new Date();
    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();

    let numDia = fecha.getDate();
    let nombreDia = diasSemana[fecha.getDay()];

    let mesActual = fecha.getMonth();
    let nombreMes = meses[mesActual].toLowerCase();
    let mesAsistencia = asistencia[nombreMes];

    //obtener el horario actual
    let horarioActual = horarios.find(horario => {
        let entrada = Number(horario.hora.slice(0,2));
        let dia = diasCort.indexOf(horario.dia);

        let diaValido = (dia == fecha.getDay());
        let entradaValida = (entrada == horas && minutos >= 0 && minutos < 60) || 
        (entrada > horas && minutos >= 50 && minutos < 60);

        return entradaValida && diaValido;
    });

    //llenar los datos
    if(!horarioActual){
        alert("No se ha encontrado el horario actual");
        return;
    }

    if(entrada){
        let dia = nombreDia + " " + numDia;
        let codHor =horarioActual.codHorario;
        let entradaH = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        let salidaH = "Aun no se ha salido";
        let estado = (horas==Number(horarioActual.hora.slice(0,2)) && minutos>5)?
        "T":"P";

        mesAsistencia.dia.push(dia);
        mesAsistencia.codHorario.push(codHor);
        mesAsistencia.entradaH.push(entradaH);
        mesAsistencia.salidaH.push(salidaH);
        mesAsistencia.asis.push(estado);

        let botones = document.querySelectorAll("#mesActual");

        crea_tablas(botones);

        entrada = false;

    }else{
        let salidaH = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;

        mesAsistencia.salidaH.pop();
        mesAsistencia.salidaH.push(salidaH);

        let botones = document.querySelectorAll("#mesActual");
        crea_tablas(botones);

        entrada = true;
    }


}


