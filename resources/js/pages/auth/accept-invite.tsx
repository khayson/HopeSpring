import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    name: string;
    email: string;
    acceptUrl: string;
};

export default function AcceptInvite({ name, email, acceptUrl }: Props) {
    return (
        <>
            <Head title="Set up your account" />

            <p className="mb-6 text-sm text-muted-foreground">
                Welcome, {name}. Set a password for{' '}
                <span className="font-medium">{email}</span> to activate your
                account.
            </p>

            <Form
                action={acceptUrl}
                method="post"
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="new-password"
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                tabIndex={2}
                                autoComplete="new-password"
                                placeholder="Confirm password"
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            tabIndex={3}
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Activate account
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

AcceptInvite.layout = {
    title: 'Activate your account',
    description: 'Set a password to finish setting up your account',
};
