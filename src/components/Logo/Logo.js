import React from 'react'
import ParallaxHover from 'react-parallax-hover'
import brain from './brain.png'
import './Logo.css'
const Logo = () => {
    return(
        <div style={{display: 'flex', justifyContent:'flex-start'}}>
            <div className='Parallax br2 shadow-2'>
            <ParallaxHover  width={150} height={150} rotation={9} scale={2} shadow={9}>
                <div className='pa3'> <img style={{paddingTop: '5px'}} alt='' src={brain} /> </div>
            </ParallaxHover>
            </div>
        </div>
        
    )
}

export default Logo;