package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	_ "github.com/lib/pq"
)

type Employee struct {
	Id         int
	Name       string
	Department string
	Position   string
	Cellnumber int
	Books      []BookOfEmployee
}

type EmployeePro struct {
	Id         int
	Name       string
	Department string
	Position   string
	Cellnumber int
}

type IdBooks struct {
	IdBook  string
	IdBooks []int
}

type BookOfEmployee struct {
	IdBook        int
	Isbn          int
	BookName      string
	Employeeid    int
	DatestartTime time.Time
	Datestart     string
	Datefinish    string
}

type Book struct {
	Id         int
	Isbn       int
	BookName   string
	Autor      string
	Publisher  string
	Year       int
	Employeeid int
	Name       string
	Datestart  time.Time
}

type BookPro struct {
	Id         int
	Isbn       int
	BookName   string
	Autor      string
	Publisher  string
	Year       int
	Status     string
	Name       string
	Employeeid int
	Datestart  string
	Datefinish string
}

type BookAdd struct {
	Isbn      int    `json:"isbn"`
	BookName  string `json:"bookName"`
	Autor     string `json:"autor"`
	Publisher string `json:"publisher"`
	Year      int    `json:"year"`
}

type BookAddPro struct {
	Isbn       int
	BookName   string
	Autor      string
	Publisher  string
	Year       int
	Employeeid int
	Datestart  time.Time
}

type msg string

func (m msg) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	fmt.Fprint(resp, m)
}

// StaffProvaider

func GiveStaffPro() (staff []Employee, err error) {
	staffPro, books, err := TakeStaff()
	fmt.Println(books)
	if err != nil {
		return nil, err
	}
	for _, val := range staffPro {
		p := Employee{}
		b := []BookOfEmployee{}
		p.Id = val.Id
		p.Name = val.Name
		p.Department = val.Department
		p.Position = val.Position
		p.Cellnumber = val.Cellnumber

		for _, v := range books {
			if val.Id == v.Employeeid {
				b = append(b, v)
			}
		}

		p.Books = b
		staff = append(staff, p)
	}
	return staff, nil
}

// StaffMapper

func TakeStaff() ([]EmployeePro, []BookOfEmployee, error) {
	connStr := "user=postgres password=q dbname=library sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, nil, err
	}
	defer db.Close()

	connStr = "SELECT * FROM staff"
	rows, err := db.Query(connStr)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()
	staff := []EmployeePro{}

	for rows.Next() {
		p := EmployeePro{}
		err := rows.Scan(&p.Id, &p.Name, &p.Department, &p.Position, &p.Cellnumber)
		if err != nil {
			fmt.Println(err)
			continue
		}

		staff = append(staff, p)
	}

	connStr = "SELECT id, Isbn, BookName, Employeeid, Datestart From books"
	rows, err = db.Query(connStr)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()
	books := []BookOfEmployee{}

	for rows.Next() {
		p := BookOfEmployee{}
		err := rows.Scan(&p.IdBook, &p.Isbn, &p.BookName, &p.Employeeid, &p.DatestartTime)
		if err != nil {
			fmt.Println(err)
			continue
		}
		p.Datestart = p.DatestartTime.Format("2006-01-02")
		p.Datefinish = p.DatestartTime.AddDate(0, 0, 7).Format("2006-01-02")

		books = append(books, p)
	}

	return staff, books, nil
}

//BookProvaider

func BookDeletePro(books IdBooks) error {
	if books.IdBook != "" {
		Id, err := strconv.Atoi(books.IdBook)
		if err != nil {
			return err
		}
		fmt.Println("hello, $1!\n", Id)
		err = BookDelete1(Id)
		if err != nil {
			return err
		}
		return nil
	} else {
		err := BookDelete2(books.IdBooks)
		if err != nil {
			return err
		}
		return nil
	}

}

func AddBookPro(bookAdd BookAdd) (err error) {
	var book BookAddPro
	book.Isbn = bookAdd.Isbn
	book.BookName = bookAdd.BookName
	book.Autor = bookAdd.Autor
	book.Publisher = bookAdd.Publisher
	book.Year = bookAdd.Year
	book.Employeeid = 1
	book.Datestart = time.Now()
	err = AddBook(book)
	if err != nil {
		return err
	}
	return nil
}

func GiveBooksPro() (bookspro []BookPro, err error) {
	books, err := TakeBooks()
	if err != nil {
		return nil, err
	}
	for _, v := range books {
		p := BookPro{}
		p.Id = v.Id
		p.Isbn = v.Isbn
		p.BookName = v.BookName
		p.Autor = v.Autor
		p.Publisher = v.Publisher
		p.Year = v.Year
		if v.Employeeid == 1 {
			p.Status = "В наличии"
			p.Name = ""
			p.Employeeid = 0
			p.Datestart = ""
			p.Datefinish = ""
		} else {
			p.Status = "Нет в наличии"
			p.Name = v.Name
			p.Employeeid = v.Employeeid
			p.Datestart = v.Datestart.Format("2006-01-02")
			p.Datefinish = v.Datestart.AddDate(0, 0, 7).Format("2006-01-02")
		}

		bookspro = append(bookspro, p)
	}
	return bookspro, nil
}

// BookMapper
func BookDelete2(b []int) error {
	connStr := "user=postgres password=q dbname=library sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	connStr = "delete from books where id = $1"

	if err != nil {
		return err
	}
	defer db.Close()

	for _, v := range b {
		_, err = db.Exec(connStr, v)
		if err != nil {
			return err
		}
	}
	return nil
}

func BookDelete1(id int) error {
	// Открытие базы данных

	connStr := "user=postgres password=q dbname=library sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return err
	}
	defer db.Close()

	connStr = "delete from books where id = $1"

	// Удаление из базы данных
	_, err = db.Exec(connStr, id)
	if err != nil {
		return err
	}

	return nil
}

func AddBook(b BookAddPro) error {
	connStr := "user=postgres password=q dbname=library sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return err
	}
	defer db.Close()

	// Добавить елемент

	connStr = "insert into books (isbn, bookname, autor, publisher, year, Employeeid, Datestart) values ( $1, $2, $3, $4, $5, $6, $7)"
	_, err = db.Exec(connStr, b.Isbn, b.BookName, b.Autor, b.Publisher, b.Year, b.Employeeid, b.Datestart)

	if err != nil {
		return err
	}

	return nil
}

func TakeBooks() ([]Book, error) {
	// Открытие базы данных

	connStr := "user=postgres password=q dbname=library sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	connStr = "SELECT books.id, books.isbn, books.bookname, books.autor, books.publisher, books.year, books.employeeid, books.datestart, staff.name FROM books LEFT JOIN staff ON books.employeeid = staff.id;"
	rows, err := db.Query(connStr)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	books := []Book{}

	for rows.Next() {
		p := Book{}
		err := rows.Scan(&p.Id, &p.Isbn, &p.BookName, &p.Autor, &p.Publisher, &p.Year, &p.Employeeid, &p.Datestart, &p.Name)
		if err != nil {
			fmt.Println(err)
			continue
		}

		books = append(books, p)
	}
	return books, nil
}

func main() {

	http.Handle("/book/", http.StripPrefix("/book/", http.FileServer(http.Dir("./book/"))))
	http.Handle("/journal/", http.StripPrefix("/journal/", http.FileServer(http.Dir("./journal/"))))
	http.Handle("/staff/", http.StripPrefix("/staff/", http.FileServer(http.Dir("./staff/"))))
	http.Handle("/app/", http.StripPrefix("/app/", http.FileServer(http.Dir("./app/"))))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	http.HandleFunc("/Books/Give", func(w http.ResponseWriter, r *http.Request) {
		allbooks, err := GiveBooksPro()
		if err != nil {
			panic(err)
		}

		js, err := json.Marshal(allbooks)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Write(js)
		//fmt.Fprint(w, "ok")
	})

	http.HandleFunc("/Books/Add", func(w http.ResponseWriter, r *http.Request) {
		var bookAdd BookAdd

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			fmt.Println(err)
			return
		} else {
			//если все нормально - пишем по указателю в структуру
			err = json.Unmarshal(body, &bookAdd)
			if err != nil {
				fmt.Println(err)
			}
		}
		err = AddBookPro(bookAdd)
		if err != nil {
			fmt.Println(err)
			return
		}
		fmt.Println("ok")
	})

	http.HandleFunc("/Book/Delete", func(w http.ResponseWriter, r *http.Request) {
		var IdArr IdBooks
		IdArr.IdBook = r.URL.Query().Get("id")
		if IdArr.IdBook != "" {
			err := BookDeletePro(IdArr)
			if err != nil {
				fmt.Println(err)
				return
			}
			fmt.Println("hello, $1!\n", IdArr.IdBook)
			return
		}
		body, err := ioutil.ReadAll(r.Body)

		if err != nil {
			fmt.Println(err)
			return
		} else {
			//если все нормально - пишем по указателю в структуру
			err = json.Unmarshal(body, &IdArr.IdBooks)
			if err != nil {
				fmt.Println(err)
			}
			err := BookDeletePro(IdArr)
			if err != nil {
				fmt.Println(err)
				return
			}
		}
		fmt.Println("ok")
	})

	http.HandleFunc("/Staff/Give", func(w http.ResponseWriter, r *http.Request) {
		staff, err := GiveStaffPro()
		if err != nil {
			panic(err)
		}

		js, err := json.Marshal(staff)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Write(js)
		fmt.Println(staff)
	})

	fmt.Println("Server is listening...")
	http.ListenAndServe("localhost:8080", nil)

}
