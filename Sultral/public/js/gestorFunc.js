if(loc != "-"){
    let filesRoute = document.getElementById("filesRoute");
    if(actual[0]['contenedor'] != null){
        let element = document.createElement("a");
        element.href = "/Gestor/"+contenedor[0]['_id'];
        let text = document.createTextNode(contenedor[0]['nombre'].charAt(0).toUpperCase()+contenedor[0]['nombre'].slice(1));
        element.appendChild(text);
        filesRoute.appendChild(element);
        filesRoute.appendChild(document.createTextNode(" > "));
    }

    element = document.createElement("a");
    element.href = "/Gestor/"+actual[0]['_id'];
    text = document.createTextNode(actual[0]['nombre'].charAt(0).toUpperCase()+actual[0]['nombre'].slice(1));
    element.appendChild(text);
    filesRoute.appendChild(element);
    filesRoute.appendChild(document.createTextNode(" > "));

}

function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
};

var elementos;

function select(elemento) {
    elementos = document.querySelectorAll(".option");

    elementos.forEach((elem) => {
        elem.className = elem.className.replace(/\bselected-menu\b/g, "");
    });

    if (!hasClass(elemento, "selected-menu")) {
        elemento.className += " selected-menu";
    }
};

if (loc == carpetas[3]['_id']) {
    select(files);
} else if (loc == carpetas[0]['_id']) {
    select(shared);
} else if (loc == carpetas[1]['_id']) {
    select(fav);
} else if (loc == carpetas[2]['_id']) {
    select(bin);
}

/* Modal */
let btnMostrar = document.getElementsByClassName("mostrar")[0];
let mascara = document.getElementsByClassName("mascara")[0];
let btnCerrar = document.getElementsByClassName("cerrar")[0];

btnMostrar.addEventListener("click", function(){
    if (!hasClass(mascara, "activo")) {
        mascara.className += " activo";
    }
});
  
function cerrarModal(){
    mascara.className = mascara.className.replace(/\bactivo\b/g, "");
    let nombreCarpeta = document.getElementById('fname');
    nombreCarpeta.value = "";
}

mascara.addEventListener("click", function(){
    cerrarModal();
});

btnCerrar.addEventListener("click", function(){
    cerrarModal();
});

document.onkeyup = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        cerrarModal();
        cerrarModalA();
    }
};

/* Modal Archivos */
let btnMostrarA = document.getElementsByClassName("upload-btn")[0];
let mascaraA = document.getElementsByClassName("mascaraA")[0];
let btnCerrarA = document.getElementsByClassName("cerrarA")[0];

btnMostrarA.addEventListener("click", function(){
    if (!hasClass(mascaraA, "activoA")) {
        mascaraA.className += " activoA";
    }
});
  
function cerrarModalA(){
    mascaraA.className = mascaraA.className.replace(/\bactivoA\b/g, "");
    let nombreCarpeta = document.getElementById('finame');
    nombreCarpeta.value = "";
}

mascaraA.addEventListener("click", function(){
    cerrarModalA();
});

btnCerrarA.addEventListener("click", function(){
    cerrarModalA();
});


/* Alert */
let alert = document.getElementsByClassName("alert")[0];
let cerrarAlert = document.getElementsByClassName("cerrar-alert")[0];

function ocultarAlert(){
    alert.className = alert.className.replace(/\b alert-activado\b/g, "");
}

function mostrarAlert(){
    if (!hasClass(alert, "alert-activado")) {
        alert.className += " alert-activado";
    }
}

cerrarAlert.addEventListener("click", () => {
    ocultarAlert();
});

if(reqAlert){
    mostrarAlert();
}