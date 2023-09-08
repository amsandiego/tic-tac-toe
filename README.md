# The Odin Project - Library

Bookshelf is a web app that allows you to keep track of your books read, currently reading, and yet to read. It was built using Vanilla JavaScript, HTML, and CSS. Building this app, I was able to practice using ES6 Classes, different DOM manipulation methods, and how to use data attributes.

## Table of contents

- [Features](#features)
- [Links](#links)
- [Features](#features)

### Features

Full Screen Display

![](./assets/screenshot-1.png)

Add Book Modal
![](./assets/screenshot-2.png)

- Users can add a new book to their bookshelf by clicking a button, which will open a pop-up that asks for the title, author, and status of the book.
- Users can change the status of the book by selecting the new status from the dropdown in the book's card.
- Users can also delete a card by clicking the 'x' button on the card.
- A library stats card shows the total book count as well as count of books read, currently reading, and to read.

### Links

- Solution URL: [https://github.com/amsandiego/bookshelf](https://github.com/amsandiego/bookshelf)
- Live Site URL: [https://amsandiego.github.io/bookshelf](https://amsandiego.github.io/bookshelf)

### Overview of Implementation

- There are two classes used: Book and Library. Book contains the details to be shown in each book card and a unique ID. Library contains an array which will be used to store the book data, and methods for adding/removing book and toggling status.
- To facilitate saving of data so it won't be lost after browser refresh, the browser's local storage is utilized.
- The action of adding a book triggers functions to add to the bookshelf array, save the data to storage, update the cards display, and close the modal.
- Inside the updateDisplay() function, the functions to create cards, toggle book status, and display library stats are called.
- The createCard function includes DOM manipulation methods to build the card UI, set the color of the status selection, etc.
- To remove a card, the bookshelf array is filtered using the unique ID of the book, set as a data attribute in the card during card creation.
