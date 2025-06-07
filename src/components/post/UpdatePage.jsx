import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Row } from 'react-bootstrap'

const UpdatePage = () => {
    const [form, setForm] = useState({
        title: '',
        body: ''
    })
    const navi = useNavigate()
    const db = getFirestore(app)
    const params = useParams()
    const { id } = params
    const getpost = async () => {
        const snapshot = await getDoc(doc(db, 'post', id))
        const post = snapshot.data()
        setForm({ ...post, preTitle: post.title, preBody: post.body })
    }
    const { title, body, preBody, preTitle, email, date } = form
    
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const onReset = () => {
        if (window.confirm('취소하시겠습니까?')) {
            getpost()
        }
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        if (window.confirm('저장하시겠습니까?')) {
            const post = { email, body, title, date }
            await setDoc(doc(db, 'post', id), post)
            navi(-1)
        }
    }
    useEffect(() => {
        getpost()
    }, [])
    
    return (
        <div>
            <h1 className='my-5 text-center'>게시글 수정</h1>
            <Row className='justify-content-center'>
                <Col md={10}>
                    <Form onReset={onReset} onSubmit={onSubmit}>
                        <Form.Control
                            name='title'
                            onChange={onChange}
                            value={title}
                            className='mb-2' />
                        <Form.Control
                            value={body}
                            name='body'
                            onChange={onChange}
                            as='textarea' rows={10} />
                        <div className='text-center mt-3'>
                            <Button
                                disabled={title === preTitle && body === preBody}
                                className='px-5 me-2'
                                type='submit'>저장</Button>
                            <Button
                                className='px-5'
                                variant='secondary'
                                type='reset'>취소</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    )

}


export default UpdatePage
