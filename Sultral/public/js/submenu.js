var botones = document.getElementsByClassName('option2');
var posx,posy;

for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", function(){
        
        var menu = document.createElement('div');
        menu.id = 'main-menu';
        menu.classList.add('menu-panel');

        let lastc = this.name;
        lastc = lastc.slice(lastc.length-1, lastc.length);

        let fileid = this.name;
        fileid = fileid.substring(0, fileid.length - 1);

        if(lastc == '+'){
            var link = document.createElement('a');
            link.href = '/Gestor/'+loc+'/'+fileid+'/del';
            link.classList.add('row');
        
            var texto = document.createElement('div');
            var tex = document.createTextNode('Eliminar');

            texto.appendChild(tex);
            link.appendChild(texto);
            menu.appendChild(link);

            link = document.createElement('a');
            link.classList.add('row');

            /* Modal Renombrar */
            let mascaraN = document.getElementsByClassName("mascaraN")[0];
            let btnCerrarN = document.getElementsByClassName("cerrarN")[0];

            function cerrarModalN(){
                mascaraN.className = mascaraN.className.replace(/\bactivoN\b/g, "");
                
            }

            mascaraN.addEventListener("click", function(){
                cerrarModalN();
            });

            btnCerrarN.addEventListener("click", function(){
                cerrarModalN();
            });
            link.addEventListener("click", function(){
                if (!hasClass(mascaraN, "activoN")) {
                    mascaraN.className += " activoN";
                }
            });
        
            texto = document.createElement('div');
            tex = document.createTextNode('Renombrar');

            texto.appendChild(tex);
            link.appendChild(texto);
            menu.appendChild(link);

            link = document.createElement('a');
            link.href = '/Gestor/'+loc+'/'+fileid+'/compartir';
            link.classList.add('row');
        
            texto = document.createElement('div');
            tex = document.createTextNode('Compartir');

            texto.appendChild(tex);
            link.appendChild(texto);
            menu.appendChild(link);

            var link = document.createElement('a');
            link.classList.add("btnMover");

            /* Modal Mover */
            let mascaraM = document.getElementsByClassName("mascaraM")[0];
            let btnCerrarM = document.getElementsByClassName("cerrarM")[0];

            function cerrarModalM(){
                mascaraM.className = mascaraM.className.replace(/\bactivoM\b/g, "");
                
            }

            mascaraM.addEventListener("click", function(){
                cerrarModalM();
            });

            btnCerrarM.addEventListener("click", function(){
                cerrarModalM();
            });
            link.addEventListener("click", function(){
                if (!hasClass(mascaraM, "activoM")) {
                    mascaraM.className += " activoM";
                }
            });
            var form = document.getElementsByClassName('mov');
            form[0].action = '/Gestor/'+loc+'/'+fileid+'/mover';
            link.classList.add('row');
        
            var texto = document.createElement('div');
            var tex = document.createTextNode('Mover');

            texto.appendChild(tex);
            link.appendChild(texto);
            menu.appendChild(link);
        }else if(lastc == '@'){
            var link = document.createElement('a');
            link.href = '/Gestor/'+loc+'/'+fileid+'/restore';
            link.classList.add('row');
        
            var texto = document.createElement('div');
            var tex = document.createTextNode('Restaurar');

            texto.appendChild(tex);
            link.appendChild(texto);
            menu.appendChild(link);

            link = document.createElement('a');
            link.href = '/Gestor/'+loc+'/'+fileid+'/exterminate';
            link.classList.add('row');
        
            texto = document.createElement('div');
            tex = document.createTextNode('Destruir');

            texto.appendChild(tex);
            link.appendChild(texto);
            menu.appendChild(link);
        }else if(lastc == '-'){
            var link = document.createElement('a');
            link.href = '/Gestor/'+loc+'/'+fileid+'/del';
            link.classList.add('row');
        
            var texto = document.createElement('div');
            var tex = document.createTextNode('Eliminar');

            texto.appendChild(tex);
            link.appendChild(texto);
            menu.appendChild(link);

            link = document.createElement('a');
            link.classList.add('row');
        
            texto = document.createElement('div');
            tex = document.createTextNode('Renombrar');

            texto.appendChild(tex);
            link.appendChild(texto);
            menu.appendChild(link);

            link = document.createElement('a');
            link.classList.add('row');
        
            texto = document.createElement('div');
            tex = document.createTextNode('Dejar de compartir');

            texto.appendChild(tex);
            link.appendChild(texto);
            menu.appendChild(link);
        }

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