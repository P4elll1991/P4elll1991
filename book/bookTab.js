class bookTab {

    constructor(){
    this.modal = new modalBook();
    this.modal.giveData(this.modal);
    
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
        { id:"Status",  header:"Статус", width:150, sort: "string"},
        { id:"Name",  header:"Сотрудник", width:200, sort: "string"},
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

    initWindow() {
      var count = $$("bookTable").getVisibleCount();
      console.log(count);
      this.staffOptions = [];
      this.up = new windowBook();
      this.window = this.up.getWindow(this.staffOptions);
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
      if (Array.isArray(item)) {
        item.forEach(function(val){
          val.ch1 = 1;
          $$("bookTable").updateItem(val.id, item);
        });
        return;
      }
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
    var table = $$("bookTable");
    var item = table.getSelectedItem();
     var form = $$("formBook");
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
        item_data.Employeeid = Number(item_data.Name);
          if (item_data.Status == "В наличии") {
            this.postData = {
              Id:Number(item_data.Id),
              Isbn:Number(item_data.Isbn), 
              BookName:item_data.BookName, 
              Autor:item_data.Autor, 
              Publisher:item_data.Publisher, 
              Year:Number(item_data.Year),
              EmployeeId:1,
      
            }
          item_data.Name = "";
          item_data.Datestart = "";
          item_data.Datefinish = "";
        } else {
          this.postData = {
            Id:Number(item_data.Id),
            Isbn:Number(item_data.Isbn), 
            BookName:item_data.BookName, 
            Autor:item_data.Autor, 
            Publisher:item_data.Publisher, 
            Year:Number(item_data.Year),
            EmployeeId:item_data.Employeeid,
    
          }
          var today = new Date;
          var dateFinish = new Date;
          item_data.Datestart = new Date;
          dateFinish.setDate(dateFinish.getDate() + 7);
          item_data.Datefinish = dateFinish;

        }
      }
      
        console.log(item_data);
        if (item.Status != item_data.Status){
          if(item_data.Status == "В наличии"){
            console.log("Возвращено")
            this.postDataEvent = {
              Event: "Возвращено",
              BookId :Number(item_data.Id),
              EmployeeId: Number(item.Employeeid),
            };
            console.log(this.postDataEvent)
          } else {
            console.log("Выдано")
            this.postDataEvent = {
              Event: "Выдано",
              BookId :Number(item_data.Id),
              EmployeeId: Number(item_data.Employeeid),
            };
            console.log(this.postDataEvent)
          }

          webix.ajax().headers({
            "Content-type":"application/json"
        }).post("/Event/Add", JSON.stringify(this.postDataEvent));



        } 

        $$("staffTable").eachRow(function(row){
            var record = $$("staffTable").getItem(row);
            if (record.Id == item_data.Name){
              item_data.Name = record.Name + " " + record.Cellnumber;
            }
        });
        
          console.log(this.postData);
          webix.ajax().headers({
            "Content-type":"application/json"
        }).post("/Books/Update", JSON.stringify(this.postData));

       table.updateItem(item_data.id, item_data);
     }
     
     
     $$("windowBook").hide();
     form.clear();
  }

  focus() {
    var item = $$("bookTable").getSelectedItem();
    if (!item) return;
    var item_id = item.id;
    var focusId = item.Employeeid;
  
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