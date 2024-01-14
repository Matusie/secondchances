import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            rating: 0
        };
    }

    handleCommentChange = (event) => {
        this.setState({ description: event.target.value });
    }

    handleRatingChange = (event) => {
        this.setState({ rating: parseInt(event.target.value) });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { description, rating } = this.state;
        const userId = this.props.userId;
        const title = this.props.title;
        // Send the comment and rating to the API endpoint
        fetch('https://secondchances.pl/api/comments', {
            method: 'POST',
            body: JSON.stringify({ description, rating, userId, title }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the API
                console.log(data);
            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });
    }

    render() {
        const { description, rating } = this.state;

        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="comment">
                    <Form.Label>Tresc komentarza</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="comment"
                        value={description}
                        onChange={this.handleCommentChange}
                        placeholder="Najlepsze ubranie jakie kiedykolwiek mialem!"
                    />
                </Form.Group>
                <Form.Group controlId="rating">
                    <Form.Label>Podobalo sie? Zostaw ocene</Form.Label>
                    <div>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <span
                                key={value}
                                className={value <= rating ? 'star selected' : 'star'}
                                onClick={() => this.handleRatingChange({ target: { value } })}
                            >
                                &#9733;
                            </span>
                        ))}
                    </div>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Wyslij
                </Button>
            </Form>
        );
    }
}

export default CommentForm;
