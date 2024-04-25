"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
function Verify({ searchParams }) {
  const obj = searchParams;

  const router = useRouter();

  const email = Object.keys(obj)[0];

  //
  const [otp, setOtp] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(data);
  useEffect(() => {
    setLoading(true);
    const fetchOTP = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/auth/otp`,
          { params: { email } }
        );

        setData(response.data.otp);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching OTP:", error);
      }
    };
    fetchOTP();
  }, [email]);
  const handleSubmit = () => {
    setData(true);
    if (data !== otp) {
      setLoading(false);
      setOtp("");
      toast.error("OTP doesn't match");
    } else {
      setLoading(false);
      // Handle successful login
      toast.success("Logged in successfully!");
      router.replace("/user");
    }
  };

  return (
    <div className="w-screen h-screen bg-blue-500 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md flex items-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
        <p className="text-gray-600 mb-4">
          OTP has been sent to your email. Please check.
        </p>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          separator={<span>-</span>}
          renderInput={(inputProps, index) => (
            <input
              {...inputProps}
              style={{
                width: "2rem",
                height: "2rem",
                marginRight: "0.5rem",
                border: "1px solid #ced4da",
                borderRadius: "0.25rem",
                textAlign: "center",
                fontSize: "1.5rem",
              }}
            />
          )}
        />
        <button
          className="bg-blue-500 mt-5 rounded p-2 px-5 text-white font-bold hover:bg-blue-300 hover:scale-95"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Loading" : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default Verify;
