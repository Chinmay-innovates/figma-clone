import { useOthers, useSelf } from "@/liveblocks.config";

import { generateRandomName } from "@/lib/utils";
import { Avatar } from "./Avatar";
import styles from "./index.module.css"
import { useMemo } from "react";
const ActiveUsers = () => {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > 3;
    const memorizedUsers = useMemo(() => {
        return (
            <div className="py-2 flex items-center justify-center gap-1">
                <div className="flex pl-3">
                    {currentUser && (
                        <Avatar name="You" otherStyles="border-[5px] border-primary-green" />
                    )}
                    {users.slice(0, 3).map(({ connectionId }) => {
                        return (
                            <Avatar key={connectionId} name={generateRandomName()}
                                otherStyles="-ml-3"
                            />
                            
                        );
                    })}
                    {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}
                </div>
            </div>
        )
    }, [users.length])

    return memorizedUsers;
}

export default ActiveUsers;