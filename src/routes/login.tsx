import { ErrorMessage } from "@hookform/error-message";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AuthProvider } from "../context/authProvider";
import { StatusCode } from "../services/apis";

export const signInParamsSchema = z.object({
  email: z.string().trim().email().min(5),
  password: z.string().min(8),
});

function Login() {
  const navigate = useNavigate();

  type SignInParamsSchema = z.infer<typeof signInParamsSchema>;
  const methods = useForm<SignInParamsSchema>();
  const {
    handleSubmit,
    register,
    formState: { errors, isLoading },
    setError,
  } = methods;

  const onSubmit: SubmitHandler<SignInParamsSchema> = async (reqData, e?) => {
    try {
      e?.persist();
      const res = await AuthProvider.signIn(reqData);
      if (res.statusCode === StatusCode.EMailOrPasswordError) {
        setError("password", {
          type: "manual",
          message: "Email or password is incorrect.",
        });
      } else if (res.statusCode === StatusCode.OK) {
        console.log("Logged in");
        console.log(res);
        return navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error(error);
      setError("password", {
        type: "server",
        message: "Invalid email or password",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <main className='w-full h-screen flex justify-center items-start md:items-center'>
        <form
          className='space-y-5 max-w-sm w-full text-gray-600 p-5 '
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className='font-medium' htmlFor='email'>
            Email
            <input
              id='email'
              type='email'
              required
              autoComplete='email'
              className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border  shadow-sm rounded-lg mb-2 border-b-2 border-gray-800 h-12'
              {...register("email")}
              placeholder='Example@email.com'
              autoFocus
            />
          </label>

          <label className='font-medium' htmlFor='password'>
            Password
            <input
              id='password'
              type='password'
              required
              autoComplete='current-password'
              className='w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border  shadow-sm rounded-lg border-b-2 border-gray-800 h-12'
              placeholder='at least 8 characters'
              {...register("password")}
            />
          </label>
          <div className='flex justify-end'>
            <a className='text-green-600 text-sm'>
              Forgot Password? (reserved)
            </a>
          </div>
          <ErrorMessage
            errors={errors}
            name='password'
            render={({ message }) => <p className='text-red-600'>{message}</p>}
          />
          <ErrorMessage
            errors={errors}
            name='email'
            render={({ message }) => <p className='text-red-600'>{message}</p>}
          />
          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-4 text-white font-medium bg-gray-800 rounded-full duration-150 ease-in-out'
          >
            <p className='text-xl'>
              {isLoading ? "Logging in..." : "Login in"}
            </p>
          </button>
        </form>
      </main>
    </FormProvider>
  );
}
export default Login;
