import React, { useRef, useState } from "react";
import ActivityCard from "./ActivityCard";
import { useDrop } from "react-dnd";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { FiPlus } from "react-icons/fi";

// --- AddActivityButton with Scramble Effect ---
const CHARS = "!@#$%^&*():{};|,.<>/?";
const TARGET_TEXT = "Add Activity";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

const AddActivityButton = ({ onClick }) => {
  const intervalRef = useRef(null);
  const [text, setText] = useState(TARGET_TEXT);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, idx) =>
          pos / CYCLES_PER_LETTER > idx
            ? char
            : CHARS[Math.floor(Math.random() * CHARS.length)]
        )
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) stopScramble();
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(TARGET_TEXT);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      onClick={onClick}
      className="group relative mt-auto overflow-hidden rounded-md border border-blue-400 bg-zinc-800 px-4 py-2 font-mono font-medium uppercase text-blue-300 w-full transition-colors hover:text-blue-400"
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        <FiPlus className="text-lg" />
        <span>{text}</span>
      </div>
      {/* Subtle animated shimmer */}
      <motion.span
        initial={{ y: "100%" }}
        animate={{ y: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1,
          ease: "linear",
        }}
        className="absolute inset-0 z-0 scale-125 bg-gradient-to-t from-blue-400/0 from-40% via-blue-500/30 to-blue-400/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
      />
    </motion.button>
  );
};

// --- DayCard (Draggable Drop Target) ---
const DayCard = ({
  day,
  activities,
  onEditActivity,
  onDeleteActivity,
  onAddActivity,
  onMoveActivity,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "ACTIVITY",
      drop: (item) => {
        if (item.day !== day) onMoveActivity(item, item.day, day);
      },
      canDrop: (item) => item.day !== day,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [day, onMoveActivity]
  );

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`bg-zinc-900 rounded-2xl p-6 shadow-md border flex flex-col h-full
        ${isActive ? "border-blue-400 bg-blue-950" : "border-zinc-700"}`}
      style={{ minHeight: 400 }}
    >
      <h3 className="text-2xl font-semibold mb-4 text-blue-400 text-center">
        Day {day}
      </h3>
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 scrollbar-thin scrollbar-thumb-blue-400 dark:scrollbar-thumb-blue-600">
        {activities.length === 0 ? (
          <p className="text-zinc-400 text-center">No activities added yet.</p>
        ) : (
          activities.map((act) => (
            <ActivityCard
              key={act.id}
              activity={act}
              onEdit={onEditActivity}
              onDelete={onDeleteActivity}
            />
          ))
        )}
      </div>
      <AddActivityButton onClick={() => onAddActivity(day)} />
    </div>
  );
};

// --- TiltDayCard with Circular Glow Only ---
const ROTATION_RANGE = 32.5;

const TiltDayCard = (props) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 120, damping: 14 });
  const ySpring = useSpring(y, { stiffness: 120, damping: 14 });
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const [isHover, setIsHover] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rX = ((mouseY / height) - 0.5) * -ROTATION_RANGE;
    const rY = ((mouseX / width) - 0.5) * ROTATION_RANGE;
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHover(false);
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  return (
    <div >
      <div className="relative">
        {/* Circular glow only (no rectangle) */}
        <motion.div
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{
            opacity: isHover ? 0.85 : 0.4,
            scale: isHover ? 1.13 : 1,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0"
          style={{
            width: "320px",
            height: "320px",
            transform: "translate(-50%, -50%)",
            filter: "blur(48px)",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.65) 0%, rgba(37,99,235,0.38) 60%, transparent 100%)",
            borderRadius: "50%",
            opacity: isHover ? 0.85 : 0.4,
          }}
        />
        {/* Card with tilt and shadow */}
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{
            transformStyle: "preserve-3d",
            transform,
            filter: isHover
              ? "drop-shadow(0 0 12px rgba(59, 130, 246, 0.7)) blur(0.2px)"
              : "drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))",
            transition: "filter 0.3s ease",
            position: "relative",
            zIndex: 1,
          }}
          className="rounded-2xl cursor-pointer"
        >
          <DayCard {...props} />
        </motion.div>
      </div>
    </div>
  );
};

export default TiltDayCard;
