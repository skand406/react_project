import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getFirestore, collection, query, orderBy, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { MdEdit, MdDelete } from "react-icons/md";
import TextareaAutosize from 'react-textarea-autosize'
import moment from 'moment/moment';

const ReplyList = ({ pid }) => {
    const db = getFirestore(app)
    const email = sessionStorage.getItem('email')
    const [list, setList] = useState([])
    const getList = () => {
        const q = query(collection(db, 'reply'), where('pid', '==', pid), orderBy('date', 'desc'))
        onSnapshot(q, snapshot => {
            let rows = []
            snapshot.forEach(row => {
                rows.push({ id: row.id, ...row.data() })
            })
            const data = rows.map(row => row && { ...row, ellipsis: true, edit: false, text: row.contents })
            console.log(rows)
            setList(data)
        })
    }
    useEffect(() => {
        getList()
    }, [])
    const onClickContents = (id) => {
        const data = list.map(reply =>
            reply.id === id ? { ...reply, ellipsis: !reply.ellipsis } : reply
        )
        setList(data)
    }
    const onClickUpdate = (id) => {
        const data = list.map(reply =>
            reply.id === id ? { ...reply, edit: !reply.edit } : reply
        )
        setList(data)
    }
    const onChangeContents = (e, id) => {
        const data = list.map(reply =>
            reply.id === id ? { ...reply, contents: e.target.value } : reply
        )
        setList(data)
    }
    const onClickCancel = (r) => {
        const data = list.map(reply =>
            reply.id === r.id ? { ...reply, edit: false, contents: reply.text } : reply
        )
        setList(data)
    }
    const onClickSave = async (e, reply) => {
        e.preventDefault()
        if (window.confirm('수정하시겠습니까?')) {
            await updateDoc(doc(db, 'reply', reply.id),
                {
                    contents: reply.contents,
                    date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                })
        }
    }
    const onClickRemove = async (id) => {
        alert('댓글이 삭제됩니다.')
        await deleteDoc(doc(db, 'reply', id))
    }

    return (
        <Row className='justify-content-center'>
            <Col md={10}>
                {list.map(reply =>
                    <div key={reply.id} className='my-5'>
                        <Row>
                            <Col className='text-muted'>
                                {reply.date} | {reply.email}
                            </Col>
                            {reply.email === email && !reply.edit &&
                                <Col className='text-end'>
                                    <MdEdit
                                        onClick={() => onClickUpdate(reply.id)}
                                        className='edit' />
                                    <MdDelete
                                        onClick={() => onClickRemove(reply.id)}
                                        className='delete' />
                                </Col>
                            }
                        </Row>
                        {reply.edit ?
                            <Form onSubmit={(e) => onClickSave(e, reply)}>
                                <TextareaAutosize
                                    className='textarea'
                                    onChange={(e) => onChangeContents(e, reply.id)}
                                    value={reply.contents} />
                                <div className='text-end'>
                                    <Button
                                        size='sm'
                                        variant='primary'
                                        className='mx-2'
                                        disabled={reply.text === reply.contents}
                                        type='submit'>저장</Button>
                                    <Button
                                        onClick={() => onClickCancel(reply)}
                                        size='sm'
                                        variant='secondary'>취소</Button>
                                </div>
                            </Form>
                            :
                            <div
                                onClick={() => onClickContents(reply.id)}
                                style={{ cursor: 'pointer' }}
                                className={reply.ellipsis ? 'ellipsis2' : ''}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{reply.contents}</p>
                            </div>
                        }
                    </div>
                )}
            </Col>
        </Row>
    )
}

export default ReplyList
