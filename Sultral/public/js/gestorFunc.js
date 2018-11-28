let locations = loc.split("-");
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

if (locations[0] == 'root') {
    select(files);
} else if (locations[0] == 'compartidos') {
    select(shared);
} else if (locations[0] == 'favoritos') {
    select(fav);
} else if (locations[0] == 'papelera') {
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
