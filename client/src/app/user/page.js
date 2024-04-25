"use client";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [isEditView, setIsEditView] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/auth/login");
        console.error("No token found in localStorage");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/auth/user`,
          { params: { email: token } }
        );
        const { user } = response.data;
        setEmail(user.email);
        setMobile(user.mobile);
        setName(user.username);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = () => {
    setIsEditView(!isEditView);
  };

  const handleSaveClick = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/auth/user/update`,
        {
          username: name,
          email,
          mobile,
        }
      );
      setMessage("Updated Successfully");
      console.log(res);
    } catch (error) {
      setMessage("Error updating data, try again");
      console.error("Error updating user:", error);
    }

    setIsEditView(false);
  };

  const messageColor = useMemo(() => {
    return message.includes("Error") ? "red" : "green";
  }, [message]);

  const handleDeleteUser = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASEURL}/auth/user`,
        {
          data: {
            email: email,
          },
        }
      );
      setMessage("User deleted successfully");
      alert("User deleted successfully");
      router.replace("/auth/login");

      localStorage.clear();

      console.log(res);
    } catch (error) {
      setMessage("Error deleting user, please try again");
      console.error("Error deleting user:", error);
    }
  };

  const handleLogOut = () => {
    router.replace("/auth/login");

    localStorage.clear();
  };

  return (
    <>
      {isEditView ? (
        <div className="bg-slate-600 h-screen w-screen flex justify-center items-center">
          <div className="bg-slate-300 m-10 flex flex-col items-center rounded-xl p-5">
            <div className="rounded-full w-24 h-24 overflow-hidden">
              <Image
                alt="Profile Image"
                width={100}
                height={100}
                src={
                  "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGUlMjBkZWZhdWx0fGVufDB8fDB8fHww"
                }
              />
            </div>
            <div className="flex flex-col w-full items-start mt-5">
              <label className="text-[20px] text-zinc-700">
                Name:{" "}
                <input
                  className="bg-transparent border-b-2 border-slate-600 outline-none ml-10"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              
              <label className="text-[20px] text-zinc-700">
                Mobile No:{" "}
                <input
                  className="bg-transparent border-b-2 border-slate-600 outline-none"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </label>
            </div>
           
            <button
              className="mt-5 bg-slate-600 rounded p-2 px-10 text-white font-bold hover:bg-slate-400 hover:scale-90"
              onClick={handleSaveClick}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-600 h-screen w-screen flex justify-center items-center">
          <div className="bg-slate-300 m-10 flex flex-col items-center rounded-xl p-5">
            <div className="rounded-full w-24 h-24 overflow-hidden">
              <Image
                alt="Profile Image"
                width={100}
                height={100}
                src={
                  "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGUlMjBkZWZhdWx0fGVufDB8fDB8fHww"
                }
              />
            </div>
            <div className="flex flex-col items-start mt-5">
              <h1 className="text-[20px] text-zinc-700">
                Name: <span className="font-bold">{name}</span>
              </h1>
              <h1 className="text-[20px] text-zinc-700">
                Email ID: <span className="font-bold">{email}</span>
              </h1>
              <h1 className="text-[20px] text-zinc-700">
                Mobile No: <span className="font-bold">{mobile}</span>
              </h1>
            </div>
            <div className="flex gap-10">
              <button
                className="mt-5 bg-slate-600 rounded p-2 px-10 text-white font-bold hover:bg-slate-400 hover:scale-90"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="mt-5 bg-slate-400 rounded p-2 px-8 text-white font-bold hover:bg-slate-400 hover:scale-90"
                onClick={handleLogOut}
              >
                LogOut
              </button>
              <button
                className="mt-5 bg-red-500 rounded p-2 px-8 text-white font-bold hover:bg-slate-400 hover:scale-90"
                onClick={handleDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Page;
