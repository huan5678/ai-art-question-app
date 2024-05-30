import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';

interface MutationHandlerProps<TInput, TOutput> {
  url: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  options?: UseMutationOptions<TOutput, unknown, TInput>;
}

const useMutationHandler = <TInput, TOutput>({
  url,
  method,
  options,
}: MutationHandlerProps<TInput, TOutput>): UseMutationResult<
  TOutput,
  unknown,
  TInput
> => {
  const { toast } = useToast();

  const mutationFn = async (input: TInput) => {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  };

  const mutation = useMutation<TOutput, unknown, TInput>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) options.onSuccess(data, variables, context);
      toast({
        title: `${method} 成功`,
        description: '操作成功',
      });
    },
    onError: (error, variables, context) => {
      if (options?.onError) options.onError(error, variables, context);
      toast({
        title: `${method} 失敗`,
        description: '請再試一次',
      });
    },
    ...options,
  });

  return mutation;
};

export default useMutationHandler;
