import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({url,boxes, height ,width}) => {
   
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' alt='' src={url} width={'500px'} height={'auto'}></img>            
                {
                    boxes.map((box, index) =>{
                        return (
                            <div key={index} className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
                        );
                    })
                }
                
            </div>
        </div>
    )
}

export default FaceRecognition;