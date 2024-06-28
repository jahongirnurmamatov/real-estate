import React from 'react'

export default function CreateListing() {
    return (
        <main className='p-3 max-w-4xl mx-auto '>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input className='p-3 border rounded-lg' id='name' maxLength='62' minLength='10' required type="text" placeholder='Name' />
                    <textarea className='p-3 border rounded-lg' id='description' required type="text" placeholder='Description' />
                    <input className='p-3 border rounded-lg' id='adress' required type="text" placeholder='Adress' />
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-2 items-center'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10' required />
                            <span>Beds</span>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bathrooms' min='1' max='10' required />
                            <span>Baths</span>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='regularPrice' min='1' max='10' required />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($/month)</span>
                            </div>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='discountPrice' min='1' max='10' required />
                            <div className='flex flex-col items-center'>
                                <p>Discount price</p>
                                <span className='text-xs'>($/month)</span>
                            </div>
                        </div>
                    </div>
                </div>
 
                <div className=' flex flex-col flex-1 gap-4 '>
                    <p className='font-semibold'>Images: <span className='font-normal text-gray-600 ml-2'>The first iamge will be the over (max 6)</span> </p>
                    <div className='flex justify-between gap-2'>
                        <input className='p-3 border border-grey-300 rounded-lg w-full' type="file" id='images' accept='image/*' multiple />
                        <button className='p-3 text-green-700 border border-green-700 uppercase hover:shadow-lg disabled:opacity-80'>upload</button>
                    </div>
                    <div className='p-3 bg-slate-800 text-white uppercase text-center rounded-lg mt-5 hover:opacity-95 disabled:opacity-80 cursor-pointer'>create listing</div>
                </div>
              
            </form>
        </main>
    )
}