var botones = document.getElementsByClassName('option2');
var posx,posy;

for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", function(){

        var menu = document.createElement('div');
        menu.id = 'main-menu';
        menu.classList.add('menu-panel');
        var link = document.createElement('a');
        link.href = '/Gestor/'+this.name+'/del/user';
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

        posx = event.clientX-80;
        posy = event.clientY-10;

        var mainmenu = document.getElementById('main-menu');
        console.log(posx+ ' '+posy);
        mainmenu.style.top = posy+'px';
        mainmenu.style.left = posx+'px';
        
    });
}

var body = document.getElementById('viewer');
body.addEventListener('click', function(){
    var submenu = document.getElementById('main-menu');

    if(event.clientX < posx+100 || event.clientX > posx+100){
        if(event.clientY < posy-10 || event.clientY > posy+10){
            submenu.style.display = "none";
        }
    }
});