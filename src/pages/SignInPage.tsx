import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { signIn } from '@/services/authService';
import AuthService from '@/services/authService';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // const userData = await signIn(username, password);
      // console.log('Signed in successfully:', userData);
      // localStorage.setItem('userToken', userData.token); // Or use context/state management
      // localStorage.setItem('userInfo', JSON.stringify({ id: userData.id, username: userData.username }));
      // navigate('/'); // Redirect to home or dashboard
      // alert('Sign In Logic Placeholder: Connect to authService'); // Placeholder
      // console.log('Username:', username, 'Password:', password); // Placeholder
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // navigate('/'); // Commenting out direct navigation for now

      const data = await AuthService.signin(username, password);
      console.log('Signed in successfully:', data);
      navigate('/'); // Redirect to home or dashboard after successful sign-in

    } catch (err: any) {
      // setError(err.message || 'Failed to sign in. Please check your credentials.');
      // console.error('Sign In Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to sign in. Please check your credentials.';
      setError(errorMessage);
      console.error('Sign In Error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-mono font-black">Sign In</CardTitle>
          <CardDescription className="font-mono">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="font-mono font-bold">Username</label>
              <Input
                id="username"
                type="text"
                placeholder="yourusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="font-mono border-2 border-border focus:border-primary shadow-[3px_3px_0px_0px_var(--foreground)]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="font-mono font-bold">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-mono border-2 border-border focus:border-primary shadow-[3px_3px_0px_0px_var(--foreground)]"
              />
            </div>
            {error && <p className="font-mono text-destructive text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full font-mono font-bold bg-primary text-primary-foreground border-2 border-primary transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_var(--foreground)]"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-6 text-center font-mono text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}