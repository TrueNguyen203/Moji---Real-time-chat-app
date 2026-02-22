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

const signInSchema = z.object({
    username: z.string().min(3, 'Username need to have atleast 3 characters'),
    password: z.string().min(6, 'Password need to have atleast 6 characters'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const { signIn } = useAuthStore();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormValues) => {
        const { username, password } = data;

        //Call backend sign in api
        await signIn(username, password);
        navigate('/');
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
                                    Welcome back to Moji!
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Please sign in to start
                                </p>
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

                            {/* Sign in button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                Sign in
                            </Button>

                            <div className="text-center text-sm">
                                Don't have an account?{' '}
                                <a
                                    href="/signup"
                                    className="underline underline-offset-4"
                                >
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.png"
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
