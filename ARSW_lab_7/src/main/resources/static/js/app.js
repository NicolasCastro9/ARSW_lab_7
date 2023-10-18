var useApiClient = true;

var apimodule; // Variable global para almacenar el módulo seleccionado

// Condición para cargar el módulo adecuado
if (useApiClient) {
    apimodule = apiclient;
} else {
    apimodule = apimock;
}

var app = (function (){
    var author;
    var blueprintName;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var currentPoints = [];
    var drawing = false;

    // actualiza el contenido de author del HTML  mostrando un mensaje
    function getName() {
            $("#name").text(author + "'s " + "blueprints:");
    }
    //  obtener blueprints del autor especificado, si no se manda nada aparece el mensaje
    function getNameAuthorBlueprints() {
        author = $("#author").val();
        
        if (author === "") {
            alert("Ingese un Nombre");
        } else {
            apimodule.getBlueprintsByAuthor(author,authorData);
                

        }
    }
    // utiliza el método map() para tomar una lista de blueprints y transformar cada elemento 
    // de la lista en un nuevo objeto que contiene solo el nombre y la cantidad de puntos asociados a ese bluePrint.
    var authorData = function( data) {
        $("#table tbody").empty();
            if (data === undefined) {
                alert("No existe el autor");
                $("#name").empty();
                $("#points").text("Total Points");
                $("#nameblu").empty();
            } else {
                getName();
                const datanew = data.map((elemento) => {
                    return {
                        name: elemento.name,
                        puntos: elemento.points.length
                    }
                });
            //  toma cada uno de los elementos del arreglo datanew 
            //  y generar filas de una tabla en un documento HTML utilizando jQuery
            datanew.map((elementos) => {
                $("#table > tbody:last").append($("<tr><td>" + elementos.name + "</td><td>" + elementos.puntos.toString() +
                "</td><td>" + "<button  id=" + elementos.name + " onclick=app.getBlueprintByAuthorAndName(this)>open</button>"
                 + "</td>"));
            });
            // se realiza una operación de reducción (reduce) sobre el arreglo datanew para calcular la suma 
            //total de puntos de todos los planos del usuario,
            //y luego se actualiza el contenido de un elemento en el documento HTML
            const totalPuntos = datanew.reduce((suma, {puntos}) => suma + puntos, 0);

            $("#points").text("Total user points: " + totalPuntos);
        }
    }

    function getBlueprintByAuthorAndName(data) {
        author = $("#author").val();
        blueprintName = data.id;
        $("#nameblu").text("Current blueprint: " + blueprintName);
        apimodule.getBlueprintsByNameAndAuthor(author, blueprintName, printPoints);
    }

    function printPoints(data) {
        if (data && data.points && data.points.length > 0) {
            const puntos = data.points;
            var c = document.getElementById("canvas");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, c.width, c.height);
            ctx.restore();
            ctx.beginPath();
            for (let i = 1; i < puntos.length; i++) {
                ctx.moveTo(puntos[i - 1].x, puntos[i - 1].y);
                ctx.lineTo(puntos[i].x, puntos[i].y);
                if (i === puntos.length - 1) {
                    ctx.moveTo(puntos[i].x, puntos[i].y);
                    ctx.lineTo(puntos[0].x, puntos[0].y);
                }
            }
            ctx.stroke();
        }
    }
    //escucha el evento "mousedown" en el lienzo. Cuando un usuario hace clic y 
    //mantiene presionado el botón del mouse en el lienzo, se activa este evento
    canvas.addEventListener("mousedown", function (event) {
        if (blueprintName) {
            drawing = true;
        }
    });
    // Este evento se dispara cuando el botón del ratón se hace clic en el área del canvas.
    // se registra la posición del clic en x e y y se agrega un punto a la secuencia de puntos (currentPoints). 
    // Luego, se vuelve a pintar el canvas para reflejar la secuencia de puntos actualizada.
    canvas.addEventListener("click", function (event) {
        if (blueprintName) {
            var x = event.clientX - canvas.getBoundingClientRect().left;
            var y = event.clientY - canvas.getBoundingClientRect().top;
            currentPoints.push({ x, y });
            repaintCanvas();
        }
    });
    // Este evento se dispara cuando el botón del ratón se suelta después de ser presionado.
    // indicar que el usuario ha dejado de dibujar.
    canvas.addEventListener("mouseup", function () {
        drawing = false;
    });


    function repaintCanvas() {
        context.beginPath();
        context.strokeStyle = 'black';  
        for (let i = 1; i < currentPoints.length; i++) {
            context.moveTo(currentPoints[i - 1].x, currentPoints[i - 1].y);
            context.lineTo(currentPoints[i].x, currentPoints[i].y);
        }
        context.stroke();
    }

    // Manejar el evento del botón 'Save/Update'
    $("#saveUpdateButton").click(function () {   
        if (author && blueprintName) {
            // Obtener los puntos del canvas
            const puntos = currentPoints;
            
            // Crear un objeto Blueprint
            const blueprint = { author: author, name: blueprintName, points: puntos };
            apimodule.saveOrUpdateBlueprint(author, blueprintName, blueprint, function () {
                // Realizar una petición GET al recurso /blueprints
                apimodule.getBlueprintByAuthorAndName(blueprintName, function () {
                    // Limpiar el canvas
                    clearCanvas();
                });
            });
            
        }
    });
    

    // Manejar el evento del botón 'Create new blueprint'
    $("#createBlueprintButton").click(function () {
            // Solicitar el nombre del nuevo 'blueprint' al usuario
        const blueprintName = prompt("Enter the name for the new blueprint:");

        if (blueprintName !== null && blueprintName.trim() !== "") {
            // Limpiar el canvas
            clearCanvas();

            // Realiza una solicitud POST al recurso /blueprints para crear el nuevo plano
            apimodule.createNewBlueprint(author, blueprintName, function () {
                // Realiza una solicitud GET al recurso /blueprints para actualizar la interfaz
                apimodule.getBlueprintsByAuthor(author, authorData);
            });
        } else {
            // Manejar el caso en que el nombre sea nulo o una cadena vacía
            alert("Please enter a valid blueprint name.");
        }
    });

    function clearCanvas() {
        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        currentPoints = [];
    }

    return{
        getBlueprintByAuthorAndName:getBlueprintByAuthorAndName,
        getNameAuthorBlueprints: getNameAuthorBlueprints,
        init: function () {
            console.info('initialized');

            //   Comprueba si el navegador admite el modelo PointerEvent
            if (window.PointerEvent) {
                //   Maneja eventos de PointerEvent
                canvas.addEventListener("pointerdown", function (event) {
                    var x = event.pageX;
                    var y = event.pageY;
                    console.log('PointerEvent: pointerdown at ' + x + ',' + y);
                });
            } else {
                //   Maneja eventos de mousedown (para dispositivos con mouse)
                canvas.addEventListener("mousedown", function (event) {
                    var x = event.clientX;
                    var y = event.clientY;
                    console.log('MouseDown: mousedown at ' + x + ',' + y);
                });
            }
        },
        
    }
})();

app.init();