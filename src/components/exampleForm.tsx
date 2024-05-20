'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
});

export const SiteForm = () => {
  // Expose the useForm() hook from react-hook-form
  // See https://react-hook-form.com/docs/useform
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
    },
  });

  // Expose the handleSubmit and control properties
  // from the useForm() hook
  const { handleSubmit, control } = form;

  // For now, we'll just console log the form values
  // when the form is submitted
  const onSubmit = (values: { name: string; url: string }) => {
    console.log(values, 'values');
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Create Your Website</CardTitle>
            <CardDescription>
              Tell us about your new site to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 py-6 space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end p-0">
            <Button type="submit">Get Started</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
