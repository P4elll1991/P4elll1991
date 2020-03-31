class staffTab{

  constructor(){
    this.modal = new modalStaff();
    this.modal.giveData(this.modal);
  }
    
  
  buttons = [{ id:"changeStaff", view:"button", type:"icon", icon:"mdi mdi-account-edit", value: "Изменить",},
  { id:"pushStaff",  view:"button", type:"icon", icon:"mdi mdi-account-plus", value: "Добавить"},
  { id:"goToBook", view:"button", type:"icon", icon:"mdi mdi-book-open-variant", value: "Перейти к книге"},
  { id:"deleteStaff", view:"button", type:"icon", icon:"mdi mdi-account-remove", value: "Удалить"},];
  
  columns = [{ id:"ch2", header:{ content:"masterCheckbox", contentId:"mc1" }, template:"{common.checkbox()}", adjust: true,},
  { id:"Name",   header:"ФИО", adjust:true, sort: "int",},
  { id:"Department",  header:"Отдел", adjust: true, sort: "string"},
  { id:"Position",  header:"Должность", adjust:true, sort: "string"},
  { id:"Cellnumber",  header:"Телефон", adjust:true, sort: "int",},
  { id:"BooksStr",  header:"Книги в пользовании", adjust:true, width: 250, sort: "string"},
  ];
    
  init() {
    this.view = {
      view:"layout",
      padding:10,
      id: "staffView", 
      type: "wide",
      
  
      rows: [
        { type: "wide",  
          rows:[ 
  
          { id:"staffSidebar", select:false,// меню
            cols: this.buttons},
          
          // Таблица
  
          {
          view:"datatable", 
          id:"staffTable", 
          wordBreak: "break-all", 
          css:"webix_data_border webix_header_border",
          fixedRowHeight:false,
          multiselect:true, 
          columns: this.columns, 
          data: this.staff, select:true, 
          },
  
        ]},
      ],             
    }
    return this.view;
  }

  initWindow() {
      this.update = new windowStaff();
      this.window = this.update.getWindow();
      return this.window;
    }

  getView() {
    return this.init();
  }
  
  editeEvents(parent){
      $$("staffTable").attachEvent("onresize", function(){
        $$("staffTable").adjustRowHeight(null, true); 
      });
      $$("deleteStaff").attachEvent("onItemClick", function(){
        parent.delete();
      });
      $$("changeStaff").attachEvent("onItemClick", function(){
        parent.checkWin = true;
        var item_data = $$("formStaff").getValues()
        var check = item_data.name;
        if(check != "")
             $$("windowStaff").show();
      });

      $$("staffTable").attachEvent("onItemDblClick", function(){
        parent.checkWin = true;
        var item_data = $$("formStaff").getValues()
        var check = item_data.name;
        if(check != "")
             $$("windowStaff").show();
      });

      $$("pushStaff").attachEvent("onItemClick", function(){
        parent.checkWin = false;
        $$("formStaff").clear();
        $$("windowStaff").show();
      });

      $$("staffTable").attachEvent("onAfterSelect", function(){
           parent.afterSelect();
      });

      $$("staffTable").attachEvent("onAfterUnSelect", function(selection){
          parent.afterUnSelect(selection);
           
      });

      $$("exitWindowStaff").attachEvent("onItemClick", function() {
          $$("windowStaff").hide();
          $$("formStaff").clear();
          $$("formStaff").clearValidation();
          parent.afterSelect();
      });

      $$("updateStaff").attachEvent("onItemClick", function(){
          parent.updateTab(parent.checkWin);

      });

      $$("goToBook").attachEvent("onItemClick", function(){
        parent.focus();
      });

      $$("staffTable").attachEvent("onCheck", function(rowId, colId, state){
        if (state == 1) {
          $$("staffTable").select(rowId, true);
        } else if (state == 0){
          $$("staffTable").unselect(rowId);
        }
      });
  
    }

    delete(){
    var list = $$("staffTable");
    var item_id = list.getSelectedId();
    var item = list.getSelectedItem();
    
    if (!Array.isArray(item)) {
      if (item_id){
        webix.confirm({
            text: "Вы действительно хотите удалить сотрудника",
            cancel: "Нет", 
            ok: "Да",
          }).then(function(){
            list.remove(item_id);
            webix.ajax().post("/Staff/Delete?id="+item.Id);
          });
      } 
    }else {
      var IdList = [];
      item.forEach(function(val){
        IdList.push(val.Id);
        console.log(IdList);
      });
      if (item_id){
        webix.confirm({
            text: "Вы действительно хотите удалить сотрудников?",
            cancel: "Нет", 
            ok: "Да",
          }).then(function(){
            list.remove(item_id);
            console.log(IdList);
            webix.ajax().headers({
              "Content-type":"application/json"
          }).post("/Staff/Delete", JSON.stringify(IdList));
          });
      }
    }
  }

  afterSelect() {
      var item = $$("staffTable").getSelectedItem();
      console.log(item);
      $$("formStaff").setValues(item);
      $$("formStaff").setValues(item);
      if (Array.isArray(item)) return;
      item.ch2 = 1;
      
      $$("staffTable").updateItem(item.id, item);
    }


    afterUnSelect(selection){
      var item = selection;
      item.ch2 = 0;
      if(!item.id) return;
      $$("staffTable").updateItem(item.id, item);
    }

  updateTab(check){
    
     var form = $$("formStaff");
     var table = $$("staffTable");
     var item_data = form.getValues();

    form.validate();
    if (!form.validate()){
        webix.message({ type:"error", text:"Некорректно заполненная форма" });
        return
    }
     if(!check) {
        if (item_data.id) {
          for (var i in this.staff){
          if(item_data.id == this.staff[i].id) {
            webix.message({ type:"error", text:"Книга с таким ISBN уже существует" });
            return
          };};
      }
      table.add(item_data);
      this.postData = {
        action:"info",
        Name: item_data.Name,
        Department: item_data.Department,
        Position: item_data.Position,
        Cellnumber:Number(item_data.Cellnumber)
      }
      console.log(this.postData);
      webix.ajax().headers({
        "Content-type":"application/json"
    }).post("/Staff/Add", JSON.stringify(this.postData));

     } else {
      this.postData = {
        action:"info",
        Id:Number(item_data.Id),
        Name: item_data.Name,
        Department: item_data.Department,
        Position: item_data.Position,
        Cellnumber:Number(item_data.Cellnumber)
      }
      console.log(this.postData);
      webix.ajax().headers({
        "Content-type":"application/json"
        }).post("/Staff/Update", JSON.stringify(this.postData));
       table.updateItem(item_data.id, item_data);
       
     }
     
     
     $$("windowStaff").hide();
     form.clear();
  }

  focus() {
    var item = $$("staffTable").getSelectedItem();
    console.log(item);
    if (!item) return;
    var item_id = item.id;
    var focusId = item.Books;

    if (!focusId) return;
    $$("staffTable").unselect(item_id);
    item.ch2 = 0;
    $$("staffTable").updateItem(item.id, item);
    $$("bookTable").unselectAll();
    

    focusId.forEach(function(v){
        
          $$("bookTable").select(v.IdBook,true);
          $$("bookTable").showItem(v.IdBook);
          $$("bookView").show();
      });
    
  }

  Option(){
    this.staffOptions = [];
    $$("staffTable").eachRow(function(row){
      var record = $$("staffTable").getItem(row);
      console.log(record);
      var option = {};
      option.id = record.id;
      option.value = record.nameWocker + " " + record.cellphone;
      this.staffOptions.push(option);
  });
  return this.staffOptions
  }

}