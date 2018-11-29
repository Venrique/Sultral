var botones = document.getElementsByClassName('option2');

for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", function(){

        var menu = document.createElement('div');
        menu.id = 'main-menu';
        menu.classList.add('menu-panel');

        var link = document.createElement('a');
        link.classList.add('row');
       
        var texto = document.createElement('div');
        var tex = document.createTextNode('Eliminar');

        texto.appendChild(tex);
        link.appendChild(texto);
        menu.appendChild(link);

        var link = document.createElement('a');
        link.classList.add('row');
       
        var texto = document.createElement('div');
        var tex = document.createTextNode('Renombrar');

        texto.appendChild(tex);
        link.appendChild(texto);
        menu.appendChild(link);

        var opciones = document.getElementById('temp');

        while (opciones.firstChild) {
            opciones.removeChild(opciones.firstChild);
        }


        opciones.appendChild(menu);

        var x = event.clientX-80;
        var y = event.clientY-10;

        var mainmenu = document.getElementById('main-menu');
        console.log(x+ ' '+y);
        mainmenu.style.top = y+'px';
        mainmenu.style.left = x+'px';
        
    });
}