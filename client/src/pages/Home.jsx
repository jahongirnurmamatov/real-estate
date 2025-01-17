import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';



const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        if (data.success === false) {
          return console.log(data.message)
        }
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error)
      }
    }
    fetchOffers();
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }

    }
    const fetchSaleListings =async()=>{
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchOffers();
  }, []);

  return (
    <div>
      {/* topside */}
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl  '>Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease</h1>
        <p className='text-gray-400 text-xs sm:text-sm'>Future Estate will help you find your home fast, easy and comfortable.
          <br />
          Our expert support area always available.
        </p>
        <Link className='text-blue-800 text-xs sm:text-sm font-bold hover:underline' to={'/search'}>Let's start now...</Link>
      </div>
      {/* swiper */}
      <Swiper navigation>
      {
        offerListings && offerListings.length>0 && offerListings.map((listing)=>(
          <SwiperSlide key={listing._id}>
            <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:'cover'}} key={listing._id} className='h-[500px]'>
            </div>
          </SwiperSlide>

        ))
      }
      </Swiper>


      {/* listin results for offer  */ }
      <div className='max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          offerListings && offerListings.length>0 && (
            <div className='my-3'>
              <div>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {
                  offerListings.map((listing)=>(
                    <ListingItem key={listing._id} listing={listing}/> 
                  ))
                }
              </div>

            </div>
          )
        }
        {
          rentListings && rentListings.length>0 && (
            <div className='my-3'>
              <div>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {
                  rentListings.map((listing)=>(
                    <ListingItem key={listing._id} listing={listing}/> 
                  ))
                }
              </div>

            </div>
          )
        }
        {
          saleListings && saleListings.length>0 && (
            <div className='my-3'>
              <div>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {
                  saleListings.map((listing)=>(
                    <ListingItem key={listing._id} listing={listing}/> 
                  ))
                }
              </div>

            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home