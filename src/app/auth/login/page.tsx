'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { BuiltInProviderType } from 'next-auth/providers';
import {
  type ClientSafeProvider,
  getProviders,
  type LiteralUnion,
  signIn,
} from 'next-auth/react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { passwordCheck } from '@/lib/utils';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine(passwordCheck, { message: '請輸入至少8個字元的密碼' }),
  confirmPassword: z
    .string()
    .min(8)
    .refine(passwordCheck, { message: '請輸入相同的密碼' }),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignUpSchema = z.infer<typeof signUpSchema>;
type SignInSchema = z.infer<typeof signInSchema>;

const Page = () => {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const { toast } = useToast();

  const signUpForm = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    control: signUpControl,
    handleSubmit: signUpHandleSubmit,
    formState: { errors: signUpErrors },
  } = signUpForm;

  const signInForm = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { control: signInControl, handleSubmit: signInHandleSubmit } =
    signInForm;

  useEffect(() => {
    getProviders().then((providers) => {
      setProviders(providers);
    });
  }, []);

  const handleSignUp = async ({
    email,
    password,
    confirmPassword,
  }: SignUpSchema) => {
    setError(null);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
      }),
    });

    if (res.ok) {
      await signIn('credentials', { email, password });
      toast({ description: 'Sign up successfully' });
      router.push('/');
    } else {
      const errorData = await res.json();
      setError(errorData.message || 'Failed to sign up');
    }
  };

  const handleSignIn = async ({ email, password }: SignInSchema) => {
    setError(null);

    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/',
      redirect: false,
    });
    if (result?.ok) {
      toast({ description: 'Sign in successfully' });
      router.push('/');
      return;
    }

    if (result?.error) {
      setError(result.error);
    } else {
      setError('');
      router.push('/');
    }
  };

  return (
    <section className="container grid h-screen place-items-center">
      <div className="bg-background flex w-full max-w-4xl flex-col justify-between overflow-hidden rounded-lg md:flex-row">
        <div className="order-2 space-y-6 p-6 md:order-1 md:min-h-[60vh] md:w-1/2 md:p-12">
          <h1 className="text-center text-xl font-bold md:text-3xl">
            {isSignUp ? '後台系統註冊' : '後台系統登入'}
          </h1>
          {isSignUp ? (
            <Form {...signUpForm}>
              <form
                className="space-y-4"
                onSubmit={signUpHandleSubmit(handleSignUp)}
              >
                <FormField
                  control={signUpControl}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email" className="md:text-lg">
                        email
                      </Label>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpControl}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password" className="md:text-lg">
                        Password
                      </Label>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpControl}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="confirmPassword" className="md:text-lg">
                        Confirm Password
                      </Label>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {signUpErrors.confirmPassword && (
                  <p className="text-red-500">
                    {signUpErrors.confirmPassword.message}
                  </p>
                )}
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" variant="default" className="w-full">
                  Sign Up
                </Button>
                <p className="text-center">
                  已有帳號？{' '}
                  <Button variant="link" onClick={() => setIsSignUp(false)}>
                    登入
                  </Button>
                </p>
              </form>
            </Form>
          ) : (
            <Form {...signInForm}>
              <form
                className="space-y-4"
                onSubmit={signInHandleSubmit(handleSignIn)}
              >
                <FormField
                  control={signInControl}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email" className="md:text-lg">
                        email
                      </Label>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={signInControl}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password" className="md:text-lg">
                        Password
                      </Label>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" variant="default" className="w-full">
                  Login
                </Button>
                <p className="text-center">
                  尚無帳號？{' '}
                  <Button variant="link" onClick={() => setIsSignUp(true)}>
                    註冊
                  </Button>
                </p>
              </form>
            </Form>
          )}
          <div className="mt-6">
            {providers &&
              Object.values(providers).map((provider) => {
                if (provider.name === 'Credentials' && isSignUp) return null;
                return (
                  <div key={provider.name} className="mt-2">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                    >
                      Sign in with {provider.name}
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="relative order-1 flex h-24 flex-col items-center justify-center md:order-2 md:h-auto md:w-1/2">
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
