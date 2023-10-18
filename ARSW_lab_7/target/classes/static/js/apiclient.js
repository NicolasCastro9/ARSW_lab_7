var apiclient = (function(){
    var url='http://localhost:8080';
    return {
        getBlueprintsByAuthor: function (authname, callback) {
            $.get(url + "/blueprints/" + authname, function (data) {
                callback(data);
            });
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            $.get(url + "/blueprints/" + authname + "/" + bpname, function (data) {
                callback(data);
            });
        },

        saveOrUpdateBlueprint: function(author, blueprintName, blueprint, callback) {
            $.ajax({
                url: `/blueprints/${author}/${blueprintName}`,
                type: 'PUT',
                data: JSON.stringify(blueprint),
                contentType: 'application/json',
                success: function () {
                    callback(); // Llamamos al callback después de la operación PUT
                },
            });
        },

        createNewBlueprint: function (author, blueprintName, callback) {
            const newBlueprint = { author: author, name: blueprintName, points: [] };
        
            // Realiza una solicitud POST para crear el nuevo blueprint
            $.ajax({
                url: '/blueprints',
                type: 'POST',
                data: JSON.stringify(newBlueprint),
                contentType: 'application/json',
                success: function () {
                    callback();
                },
            });
        }
    }
})();