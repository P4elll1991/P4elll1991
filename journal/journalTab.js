class journalTab {


    constructor(){
    this.modal = new modalJournal();
    this.modal.giveData(this.modal);
  }
  
    buttons = [
      { id:"goToEmployeeLog", view:"button", type:"icon", icon:"mdi mdi-account", value: "Перейти к сотруднику"},
      { id:"goToBookLog", view:"button", type:"icon", icon:"mdi mdi-book-open-variant", value: "Перейти к книге"},
    ];
  
    columns = [
      { id:"Event",    header:"Событие",  sort: "string",  adjust:true,},
      { id:"BookNameJ",   header:"Название",   sort: "string",  adjust:true,},
      { id:"IsbnJ",  header:"ISBN",   sort: "int",  adjust:true,},
      { id:"DateEvent",  header:"Дата события",  format:webix.i18n.dateFormatStr, sort: "date",  adjust:true,},
      { id:"NameJ",  header:"ФИО",   sort: "string",  adjust:true,},
      { id:"CellnumberJ",  header:"Телефон",   sort: "string",  adjust:true,},
      ];
  
    init(){
      this.view = {
        view:"layout",
        padding:10,
        id: "journalView", 
        type: "wide",
    
        rows: [
          { type: "wide",  
            rows:[ 
    
            { id:"journalSidebar", select:false,// меню
              cols: this.buttons},
            
            // Таблица
    
            {
            view:"datatable", 
            id:"journalTable", 
            wordBreak: "break-all", 
            css:"webix_data_border webix_header_border",
            multiselect:true, 
            columns: this.columns, 
            select:true, 
            },
    
          ]},
        ],             
      }
      return this.view;
    }

    getView() {
      return this.init();
    }

    editeEvents(parent){

      $$("goToBookLog").attachEvent("onItemClick", function(){
        parent.focusBook();
      });

      $$("goToEmployeeLog").attachEvent("onItemClick", function(){
        parent.focusStaff("staffTable");
      });
  
    }

    focusBook() {
      var item = $$("journalTable").getSelectedItem();
      
      if (!item) return;
      var item_id = item.id;
      var focusId = item.BookId;
      if (!focusId) return;

      $$("journalTable").unselect(item_id);
      $$("bookTable").unselectAll();
      $$("bookTable").select(focusId,true);
      $$("bookView").show();
      $$("bookTable").showItem(focusId);

    }


    focusStaff() {
      var item = $$("journalTable").getSelectedItem();
      if (!item) return;
      var item_id = item.id;
      var focusId = item.EmployeeId;
      if (!focusId) return;

      $$("journalTable").unselect(item_id);
      $$("staffTable").unselectAll();
      $$("staffTable").select(focusId,true);
      $$("staffView").show();
      $$("staffTable").showItem(focusId);
    }
    
  }
    