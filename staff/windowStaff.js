class windowStaff {
    
    formElements = [
        { view:"text", name:"Name", label:"ФИО" },
        { view:"text", name:"Department", label:"Отдел" },
        { view:"text", name:"Position", label:"Должность" },
        { view:"text", name:"Cellnumber", label:"Телефон" },
        { view:"button", id:"updateStaff", type:"icon", icon:"mdi mdi-check", },
];
    
    formRules = {
        "Name":webix.rules.isNotEmpty,
        "Department":webix.rules.isNotEmpty,
        "Position":webix.rules.isNotEmpty,
        "Cellnumber":webix.rules.isNotEmpty,
        "Cellnumber":webix.rules.isNumber,
            };
    
    getWindow(){
        
        this.window = {
            view:"window",
            id:"windowStaff",
            height:600,
            position:"center",
            zIndex:1000,
            modal:true, 
            head:{
              view:"toolbar", cols:[
                
                { view:"label", label: "Изменить данные", align:"center", },
                { view:"icon", id:"exitWindowStaff", icon:"mdi mdi-close", align: 'right', }
              ]
            },
      
            body:{
              rows: [
                  {view:"form", id:"formStaff",      
                  elements: this.formElements,
                      rules: this.formRules,
                  },
      
              ]
               
            } 
        };

        return this.window;
    }
}