//Variable global que almacena el paginado de casas
var page = 1;

//Metodo principal, inicio de la ejecución.
$(document).ready(function () {
    //Recuperamos las primeras 50 casas
    CargarCasas(page);

    //Inicializamos la ventana modal para mostrar información del Lord Commander
    InicializarModal();
});

//Función que carga las 50 casas correspondientes a la página que recibe como parametro
function CargarCasas(page) {
    //Llamada al api de casas
    $.get(`https://www.anapioficeandfire.com/api/houses/?page=${page}&pagesize=50`, function (todasLasCasas) {
        //Si ya no retorna casas ocultamos el botón de ver mas
        if (todasLasCasas.length == 0) {
            $('#viewMore').hide();
        } else {
            //Si recupera casas se habilita la opción de ver más.
            $('#viewMore').show();

            todasLasCasas.forEach(casa => {
                //Se extrae la información a mostrar para cada una de las casas
                let name = casa.name || "No tiene";
                let region = casa.region || "No tiene";
                let words = casa.words || "No tiene";
                let currentLord = casa.currentLord || "No tiene";
                let url = casa.url;
                let number = url.split("/").pop();

                if (currentLord !== "No tiene") {
                    let idCharacter = currentLord.split("/").pop();
                    currentLord =
                        `<a href="javascript:VerInfoLordCommander(${idCharacter});">ver más información del Lord</a>`;
                }

                //Construimos un elemento casa y lo añadimos al contenedor
                $('#contenedor-casas').append(
                    `<div class="casaBox">
                        <div class="casaBoxLeft">${number}</div>
                        <div class="casaBoxRight">- Nombre: ${name}<br>- Región: ${region}<br>- Frase: ${words}<br>- Lord: ${currentLord}<br></div>
                    </div>`
                );
            });
        }

    });
}

//Función que se activa al pulsar el botón "Ver más"
function VerMasCasas() {
    //Aumenta la paginación
    page++;
    //Recupera casas de la nueva página
    CargarCasas(page);
}

//Función que realiza la llamada para recuperar información del Lord Commander
function VerInfoLordCommander(idCharacter) {
    $.get(`https://www.anapioficeandfire.com/api/characters/${idCharacter}`, function (lordCommander) {
        $("#commanderName").html(lordCommander.name || "N/A");
        $("#commanderGender").html(lordCommander.gender || "N/A");
        $("#commanderCulture").html(lordCommander.culture || "N/A");
        $("#commanderBorn").html(lordCommander.born || "N/A");
        $("#commanderDied").html(lordCommander.died || "N/A");
        $("#commanderTitles").html(lordCommander.titles.join(', ') || "N/A");
        $("#commanderAliases").html(lordCommander.aliases.join(', ') || "N/A");
        ProcesarFather(lordCommander.father);
        ProcesarMother(lordCommander.mother);
        ProcesarSpouse(lordCommander.spouse);
        ProcesarAlianzas(lordCommander.allegiances);
        $("#dialog").dialog("open");
    });

}

//Busca la información del padre
function ProcesarFather(fatherUrl) {
    if (fatherUrl) {
        $.get(fatherUrl, function (persona) {
            $("#commanderFather").html(persona.name);
        });
    } else {
        $("#commanderFather").html('N/A');
    }

}

//Busca la información de la madre
function ProcesarMother(motherUrl) {
    if (motherUrl) {
        $.get(motherUrl, function (persona) {
            $("#commanderMother").html(persona.name);
        });
    } else {
        $("#commanderMother").html('N/A');
    }
}

//Busca la información del espos@
function ProcesarSpouse(spouseUrl) {
    if (spouseUrl) {
        $.get(spouseUrl, function (persona) {
            $("#commanderSpouse").html(persona.name);
        });
    } else {
        $("#commanderSpouse").html('N/A');
    }

}

//Función que procesa las alianzas de una casa, buscando los nombres haciendo uso del API.
function ProcesarAlianzas(alianzas) {
    //Alianzas es un string de urls
    $("#commanderAllegiances").html('');
    if (alianzas.length === 0) {
        $("#commanderAllegiances").html('N/A')
    } else {
        let todasLasAlianzas;
        $.each(alianzas, function (key, alianza) {
            $.get(alianza, function (casa) {
                if ($("#commanderAllegiances").html() === "")

                    $("#commanderAllegiances").append(casa.name);
                else
                    $("#commanderAllegiances").append(', ' + casa.name);
            });
        });
    }
}

//Inicializa la ventana modal informativa para mostrar la información del Lord Commander
function InicializarModal() {
    $("#dialog").dialog({
        autoOpen: false,
        width: 'auto',
        maxWidth: 600,
        height: 'auto',
        modal: true,
        fluid: true,
        resizable: false,
        show: {
            effect: "fade",
            duration: 750
        },
        hide: {
            effect: "fade",
            duration: 750
        }
    });
}

// Función que esconde o muestra el boton "Ir Arriba" según la posición del scroll. A partir del pixel 20 muestra el botón.
window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
};

// Función que regresa el scroll al tope de la página. Es llamada desde el boton "Ir Arriba"
function IrArriba() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}