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
    return{
        getBlueprintByAuthorAndName:getBlueprintByAuthorAndName,
        getNameAuthorBlueprints: getNameAuthorBlueprints
    }
})();