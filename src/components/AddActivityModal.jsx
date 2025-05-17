import React, { useState, useEffect } from 'react';

const AddActivityModal = ({ isOpen, onClose, onSave, initialData, day }) => {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setTime(initialData.time || '');
            setDescription(initialData.description || '');
        } else {
            setTitle('');
            setTime('');
            setDescription('');
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() === '') return alert('Title is required');
        onSave({
            id: initialData?.id || Date.now().toString(),
            title: title.trim(),
            time: time.trim(),
            description: description.trim(),
            day,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
            <form
                onSubmit={handleSubmit}
                className="
          w-11/12 max-w-md
          bg-gradient-to-br from-zinc-900/90 to-zinc-800/80
          border border-zinc-700
          rounded-2xl
          shadow-2xl
          p-8
          animate-fade-in
        "
            >
                <h2 className="text-2xl font-bold mb-6 text-white text-center drop-shadow">
                    {initialData ? 'Edit Activity' : `Add Activity for Day ${day}`}
                </h2>
                <label className="block mb-4">
                    <span className="text-zinc-200 font-medium">Title <span className="text-red-400">*</span></span>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="
              mt-2 block w-full rounded-lg
              border border-zinc-700
              bg-zinc-800 text-white
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              placeholder-zinc-400
              transition
              px-4 py-2
            "
                        required
                        autoFocus
                        placeholder="Enter activity title"
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-zinc-200 font-medium">Time</span>
                    <input
                        type="text"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        placeholder="e.g. 9:00 AM - 11:00 AM"
                        className="
              mt-2 block w-full rounded-lg
              border border-zinc-700
              bg-zinc-800 text-white
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              placeholder-zinc-400
              transition
              px-4 py-2
            "
                    />
                </label>
                <label className="block mb-6">
                    <span className="text-zinc-200 font-medium">Description</span>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows="3"
                        placeholder="Add more details..."
                        className="
              mt-2 block w-full rounded-lg
              border border-zinc-700
              bg-zinc-800 text-white
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              placeholder-zinc-400
              transition
              px-4 py-2
              resize-none
            "
                    />
                </label>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="
              px-5 py-2 rounded-lg
              bg-zinc-700 text-zinc-200
              hover:bg-zinc-600 hover:text-white
              transition font-medium
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="
              px-5 py-2 rounded-lg
              bg-blue-600 text-white
              hover:bg-blue-700
              transition font-semibold
              focus:outline-none focus:ring-2 focus:ring-blue-500
              shadow
            "
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddActivityModal;
