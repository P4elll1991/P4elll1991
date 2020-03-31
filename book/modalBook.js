class modalBook {

	

	takeData(){
		
		webix.ajax().get("/Books/Give").then(function(data){
			data = data.json();
			data.forEach(function(val){
				val.id = val.Id;
			});
            $$("bookTable").parse(data);
		  });
		
	}

	giveData(parent) {
		parent.takeData();
	}
}