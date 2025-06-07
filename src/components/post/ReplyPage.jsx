import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize'
import {app} from '../../firebase'
import { getFirestore,addDoc, collection } from 'firebase/firestore'
import moment from 'moment'
import ReplyList from './ReplyList'

const ReplyPage = ({id}) => {
    const db = getFirestore(app)
    const email=sessionStorage.getItem('email')
    const [contents,setContents] = useState('')
    const onWrite=async()=>{
        const reply={
            pid:id,
            email,
            contents,
            date:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        await addDoc(collection(db,'reply'),reply)
        setContents('')
    }
    return (
        <div>
            {email ?
                <Row className='justify-content-center'>
                    <Col md={10}>
                        <TextareaAutosize 
                            onChange={(e)=>setContents(e.target.value)}
                            value={contents}
                            placeholder='내용을 입력하세요요'
                            className='textarea'/>
                        <Button 
                            disabled={contents===''} 
                            onClick={onWrite}
                            className='px-5 text-end'>등록</Button>
                    </Col>
                </Row>
                :
                <div>
                    <Button className='w-100'>로그인</Button>
                </div>
            }
            <ReplyList pid={id}/>
        </div>
    )
}

export default ReplyPage
