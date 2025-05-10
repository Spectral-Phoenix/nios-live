import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import AuthService from "@/services/authService";

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await AuthService.signup(username, password);
      console.log('Sign up successful:', response);
      setSuccessMessage(response.data.message || "Account created successfully! Please sign in.");
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to sign up. Please try again.';
      setError(errorMessage);
      console.error('Sign Up Error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-md border-4 border-border shadow-[8px_8px_0px_0px_var(--foreground)]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-mono font-black">Create Account</CardTitle>
          <CardDescription className="font-mono">
            Enter your details below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-mono font-bold">Username</Label>
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
              <Label htmlFor="password" className="font-mono font-bold">Password</Label>
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
            {successMessage && <p className="font-mono text-green-600 dark:text-green-500 text-sm text-center">{successMessage}</p>}
            <Button
              type="submit"
              className="w-full font-mono font-bold bg-primary text-primary-foreground border-2 border-primary transform hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_var(--foreground)]"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-6">
          <p className="text-sm font-mono text-center">
            Already have an account?{" "}
            <Link to="/signin" className="font-bold hover:underline text-primary">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 