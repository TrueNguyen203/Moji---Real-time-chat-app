import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { UserPlus } from 'lucide-react';
import type { User } from '../../types/user';
import { useFriendStore } from '@/stores/useFriendStore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import SearchForm from '../addFriendModal/SearchForm';
import SendFriendRequestForm from '../addFriendModal/SendFriendRequestForm';
export interface IFormValues {
    username: string;
    message: string;
}

const AddFriendModal = () => {
    const [isFound, setIsFound] = useState<boolean | null>(null);
    const [searchUser, setSearchUser] = useState<User>();
    const [searchedUsername, setSearchedUsername] = useState('');
    const { loading, searchByUsername, addFriend } = useFriendStore();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<IFormValues>({
        defaultValues: {
            username: '',
            message: '',
        },
    });

    const usernameValue = watch('username');

    const handleSearch = handleSubmit(async (data) => {
        const username = data.username.trim();
        if (!username) return;

        setIsFound(null);
        setSearchedUsername(username);
        try {
            const foundUser = await searchByUsername(username);
            if (foundUser) {
                setIsFound(true);
                setSearchUser(foundUser);
                console.log('Found user:', foundUser);
                console.log(typeof foundUser);
            } else {
                setIsFound(false);
            }
        } catch (error) {
            console.error(error);
            setIsFound(false);
        }
    });

    const handleSend = handleSubmit(async (data) => {
        if (!searchUser) return;
        try {
            console.log('Sending friend request to:', searchUser._id);
            console.log(searchUser._id);
            const message = await addFriend(
                searchUser._id,
                data.message.trim(),
            );
            toast.success(message);
            handleCancel();
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    });

    const handleCancel = () => {
        reset();
        setSearchedUsername('');
        setIsFound(null);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex justify-center items-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10">
                    <UserPlus className="size-4" />
                    <span className="sr-only">Add Friend</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-none">
                <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                </DialogHeader>
                {!isFound && (
                    <>
                        <SearchForm
                            register={register}
                            errors={errors}
                            usernameValue={usernameValue}
                            loading={loading}
                            isFound={isFound}
                            seachedUsername={searchedUsername}
                            onSubmit={handleSearch}
                            onCancel={handleCancel}
                        />
                    </>
                )}

                {isFound && (
                    <>
                        <SendFriendRequestForm
                            register={register}
                            loading={loading}
                            seachedUsername={searchedUsername}
                            onSubmit={handleSend}
                            onBack={() => setIsFound(null)}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendModal;
