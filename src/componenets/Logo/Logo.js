import React from "react";
import Tilty from 'react-tilty';
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilty className="Tilt br2 shadow-2" options={{ max: 55 }} style={{ height: 150, width: 150 }}>
                <div className="Tilt-inner pa3">
                    <img style={{ paddingTop: '5px' }} alt='logo'
                    src="https://img.icons8.com/ios/100/000000/brain--v1.png" />
                </div>
            </Tilty>
        </div>
    );
}

export default Logo;