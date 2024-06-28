import React, { useState } from 'react'
import { app } from '../firebase';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'

export default function CreateListing() {
    const [files,setFiles]=useState([]);
    const [imageUploadErr,setImageUploadErr]=useState(false);
    const [uploading,setUploading] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls:[],
    });
    console.log(formData)
    const handleImageSubmit = ()=>{
        setUploading(true)
        if(files.length>0 && files.length +formData.imageUrls.length<7){
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls)=>{
                setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)});
                setImageUploadErr(false);
                setUploading(false)
            }).catch(err=>{
                setImageUploadErr('Image upload failed (2mb max per image');
                setUploading(false)
            })
           
        }else{
            setImageUploadErr('You can upload only 6 images in total!');
            setUploading(false);
        }
    }
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage(app);
          const fileName = new Date().getTime() + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };

    const handleRemoveImage = (index)=>{
        setFormData({
            ...formData,
            imageUrls:formData.imageUrls.filter((__,i)=>i!==index),
        });
    }
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
                        <input onChange={(e)=>{setFiles(e.target.files)}} className='p-3 border border-grey-300 rounded-lg w-full' type="file" id='images' accept='image/*' multiple />
                        <button  disabled={uploading} type='button' onClick={()=>handleImageSubmit()} className='p-3 text-green-700 border border-green-700 uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading...':"Upload"}</button>
                    </div>
                    {
                        formData.imageUrls.length>0 && formData.imageUrls.map((url,index)=>(
                            <div className=' flex justify-between p-3 border items-center'>
                                 <img src={url} key={index}  className='w-20 h-20 object-contain rounded-lg'/>
                                <button type='button' onClick={()=>handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>
                        ))
                    }
                    <div className='p-3 bg-slate-800 text-white uppercase text-center rounded-lg  hover:opacity-95 disabled:opacity-80 cursor-pointer'>create listing</div>
                    <p className='text-red-700 text-sm'>{imageUploadErr && imageUploadErr}</p>
                    
                </div>
               
              
            </form>
        </main>
    )
}
