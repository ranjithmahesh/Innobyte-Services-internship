"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import React, { useState } from "react";

function Register() {
  const [data, setData] = useState({
    email: "",
    password: "",
    username: "",
    mobile: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const path = pathname.split("/").pop();
  const router = useRouter();

  const handleValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!data.email || !data.password || !data.username || !data.mobile) {
      setError("Fill all the required fields");
      return false;
    }
    if (data.email && !emailRegex.test(data.email)) {
      setError("Invalid email !");
      return false;
    }

    if (data.password && !passwordRegex.test(data.password)) {
      setError("Invalid password !");
      return false;
    }

    setError(false);
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    handleValidation();
  };

  const onSubmit = async () => {
    if (handleValidation()) {
      setLoading(true);
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/auth/register`,
          {
            name: data.username,
            email: data.email,
            password: data.password,
            mobile: data.mobile,
          }
        );

        console.log(res.data);
        toast.success("Verification link sent to your email!");
        router.push("/auth/login");

        setLoading(false);
        // Handle successful response
      } catch (error) {
        // Handle error
        if (error.response && error.response.status === 400) {
          toast.error("User already exists");
        } else {
          console.error(error, "error");
        }
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-[#131a2c] w-screen h-screen flex flex-row p-14 px-44 rounded-lg">
      <div className="bg-[#2d3250] flex-1 rounded-l-3xl p-3">
        <div className="flex gap-5 text-white">
          <Link href={"/auth/login"}>
            <h1
              className={`${
                path === "login" && " border-b-4 border-[#F9B17A]"
              }`}
            >
              Login
            </h1>
          </Link>
          <Link href={"/auth/register"}>
            <h1
              className={`${
                path === "register" && " border-b-4 border-[#F9B17A]"
              }`}
            >
              Register
            </h1>
          </Link>
        </div>
        <div className="m-[50px]">
          <div className="text-white   text-[34px]  ">
            <h1 className="font-semibold">
              {" "}
              welcome to <span className="  text-[#F9B17A]">Market</span>
            </h1>
            {path === "login" ? (
              <p className="text-[14px]">Sign in to continue</p>
            ) : (
              <p className="text-[14px]">Sign up to continue</p>
            )}
          </div>
          <div className="mt-10 ">
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                onChange={handleChange}
                value={data.username}
                placeholder=" "
                className="peer focus:outline-none placeholder-transparent text-white border-b-2 border-gray-300 w-full focus:border-[#F9B17A] bg-[#2d3250]"
              />
              <label
                htmlFor="username"
                className="absolute transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm left-0 -top-3.5 text-sm text-gray-600 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base"
              >
                Username
              </label>
            </div>
            <div className="relative mt-5">
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                value={data.email}
                placeholder=" "
                className="peer focus:outline-none placeholder-transparent text-white border-b-2 border-gray-300 w-full focus:border-[#F9B17A] bg-[#2d3250]"
              />
              <label
                htmlFor="email"
                className="absolute transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm left-0 -top-3.5 text-sm text-gray-600 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base"
              >
                Email id
              </label>
            </div>
            <div className="relative mt-5">
              <input
                id="mobile"
                name="mobile"
                type="number"
                onChange={handleChange}
                value={data.mobile}
                placeholder=" "
                className="peer focus:outline-none placeholder-transparent text-white border-b-2 border-gray-300 w-full focus:border-[#F9B17A] bg-[#2d3250] spin-button-none"
              />
              <label
                htmlFor="mobile"
                className="absolute transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm left-0 -top-3.5 text-sm text-gray-600 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base"
              >
                Mobile Number
              </label>
            </div>

            <div className="relative mt-5">
              <input
                name="password"
                autoComplete="new-password"
                value={data.password}
                type="password"
                onChange={handleChange}
                id="password"
                placeholder=" "
                className="peer focus:outline-none placeholder-transparent text-white border-b-2 border-gray-300 w-full focus:border-[#F9B17A] bg-[#2d3250]"
              />
              <label
                htmlFor="password"
                className="absolute transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm left-0 -top-3.5 text-sm text-gray-600 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base"
              >
                Password
              </label>
            </div>
            <h1 className="text-red-500">{error}</h1>

            <div className=" flex justify-between mt-2 text-white items-center">
              <div>
                <input
                  id="hi"
                  type="checkbox"
                  className="border border-[#F9B17A] bg-[#2d3250] cursor-pointer"
                />
                <label className="ml-2 text-sm  " htmlFor="hi">
                  Remember me
                </label>
              </div>
              <div className="text-sm hover:underline  hover:scale-120 cursor-pointer">
                Forgot Password ?
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <button
            onClick={onSubmit}
            className="bg-[#e58f52] rounded-xl text-white px-5 py-2 font-bold mx-auto block hover:bg-[#F9B17A]"
          >
            {path === "login"
              ? loading
                ? "Loading..."
                : "LogIn"
              : loading
              ? "Loading..."
              : "Sign up"}
          </button>{" "}
        </div>
      </div>
      <div className="flex-1 ">
        <Image
          className=" w-full h-full  object-cover rounded-r-3xl"
          alt="l"
          width={500}
          height={100}
          src={
            "https://images.unsplash.com/photo-1707617961911-889e9ab306bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2fHx8ZW58MHx8fHx8"
          }
        />
      </div>
    </div>
  );
}

export default Register;
