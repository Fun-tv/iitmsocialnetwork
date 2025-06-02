
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateIITMEmail, validatePassword } from '@/utils/validation';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Heart, Users, MessageCircle, Star } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { signUp, signIn, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      // Small delay to prevent flash
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  }, [user, authLoading]);

  // Show loading if auth is still initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🔥</span>
          </div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateIITMEmail(email)) {
        toast({
          title: 'Invalid Email',
          description: 'Please use your IITM email address (@smail.iitm.ac.in, @ds.study.iitm.ac.in, etc.)',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      if (!isLogin) {
        if (password !== confirmPassword) {
          toast({
            title: 'Password Mismatch',
            description: 'Passwords do not match',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          toast({
            title: 'Invalid Password',
            description: passwordValidation.errors.join('. '),
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        console.log('Attempting sign up with email:', email);
        const { error } = await signUp(email, password);
        if (error) {
          console.error('Sign up error:', error);
          toast({
            title: 'Sign Up Failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Sign Up Successful',
            description: 'Please check your email for verification instructions.',
          });
        }
      } else {
        console.log('Attempting sign in with email:', email);
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Sign in error:', error);
          toast({
            title: 'Sign In Failed',
            description: error.message || 'Invalid email or password',
            variant: 'destructive',
          });
        } else {
          console.log('Sign in successful');
          toast({
            title: 'Welcome back!',
            description: 'You have been successfully signed in.',
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🔥</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            IITM Social Network
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with fellow IITM students, make meaningful relationships, and build your campus network
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm">Find Connections</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm">Build Network</p>
            </div>
            <div className="text-center">
              <MessageCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm">Chat & Connect</p>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-gray-300 text-sm">Premium Features</p>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white">
                {isLogin ? 'Welcome Back' : 'Join IITM Social Network'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {isLogin 
                  ? 'Sign in to your account' 
                  : 'Create an account with your IITM email'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-300">IITM Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@smail.iitm.ac.in"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
