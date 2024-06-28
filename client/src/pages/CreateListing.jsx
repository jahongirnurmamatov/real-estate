import React, { useState  } from 'react'
import { app } from '../firebase';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
export default function CreateListing() {
    const [files,setFiles]=useState([]);
    const [imageUploadErr,setImageUploadErr]=useState(false);
    const [uploading,setUploading] = useState(false);
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    const {currentUser} = useSelector(state=>state.user)
    const [formData, setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:0,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,
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

    const handleChange = (e)=>{
        if(e.target.id==='sale'||e.target.id==='rent'){
            setFormData({
                ...formData,
                type:e.target.id
            });
        }
        if(e.target.id==='parking'||e.target.id==='furnished'||e.target.id==='offer'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.checked
                
            });
        }
        if(e.target.type==='text'||e.target.type==='number'||e.target.type==='textarea'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.value
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (formData.imageUrls.length < 1)
            return setError('You must upload at least one image');
          if (+formData.regularPrice < +formData.discountPrice)
            return setError('Discount price must be lower than regular price');
          setLoading(true);
          setError(false);
          const res = await fetch('api/listing/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              userRef: currentUser._id,
            }),
          });
          const data = await res.json();
          setLoading(false);
          if (data.success === false) {
            setError(data.message);
          }else{
            navigate(`/listing/${data._id}`);
          }
         
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
    return (
        <main className='p-3 max-w-4xl mx-auto '>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input onChange={handleChange} className='p-3 border rounded-lg' id='name' maxLength='62' minLength='10' required type="text" placeholder='Name' />
                    <textarea onChange={handleChange} className='p-3 border rounded-lg' id='description' required type="text" placeholder='Description' />
                    <input onChange={handleChange} className='p-3 border rounded-lg' id='address' required type="text" placeholder='Adress' />
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type==='sale'}/>
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type==='rent'}/>
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                            <span>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-2 items-center'>
                            <input onChange={handleChange} value={formData.bedrooms} className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10' required />
                            <span>Beds</span>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input onChange={handleChange} value={formData.bathrooms} className='p-3 border border-gray-300 rounded-lg' type="number" id='bathrooms' min='1' max='10' required />
                            <span>Baths</span>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input onChange={handleChange} value={formData.regularPrice} className='p-3 border border-gray-300 rounded-lg' type="number" id='regularPrice' required />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($/month)</span>
                            </div>
                        </div>
                        {formData.offer && <div className='flex gap-2 items-center'>
                            <input onChange={handleChange} value={formData.discountPrice} className='p-3 border border-gray-300 rounded-lg' min='0' type="number" id='discountPrice'  required />
                            <div className='flex flex-col items-center'>
                                <p>Discount price</p>
                                <span className='text-xs'>($/month)</span>
                            </div>
                        </div>}
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
                    <button disabled={loading||uploading} className='p-3 bg-slate-800 text-white uppercase text-center rounded-lg  hover:opacity-95 disabled:opacity-80 cursor-pointer'>{loading ? 'Creating...' : 'Create list'}</button>
                    <p className='text-red-700 text-sm'>{imageUploadErr && imageUploadErr}</p>
                    <p className='text-red-700 text-sm'>{error && error}</p>
                    
                </div>
               
              
            </form>
        </main>
    )
}
