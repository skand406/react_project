import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Row, Col, Card, InputGroup, Button, Form } from 'react-bootstrap'
import BookPage from './BookPage'
import { CiShoppingCart } from "react-icons/ci";
import { app } from '../firebase'
import { getDatabase, ref, set, get, onValue, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { SyncLoader } from 'react-spinners';

const HomePage = () => {
    const db = getDatabase(app)
    const [heart, setHeart] = useState()
    const [loading, setLoading] = useState(false)
    const uid = sessionStorage.getItem('uid')
    const navi = useNavigate()

    const [documents, setDocuments] = useState([])
    const [query, setQuery] = useState('리액트')
    const [page, setPage] = useState(1)
    const [last, setLast] = useState(1)

    const callAPI = async () => {
        const url = 'https://dapi.kakao.com/v3/search/book'
        const config = {
            'headers': {
                'Authorization': 'KakaoAK ' + process.env.REACT_APP_KAKAO_REST_KEY
            },
            'params': {
                query: query,
                size: 12,
                page: page
            }
        }
        const res = await axios.get(url, config)
        //console.log(res)
        setDocuments(res.data.documents)
        setLast(Math.ceil(res.data.meta.pageable_count / 12))
    }
    useEffect(() => {
        callAPI()
    }, [page])
    const onSubmit = (e) => {
        e.preventDefault();
        if (query === '') {
            alert('검색어를 입력하세요!')
        } else {
            callAPI()
        }
    }
    const onClickCart = (book) => {
        if (uid) {
            //장바구니 넣기
            get(ref(db, `cart/${uid}/${book.isbn}`))
                .then(snapshot => {
                    if (snapshot.exists()) {
                        alert('장바구니에 이미 존재합니다.')
                    } else {
                        const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                        set(ref(db, `cart/${uid}/${book.isbn}`),{...book,date})
                    }
                })

        } else {
            alert('로그인이 필요한 서비스입니다.')
            navi('/login')
        }
    }
    //빈하트를 클릭했을때
    const onClickRegHeart = (book) => {
        if(uid){ //관심 목록 등록
            set(ref(db,`heart/${uid}/${book.isbn}`),book)
            alert('관심 목록에 추가되었습니다.')
        }else{
            alert('로그인이 필요한 서비스입니다.')
            navi('/login') 
        }
    }
    //채운 하트를 클릭했을때
    const onClickFaHeart = (book) =>{
        remove(ref(db, `heart/${uid}/${book.isbn}`),book)
    }
    //현재 이메일의 관심 목록
    const checkHeart = () => {
        setLoading(true)
        onValue(ref(db,`heart/${uid}`), snapshot =>{
            const rows = []
            snapshot.forEach(row=>{
                rows.push(row.val().isbn)
            })
            console.log(rows)
            setHeart(rows)
            setLoading(false)
        })
    }

    useEffect(()=>{
        checkHeart()
    },[])

    if (loading) return <h1 className='text-center my-5'><SyncLoader/></h1>
    return (
        <div>
            <h1 className='my-5 text-center'>메인페이지</h1>
            <Row className='mb-2'>
                <Col>
                    <Form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control
                                onChange={(e) => setQuery(e.target.value)}
                                value={query} />
                            <Button type="submit">검색</Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col></Col>
                <Col></Col>
            </Row>
            <Row>
                {documents.map(doc =>
                    <Col lg={2} md={3} xs={6} className='mb-2' key={doc.isbn}>
                        <Card>
                            <Card.Body>
                                <BookPage book={doc} />
                                <div className='heart text-end'>
                                    {heart.includes(doc.isbn) ? 
                                        <FaHeart onClick={()=>onClickFaHeart(doc)}/>: 
                                        <FaRegHeart onClick={()=>onClickRegHeart(doc)}/>
                                    }
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <div className='text-truncate'>{doc.title}</div>
                                <Row>
                                    <Col>{doc.sale_price}원</Col>
                                    <Col className='text-end cart'><CiShoppingCart onClick={()=>onClickCart(doc)}></CiShoppingCart></Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            <div className='text-center mt-3'>
                <Button onClick={() => setPage(page - 1)} disabled={page === 1 && true}>이전</Button>
                <span className='mx-2'>{page} / {last}</span>
                <Button onClick={() => setPage(page + 1)} disabled={page === last && true}>다음</Button>
            </div>
        </div>
    )
}

export default HomePage
