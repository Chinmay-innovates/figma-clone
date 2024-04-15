import CursorSVG from "@/public/assets/CursorSVG";

interface CursorProps {
  color: string;
  x: number;
  y: number;
  message?: string;
}

const Cursor = ({ color, x, y, message }: CursorProps) => {
  return (
    <div
      className='pointer-events-none absolute left-0 top-0'
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
    >
      <CursorSVG color={color} />

      {/* MESSAGE */}
      {message && (
        <div
          className='absolute left-2 top-5 rounded-3xl px-4 py-2'
          style={{ backgroundColor: color, borderRadius: 20 , }}
        >
          <p className='whitespace-nowrap text-sm leading-relaxed text-white'>
            {message}
          </p>
        </div>
      )}
    </div>
  )
}

export default Cursor
