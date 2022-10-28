import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

// component definition
const SavedBooks = () => {
  // create hook for GET_ME graphQL api call
  const { loading, data } = useQuery(GET_ME);
  // create hook for REMOVE_BOOK graphQL api call
  const [removeBook] = useMutation(REMOVE_BOOK);
  // get data from api call
  const userData = data?.me || {};
  // handles REMOVE_BOOK graphQL api call
  const handleDeleteBook = async (bookId) => {
    // verify user logged in
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    // wrap graphQL api call for error handling
    try {
      // call graphQL api REMOVE_BOOK w/Google Book ID
      await removeBook({ variables: { bookId: bookId } });
      // remove from local storage
      removeBookId(bookId);
    } catch (e) {
      // log error
      console.log(e);
    }
  };
  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  // render component JSX
  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
