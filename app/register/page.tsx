"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Film, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'

type Step = 'info' | 'otp' | 'success'

const MOCK_OTP = '123456'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading } = useAuth()

  const [step, setStep] = useState<Step>('info')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [otp, setOtp] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const updateForm = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setError('')
  }

  const handleSendOtp = async () => {
    setError('')
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Vui lòng nhập đầy đủ thông tin.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }
    setSendingOtp(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSendingOtp(false)
    setOtpSent(true)
    setStep('otp')
  }

  const handleVerifyOtp = async () => {
    setError('')
    if (otp !== MOCK_OTP) {
      setError('Mã OTP không đúng. Thử: 123456')
      return
    }
    await register(form.name, form.email, form.phone, form.password)
    setStep('success')
  }

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary">
              <Film className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">
              Cine<span className="text-primary">Book</span>
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            {(['info', 'otp', 'success'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : ['otp', 'success'].includes(step) && i === 0
                      ? 'bg-green-500 text-white'
                      : step === 'success' && i === 1
                      ? 'bg-green-500 text-white'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {(step === 'otp' && i === 0) || (step === 'success' && i <= 1) ? '✓' : i + 1}
                </div>
                {i < 2 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          {/* Step 1: Info */}
          {step === 'info' && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Tạo tài khoản</CardTitle>
                <CardDescription>Nhập thông tin cá nhân của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" placeholder="Nguyễn Văn A" value={form.name} onChange={updateForm('name')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={updateForm('email')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" type="tel" placeholder="09xx xxx xxx" value={form.phone} onChange={updateForm('phone')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tối thiểu 6 ký tự"
                      value={form.password}
                      onChange={updateForm('password')}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={form.confirmPassword}
                    onChange={updateForm('confirmPassword')}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button className="w-full" onClick={handleSendOtp} disabled={sendingOtp}>
                  {sendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang gửi OTP...
                    </>
                  ) : (
                    'Tiếp tục'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <Card className="bg-card border-border">
              <CardHeader>
                <button
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
                  onClick={() => setStep('info')}
                >
                  <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>
                <CardTitle>Xác minh Email</CardTitle>
                <CardDescription>
                  Nhập mã OTP 6 chữ số đã gửi tới{' '}
                  <span className="text-foreground font-medium">{form.email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-center">
                  <p className="text-muted-foreground">Mã OTP demo:</p>
                  <p className="text-2xl font-mono font-bold text-primary tracking-widest mt-1">
                    {MOCK_OTP}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">(Trong thực tế sẽ gửi qua Email Service)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">Mã OTP</Label>
                  <Input
                    id="otp"
                    placeholder="Nhập 6 chữ số"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setError('') }}
                    maxLength={6}
                    className="text-center text-xl tracking-widest font-mono"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button className="w-full" onClick={handleVerifyOtp} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xác minh...
                    </>
                  ) : (
                    'Xác minh & Đăng ký'
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Không nhận được mã?{' '}
                  <button
                    className="text-primary hover:underline"
                    onClick={() => setOtpSent(false)}
                  >
                    Gửi lại
                  </button>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <Card className="bg-card border-border">
              <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
                <div>
                  <h2 className="text-xl font-bold">Đăng ký thành công!</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Chào mừng <span className="text-foreground font-medium">{form.name}</span> đến với CineBook!
                  </p>
                </div>
                <Button className="w-full mt-2" onClick={() => router.push('/')}>
                  Khám phá phim ngay
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 'info' && (
            <p className="text-center text-sm text-muted-foreground">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
