"use client"

import { useState } from "react"
import { Input } from "@/component/ui/Input"
import { Button } from "@/component/ui/Button"
import { Mail, Phone, CheckCircle } from "lucide-react"

interface VerificationStepProps {
  onComplete: () => void
}

export function VerificationStep({ onComplete }: VerificationStepProps) {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [phoneOtp, setPhoneOtp] = useState("")
  const [emailOtp, setEmailOtp] = useState("")
  const [phoneSent, setPhoneSent] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  const handleSendPhoneOtp = () => {
    if (phone.length >= 10) {
      setPhoneSent(true)
    }
  }

  const handleSendEmailOtp = () => {
    if (email.includes("@")) {
      setEmailSent(true)
    }
  }

  const handleVerifyPhone = () => {
    if (phoneOtp.length === 6) {
      setPhoneVerified(true)
    }
  }

  const handleVerifyEmail = () => {
    if (emailOtp.length === 6) {
      setEmailVerified(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-border flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Verify Your Contact</h2>
        <p className="text-sm text-muted-foreground">Verify your phone and email to secure your account</p>
        <p className="text-xs text-yellow-500 mt-2">This step cannot be skipped</p>
      </div>

      <div className="space-y-4">
        {/* Phone Verification */}
        <div className="border border-border rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Mobile Number</span>
            {phoneVerified && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
          </div>

          {!phoneVerified ? (
            <>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={phoneSent}
                  />
                </div>
                {!phoneSent && (
                  <Button onClick={handleSendPhoneOtp} variant="outline" className="shrink-0 bg-transparent">
                    Send OTP
                  </Button>
                )}
              </div>

              {phoneSent && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter 6-digit OTP"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <Button onClick={handleVerifyPhone} className="shrink-0">
                    Verify
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-green-500">Phone verified successfully</p>
          )}
        </div>

        {/* Email Verification */}
        <div className="border border-border rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Email Address</span>
            {emailVerified && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
          </div>

          {!emailVerified ? (
            <>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={emailSent}
                  />
                </div>
                {!emailSent && (
                  <Button onClick={handleSendEmailOtp} variant="outline" className="shrink-0 bg-transparent">
                    Send OTP
                  </Button>
                )}
              </div>

              {emailSent && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter 6-digit OTP"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                  <Button onClick={handleVerifyEmail} className="shrink-0">
                    Verify
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-green-500">Email verified successfully</p>
          )}
        </div>
      </div>

      {phoneVerified && emailVerified && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
          <p className="text-sm text-green-500">Both verified! You can proceed to the next step.</p>
        </div>
      )}
    </div>
  )
}
