import ReactAvatar from 'react-avatar';
import { AvatarProps } from '@/types/avatar';

export default function Avatar({ name, imageUrl, size = 40 }: AvatarProps) {
    return (
        <ReactAvatar
            name={name}
            src={imageUrl ?? undefined}
            size={size.toString()}
            round
            className="cursor-pointer"
        />
    );
}
