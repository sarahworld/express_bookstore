process.env.NODE_ENV = 'test';

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const test = require("supertest/lib/test");

let book_isbn;

beforeEach(async () => {
    const results = await db.query(`INSERT INTO books-test (isbn, amazon_url,author,language,pages,publisher,title,year)
                            VALUES (
                                '593385683',
                                'https://amazon.com/bluey',
                                'Elie',
                                'English',
                                24,
                                'Penguin Young Readers Licenses',
                                'Bluey: The Pool', 2022)
                                RETURNING isbn`)

    book_isbn = results.rows[0].isbn
    })


describe("Get a list of books /books", function(){
    test("get books list /books", async ()=>{
        let response = await request(app)
                .get('/books');
    
    expect(response.statusCode).toBe(200)
    expect(response.body.books).toHaveLength(1);
    })
})


describe("Post a new book /books", function(){
    test("Create a new book /books", async function (){
        const response = await request(app)
            .post('/books')
            .send({
                isbn: '32794782',
                amazon_url: "https://taco.com",
                author: "mctest",
                language: "english",
                pages: 1000,
                publisher: "yeah right",
                title: "amazing times",
                year: 2000
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.book).toHaveProperty("isbn")
    })
})


describe("Put a new book /books/:id", function(){
    test("edit a  book /books", async function (){
        const response = await request(app)
            .put(`/books/${book_isbn}`)
            .send({
                amazon_url: "https://taco.com",
                author: "mctest",
                language: "Hindi",
                pages: 1000,
                publisher: "yeah right",
                title: "amazing times",
                year: 2000
                
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.book.language).toHaveProperty("Hindi")
    })
})

describe("Delete a book /books/:isbn", ()=> {
    test("Delete a book ", async function(){
        const response = await request(app)
            .delete(`/books/${book_isbn}`);
    
        expect(response.body).toequal({message:"Book deleted"})
    })
})

afterEach(async () => {
    await db.query("DELETE FROM books-test")
});

afterAll(async () => {
    await db.end()
})