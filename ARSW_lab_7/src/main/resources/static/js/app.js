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
    var drawing = false;
    var currentCanvasData = {
        // Otros datos del canvas actual
        points: [], // Inicialmente, la secuencia de puntos está vacía
    };


    // actualiza el contenido de author del HTML  mostrando un mensaje
    function getName() {
            $("#name").text(author + "'s " + "blueprints:");
    }
    //  obtener blueprints del autor especificado, si no se manda nada aparece el mensaje
    function getNameAuthorBlueprints() {
        author = $("#author").val();
        if (author === "" || !author) {
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
        // Obtener los puntos existentes del servidor API
        apimodule.getBlueprintsByNameAndAuthor(author, blueprintName, function(existingData) {
            // Combinar los puntos existentes con los puntos en memoria
            if (existingData && existingData.points) {
                currentCanvasData.points = existingData.points;
            } else {
                currentCanvasData.points = [];
            }

        // Repintar el dibujo en el canvas con la nueva combinación de puntos
        repaintCanvas();

        });
    }




    
    canvas.addEventListener("pointerdown", function (event) {
        if (!blueprintName) {
            console.log("No se ha seleccionado un canvas. Seleccione uno antes de dibujar.");
            return;
        }

        var x = event.clientX - canvas.getBoundingClientRect().left;
        var y = event.clientY - canvas.getBoundingClientRect().top;

        // Agregar el punto al final de la secuencia de puntos del canvas actual en memoria
        currentCanvasData.points.push({ x: x, y: y });

        // Repintar el dibujo en el canvas
        repaintCanvas();
    });




    function repaintCanvas() {
        if (!blueprintName) {
            console.log("No se ha seleccionado un canvas. Seleccione uno antes de dibujar.");
            return;
        }

        var ctx = canvas.getContext("2d");

        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar los puntos almacenados en la secuencia
        ctx.beginPath();
        ctx.moveTo(currentCanvasData.points[0].x, currentCanvasData.points[0].y);
        for (var i = 1; i < currentCanvasData.points.length; i++) {
            ctx.lineTo(currentCanvasData.points[i].x, currentCanvasData.points[i].y);
        }
        ctx.stroke();


    }
    





    document.getElementById("saveUpdateButton").addEventListener("click", function () {
        if (author && blueprintName) {
            // Obtener el lienzo actual y convertirlo en un arreglo de puntos
            const puntos = currentCanvasData.points;
            
            // Crear un objeto Blueprint
            const blueprint = { author: author, name: blueprintName, points: puntos };
    
            // Llamar a la función para actualizar el plano
            apimodule.updateBlueprint(author, blueprintName, blueprint)
            .then(function() {
                // Después de actualizar el plano, realizar la solicitud GET para obtener todos los planos
                apimodule.getBlueprintsByAuthor(author, function (data) {
                    // Calcular nuevamente los puntos totales del usuario
                    authorData(data);
                });
            })
            .catch(function(error) {
                console.error("Error updating blueprint: " + error);
            });
        }
    });


    function clearCanvas() {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }




    document.getElementById("createBlueprintButton").addEventListener("click", function () {
            // Solicitar el nombre del nuevo 'blueprint' al usuario
        const blueprintName = prompt("Ingrese Nombre del nuevo BluePrint");

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
            alert("Entre un Valor valido");
        }
    });




    document.getElementById("deleteBlueprintButton").addEventListener("click", function () {
        if (author && blueprintName) {
            if (confirm("¿Quieres borrar el blueptrint?")) {
                // Realizar una solicitud DELETE al recurso /blueprints para eliminar el plano actual
                apimodule.deleteBlueprint(author, blueprintName, function () {
                    
                    // Limpiar el canvas después de borrar el plano
                    clearCanvas();   
                    // Realizar una solicitud GET al recurso /blueprints para actualizar la interfaz
                    apimodule.getBlueprintsByAuthor(author, authorData);
                });
                location.reload();
            }
        } else {
            alert("Seleccione BluePrint para borrar");
        }
    });

   





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