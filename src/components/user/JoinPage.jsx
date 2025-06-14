import React, { useState } from 'react'
import { Card, Row, Col, Form, Button } from 'react-bootstrap'
import {app} from '../../firebase'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'

const JoinPage = () => {
    const auth = getAuth(app);
    const [loading, setLoading] = useState(false)
    const navi = useNavigate()

    const [form, setForm] = useState({
        email:'green@inha.edu',
        pass:'12341234'
    })
    const {email,pass} = form
    const onChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const onSubmit = (e) => {
        e.preventDefault()
        if(email==='' || pass===''){
            alert('이메일 또는 비밀번호를 입력해주세요요')
        }else{
            //회원가입
            if(window.confirm('회원가입하시겠습니까?')){
                setLoading(true)
                createUserWithEmailAndPassword(auth, email, pass)
                    .then(success=>{
                        setLoading(false)
                        alert('회원가입 성공')
                        navi('/login')
                    })
                    .catch(error=>{
                        setLoading(false)
                        alert('회원가입 에러' + error.message)
                    })
            }
        }
    }

    if(loading) return <h1 className='my-5 text-center'><SyncLoader/></h1>
    return (
        <div>
            <Row className='my-5 justify-content-center'>
                <Col lg={4} md={6} sm={8}>
                    <Card>
                        <Card.Header>
                            <h5>회원가입</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={onSubmit}>
                                <Form.Control 
                                    className='mb-2'
                                    value={email}
                                    name='email'
                                    onChange={onChange}/>
                                <Form.Control
                                    className='mb-2'
                                    value={pass}
                                    name='pass'
                                    type='password'
                                    onChange={onChange}/>
                                <Button
                                    type='submit'
                                    className='w-100' >회원가입</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
    </div>
    )
}

export default JoinPage
