import React from 'react';
import { useHistory } from 'react-router';

const Logout = () => {

    const history = useHistory()
    if(localStorage.getItem('user')){
        localStorage.clear();
        history.push('/')
        window.location.reload(true);
    }
    
    return (
        <div>
            
        </div>
    );
};

export default Logout;