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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { passwordCheck } from '@/lib/utils';

const signUpSchema = z
  .object({
    email: z.string().email('請輸入有效的email'),
    password: z.string().refine(passwordCheck, {
      message:
        '密碼至少需要8個字符，包含至少一個大寫字母、一個小寫字母、一個數字和一個特殊字符',
    }),
    confirmPassword: z.string().min(8, { message: '密碼至少需要8個字符' }),
  })
  .refine(
    (data) => {
      const { password, confirmPassword } = data;
      return password === confirmPassword;
    },
    {
      message: '請輸入相同的密碼',
      path: ['confirmPassword'],
    }
  );

const signInSchema = z.object({
  email: z.string().email('請輸入有效的email'),
  password: z.string().min(1, { message: '請輸入密碼' }),
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
    formState: signUpFormState,
  } = signUpForm;

  const signInForm = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema, {}, { raw: true }),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    control: signInControl,
    handleSubmit: signInHandleSubmit,
    formState: signInFormState,
  } = signInForm;

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
      router.push('/admin');
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
      <Card className="w-full max-w-4xl overflow-hidden">
        <CardHeader className="border-b text-center">
          <CardTitle>{isSignUp ? '後台系統註冊' : '後台系統登入'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between p-0 md:flex-row">
          <div className="order-2 space-y-4 p-4 md:order-1 md:min-h-[60vh] md:w-1/2 md:p-8">
            {isSignUp ? (
              <Form {...signUpForm}>
                <form
                  className="space-y-4 "
                  onSubmit={signUpHandleSubmit(handleSignUp)}
                >
                  <FormField
                    control={signUpControl}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="signUpEmail">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="signUpEmail"
                            type="email"
                            placeholder="email"
                            disabled={signUpFormState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpControl}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="signUpPassword">Password</FormLabel>
                        <FormControl>
                          <Input
                            id="signUpPassword"
                            type="password"
                            placeholder="Password"
                            disabled={signUpFormState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpControl}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            disabled={signUpFormState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={signUpFormState.isSubmitting}
                  >
                    {signUpFormState.isSubmitting ? 'Loading...' : '註冊'}
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
                        <FormLabel htmlFor="signInEmail">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="signInEmail"
                            type="email"
                            placeholder="email"
                            disabled={signInFormState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInControl}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="signInPassword">Password</FormLabel>
                        <FormControl>
                          <Input
                            id="signInPassword"
                            type="password"
                            placeholder="Password"
                            disabled={signInFormState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full"
                    disabled={signInFormState.isSubmitting}
                  >
                    {signInFormState.isSubmitting ? 'Loading...' : '登入'}
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
            <div>
              {providers &&
                Object.values(providers).map((provider) => {
                  if (provider.name === 'Credentials') return null;
                  return (
                    <div key={provider.name} className="mt-2">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() =>
                          signIn(provider.id, { callbackUrl: '/' })
                        }
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
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
