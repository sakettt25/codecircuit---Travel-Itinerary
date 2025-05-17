import React, { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';
import DayCard from './DayCard';
import AddActivityModal from './AddActivityModal';
import dayTemplates from './dayTemplates';

const ItineraryBoard = () => {
    const [daysCount, setDaysCount] = useState(5);
    const [activities, setActivities] = useState(() => {
        const init = {};
        for (let i = 1; i <= 5; i++) init[i] = [];
        return init;
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [modalDay, setModalDay] = useState(null);
    const [editingActivity, setEditingActivity] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [templateDay, setTemplateDay] = useState('');

    const addNewDay = () => {
        setDaysCount((prev) => prev + 1);
        setActivities((prev) => ({
            ...prev,
            [daysCount + 1]: [],
        }));
    };

    const deleteDay = (day) => {
        if (day !== daysCount || day === 1) return;
        setDaysCount(prev => prev - 1);
        setActivities(prev => {
            const updated = { ...prev };
            delete updated[day];
            return updated;
        });
        if (templateDay === day) setTemplateDay('');
    };

    useEffect(() => {
        setActivities((prev) => {
            const updated = { ...prev };
            for (let i = 1; i <= daysCount; i++) {
                if (!updated[i]) updated[i] = [];
            }
            return updated;
        });
    }, [daysCount]);

    const openAddModal = (day) => {
        setModalDay(day);
        setEditingActivity(null);
        setModalOpen(true);
    };

    const openEditModal = (activity, day) => {
        setModalDay(day);
        setEditingActivity(activity);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingActivity(null);
        setModalDay(null);
    };

    const saveActivity = (activityData) => {
        setActivities((prev) => {
            const updated = { ...prev };
            const updatedDay = activityData.day;
            if (editingActivity) {
                updated[updatedDay] = updated[updatedDay].map((act) =>
                    act.id === editingActivity.id ? activityData : act
                );
            } else {
                updated[updatedDay] = [
                    ...updated[updatedDay],
                    { ...activityData, id: Date.now().toString() },
                ];
            }
            return updated;
        });
        closeModal();
    };

    const deleteActivity = (activityId, day) => {
        setActivities((prev) => {
            const updated = { ...prev };
            updated[day] = updated[day].filter((act) => act.id !== activityId);
            return updated;
        });
    };

    const moveActivity = (activity, fromDay, toDay) => {
        if (fromDay === toDay) return;
        setActivities((prev) => {
            const updated = { ...prev };
            updated[fromDay] = updated[fromDay].filter((act) => act.id !== activity.id);
            updated[toDay] = [...updated[toDay], { ...activity, day: toDay }];
            return updated;
        });
    };

    const applyTemplateToDay = () => {
        if (!selectedTemplate || !templateDay) return;
        const templateActivities = dayTemplates[selectedTemplate].map((act) => ({
            ...act,
            id: `${act.id}-${Date.now()}`,
            day: templateDay,
        }));
        setActivities((prev) => ({
            ...prev,
            [templateDay]: [...prev[templateDay], ...templateActivities],
        }));
        setSelectedTemplate('');
        setTemplateDay('');
    };

    const btnRef = useRef(null);
    const spanRef = useRef(null);

    useEffect(() => {
        if (!btnRef.current || !spanRef.current) return;
        if (!selectedTemplate || !templateDay) return;

        const handleMouseMove = (e) => {
            const { width, left } = btnRef.current.getBoundingClientRect();
            const offset = e.clientX - left;
            const leftPos = `${(offset / width) * 100}%`;
            spanRef.current.animate({ left: leftPos }, { duration: 250, fill: 'forwards' });
        };

        const handleMouseLeave = () => {
            spanRef.current.animate({ left: '50%' }, { duration: 100, fill: 'forwards' });
        };

        const btn = btnRef.current;
        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            btn.removeEventListener('mousemove', handleMouseMove);
            btn.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [selectedTemplate, templateDay]);

    const AddDayCard = () => (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 0 2px #2563eb' }}
            whileTap={{ scale: 0.97 }}
            onClick={addNewDay}
            className={`
        flex flex-col items-center justify-center
        h-full min-h-[320px]
        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
        border-2 border-dashed border-gray-700
        rounded-2xl shadow-md cursor-pointer
        transition-all duration-200
        text-gray-400 hover:text-blue-400
        focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
            style={{ minHeight: 320 }}
        >
            <span className="text-5xl mb-2">＋</span>
            <span className="text-lg font-semibold">Add Day</span>
        </motion.button>
    );

    const DayCardWithDelete = (props) => {
        const { day } = props;
        const isLastDay = day === daysCount && day !== 1;
        return (
            <div className="relative group">
                <div
                    className={`
            transition-all duration-200
            hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20
            border-2 border-transparent rounded-2xl
          `}
                >
                    <DayCard {...props} />
                </div>
                {isLastDay && (
                    <button
                        title="Delete this day"
                        onClick={() => deleteDay(day)}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-gray-900/80 text-red-400 hover:bg-red-900 hover:text-white shadow transition-all opacity-70 group-hover:opacity-100"
                    >
                        <FiTrash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="max-w-xl mx-auto mt-10 mb-6 rounded-xl border border-gray-800 shadow-lg p-5 bg-black"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 justify-between">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-300 mb-1">
                            Select Day
                        </label>
                        <select
                            value={templateDay}
                            onChange={(e) => setTemplateDay(Number(e.target.value))}
                            className="w-32 px-2 py-1.5 rounded border border-gray-700 bg-gray-900 text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">--Select Day--</option>
                            {Array.from({ length: daysCount }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    Day {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-300 mb-1">
                            Choose Template
                        </label>
                        <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="w-40 px-2 py-1.5 rounded border border-gray-700 bg-gray-900 text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">--Select Template--</option>
                            {Object.keys(dayTemplates).map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.985 }}
                        ref={btnRef}
                        disabled={!selectedTemplate || !templateDay}
                        onClick={applyTemplateToDay}
                        className="relative overflow-hidden rounded-lg px-4 py-1.5 text-sm font-medium bg-gray-900 text-white shadow transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-0"
                    >
                        <span className="relative z-10 mix-blend-difference">
                            Apply Template
                        </span>
                        <span
                            ref={spanRef}
                            className="pointer-events-none absolute left-[50%] top-[50%] h-20 w-20 -translate-x-[50%] -translate-y-[50%] rounded-full bg-white/10"
                        />
                    </motion.button>
                </div>
            </motion.div>

            <main className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[70vh] bg-transparent">
                <AnimatePresence>
                    {Array.from({ length: daysCount }, (_, i) => (
                        <motion.div
                            key={i + 1}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            layout
                        >
                            <DayCardWithDelete
                                day={i + 1}
                                activities={activities[i + 1] || []}
                                onAddActivity={openAddModal}
                                onEditActivity={openEditModal}
                                onDeleteActivity={deleteActivity}
                                onMoveActivity={moveActivity}
                                daysCount={daysCount}
                            />
                        </motion.div>
                    ))}
                    <AddDayCard key="add-day-card" />
                </AnimatePresence>

                <AddActivityModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSave={saveActivity}
                    initialData={editingActivity}
                    day={modalDay}
                />
            </main>
        </DndProvider>
    );
};

export default ItineraryBoard;
