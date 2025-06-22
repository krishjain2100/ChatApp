import { useState } from 'react';


const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    return (
        <div>
            <p style = {{textAlign: 'center', fontSize: '30px'}} > Forgot Password </p>
            <div style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto' }}>
                <div style={{display: 'flex', flexDirection: 'row', textAlign: 'center', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', gap: '10px'}}>
                    <div style={{ flex: 0.5 }}> Username: </div>
                    <input style = {{flex: 1.5}} type="text" onChange={(e)=>setUsername(e.target.value)}/> 
                </div>
                <button type="submit"> Send Link </button>
            </div>
        </div>
    );
}

export default ForgotPassword;