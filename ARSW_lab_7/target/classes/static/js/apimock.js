//@author hcadavid

apimock=(function(){

	var mockdata=[];

	mockdata["johnconnor"]=	[{author:"johnconnor","points":[{"x":150,"y":120},{"x":215,"y":115}],"name":"house"},
	 {author:"johnconnor","points":[{"x":340,"y":240},{"x":15,"y":215}],"name":"gear"}];
	mockdata["maryweyland"]=[{author:"maryweyland","points":[{"x":140,"y":140},{"x":115,"y":115}],"name":"house2"},
	 {author:"maryweyland","points":[{"x":140,"y":140},{"x":115,"y":115}],"name":"gear2"}];
	mockdata["Sergio"] = [{ author: "Sergio", "points": [{ "x": 15, "y": 30 }, { "x": 50, "y": 50 }], "name": "pruebaSergio" },
	 { author: "Sergio", "points": [{ "x": 55, "y": 85 }, { "x": 200, "y": 150 }], "name": "pruebaSergio2" }];
	mockdata["Nicolas"] = [{ author: "Nicolas", "points": [{ "x": 70, "y": 80 }, { "x": 170, "y": 180 }], "name": "pruebaNicolas" },
	 { author: "Nicolas", "points": [{ "x": 80, "y": 90 }, { "x": 150, "y": 110 }], "name": "pruebaNicolas2" }];
	 mockdata["awa"] = [{ author: "awa", "points": [{ "x": 10, "y": 80 }, { "x": 150, "y": 90 }], "name": "pruebaawa" },
	 { author: "awa", "points": [{ "x": 80, "y": 50 }, { "x": 190, "y": 10 }], "name": "pruebaawa2" }];
 


	return {
		getBlueprintsByAuthor:function(authname,callback){
			callback(
				mockdata[authname]
			);
		},

		getBlueprintsByNameAndAuthor:function(authname,bpname,callback){

			callback(
				mockdata[authname].find(function(e){return e.name===bpname})
			);
		}
	}	

})();



// var fun=function(list){
// 	console.info(list);
// }

// apimock.getBlueprintsByAuthor("johnconnor",fun);
// apimock.getBlueprintsByNameAndAuthor("johnconnor","house",fun);