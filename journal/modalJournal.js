class modalJournal {

	

	takeData(){

		webix.ajax().get("/Journal/Give").then(function(data){
			data = data.json();
			console.log(data);
            $$("journalTable").parse(data);
		  });

	}

	giveData(parent) {
		parent.takeData();
	}
}