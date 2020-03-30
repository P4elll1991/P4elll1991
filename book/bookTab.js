class bookTab {

    constructor(staff){
    this.modal = new modalBook();
    this.modal.giveData(this.modal);
    this.staff = staff;
    
  }
  
    buttons = [
      { id:"change", view:"button", type:"icon", icon:"mdi mdi-pen", value: "Изменить"},                           
      { id:"push",  view:"button", type:"icon", icon:"mdi mdi-plus-box-outline", value: "Добавить"},
      { id:"goToEmployee", view:"button", type:"icon", icon:"mdi mdi-account", value: "Перейти к сотруднику"},
      { id:"delete", view:"button", type:"icon", icon:"mdi mdi-delete-forever", value: "Удалить"},      
      ];
  
      columns = [
        { id:"ch1", header:{ content:"masterCheckbox", contentId:"mc1" }, template:"{common.checkbox()}", width: 50,},
        { id:"Isbn",    header:"ISBN", adjust:true, sort: "int",},
        { id:"BookName",   header:"Название", adjust:true, sort: "string",},
        { id:"Autor",  header:"Автор", adjust:true, sort: "string"},
        { id:"Publisher",  header:"Издатель", adjust: true, sort: "string"},
        { id:"Year",  header:"Год", adjust: true, sort: "int",},
        { id:"Status",  header:"Статус", adjust: true, sort: "string"},
        { id:"Name",  header:"Сотрудник", adjust: true, sort: "string"},
        { id:"Datestart",  header:"Дата выдачи", adjust: true, format:webix.i18n.dateFormatStr, sort: "date"},
        { id:"Datefinish",  header:"Дата сдачи", adjust: true, format:webix.i18n.dateFormatStr, sort: "date"}
                    ];
  
    init() {
    
      this.view = {
        view:"layout",
        padding:10,
        id: "bookView", 
        type: "wide",
            rows:[
            

            // меню
  
            { id:"bookSidebar", select:false,
              cols: this.buttons},
            
            // Таблица
  
            {
            view:"datatable", 
            id:"bookTable", 
            wordBreak: "break-all", 
            css:"webix_data_border webix_header_border",
            multiselect:true, 
            columns: this.columns, 
            select:true, 
            },

  
          ],
                   
      }
      return this.view;
  
    }

    initWindow(staffOptions) {

      this.up = new windowBook();
      this.window = this.up.getWindow(staffOptions);
      return this.window;
    }

    getView() {
      return this.init();
    }

    editeEvents(parent){
      $$("delete").attachEvent("onItemClick", function(){
        parent.delete();
      });

      $$("change").attachEvent("onItemClick", function(){
        $$("Status").show();
        parent.checkWin = true;
        var item_data = $$("formBook").getValues()
        var check = item_data.BookName;
        console.log(check);
        if(check != "")
             $$("windowBook").show();
      });

      $$("bookTable").attachEvent("onItemDblClick", function(){
        $$("Status").show();
        parent.checkWin = true;
        var item_data = $$("formBook").getValues()
        var check = item_data.name;
        if(check != "")
             $$("windowBook").show();
      });

      $$("push").attachEvent("onItemClick", function(){
        parent.checkWin = false;
        $$("formBook").clear();
        $$("Status").hide();
        $$("formBook").elements["Name"].hide();
        $$("windowBook").show();
      });

      $$("bookTable").attachEvent("onAfterSelect", function(){
           parent.afterSelect();
      });

      $$("bookTable").attachEvent("onAfterUnSelect", function(selection){
          parent.afterUnSelect(selection);
           
      });

      $$("exitWindowBook").attachEvent("onItemClick", function() {
          $$("windowBook").hide();
          $$("formBook").clear();
          $$("formBook").clearValidation();
          $$("Status").show();

          parent.afterSelect();
      });

      $$("updateBookTab").attachEvent("onItemClick", function(){
          
          parent.updateTab(parent.checkWin);

      });

      $$("formBook").elements["Status"].attachEvent("onChange", function(newv, oldv){
        if (newv == "Нет в наличии") {
           $$("formBook").elements["Name"].show();

        } else if (newv == "В наличии"){
          $$("formBook").elements["Name"].hide();
        }
        });


      $$("goToEmployee").attachEvent("onItemClick", function(){
        parent.focus();
      });

      $$("bookTable").attachEvent("onCheck", function(rowId, colId, state){
        if (state == 1) {
          $$("bookTable").select(rowId, true);
        } else if (state == 0){
          $$("bookTable").unselect(rowId);
        }
          
      });
  
    }

    delete(){
    var list = $$("bookTable");
    var item_id = list.getSelectedId();
    var item = list.getSelectedItem();
    if (!Array.isArray(item)) {
      if (item_id){
        webix.confirm({
            text: "Вы действительно хотите удалить книу?",
            cancel: "Нет", 
            ok: "Да",
          }).then(function(){
            list.remove(item_id);
            console.log(item.Id);
            webix.ajax().post("/Book/Delete?id="+item.Id);
          });
      }
    } else {
      var IdList = [];
      item.forEach(function(val){
        IdList.push(val.Id);
      });
      if (item_id){
        webix.confirm({
            text: "Вы действительно хотите удалить книги?",
            cancel: "Нет", 
            ok: "Да",
          }).then(function(){
            list.remove(item_id);
            console.log(IdList);
            webix.ajax().headers({
              "Content-type":"application/json"
          }).post("/Book/Delete", JSON.stringify(IdList));
          });
      }
    }
  }

  afterSelect() {
      var item = $$("bookTable").getSelectedItem();
      console.log(item);
      $$("formBook").setValues(item);
      $$("formBook").setValues(item);
      if (Array.isArray(item)) return;
      item.ch1 = 1;
      
      $$("bookTable").updateItem(item.id, item);
    }


    afterUnSelect(selection){
      var item = selection;
      item.ch1 = 0;
      if(!item.id) return;
      $$("bookTable").updateItem(item.id, item);
    }

  updateTab(check){
    console.log(1);
     var form = $$("formBook");
     var table = $$("bookTable");
     var item_data = form.getValues();

    form.validate();
    if (!form.validate()){
        webix.message({ type:"error", text:"Некорректно заполненная форма" });
        return
    }
     if(!check) {
        if (item_data.id) {
          for (var i in this.books){
          if(item_data.id == this.books[i].id) {
            webix.message({ type:"error", text:"Книга с таким ISBN уже существует" });
            return
          };
        };
      }
      if ((Number(item_data.Year) < 1500 )|| (Number(item_data.Year) > 2100)){
        webix.message({ type:"error", text:"Невалидный год" });
        return
      }
      item_data["Status"] = "В наличии";
      table.add(item_data);
      this.postData = {
        action:"info",
        isbn:Number(item_data.Isbn), 
        bookName:item_data.BookName, 
        autor:item_data.Autor, 
        publisher:item_data.Publisher, 
        year:Number(item_data.Year)}
        console.log(this.postData)

      webix.ajax().headers({
        "Content-type":"application/json"
    }).post("/Books/Add", JSON.stringify(this.postData));

     } else {
      if (item_data.Status) {
          if (item_data.Status == "В наличии") {
          item_data.Name = "";
          item_data.timeFinish = "";
          item_data.timeStart = "";
        } else {
          var today = new Date;
          var dateFinish = new Date;
          item_data.TimeStart = new Date;
          dateFinish.setDate(dateFinish.getDate() + 7);
          console.log(dateFinish);
          item_data.TimeFinish = dateFinish;

        }
      }
      
      this.postData = {
        isbn:Number(item_data.Isbn), 
        bookName:item_data.BookName, 
        autor:item_data.Autor, 
        publisher:item_data.Publisher, 
        year:Number(item_data.Year),
        employeeId:Number(item_data.EmployeeId),

      }
        console.log(this.postData)

    //   webix.ajax().headers({
    //     "Content-type":"application/json"
    // }).post("/Books/Add", JSON.stringify(this.postData));
        console.log(item_data);
          
        item_data.Employeeid = Number(item_data.Name);

        $$("staffTable").eachRow(function(row){
            var record = $$("staffTable").getItem(row);
            if (record.id == item_data.Name){
              item_data.Name = record.nameWocker + " " + record.cellphone;
            }
        });


       table.updateItem(item_data.id, item_data);
     }
     
     
     $$("windowBook").hide();
     form.clear();
  }

  focus() {
    var item = $$("bookTable").getSelectedId();
    console.log(item);
    if (!item) return;
    var item_id = item.id;
    var focusId;

    
    this.books.forEach(function(v){
        if (v.id == item.id) focusId = v.Employeeid;
      });
    

    if (!focusId) return;

    $$("bookTable").unselect(item_id);
    item.ch1 = 0;
    $$("bookTable").updateItem(item.id, item);
    $$("staffTable").unselectAll();
    $$("staffTable").select(focusId,true);
    $$("staffView").show();
    $$("staffTable").showItem(focusId);
  }


}