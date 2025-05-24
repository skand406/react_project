import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import MainRouter from './MainRouter';
import { useLocation, useNavigate } from 'react-router-dom';


const Menubar = () => {
    const navi = useNavigate()
    const email = sessionStorage.getItem('email')
    const uid = sessionStorage.getItem('uid')
    const basename = process.env.PUBLIC_URL;
    const location = useLocation();
    const pathname = location.pathname; //{pathname} = location;
    console.log(pathname);

    const onLogout = (e) =>{
        e.preventDefault()
        if(window.confirm('로그아웃하시겠습니까?')){
            sessionStorage.clear()
            navi('/')
        }
    }
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                <Navbar.Brand href={`${basename}/`}>REACT</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll>
                        <Nav.Link href={`${basename}/`} active={pathname==='/' && true}>Home</Nav.Link>
                        {email &&
                            <Nav.Link href={`${basename}/cart`} active={pathname==='/cart' && true}>장바구니</Nav.Link>              
                        }
                        </Nav>
                    <Nav>
                        {email ?    
                            <>
                                <Nav.Link href='#' active={true}>{email}</Nav.Link>
                                <Nav.Link href='#' onClick={onLogout}>로그아웃</Nav.Link>
                            </>
                            :
                            <Nav.Link href={`${basename}/login`} active={pathname==='/login' && true}>로그인</Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        <MainRouter/>
        </>
    );
}      


export default Menubar
