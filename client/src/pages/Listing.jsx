import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaLocationDot } from "react-icons/fa6";
import {FaBed, FaBath, FaParking, FaChair} from 'react-icons/fa'
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const {currentUser} = useSelector(state=>state.user);
    const [contact,setContact] = useState(false);



    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setLoading(false);
                    setError(true);
                    return;
                };
                setListing(data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();

    }, [params.listingId]);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl text-red-700'>Something went wrong!</p>}
            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {
                            listing.imageUrls.map((url) => (
                                <SwiperSlide key={url}>
                                    <div className='h-[550px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                  
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                        <h1 className='mt-7 text-2xl font-bold text-slate-900'>{listing.name}
                            <span>-${listing.discountPrice > 0 ? listing.discountPrice : listing.regularPrice}</span>
                            <span>{listing.type === 'rent' ? '/month' : ''}</span>
                        </h1>
                        <div className='flex gap-2 mt-5'>
                            <FaLocationDot className='w-4 h-4 text-green-800' />
                            <span className='text-sm text-green-800'>{listing.address}</span>
                        </div>
                        <div className='mt-3 flex gap-4'>
                            <p className='p-3 bg-red-900 w-[200px] text-white rounded-md  text-center '>
                                {listing.type==='rent' ? 'For rent' : "For sale"}
                            </p>
                            {listing.offer  && (
                                 <p className='p-3 bg-green-900 w-[200px] text-white rounded-md  text-center '>
                                    ${listing.regularPrice-listing.discountPrice} DISCOUNT
                             </p>
                            )}
                            
                        </div>
                        <p className='text-slate-800 mt-5'> <span className='font-semibold text-black'>Description -</span> {listing.description}</p>
                        <ul className='mt-5 flex-wrap text-green-900 font-semibold text-sm flex items-center sm:gap-6'>
                            <li className='flex gap-1 items-center whitespace-nowrap '>
                                <FaBed className='text-lg'/>
                                {listing.bedrooms>1 ? `${listing.bedrooms} beds` :`${listing.bedrooms} bed`}
                            </li>
                            <li className='flex gap-1 items-center whitespace-nowrap '>
                                <FaBath className='text-lg'/>
                                {listing.bathrooms>1 ? `${listing.bathrooms} baths` :`${listing.bathrooms} bath`}
                            </li>
                            <li className='flex gap-1 items-center whitespace-nowrap '>
                                {listing.parking === true? <><FaParking className='text-lg'/> Parking spot</>:'No Parking'}
                            </li>
                            <li className='flex gap-1 items-center whitespace-nowrap '>
                                {listing.furnished === true? <><FaChair className='text-lg'/> Furnished</>:'Not furnished'}
                            </li>

                        </ul>
                        {currentUser && listing.userRef!==currentUser._id && !contact&& <button onClick={()=>setContact(true)} className='w-full p-3 bg-slate-800 text-white rounded-lg uppercase hover:opacity-95'>Contact landlord</button>}
                        {
                            contact && <Contact listing={listing}/>
                        }
                    </div>
              
                </>
            )}

        </main>
    )
}
