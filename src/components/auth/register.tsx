import { useAuthState } from "@/stores/auth.store";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { registerScheme } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useState } from "react";
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import FillLoading from "../shared/fillLoading";

const Register = () => {
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState('');
  const navigate = useNavigate()
  const { setAuth } = useAuthState();
  const form = useForm<z.infer<typeof registerScheme>>({
    resolver: zodResolver(registerScheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof registerScheme>) => {
    const { email, password } = values;
    setIsLoading(true)
    try {
      const res = await createUserWithEmailAndPassword(auth,email,password)
      navigate('/')
    } catch (error) {
      const result = error as Error
      setError(result.message)
    }finally{
      setIsLoading(false)
    }
    
  };
  return (
    <div className="flex flex-col">
      {isLoading&&<FillLoading/>}
      <h2 className="text-xl font-bold">Register</h2>
      <p className="text-muted-foreground">
        Already have an account?{" "}
        <span
          onClick={() => setAuth("login")}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Sign in
        </span>
      </p>
      <Separator className="my-3" />
      {error&&(
        <Alert variant="destructive" className="mb-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
      )}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div>
        <Button type="submit" className="w-full h-11 mt-1" disabled={isLoading}>Submit</Button>
        </div>
      </form>
    </Form>
    </div>
  );
};

export default Register;
