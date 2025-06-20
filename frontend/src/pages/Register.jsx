import React from 'react';
import {Link }from "react-router-dom"

export default function Register() {
  return (
    <form className="flex flex-col gap-3 px-8 pb-2 bg-[#171717] rounded-[25px] transition-transform duration-300 hover:scale-105 hover:border border-black max-w-sm mx-auto">
      <p className="text-center my-8 text-white text-xl">Register</p>

      <InputField icon={<UserIcon />} placeholder="Full Name" type="text" />
      <InputField icon={<MailIcon />} placeholder="Email" type="email" />
      <InputField icon={<LockIcon />} placeholder="Password" type="password" />
      <InputField icon={<PhoneIcon />} placeholder="Phone Number" type="tel" />

      <div className="flex items-center gap-2 rounded-[25px] px-4 py-2 bg-[#171717] shadow-inner text-white">
        <RoleIcon />
        <select className="bg-transparent text-gray-300 w-full outline-none border-none">
          <option className="bg-[#171717] text-white" value="">Select Role</option>
          <option className="bg-[#171717] text-white" value="user">conducteur</option>
          <option className="bg-[#171717] text-white" value="admin">expediteur</option>
        </select>
      </div>

      <div className="flex justify-center gap-2 mt-10">
        <button
          type="submit"
          className="bg-[#252525] text-white px-8 py-2 rounded-md transition duration-300 hover:bg-black"
        >
          Register
        </button>
        <button
          type="button"
          className="bg-[#252525] text-white px-6 py-2 rounded-md transition duration-300 hover:bg-black"
        >
          Login
        </button>
      </div>
    </form>
  );
}

function InputField({ icon, placeholder, type }) {
  return (
    <div className="flex items-center gap-2 rounded-[25px] px-4 py-2 bg-[#171717] shadow-inner text-white">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        required
        className="bg-transparent border-none outline-none w-full text-gray-300"
      />
    </div>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5 fill-white" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5 fill-white" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v.217l-8 4.8-8-4.8V4zm0 1.383v6.634L5.803 8.21 0 5.383zM6.761 8.83l-6.761 4.06A2 2 0 002 14h12a2 2 0 001.999-1.11l-6.76-4.06-1.12.672-1.12-.672zM10.197 8.21L16 12.017V5.383l-5.803 2.827z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-5 w-5 fill-white" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1a2 2 0 012 2v4H6V3a2 2 0 012-2zM3 7V3a5 5 0 0110 0v4a2 2 0 012 2v5a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5 fill-white" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M391 351c-19-3-37-6-55-10-13-3-27 2-35 12l-27 27c-53-27-97-69-127-121l27-28c9-9 13-22 10-35-4-18-7-37-10-56-2-13-13-23-26-23H84c-15 0-28 13-26 28 17 161 144 288 305 305 15 2 28-11 28-26v-60c0-13-10-24-23-26z" />
    </svg>
  );
}

function RoleIcon() {
  return (
    <svg className="h-5 w-5 fill-white" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M96 96a96 96 0 1 1 0 192 96 96 0 1 1 0-192zm352 48a80 80 0 1 1 0 160 80 80 0 1 1 0-160zm192 240c0 44.2-35.8 80-80 80H80c-44.18 0-80-35.8-80-80 0-52.9 43.1-96 96-96h64c17.67 0 32 14.3 32 32s14.33 32 32 32h192c17.7 0 32-14.3 32-32s14.3-32 32-32h64c52.9 0 96 43.1 96 96z" />
    </svg>
  );
}
