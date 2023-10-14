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
        }
    }
})();