import Image from "next/image";
import styles from "./Avatar.module.css"

interface Props {
    name: string;
    otherStyles: string;
};
export function Avatar({ name, otherStyles }: Props) {
    return (
        <div className={`${styles.avatar} ${otherStyles} h-9 w-9`} data-tooltip={name}>
            <Image
                src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.avatar_picture}
                alt={name}
            />
        </div>
    )
}
