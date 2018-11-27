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
    let text = document.createTextNode(locations[i]);
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

if (locations[0] == 'Root') {
    select(files);
} else if (locations[0] == 'Compartidos') {
    select(shared);
} else if (locations[0] == 'Favoritos') {
    select(fav);
} else if (locations[0] == 'Papelera') {
    select(bin);
}