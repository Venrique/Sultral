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

/*
console.log(locations[0]);
let filesRoute = document.getElementById("filesRoute");
for (let i = 0; i < locations.length; i++) {
    if (i > 0) {
        currentLoc = currentLoc + "-" + locations[i];
    } else {
        currentLoc = currentLoc + locations[i];
    }
    let element = document.createElement("a");
    element.href = currentLoc;
    let text = document.createTextNode(locations[i].charAt(0).toUpperCase()+locations[i].slice(1));
    element.appendChild(text);
    filesRoute.appendChild(element);
    filesRoute.appendChild(document.createTextNode(" > "));
}
*/
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
    }
};