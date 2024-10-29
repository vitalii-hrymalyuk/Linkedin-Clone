import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ISignUp } from '../../types/auth.types';
import { authService } from '../../services/auth.service';
import { toast } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../types/common.types';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: signUpMutation, isPending } = useMutation({
    mutationFn: async (data: ISignUp) => authService.signUp(data),
    onSuccess: () => {
      toast.success('Account created successfully!');
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    },
  });

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signUpMutation({ name, username, email, password });
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full"
        required
      />

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full text-white"
      >
        {isPending ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          'Agree & Join'
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
