import styles from './App.module.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login.js';
import ToDo from './pages/ToDo/ToDo.js';
import Register from './pages/Register/Register.js';

function App() {
    return (
		<main className={styles.wrap}>
			<Routes>
				<Route path="/" element={<Login></Login>}></Route>
				<Route path="/register" element={<Register></Register>}></Route>
				<Route path="/todo" element={<ToDo></ToDo>}></Route>
			</Routes>
		</main>
    );
}

export default App;
