CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    cover_url TEXT,
    notes TEXT,
    rating INT
);


INSERT INTO books (title, author, cover_url, notes, rating)
VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'https://covers.openlibrary.org/b/isbn/9780385533225-L.jpg', 'A classic novel set in the 1920s.', 5),
('To Kill a Mockingbird', 'Harper Lee', 'https://example.com/covers/to-kill-a-mockingbird.jpg', 'A novel about racial injustice in the Deep South.', 5),
('1984', 'George Orwell', 'https://example.com/covers/1984.jpg', 'A dystopian novel about totalitarianism.', 4);
