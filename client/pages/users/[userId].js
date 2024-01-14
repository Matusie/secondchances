import useRequest from '../../hooks/use-request';
import CommentForm from '../../components/comentForm';

import React, { useEffect, useState } from 'react';
import { ListGroup, Container, Row, Col, Button } from 'react-bootstrap';

const ItemShow = ({ user }) => {  
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = (await fetch(`https://secondchances.pl/api/comments/`)).body({userId: user.id});
                const data = await response.json();
                const commentsWithAuthor = await Promise.all(data.map(async (comment) => {
                    const authorResponse = await fetch(`https://secondchances.pl/api/users/${comment.authorId}`);
                    const authorData = await authorResponse.json();
                    return { ...comment, author: authorData };
                }));
                setComments(commentsWithAuthor);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [user.id]);
    if(!user?.avatar){
        user.avatar="https://source.unsplash.com/random/500x500/?profile"
    }
    return (
        <div>
            <Container>
                <Row>
                    <Col lg={7} className="pr-lg-5 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade-up" data-aos-delay="0">
                        <div className="img-wrap">
                            <img src={user.avatar} alt="Image placeholder" className="img-fluid" />
                        </div>
                    </Col>
                    <Col lg={5} className="pl-lg-5 aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                        <div className="section-heading">
                            <h2>{user.firstName} {user.lastName}</h2>
                        </div>
                        <p>{user?.description}</p>
                        <div className="section-heading">
                            <h2>Statystyki</h2>
                        </div>
                        <p>Ilosc przedmiotow wystawionych: {user?.description}</p>
                        <p>Ilosc przedmiotow sprzedanych: {user?.description}</p>
                        <p>Ilosc przedmiotow kupionych: {user?.description}</p>
                        <p>
                            <Button href="#contact-section" className="btn btn-primary smoothscroll">Hire Me</Button>
                            <Button href="#" className="btn btn-secondary">Download CV</Button>
                        </p>
                    </Col>
                </Row>
            </Container>
            <section>
                <div>
                    Komentarze innych uzytkownikow
                    <ListGroup>
                        {Array.isArray(comments) && comments.map((comment) => (
                            <ListGroup.Item key={comment.id}>
                                <div>
                                    Ocenina zostawiona przez <i>{comment.author.firstName} {comment.author.lastName}</i>
                                    <h4>{comment.title.includes("profile") ? "Zamieszczona ocena pod profilem sprzedawcy" : `Zamieszczona ocena dotyczy przedmiotu ${comment.title}`}</h4>
                                </div>
                                <i>"{comment.description}"</i>
                                <p>{Array(comment.rating).fill(<i className="fa fa-star star selected">&#9733;</i>)}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
                <div>
                    Podobaja ci sie moje przedmioty? Zostaw komentarz!
                    <CommentForm userId={user?.id} title="profile" />
                </div>
            </section>
        </div>
    );
};

ItemShow.getInitialProps = async (context, client) => {
    const query = context.query;
    const user = await client.get(`/api/users/${query.userId}`);
    const purchase = await client.get('/api/purchases');
    return { user: user.data, purchase: purchase.data };
};

export default ItemShow;
