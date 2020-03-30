class modalJournal {

	

	takeData(){
		return [
      {id: 0, Event: "Выдано", nameBook:"Тихий Дон", ISBNLog: 134, date: "12-2-20", nameWockerLog: "Иванов Иван Иванович", wockerId: 453, departmentLog:"12-2-20", positionLog:"12-5-20", },
      {id: 1, Event: "Выдано", nameBook:"Горе от ума", ISBNLog: 2341, date: "16.1.20", nameWockerLog: "Петров Петр Петрович", wockerId: 656, departmentLog:"12-2-20", positionLog:"12-5-20", },
      {id: 2, Event: "Выдано", nameBook:"Атлант расправил плечи", ISBNLog: 165876, date: "7.11.17", nameWockerLog: "Александров Адександр Александрович", wockerId:  98, departmentLog:"12-2-20", positionLog:"12-5-20", },
    ]
	}

	giveData(parent) {
		this.journal = parent.takeData();
		return this.journal;
	}
}