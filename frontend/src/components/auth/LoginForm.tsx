import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { authService } from '../../services/auth.service';
import { ILogin } from '../../types/auth.types';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { ErrorResponse } from '../../types/common.types';
import { Loader } from 'lucide-react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (userData: ILogin) => authService.login(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full"
        required
      />

      <button type="submit" className="btn btn-primary w-full">
        {isPending ? <Loader className="size-5 animate-spin" /> : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
