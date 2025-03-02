'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import SignUp from '@/app/(auth)/sign-up/page'
import SignIn from '@/app/(auth)/sign-in/page'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'


function AuthForm({ type }: { type: string }) {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const formSchema = authFormSchema(type);
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })
 
  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    
    try {
        //console.log(data)
        // Sign up with Appwrite & create plaid token

        if(type === 'sign-up') {
            const newUser = await signUp(data);

            setUser(newUser);
        }
        
        if(type === 'sign-in') {
            const response = await signIn({
                email: data.email,
                password: data.password
            });

            if(response) {
                router.push('/');
            }
        }
    } catch (error) {
        console.log(error)

    } finally {
        setIsLoading(false)
    }
  }

  
    
  return (
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
            <Link href="/" className='flex cursor-pointer items-center gap-1'>
                <Image
                    src="/icons/logo.svg"
                    width={34}
                    height={34}
                    alt='logo'
                />
                <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Horizon</h1>
            </Link>

            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                    {user
                        ? 'Link Account'
                        : type === 'sign-in'
                            ? 'Sign In'
                            : 'Sign Up'
                    }
                    <p className='text-16 font-normal text-gray-600'>
                        {user
                            ? 'Link your account to get started'
                            : 'Please enter your details'
                        }
                    </p>
                </h1>
            </div>
        </header>
        {user
            ? (
            <div className=' flex flex-col gap-4'>
                {/* PlaidLink */}
            </div>)
            : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                                <>
                                    <div className='flex gap-4'>
                                        <CustomInput
                                            control={ form.control }
                                            name='firstName'
                                            label='First Name'
                                            placeholder='ex: John'
                                        />
                                        <CustomInput
                                            control={ form.control }
                                            name='lastName'
                                            label='Last Name'
                                            placeholder='ex: Doe'
                                        />
                                    </div>
                                    <CustomInput
                                        control={ form.control }
                                        name='address1'
                                        label='Address'
                                        placeholder='Enter your specific address'
                                    />
                                    <CustomInput
                                        control={ form.control }
                                        name='city'
                                        label='City'
                                        placeholder='ex: New York'
                                    />
                                    <div className='flex gap-4'>
                                        <CustomInput
                                            control={ form.control }
                                            name='state'
                                            label='State'
                                            placeholder='ex: NY'
                                        />
                                        <CustomInput
                                            control={ form.control }
                                            name='postalCode'
                                            label='Postal Code'
                                            placeholder='ex: 11101'
                                        />
                                    </div>
                                    <div className='flex gap-4'>
                                        <CustomInput
                                            control={ form.control }
                                            name='dateOfBirth'
                                            label='Date of Birth'
                                            placeholder='yyyy-mm-dd'
                                        />
                                        <CustomInput
                                            control={ form.control }
                                            name='ssn'
                                            label='SSN'
                                            placeholder='ex: 1234'
                                        />
                                    </div>
                                </>
                            )}

                            <CustomInput
                                control={ form.control }
                                name='email'
                                label='Email'
                                placeholder='Enter your email'
                            />
                            <CustomInput
                                control={ form.control }
                                name='password'
                                label='Password'
                                placeholder='Enter your password'
                            />
                            {/* <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <div className='form-item'>
                                        <FormLabel className='form-label'>
                                            Email
                                        </FormLabel>
                                        <div className='flex w-full flex-col'>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter your email'
                                                    className='input-class'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage
                                                className='form-message mt-2'
                                            />
                                        </div>
                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <div className='form-item'>
                                        <FormLabel className='form-label'>
                                            Password
                                        </FormLabel>
                                        <div className='flex w-full flex-col'>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter your password'
                                                    className='input-class'
                                                    type='password'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage
                                                className='form-message mt-2'
                                            />
                                        </div>
                                    </div>
                                )}
                            /> */}
                            <div className='flex flex-col gap-4'>
                                <Button type="submit" className='form-btn' disabled={isLoading}>
                                    {isLoading
                                        ? (
                                        <>
                                            <Loader2 size={20} className='animate-spin' /> &nbsp; Loading...
                                        </>)
                                        : ( type === 'sign-in' ? 'Sign In' : 'Sign Up')
                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'>
                            {type === 'sign-in'
                                ? "Don't have an account?"
                                : "Already have an account?"}
                        </p>
                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                            {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </footer>
                </>
            )
        }
    </section>
  )
}


export default AuthForm