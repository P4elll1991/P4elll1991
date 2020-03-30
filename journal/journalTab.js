class journalTab {


    constructor(){
    this.modal = new modalJournal();
    this.journal = this.modal.giveData(this.modal);
    console.log(this.journal);
  }

    journal = [
      {id: 0, Event: "Выдано", nameBook:"Тихий Дон", ISBNLog: 134, date: "12-2-20", nameWockerLog: "Иванов Иван Иванович", wockerId: 453, departmentLog:"12-2-20", positionLog:"12-5-20", },
      {id: 1, Event: "Выдано", nameBook:"Горе от ума", ISBNLog: 2341, date: "16.1.20", nameWockerLog: "Петров Петр Петрович", wockerId: 656, departmentLog:"12-2-20", positionLog:"12-5-20", },
      {id: 2, Event: "Выдано", nameBook:"Атлант расправил плечи", ISBNLog: 165876, date: "7.11.17", nameWockerLog: "Александров Адександр Александрович", wockerId:  98, departmentLog:"12-2-20", positionLog:"12-5-20", },
    ];
  
    buttons = [
      { id:"goToEmployeeLog", view:"button", type:"icon", icon:"mdi mdi-account", value: "Перейти к сотруднику"},
      { id:"goToBookLog", view:"button", type:"icon", icon:"mdi mdi-book-open-variant", value: "Перейти к книге"},
    ];
  
    columns = [
      { id:"Event",    header:"Событие",  sort: "string",  adjust:true,},
      { id:"nameBook",   header:"Название",   sort: "string",  adjust:true,},
      { id:"ISBNLog",  header:"ISBN",   sort: "int",  adjust:true,},
      { id:"date",  header:"Дата события",  format:webix.i18n.dateFormatStr, sort: "date",  adjust:true,},
      { id:"nameWockerLog",  header:"ФИО",   sort: "string",  adjust:true,},
      { id:"departmentLog",  header:"Отдел",   sort: "string",  adjust:true,},
      { id:"positionLog",  header:"Должность",   sort: "string",  adjust:true,},
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
            data: this.journal, select:true, 
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
      console.log(item);
      if (!item) return;
      var item_id = item.id;
      var focusId = item.ISBNLog;
      if (!focusId) return;

      $$("journalTable").unselect(item_id);
      $$("bookTable").unselectAll();
      $$("bookTable").select(focusId,true);
      $$("bookView").show();
      $$("bookTable").showItem(focusId);

    }


    focusStaff() {
      var item = $$("journalTable").getSelectedItem();
      console.log(item);
      if (!item) return;
      var item_id = item.id;
      var focusId = item.wockerId;
      if (!focusId) return;

      $$("journalTable").unselect(item_id);
      $$("staffTable").unselectAll();
      $$("staffTable").select(focusId,true);
      $$("staffView").show();
      $$("staffTable").showItem(focusId);
    }
    
  }
    