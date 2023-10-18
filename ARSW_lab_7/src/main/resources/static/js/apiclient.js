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
        updateBlueprint: function (author, blueprintName, blueprint, callback) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: `/blueprints/${author}/${blueprintName}`,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(blueprint),
                    success: function() {
                        resolve();
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
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
        },
        deleteBlueprint: function (author, blueprintName) {
            return new Promise(function (resolve, reject) {
                resolve(
                    $.ajax({
                        type:"DELETE",
                        url: `/blueprints/${author}/${blueprintName}`,
                        success: function () {
                            callback();
                        },
                        error: function(error) {
                            reject(error);
                        }
                    })
                )
            });
        },


        

    }
})();