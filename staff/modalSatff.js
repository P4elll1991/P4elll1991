class modalStaff {

	

	takeData(){
		
		webix.ajax().get("/Staff/Give").then(function(data){
			data = data.json();
			
			data.forEach(function(val){
				val.id = val.Id;
				val.BooksStr = "";
				val.Books.forEach(function(v){
					val.BooksStr += "<p style = 'padding: 0px; margin: 0px; height: 25px;'> ISBN : " + v.Isbn + ", " + v.BookName + ", " + v.Datestart + " - " + v.Datefinish + ";</p>";
				});
			});
			$$("staffTable").parse(data);
			
		  });
	}

	giveData(parent) {
		parent.takeData();
	}
}