import { useForm } from '@inertiajs/react';
import { Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ContactFormProps = {
    className?: string;
};

export function ContactForm({ className }: ContactFormProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        recentlySuccessful,
        reset,
    } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    if (recentlySuccessful) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center shadow-md dark:bg-card',
                    className,
                )}
            >
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-green/10">
                    <Check className="size-6 text-brand-green" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                    Message Sent!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Thank you for reaching out. We&apos;ll get back to you
                    within 24 hours.
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                'space-y-5 rounded-xl bg-white p-8 shadow-md dark:bg-card',
                className,
            )}
        >
            <div className="space-y-2">
                <Label htmlFor="contact-name">Full Name</Label>
                <Input
                    id="contact-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Your full name"
                    required
                />
                {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact-email">Email Address</Label>
                <Input
                    id="contact-email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="you@example.com"
                    required
                />
                {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input
                    id="contact-subject"
                    value={data.subject}
                    onChange={(e) => setData('subject', e.target.value)}
                    placeholder="How can we help?"
                    required
                />
                {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <textarea
                    id="contact-message"
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    placeholder="Tell us more..."
                    required
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                />
                {errors.message && (
                    <p className="text-xs text-destructive">{errors.message}</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={processing}
                className="w-full bg-brand-green font-bold hover:bg-brand-green-dark"
            >
                <Send className="size-4" />
                {processing ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
}
