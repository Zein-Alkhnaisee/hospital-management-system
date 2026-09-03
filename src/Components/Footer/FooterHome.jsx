import { Link } from "react-router-dom";
import "./FooterStylee.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function FooterHome() {
    return (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-logo">Alivia Hospital</div>

            <ul className="footer-links">
                <li><Link to="/" onClick={ ()=>{
                    const el = document.getElementById('topHome');
                    el?.scrollIntoView({behavio : 'smooth' , block:'start'});
                    window.scrollBy(0,-2000)

                }}>Home</Link></li>

                <li><Link to={"/service"} onClick={ ()=>{
                    const el = document.getElementById('topService');
                    el?.scrollIntoView({behavio : 'smooth' , block:'start'});
                    window.scrollBy(0,-2000)

                }}>Service</Link></li>


                <li><Link to={"/about"} onClick={ ()=>{
                    const el = document.getElementById('topAbout');
                    el?.scrollIntoView({behavio : 'smooth' , block:'start'});
                    window.scrollBy(0,-2000)
                }}>About Us</Link></li>

                <li><Link to={"/specialties"} onClick={ ()=>{
                    const el = document.getElementById('topContact');
                    el?.scrollIntoView({behavio : 'smooth' , block:'start'});
                    window.scrollBy(0,-2000)

                }}>Medical departments</Link></li>
            </ul>

            <div className="footer-social">
                <Link to={"#"}><FaFacebook /></Link>
                <Link to={"#"}><FaInstagram /></Link>
                <Link to={"#"}><FaTwitter /></Link>
            </div>
        </div>
        <p className="footer-copy">© 2025 Alivia Hospital. جميع الحقوق محفوظة.</p>
    </footer>
);
}