import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PhoneCall, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/config';

const bookCallSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z
    .string()
    .min(6, { message: 'Phone number must be at least 6 characters' })
    .regex(/^[+\-\d\s]+$/, { message: 'Invalid phone number' }),
  preferredTime: z.string().nonempty({ message: 'Preferred time is required' }),
});

interface BookCallFormProps {
  chatId: string;
}

export function BookCallForm({ chatId }: BookCallFormProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const result = bookCallSchema.safeParse({ email, phone, preferredTime });
    if (!result.success) {
      const fieldErrors: typeof errors = {};

      result.error.issues.forEach((err) => {
        if (err.path[0])
          fieldErrors[err.path[0] as keyof typeof errors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('followups').insert({
        chat_id: chatId,
        student_email: email,
        student_phone: phone,
        preferred_time: new Date(preferredTime).toISOString(),
      });

      if (error) {
        console.error('Supabase insert error:', error);
        return;
      }

      // Success: show submitted state
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) setSubmitted(false);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <PhoneCall className="p-0.5" />
          Book a call
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Book a Call</DialogTitle>
          <DialogDescription>
            {submitted
              ? 'Thank you! Your request has been submitted successfully.'
              : 'Fill in your details and pick a preferred time for our admissions team to call you.'}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 mt-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-center text-gray-700">
              Our team will reach out to you shortly at <b>{email}</b> or{' '}
              <b>{phone}</b>. You can close this modal or book another time if
              needed.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setEmail('');
                setPhone('');
                setPreferredTime('');
              }}
            >
              Book Another Call
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}

            <Input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.phone && (
              <span className="text-red-500 text-xs">{errors.phone}</span>
            )}

            <Input
              type="datetime-local"
              placeholder="Preferred Time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className={errors.preferredTime ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.preferredTime && (
              <span className="text-red-500 text-xs">
                {errors.preferredTime}
              </span>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
