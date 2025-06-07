import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getFirestore, collection, query, orderBy, where, onSnapshot } from 'firebase/firestore'
import { Col, Row } from 'react-bootstrap'

const ReplyList = ({ pid }) => {
    const db = getFirestore(app)
    const [list, setList] = useState([])
    const getList = () => {
        const q = query(collection(db, 'reply'), where('pid', '==', pid), orderBy('date', 'desc'))
        onSnapshot(q, snapshot => {
            let rows = []
            snapshot.forEach(row => {
                rows.push({ id: row.id, ...row.data() })
            })

            console.log(rows)
            setList(rows)
        })
    }
    useEffect(() => {
        getList()
    }, [])

    return (
        <Row className='justify-content-center'>
            <Col md={10}>
                {list.map(reply=>
                    <div key={reply.id}>
                        <div>{reply.date}:{reply.email}</div>
                        <div><p>{reply.contents}</p></div>
                    </div>
                )}
            </Col>
        </Row> 
    )
}

export default ReplyList
