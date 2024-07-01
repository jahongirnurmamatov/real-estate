import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'

export default function Contact({ listing }) {
    const [landLord, setLandLord] = useState();
    const [message,setMessage]=useState('');

    const handleChange = (e)=>{
        setMessage(e.target.value);
    }
    
    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message)
                    return;
                }
                setLandLord(data);
            } catch (error) {
                console.log(error); 
            }
        }
        fetchLandLord();
    }, [listing.userRef]);

    return (
        <div>
            {landLord && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{landLord.username} </span>for <span className='toLowerCase font-semibold'>{listing.name}</span></p>
                    <textarea 
                    className='w-full border p-3 rounded-lg'
                    onChange={handleChange}
                     name="message" id="message" 
                     placeholder='Enter your message here'></textarea>
                     <Link className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95' to={`mailto:${landLord.username}?subject=Regarding ${listing.name}&body=${message}`}>Send Message</Link>
                </div>
            )}
        </div>
    )
}
