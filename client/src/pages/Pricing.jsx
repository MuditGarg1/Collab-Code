import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];



  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order" , {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      },{withCredentials:true})
      

      const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: result.data.amount,
      currency: "INR",
      name: "InterviewIQ.AI",
      description: `${plan.name} - ${plan.credits} Credits`,
      order_id: result.data.id,

      handler:async function (response) {
        const verifypay = await axios.post(ServerUrl + "/api/payment/verify" ,response , {withCredentials:true})
        dispatch(setUserData(verifypay.data.user))

          alert("Payment Successful 🎉 Credits Added!");
          navigate("/")

      },
      theme:{
        color: "#10b981",
      },

      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      setLoadingPlan(null);
    } catch (error) {
     console.log(error)
     setLoadingPlan(null);
    }
  }



  return (
    <div className='min-h-[calc(100vh-5rem)] bg-transparent py-20 px-6 relative overflow-hidden'>
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className='max-w-6xl mx-auto mb-16 flex flex-col items-center relative z-10'>
        <button onClick={() => navigate("/")} className='absolute left-0 top-0 mt-2 p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition'>
          <FaArrowLeft className='text-gray-600' />
        </button>

        <div className="text-center w-full max-w-2xl mt-4 sm:mt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            Pricing Plans
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Future</span>
          </h1>
          <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">
            Flexible pricing to match your interview preparation goals. Unlock your full potential.
          </p>
        </div>
      </div>


      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10'>

        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id

          return (
            <motion.div key={plan.id}
              whileHover={!plan.default && { y: -8 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-6 transition-all duration-300 border flex flex-col bg-white
                ${isSelected
                  ? "border-emerald-200 shadow-[0_8px_40px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/20"
                  : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md"
                }
                ${plan.default ? "cursor-default" : "cursor-pointer"}
              `}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent rounded-3xl pointer-events-none"></div>
              )}

              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-5 right-5 bg-gray-100 border border-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                  Current
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-gray-900 mt-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700">
                  {plan.price}
                </span>
                <span className="text-gray-500 text-sm font-medium">/ package</span>
              </div>
              <p className="text-emerald-600 font-semibold mt-1 text-sm">
                {plan.credits} Credits included
              </p>

              {/* Description */}
              <p className="text-gray-600 mt-4 text-sm leading-relaxed min-h-[40px]">
                {plan.description}
              </p>

              <div className="h-px w-full bg-gray-100 my-6"></div>

              {/* Features */}
              <div className="space-y-4 text-left mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm leading-tight font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default &&
                <div className="mt-auto pt-4">
                  <button
                  disabled={loadingPlan === plan.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSelectedPlan(plan.id)
                      } else {
                        handlePayment(plan)
                      }
                    }} 
                    className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-sm
                      ${isSelected
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}>
                    {loadingPlan === plan.id
                      ? "Processing..."
                      : isSelected
                        ? "Proceed to Pay"
                        : "Select Plan"}
                  </button>
                </div>
              }
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}

export default Pricing
