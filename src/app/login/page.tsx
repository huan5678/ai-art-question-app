'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Page = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {};

  return (
    <section className="container grid h-screen place-items-center">
      <div className="bg-background flex w-full max-w-4xl justify-between overflow-hidden rounded-lg">
        <form className="min-h-[60vh] w-1/2 space-y-8 p-12">
          <h1 className="text-center text-3xl font-bold">後台系統登入</h1>
          <div className="flex flex-col justify-center gap-4">
            <Label htmlFor="username" className="text-lg">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="flex flex-col justify-center gap-4">
            <Label htmlFor="password" className="text-lg">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <Button variant="default" className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </form>
        <div className="relative flex w-1/2 flex-col items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1641156803026-0b819059b04d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            width={1932}
            height={1218}
            alt="login"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};
export default Page;
