import React from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import './Footer.css'
import Logo from './Logo.jsx'
import LogoMonster from '../assets/LogoMonster.png'

const Footer = () => {
    return (
        <div className='Footer Constants '>
            <div className="footerTop">
                <div className='footer-left no-select'>
                    <div className="footer-left-first">
                        <div>
                            <div className="logo"> <Logo /> </div>
                        </div>
                        <p>The fastest and most reliable Pinterest board downloader. Download entire boards in seconds.</p>
                    </div>
                    <div className="footer-left-second">
                        <h3>Product</h3>
                        <Link to="#home">Home</Link>
                        <Link to="#features">Features</Link>
                        <Link to="#pricing">Pricing</Link>
                        <Link to="/">FAQs</Link>
                    </div>
                </div>
                <div className='footer-right'>
                    <img src={LogoMonster} alt="" />
                    <h3>hello@pinhoader.com</h3>
                </div>

            </div>
            <div className="line"></div>
            <div className='endingText no-select'>© PinBoarder. All right Reserved.</div>
        </div>
    )
}

export default Footer
