import type { UseFormRegister } from 'react-hook-form';
import type { IFormValues } from '../chat/AddFriendModal';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';

interface SendFriendRequestFormProps {
    register: UseFormRegister<IFormValues>;
    loading: boolean;
    seachedUsername: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}

const SendFriendRequestForm = ({
    register,
    loading,
    seachedUsername,
    onSubmit,
    onBack,
}: SendFriendRequestFormProps) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-4">
                <span className="success-message">
                    Found{' '}
                    <span className="font-semibold">@{seachedUsername}</span>
                </span>

                <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">
                        Introduction
                    </Label>
                    <Textarea
                        id="message"
                        rows={3}
                        placeholder="Can we be friends?"
                        className="glass border-border/50 focus:border-primary/50 transition-smooth resize-none"
                        {...register('message')}
                    />
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 glass hover:text-destructive"
                        onClick={onBack}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
                        disabled={loading}
                    >
                        {loading ? (
                            <span>Sending...</span>
                        ) : (
                            <>
                                <UserPlus className="size-4 mr-2" /> 'Send
                                Friend Request'
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </div>
        </form>
    );
};

export default SendFriendRequestForm;
