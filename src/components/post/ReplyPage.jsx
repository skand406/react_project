import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize'
import { app } from '../../firebase'
import { getFirestore, addDoc, collection } from 'firebase/firestore'
import moment from 'moment'
import ReplyList from './ReplyList'
import { useNavigate } from 'react-router-dom'

const ReplyPage = ({ id }) => {
    const db = getFirestore(app)
    const navi = useNavigate()
    const email = sessionStorage.getItem('email')
    const [contents, setContents] = useState('')
    const onWrite = async () => {
        const reply = {
            pid: id,
            email,
            contents,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        await addDoc(collection(db, 'reply'), reply)
        setContents('')
    }
    const onClickLogin = () => {
        sessionStorage.setItem('target', `/post/${id}`)
        navi('/login')
    }
    return (
        <div>
            <Row className='justify-content-center'>
                <Col md={10}>
                    {email ?
                        <div className='text-end mt-5'>
                            <TextareaAutosize
                                onChange={(e) => setContents(e.target.value)}
                                value={contents}
                                placeholder='내용을 입력하세요요'
                                className='textarea' />
                            <Button
                                disabled={contents === ''}
                                onClick={onWrite}
                                className='px-5'>등록</Button>
                        </div>
                        :
                        <div>
                            <Button 
                                className='w-100 my-2'
                                onClick={onClickLogin}>로그인</Button>
                        </div>
                    }
                </Col>
            </Row>
            <ReplyList pid={id} />
        </div >
    )
}

export default ReplyPage
