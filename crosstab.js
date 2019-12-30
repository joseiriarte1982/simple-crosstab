   //Checamos la variable external vacia que nos indica que recien iniciamos en la pagina
   
   /*Podemos usar modernizr custom build para checar sessionstorage
    Modernizr es una libreria que detecta features de HTML5 igual
    hoy en dia y con el paso del tiempo ya no es necesario ya que html5 esta
    completamente integrado
    */

    /*! modernizr 3.6.0 (Custom Build) | MIT *
    * https://modernizr.com/download/?-sessionstorage-setclasses !*/
    !function(e,n,s){function o(e,n){return typeof e===n}function a(){var e,n,s,a,t,f,l;for(var c in r)if(r.hasOwnProperty(c)){if(e=[],n=r[c],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(a=o(n.fn,"function")?n.fn():n.fn,t=0;t<e.length;t++)f=e[t],l=f.split("."),1===l.length?Modernizr[l[0]]=a:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=a),i.push((a?"":"no-")+l.join("-"))}}function t(e){var n=l.className,s=Modernizr._config.classPrefix||"";if(c&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(o,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(n+=" "+s+e.join(" "+s),c?l.className.baseVal=n:l.className=n)}var i=[],r=[],f={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout(function(){n(s[e])},0)},addTest:function(e,n,s){r.push({name:e,fn:n,options:s})},addAsyncTest:function(e){r.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=f,Modernizr=new Modernizr;var l=n.documentElement,c="svg"===l.nodeName.toLowerCase();Modernizr.addTest("sessionstorage",function(){var e="modernizr";try{return sessionStorage.setItem(e,e),sessionStorage.removeItem(e),!0}catch(n){return!1}}),a(),t(i),delete f.addTest,delete f.addAsyncTest;for(var u=0;u<Modernizr._q.length;u++)Modernizr._q[u]();e.Modernizr=Modernizr}(window,document);

    var crosstab = {};

    if (Modernizr.sessionstorage) {

        //Aqui manipulamos nuestros datos metemos y sacamos a local storage los metemos como string JSON.stringify(datoLocal);
        //datoLocal puede ser articulos en un objeto, un array o cualquier cosa que ocupemos pasar de un lugar a otro en nuestros tabs
           
            crosstab.datoLocal = sessionStorage.getItem("algunosDatos");
            

        
             /* 
            //Si nuestros datos fuera un array con objetos sacamos el array y lo ponemos en una variable local a esta funcion que usaremos
            // de otra manera solo obtenemos el dato dependiendo del tipo que sea
			if (datoLocal) {
			    datoLocal = JSON.parse(datoLocal);
			}else{
				datoLocal = [];
            }
            */
           crosstab.datoLocal = nuevosDatos;
            
            //Ya tenemos nuestro datoLocal
            //Ahora empujamos nuevos datos, borramos o lo que sea
            var jsonDatoLocal = JSON.stringify(crosstab.datoLocal);
            
            sessionStorage.setItem("datoLocal",jsonDatoLocal);
			memoryStorage.datoLocal = jsonDatoLocal;
			localStorage.setItem('algunosDatos', jsonDatoLocal );


    }

    //Si solo se cambio el url es decir hubo un popstate history.replace o cualquier cosa pues ponemos external a 0
    //Esto nos servira cuando queramos dejar la pagina y saber si es que estamos refrescando
    window.onpopstate = function(event) {
        external = "0";
    }
    //inicializamos windows memory storage como un objeto vacio
    window.memoryStorage = {};


    // Inicialiamos o traemos el datoLocal por ejemplo articulos en un carrito que anteriormente metimos a la canasta
    //por ejemplo en algunosDatos variable que se vera mas adelante
    //var datoLocal;
    
    //iniciamos una funcion para checar los objetos vacios
	function isEmpty(o) {
		for (var i in o) {
	  		return false;
	 	}
	 	return true;
	};
    // Si no existe ningun tab abierto en tabCount lo inicializamos con 0 
	if(isEmpty(localStorage.tabCount)){
		localStorage.setItem("tabCount","0");
    }
    
    if(parseInt(localStorage.tabCount) == 1 && isEmpty(memoryStorage) && !isEmpty(localStorage.setItem('popupstage'))){
		sessionStorage.setItem("datoLocal",localStorage.getItem('popupstage'));
		memoryStorage.datoLocal = localStorage.getItem('popupstage');
		localStorage.removeItem('popupstage');
    }
    
    if (isEmpty(memoryStorage)) {
        // Preguntar a otras tabs por memoryStorage con "get" session storage y guardamos la fecha
        localStorage.setItem('getSessionStorage', Date.now());
    };

    //De entrada agregamos un listener al storage cualquier evento debemos de leerlo
    //tambien pasamos el evento cuando se use el storage
    window.addEventListener('storage', function(event) {
        // Algun tab pregunto por memoryStorage -> send it
        if (event.key == 'getSessionStorage') {
            //En este caso pasamos todo lo que hay en memoryStorage y lo ponemos en localstorage-> sessionStorage
            localStorage.setItem('sessionStorage', JSON.stringify(memoryStorage));
            localStorage.removeItem('sessionStorage');
        } else if (event.key == 'sessionStorage' && isEmpty(memoryStorage)) {
            //memoryStorage esta vacio -> llenalo
            //Checamos todas las variables globales del storage y las pasamos al local con las que estaremos trabajando
            if(!isEmpty(localStorage.algunosDatos)){
                sessionStorage.setItem("datoLocal",localStorage.getItem("algunosDatos"));
                crosstab.datoLocal = JSON.parse(localStorage.getItem('algunosDatos'));
                /////////////Acutualizamos cuenta y removemos cosas dependiendo de para que usemos nuestra libreria o mandamos notificaciona
            }else{
                var data = JSON.parse(event.newValue), value;
                for (key in data) {
                    memoryStorage[key] = data[key];
                }
                sessionStorage.setItem("datoLocal", memoryStorage.datoLocal);
                crosstab.datoLocal = JSON.parse(sessionStorage.getItem('datoLocal'));
                /////////////Acutualizamos cuenta y removemos cosas dependiendo de para que usemos nuestra libreria o mandamos notificacion
                showSessionStorage();
            }
            
        // para si no esta vacia la canasta
        }
        
    });

    //Antes de cerrar cualquier tab
    window.onbeforeunload = function() {
        //Si la cuenta de tabs es mayor que uno pues simplemente reducimos
        if(parseInt(localStorage.tabCount) > 1){
            localStorage.setItem("tabCount",parseInt(localStorage.tabCount) - 1);
            //Si es el unico igual reducimos el tabcount pero checamos si el link hacia donde vamos es externo
        }else if(parseInt(localStorage.tabCount) == 1){
            localStorage.setItem("tabCount",parseInt(localStorage.tabCount) - 1);	
            if(external != "" && external == "0"){
                // external quiere decir que si no va o viene afuera y si solo hay un tab abierto
                // y esta siendo recargado pues hay que meter memoryStorage en localStorage popupstage
                if(parseInt(localStorage.tabCount) == 1 && !isEmpty(memoryStorage)){
                    localStorage.setItem('popupstage', JSON.stringify(memoryStorage));	
                }
            }else{
                // Limpiamos la session y localstorage
                sessionStorage.clear();
                localStorage.clear();
            }
        }
    };

    /* This code is only for the UI in the demo, it's not part of the sulotion */
    var el;
    function showSessionStorage() {
        console.log(!isEmpty(memoryStorage) ? memoryStorage : 'memoryStorage is empty');
    }
    if (window.addEventListener) {
        // Navegadores normales
        window.addEventListener("storage", handler, false);
    } else {
        // para Internet Explorer, para que hacer la vida mas dificil
        window.attachEvent("onstorage", handler);
    }

    function handler(e) {
        if (e.key == 'algunosDatos') {					
            crosstab.datoLocal = JSON.parse(localStorage.getItem('algunosDatos'));
            sessionStorage.setItem("datoLocal",localStorage.getItem('algunosDatos'));
            memoryStorage.datoLocal = localStorage.getItem('algunosDatos');
            /////////////Acutualizamos cuenta y removemos cosas dependiendo de para que usemos nuestra libreria o mandamos notificacion
           
        }
    }