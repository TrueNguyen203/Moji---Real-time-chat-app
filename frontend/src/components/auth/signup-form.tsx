import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';

const signUpSchema = z.object({
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    username: z.string().min(3, 'Username need to have atleast 3 characters'),
    email: z.email('Invalid Email'),
    password: z.string().min(6, 'Password need to have atleast 6 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const { signUp } = useAuthStore();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormValues) => {
        const { firstname, lastname, username, email, password } = data;
        //Call backend sign up api
        await signUp(username, password, email, firstname, lastname);

        navigate('/signin');
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="overflow-hidden p-0 border-border">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form
                        className="p-6 md:p-8"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex flex-col gap-6">
                            {/* header-logo */}
                            <div className="flex flex-col items-center text-center gap-2">
                                <a
                                    href="/"
                                    className="mx auto block w-fit text-center"
                                >
                                    <img src="/logo.svg" alt="logo" />
                                </a>
                                <h1 className="text-2xl font-bold">
                                    Create Moji Account
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Welcome! Please sign up to start
                                </p>
                            </div>

                            {/* FirstName LastName */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstname"
                                        type="text"
                                        {...register('firstname', {
                                            required: true,
                                        })}
                                    />

                                    {errors.firstname && (
                                        <p className="error-message">
                                            {errors.firstname.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input
                                        id="lastname"
                                        type="text"
                                        {...register('lastname', {
                                            required: true,
                                        })}
                                    />

                                    {errors.lastname && (
                                        <p className="error-message">
                                            {errors.lastname.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* user name */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="username">User Name</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    {...register('username', {
                                        required: true,
                                    })}
                                />

                                {errors.username && (
                                    <p className="error-message">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                            {/* email */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="email@gmail.com"
                                    {...register('email', { required: true })}
                                />

                                {errors.email && (
                                    <p className="error-message">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* password */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password', {
                                        required: true,
                                    })}
                                />

                                {errors.password && (
                                    <p className="error-message">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Sign up button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                Create Account
                            </Button>

                            <div className="text-center text-sm">
                                Already have an account?{' '}
                                <a
                                    href="/signin"
                                    className="underline underline-offset-4"
                                >
                                    Sign In
                                </a>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholderSignUp.png"
                            alt="Image"
                            className="absolute top-1/2 -translate-y-1/2 object-cover"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:hover:underline-offset-4">
                By clicking continue, you agree to our{' '}
                <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
