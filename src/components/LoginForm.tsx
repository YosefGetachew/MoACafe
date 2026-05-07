
import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: string, pass: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-none shadow-2xl">
      <CardHeader className="space-y-1 bg-primary text-primary-foreground p-8 text-center">
        <div className="mx-auto bg-primary-foreground/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
          <Shield className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Staff Access</CardTitle>
        <CardDescription className="text-primary-foreground/70">
          Enter your credentials to manage orders
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. maocafe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="p-8 pt-0">
          <Button type="submit" className="w-full h-11">
            Sign In to Dashboard
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
