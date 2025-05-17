import React from 'react';
import { useDrag } from 'react-dnd';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ACTIVITY',
    item: activity,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`group relative
        bg-gradient-to-br from-zinc-900/80 to-zinc-800/70
        backdrop-blur-md
        border border-zinc-700
        rounded-2xl p-5
        shadow-xl shadow-black/30
        transition-all duration-300 ease-out
        ${isDragging ? 
          'opacity-50 scale-95 border-blue-500/50' : 
          'opacity-100 hover:border-blue-500/50 hover:shadow-blue-500/10'}
        `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-blue-500/10 group-hover:opacity-40 opacity-0 transition-opacity" />

      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-bold text-lg text-white mb-1.5">
              {activity.title}
            </h4>
            
            {activity.time && (
              <div className="flex items-center text-sm text-blue-400 mb-2">
                <span className="mr-2">⏰</span>
                <span>{activity.time}</span>
              </div>
            )}

            {activity.description && (
              <p className="text-sm text-zinc-400 leading-relaxed">
                {activity.description}
              </p>
            )}
          </div>

          <div className="flex gap-2 ml-3">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(activity); }}
              className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors"
              aria-label="Edit activity"
            >
              <FiEdit3 className="text-zinc-400 hover:text-blue-400 w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(activity.id, activity.day); }}
              className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors"
              aria-label="Delete activity"
            >
              <FiTrash2 className="text-zinc-400 hover:text-red-400 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
