import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import uploadImage from '../../utils/UploadImage';
import { UserContext } from '../../contexts/userContext';
import { API_PATHS } from '../../utils/apiPaths';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import defaultProfileImage from '../../assets/images/defaultProfilePic.png';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async(e) => {
      e.preventDefault();
  
      let profileImageUrl = defaultProfileImage;

      if(fullName.length < 3){
        setError("Please enter full name");
        return;
      }

      if(!validateEmail(email)){
        setError("Please enter a valid email address");
        return;
      }
  
      if(!password || password.length < 8){
        setError("Please enter your password min. 8 characters");
        return;
      }
  
      setError("");
  
      // SignUp API call
      try{
        if(profilePic) {
          const imageUploadRes = await uploadImage(profilePic);
          profileImageUrl = imageUploadRes.imageUrl || '';
        }

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          name: fullName,
          email,
          password,
          profileImageUrl: profileImageUrl,
          adminInviteToken
        });

        const { token, role } = response.data;

        if (token) {
          localStorage.setItem("token", token);
          updateUser(response.data);
        }

        //Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
      catch (error){
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      }
    }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>
          Create an account
        </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}></ProfilePhotoSelector>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              type='text'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder='John'
              label="Full Name"
            />

            <Input
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='hello@gmail.com'
              label="Email Address"
            />

            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Min. 8 characters'
              label="Password"
            />

            <Input
              type='text'
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
              placeholder='6 digit code'
              label="Admin Invite Token"
            />
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            Sign Up
          </button>
        </form>

        <p className='text-[13px] text-slate-800 mt-3'>
          Already have an account? {" "}
          <Link className='font-medium text-blue-500 underline' to='/login'>
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignUp
