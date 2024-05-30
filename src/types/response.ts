export type TResponse<T> = {
  status: boolean;
  message: string;
  result: T;
};
