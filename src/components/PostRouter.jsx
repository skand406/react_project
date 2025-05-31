import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ListPage from './post/ListPage'
import WritePage from './post/WritePage'

const PostRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<ListPage/>}/>
            <Route path='/write' element={<WritePage/>}/>
        </Routes>
    )
}

export default PostRouter
