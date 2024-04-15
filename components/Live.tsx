import React, { MutableRefObject, useCallback, useEffect, useState } from 'react'
import LiveCursors from './Cursor/LiveCursors'
import { useBroadcastEvent, useEventListener, useMyPresence } from '@/liveblocks.config'
import CursorChat from './Cursor/CursorChat'
import { CursorMode, CursorState, Reaction, } from '@/types/type'
import ReactionSelector from './reaction/ReactionButton'
import FlyingReaction from './reaction/FlyingReaction'
import useInterval from '@/hooks/useInterval'


interface Props {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>
    undo: () => void
    redo: () => void
}
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { shortcuts } from '@/constants'



const Live = ({ canvasRef, undo, redo }: Props) => {
    const [{ cursor }, updateMyPresence] = useMyPresence()
    const [cursorState, setCursorState] = useState<CursorState>({
        mode: CursorMode.Hidden
    })
    const [reaction, setReaction] = useState<Reaction[]>([]);

    const broadcast = useBroadcastEvent()

    // Remove reactions that are not visible anymore (every 1 sec)
    useInterval(() => {
        setReaction((reactions) =>
            reactions.filter((r) => r.timestamp > Date.now() - 4000));
    }, 1000);

    useEventListener((eventData) => {
        const event = eventData.event;
        setReaction((reactions) => reactions.concat([
            {
                value: event.value,
                timestamp: Date.now(),
                point: { x: event.x, y: event.y }
            }
        ]))

    },)

    // Remove reactions that are not visible anymore (every 1 sec)
    useInterval(() => {
        if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
            setReaction((reactions) => reactions.concat([
                {
                    value: cursorState.reaction,
                    timestamp: Date.now(),
                    point: { x: cursor.x, y: cursor.y }
                }
            ]))
            broadcast({
                x: cursor.x,
                y: cursor.y,
                value: cursorState.reaction
            })
        }
    }, 100);

    // Listen to mouse events to change the cursor state
    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault();

        // if cursor is not in reaction selector mode, update the cursor position
        if (cursorState == null || cursorState.mode !== CursorMode.ReactionSelector) {
            // get the cursor position in the canvas
            const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
            const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

            // broadcast the cursor position to other users
            updateMyPresence({
                cursor: { x, y },
            });
        }

    }, []);

    const handlePointerLeave = useCallback((event: React.PointerEvent) => {

        setCursorState({ mode: CursorMode.Hidden }); //


        // broadcast the cursor position to other users
        updateMyPresence({
            cursor: null,
            message: null
        });

    }, []);

    const handlePointerDown = useCallback((event: React.PointerEvent) => {


        // get the cursor position in the canvas
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        // broadcast the cursor position to other users
        updateMyPresence({
            cursor: { x, y },
        });
        // if cursor is in reaction mode, set isPressed to true
        setCursorState((state: CursorState) =>
            cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
        )
    }, [cursorState.mode, setCursorState])

    const handlePointerUp = useCallback((event: React.PointerEvent) => {
        setCursorState((state: CursorState) =>
            cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
        )
    }, [cursorState.mode, setCursorState])

    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.key === "/") {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: '',
                })
            } else if (e.key === "Escape") {
                updateMyPresence({ message: '' })
                setCursorState({
                    mode: CursorMode.Hidden,
                })
            }
            else if (e.key === 'e') {
                setCursorState({
                    mode: CursorMode.ReactionSelector,
                })
            }
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/") {
                e.preventDefault()
            }
        }
        return () => {
            window.addEventListener('keyup', onKeyUp);
            window.addEventListener('keydown', onKeyDown);
        }

    }, [updateMyPresence]);

    const setReactions = useCallback((reaction: string) => {
        setCursorState({
            mode: CursorMode.Reaction,
            reaction,
            isPressed: false
        })
    }, [])


    // trigger respective actions when the user clicks on the right menu
    const handleContextMenuClick = useCallback((key: string) => {
        switch (key) {
            case "Chat":
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: "",
                });
                break;

            case "Reactions":
                setCursorState({ mode: CursorMode.ReactionSelector });
                break;

            case "Undo":
                undo();
                break;

            case "Redo":
                redo();
                break;
            case "rectangle":
                redo();
                break;

            default:
                break;
        }
    }, []);

    return (
        <ContextMenu>
            <ContextMenuTrigger
                id='canvas'
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                className="h-[100vh] w-full flex justify-center items-center text-center"
            >
                <canvas
                    ref={canvasRef}
                />


                {reaction.map((r) => (
                    <FlyingReaction
                        key={r.timestamp.toString()}
                        x={r.point.x}
                        y={r.point.y}
                        timestamp={r.timestamp}
                        value={r.value}
                    />
                ))}
                {cursor && (
                    <CursorChat
                        cursor={cursor}
                        cursorState={cursorState}
                        setCursorState={setCursorState}
                        updateMyPresence={updateMyPresence}
                    />
                )}
                {cursorState.mode === CursorMode.ReactionSelector && (
                    <ReactionSelector
                        setReaction={setReactions}
                    />
                )}
                <LiveCursors />

                {/* <Comments />  */}

            </ContextMenuTrigger>
            <ContextMenuContent className="right-menu-content">
                {shortcuts.map((item) => (
                    <ContextMenuItem
                        key={item.key}
                        className="right-menu-item"
                        onClick={() => handleContextMenuClick(item.name)}
                    >
                        <p>{item.name}</p>
                        <p className="text-xs text-primary-grey-300">{item.shortcut}</p>
                    </ContextMenuItem>
                ))}
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default Live
