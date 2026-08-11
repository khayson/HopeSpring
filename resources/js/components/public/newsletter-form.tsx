import { useForm } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NewsletterForm() {
    const { data, setData, post, processing, recentlySuccessful, errors, reset } = useForm({
        email: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/newsletter/subscribe', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    if (recentlySuccessful) {
        return (
            <div className="flex items-center gap-2 text-sm text-brand-green-light">
                <Check className="size-4" />
                <span>Thank you for subscribing!</span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Your email"
                    required
                    aria-label="Email address for newsletter"
                    className="h-10 flex-1 rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/40 focus:border-brand-green-light focus:outline-none focus:ring-1 focus:ring-brand-green-light"
                />
                <Button
                    type="submit"
                    disabled={processing}
                    size="icon"
                    aria-label="Subscribe to newsletter"
                    className="size-10 shrink-0 bg-brand-green hover:bg-brand-green-dark"
                >
                    <ArrowRight className="size-4" />
                </Button>
            </div>
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </form>
    );
}
