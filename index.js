import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// إعداد الملفات الثابتة
app.use(express.static('public'));

const db = new pg.Client({
  connectionString: 'postgres://postgres.njoejsszhredpnxlpelp:Alialialh.50@aws-0-eu-central-1.pooler.supabase.com:6543/postgres',
});

let books = [];

db.connect()
  .then(() => {
    console.log('Connected to the database successfully!');
    return fetchBooksFromDatabase();
  })
  .then(async res => {
    books = res;
    for (let book of books) {
      const coverUrl = await getBookCover(book.isbn);
      book.cover = coverUrl;
    }
    console.log('Books with covers:', books); // طباعة البيانات في الكونسول
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });

async function fetchBooksFromDatabase() {
  try {
    const res = await db.query('SELECT * FROM books');
    return res.rows;
  } catch (err) {
    console.error('Error fetching books:', err);
    return [];
  }
}

async function getBookCover(isbn) {
  try {
    const response = await axios.get(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
    return response.config.url; // عنوان الصورة من URL
  } catch (error) {
    console.error(`Error fetching cover for ISBN ${isbn}:`, error);
    return 'default-cover.jpg'; // استخدم صورة افتراضية في حالة الخطأ
  }
}

app.get('/', async (req, res) => {
  try {
    res.render('index', {
      books: books,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error');
  }
});

app.post('/submit', async (req, res) => {
  const { title, author, isbn, notes, rating } = req.body;
  try {
    await db.query(
      'INSERT INTO books (title, author, isbn, notes, rating) VALUES ($1, $2, $3, $4, $5)',
      [title, author, isbn, notes, rating]
    );
    const coverUrl = await getBookCover(isbn);
    books.push({ title, author, isbn, notes, rating, cover: coverUrl });
    res.redirect('/');
  } catch (err) {
    console.error('Error inserting book:', err);
    res.status(500).send('Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
