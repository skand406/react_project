import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menubar from './components/Menubar';
import FooterPage from './components/FooterPage';


function App() {
  const basename = process.env.PUBLIC_URL
  return (
    <div>
      <img src={`${basename}/home.jpg`} width='100%' />
      <Menubar/>
      <FooterPage/>
    </div>
  );
}

export default App;
