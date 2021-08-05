import React from 'react';
import { useHistory } from 'react-router-dom';

const SettingsPage = () => {
    const history = useHistory();
    return (
        <div>
            <button onClick={() => history.push('/dashboard')}>Back</button>
        </div>
    )
}

export default SettingsPage;