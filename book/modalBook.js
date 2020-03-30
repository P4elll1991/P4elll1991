class modalBook {

	

	takeData(){
		
		webix.ajax().get("/Books/Give").then(function(data){
			data = data.json();
			console.log(data);
            $$("bookTable").parse(data);
		  });
		
	}

	giveData(parent) {
		parent.takeData();
	}
}