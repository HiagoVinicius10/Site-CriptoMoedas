import { Link } from "react-router-dom";
import styles from './header.module.css'
import Logo from '../../assets/logo.svg'


export function Header () {
    return (      
    <header className={styles.container}> 
        <Link to='/'>
           <img src={Logo} alt="Logo Cripto App" className={styles.logo}/> 
        </Link>
    

    </header>
    )
}