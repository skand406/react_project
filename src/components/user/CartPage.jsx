import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getDatabase, ref, onValue, remove } from 'firebase/database'
import { Table, Button } from 'react-bootstrap'
import BookPage from '../BookPage'
import {SyncLoader} from 'react-spinners'

const CartPage = () => {
    const uid = sessionStorage.getItem('uid')
    const [loading, setLoading] = useState(false)
    const db = getDatabase(app)
    const [books, setBooks] = useState([])

    const getCart = () =>{
        setLoading(true)
        onValue(ref(db, `cart/${uid}`),snapshot=>{
            console.log(snapshot)
            const rows = []
            snapshot.forEach(row=>{
                rows.push({key:row.key, ...row.val()})
            })
            setBooks(rows)
            setLoading(false)
        })
        
    }
    useEffect(()=>{
        getCart()
    },[])
    const onClickRemove = (book) =>{
        if(window.confirm(`${book.title}을 삭제하시겠습니까?`)){
            //삭제
            remove(ref(db, `cart/${uid}/${book.isbn}`))
        }
    }

    if(loading) return <h1 className='text-center my-5'><SyncLoader/></h1>
    return (
        <div>
            <h1 className='mt-5 text-center'>장바구니</h1>
            <Table>
                <thead>
                    <tr>
                        <td></td>
                        <td>제목</td>
                        <td>등록일</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => 
                        <tr key={book.isbn}>
                            <td width={50} ><BookPage book={book} /></td>
                            <td>{book.title}</td>
                            <td>{book.title}</td>
                            <td><Button 
                                onClick={()=>onClickRemove(book)}
                                size='sm' variant='outline-danger'>삭제</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default CartPage
