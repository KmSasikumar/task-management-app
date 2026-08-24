'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { dispatch } = useApp();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!email.trim() || !password.trim() || (!isLogin && !name.trim())) return;
    
    setLoading(true);
    setError('');
    
    try {
      const user = isLogin 
        ? await api.login(email, password)
        : await api.signup(name, email, password);
        
      dispatch({ type: 'LOGIN', payload: user });
      router.push('/tasks');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  }



  function handleGoogle() {
    // Not implemented yet
    setError('Google login is not implemented yet.');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-4">
      
      {/* Logo */}
      <div className="flex flex-row items-center gap-2 mt-12 mb-8">
        <div className="w-8 h-8 bg-[#111827] rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7273-1.1286-.7541-.5023-.0293-.9523.213-1.2062.6253L2.266 15.1271c-.2773.4518-.2718 1.0091.0158 1.4555l4.3759 6.7786c.2608.4046.7127.6388 1.1823.6388.1332 0 .267-.0188.3987-.0577l12.7019-3.7568c.3891-.1151.7072-.3904.8737-.7553s.1633-.7828-.0075-1.1454zm-1.8481.7519L9.1814 22.2242c-.3292.0975-.6448-.1873-.5756-.5194l3.8501-18.4386c.072-.3448.5486-.3996.699-.0803l7.1288 15.138c.1344.2856-.019.6224-.325.7128z"/>
          </svg>
        </div>
        <span className="text-[17px] font-bold text-[#111827]">Pyramid</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-[420px] flex flex-col bg-white border border-[#E5E5E5] rounded-[24px] p-8 shadow-sm">
        
        <h1 className="text-[24px] font-bold text-[#111827] text-center tracking-tight mb-2">
          {isLogin ? "Let's get back on track" : "Create an account"}
        </h1>
        <p className="text-[15px] text-[#6b7280] text-center mb-6">
          {isLogin ? "Enter your email and password below to login." : "Enter your details below to sign up."}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[48px] px-4 rounded-xl border border-[#E5E5E5] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all"
            />
          )}

          <input 
            type="email" 
            placeholder="E mail😊"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[48px] px-4 rounded-xl border border-[#E5E5E5] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all"
          />

          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[48px] px-4 rounded-xl border border-[#E5E5E5] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all mb-2"
          />

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full h-[48px] bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors active:bg-blue-800 text-[15px] disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>


          <button
            onClick={handleGoogle}
            disabled={loading}
            id="btn-google-login"
            className="w-full h-[48px] bg-white text-[#111827] font-medium rounded-full border border-[#eaeaea] hover:bg-gray-50 transition-colors active:bg-gray-100 flex items-center justify-center gap-2 text-[15px] disabled:opacity-50"
          >
            <svg className="w-[18px] h-[18px] text-[#111827]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
            </svg>
            Login with Google
          </button>
        </div>
      </div>

      {/* Toggle Login/Signup */}
      <p className="mt-6 text-[14px] text-[#6b7280]">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="text-[#111827] font-medium hover:underline focus:outline-none"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>

      {/* Footer */}
      <p className="text-[14px] text-[#6b7280] text-center mt-8 leading-relaxed">
        By clicking continue, you agree to<br />
        our <a href="#" className="text-[#6b7280] underline hover:text-[#374151] transition-colors">Terms of Service</a>
        {' '}and <a href="#" className="text-[#6b7280] underline hover:text-[#374151] transition-colors">Privacy<br />Policy</a>
      </p>
    </div>
  );
}