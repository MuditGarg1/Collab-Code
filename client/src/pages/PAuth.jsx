import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Auth from '../AuthComponent.jsx/Auth'
import ForgotPassword from '../AuthComponent.jsx/ForgotPassword'
import OtpVerify from '../AuthComponent.jsx/OtpVerify'
import ResetPassword from '../AuthComponent.jsx/ResetPassword'

const PAuth = () => {
  return (
    <Routes>
      <Route index element={<Auth />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="verify-otp" element={<OtpVerify />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

export default PAuth