import React, { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import {app} from '../../firebase'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const auth = getAuth(app) //파이어베이스 인증
    const [loading, setLoading] = useState(false)
    const navi = useNavigate()
    const basename = process.env.PUBLIC_URL
    const [form, setForm] = useState({
        email: 'dark@inha.edu',
        pass: '12341234'
    })
    const { email, pass } = form
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const onSubmit = (e) => {
        e.preventDefault()
        if (email === '' || pass === '') {
            alert('이메일 또는 패스워드를 입력하세요')
        } else {
            setLoading(true)
            //로그인 체크
            signInWithEmailAndPassword(auth, email, pass)
                .then(success=>{
                    alert('로그인 성공')
                    sessionStorage.setItem('email',email)
                    sessionStorage.setItem('uid', success.user.uid)
                    setLoading(false)
                    if(sessionStorage.getItem('target')){
                        navi(sessionStorage.getItem('target'))
                    }else{
                        navi('/')
                    }
                })
                .catch(error=>{
                    alert('로그인 에러' + error.message)
                    setLoading(false)
                })

        }
    }
    if(loading) return <h1 className='my-5 text-center'>로딩중...</h1>
    return (
        <div>
            <Row className='my-5 justify-content-center'>
                <Col lg={4} md={6} sm={8}>
                    <Card>
                        <Card.Header>
                            <h5>로그인</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={onSubmit}>
                                <Form.Control
                                    className='mb-2'
                                    placeholder='email'
                                    value={email}
                                    name='email'
                                    onChange={onChange} />
                                <Form.Control
                                    className='mb-2'
                                    placeholder='password'
                                    value={pass}
                                    type='password'
                                    name='pass'
                                    onChange={onChange} />
                                <Button
                                    type='submit'
                                    className='w-100' >로그인</Button>
                            </Form>
                            <div className='text-end'>
                                <a href={`${basename}/join`}>회원가입</a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default LoginPage
