import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);

            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    }

    const handleRemoveChange = () => {
        setImage(null);
        setPreviewUrl(null);
    }

    const onChooseFile = () => {
        inputRef.current.click();
    }

  return (
    <div className='flex justify-center mb-6'>
      <input
        type="file"
        accept="image/*"
        className='hidden'
        ref={inputRef}
        onChange={handleImageChange}
      />
    
      {!image ? (
        <div className='w-20 h-20 flex justify-center items-center bg-blue-100/50 rounded-full relative cursor-pointer'>
            <LuUser className='text-4xl text-primary' />

            <button
                type='button'
                className='w-8 h-8 flex items-center justify-center bg-primary text-white bg-blue-500 rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                onClick={onChooseFile}
            >
                <LuUpload size={18}/>
            </button>
        </div>
      ) : (
        <div className='relative'>
            <img
                src={previewUrl}
                alt="profile photo"
                className='w-20 h-20 rounded-full object-cover'>
            </img>

            <button
                type='button'
                className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                onClick={handleRemoveChange}
            >
                <LuTrash/>
            </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector
