


var StaffTab = new staffTab;
var BookTab = new bookTab(StaffTab.staff);
var JournalTab = new journalTab;


function initch(a) {
  return a;
}

function init() {
  var y = StaffTab.getView();
  var x = BookTab.getView();
 
  var z = JournalTab.getView();
  
 viewer = {  
  view:"tabview",
  cells:[
    { id: "booksView", header:"Книги", body: x,},
    { id: "staffView", header:"Сотрудники", body: y,},
    { id: "journal", header:"Журнал", body: z }
  ],
  multiview:{animate:true}
};
return viewer
}

function run(){
  webix.ui(init());
  var staffOptions = [];
    $$("staffTable").eachRow(function(row){
      var record = $$("staffTable").getItem(row);
      var option = {};
      option.id = record.id;
      option.value = record.nameWocker + " " + record.cellphone;
      staffOptions.push(option);
  });
  console.log(staffOptions);
  webix.ui(BookTab.initWindow(staffOptions));
  webix.ui(StaffTab.initWindow());
  
  BookTab.editeEvents(BookTab);
  StaffTab.editeEvents(StaffTab);
  JournalTab.editeEvents(JournalTab);
  
  
};
run();
  




