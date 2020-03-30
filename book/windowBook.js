class windowBook {

    
    
    
    formRules = {
        "Isbn":webix.rules.isNotEmpty,
        "Isbn":webix.rules.isNumber,
        "BookName":webix.rules.isNotEmpty,
        "Autor":webix.rules.isNotEmpty,
        "Publisher":webix.rules.isNotEmpty,
        "Name":webix.rules.isNotEmpty,
        "Year":webix.rules.isNotEmpty,
        "Year":webix.rules.isNumber,
            };
    
    getWindow(staffOptions){
        console.log(staffOptions);
        this.window = {
            view:"window",
            id:"windowBook",
            height:600,
            position:"center",
            zIndex:1000,
            modal:true, 
            head:{
              view:"toolbar", cols:[
                
                { view:"label", label: "Изменить данные", align:"center", },
                { view:"icon", id:"exitWindowBook", icon:"mdi mdi-close", align: 'right', }
              ]
            },
      
            body:{
              rows: [
                  {view:"form", id:"formBook",      
                  elements: [
                    { view:"text", name:"Isbn", label:"ISBN",},
                    { view:"text", name:"BookName", label:"Название" },
                    { view:"text", name:"Autor", label:"Автор" },
                    { view:"text", name:"Publisher", label:"Издатель" },
                    { view:"text", name:"Year", label:"Год" },
                    { view:"richselect", id: "Status", name:"Status",  label:"Статус",  value:"В наличии", options:["В наличии", "Нет в наличии"]},
                    { view:"richselect", id:"Name", name:"Name",  label:"Сотрудник", hidden: true, options:staffOptions, minWidth: 500},
                    { view:"button", id:"updateBookTab", type:"icon", icon:"mdi mdi-check", }
                    ],
                      rules: this.formRules,
                  },
      
              ]
               
            } 
        };

        return this.window;
    }
}