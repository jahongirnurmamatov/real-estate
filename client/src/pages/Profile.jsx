import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserFailure, updateUserStart, updateUserSuccess, deleteUserStart,
  deleteFailure,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess
} from '../redux/userSlice.js'
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useSelector(state => state.user);
  const imageRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(null);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.user);
  const [showListingErr, setShowListingErr] = useState(false);
  const [listings, setListings] = useState([]);

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        console.log('deleting user')
        dispatch(deleteUserSuccess(data.message));
        return;
      } else {
        console.log('failed to delete user');
        dispatch(deleteFailure(data.message));
        return;
      }
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  }
  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(signoutUserFailure(data))
      } else {
        dispatch(signoutUserSuccess(data));
      }
    } catch (error) {
      dispatch(signoutUserFailure(error))
    }
  }


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSumbit = async (e) => {
    dispatch(updateUserStart());
    e.preventDefault();
    try {
      const res = await fetch('/api/user/update/' + currentUser._id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        dispatch(updateUserSuccess(data.rest));
        setUpdateSuccess(true);
      } else {
        dispatch(updateUserFailure(data.message))
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadErr(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch('/api/listing/delete/' + listingId, {
        method: "DELETE"
      });
      const data = res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListings(prev => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {

    }
  }

  const handleShowListing = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingErr(true);
        return;
      }
      setListings(data);
    } catch (error) {
      setShowListingErr(true);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-semibold text-3xl text-center my-7'>Profile</h1>
      <form onSubmit={handleSumbit} className='flex flex-col gap-4'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" hidden ref={imageRef} accept='image/*' />
        <img
          onClick={() => imageRef.current.click()}
          src={formData.avatar ? formData.avatar : currentUser.avatar}
          alt=""
          className='rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer'
        />
        {filePerc !== null && (
          <div className='self-center text-slate-700'>
            {filePerc < 100 ? (
              <p>Uploading... {filePerc}%</p>
            ) : (
              <span className='text-green-700'>Successfully uploaded</span>
            )}
          </div>
        )}
        {fileUploadErr && <span className='text-red-700 self-center'>Error in uploading image (image must be less than 2mb)</span>}
        <input onChange={handleChange} type="text" defaultValue={currentUser.username} placeholder='username' className='border p-3 rounded-lg' id='username' />
        <input onChange={handleChange} type="text" defaultValue={currentUser.email} placeholder='email' className='border p-3 rounded-lg' id='email' />
        <input onChange={handleChange} type="password" placeholder='password' className='border p-3 rounded-lg' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Updating...' : 'update'}</button>
        <Link to='/create-listing' className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 '>Create</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      {error && <p className='text-red-500 mt-5'>{error ? error : ''}</p>}
      {updateSuccess && <p className='text-green-700'>User updated successfully!</p>}
      <button onClick={handleShowListing} className='text-green-700 w-full mt-5'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showListingErr && 'Error in showing listings'}</p>
      {
        listings && listings.length > 0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-center my-7 text-2xl font-semibold'>Your Listings</h1>
          {listings.map((listing) => (
            <div className='border rounded-lg p-3 flex justify-between items-center' key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <img className='w-16 h-16 object-contain ' src={listing.imageUrls[0]} alt="" />
              </Link>
              <Link className='flex-1 ml-2' to={`/listing/${listing._id}`}><p className='font-semibold hover:underline truncate text-slate-700 '>{listing.name}</p></Link>
              <div className='flex flex-col gap-0'>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='font-semibold hover:opacity-70 uppercase text-green-700'>Edit </button>
                </Link>
                <button onClick={() => handleListingDelete(listing._id)} className='font-semibold hover:opacity-70 uppercase text-red-700'>Delete</button>
              </div>

            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default Profile;
