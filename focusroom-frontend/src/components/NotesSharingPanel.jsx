import React, { useState } from 'react';
import { BASE_URL } from '../services/apiService';

const NotesSharingPanel = ({ notes, onUpload }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        try {
            await onUpload(file);
            setFile(null);
            e.target.reset();
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };


    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return '📄';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
        return '📝';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-black">Shared Files</h3>
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">{notes.length} Files</span>
                </div>
                
                <form onSubmit={handleUpload} className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-red-500 rounded-lg cursor-pointer transition-all hover:bg-gray-50 group shadow-sm">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        <span className="text-xs font-medium text-gray-600 truncate max-w-[120px]">
                            {file ? file.name : 'Select File'}
                        </span>
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm ${
                            file && !uploading ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            onClick={() => window.open(`${BASE_URL}${note.fileUrl}`, '_blank')}
                            className="card-notion group bg-white border border-gray-200 flex flex-col h-full rounded-xl shadow-sm hover:shadow-md hover:border-red-500 cursor-pointer transition-all p-4"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                    <span className="text-xl">{getFileIcon(note.fileName)}</span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </div>
                            </div>
                            
                            <div className="mt-auto space-y-1">
                                <h4 className="text-sm font-semibold text-black truncate" title={note.fileName}>{note.fileName}</h4>
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-medium text-gray-500">
                                        By <span className="text-red-500">{note.userName}</span>
                                    </p>
                                    <p className="text-[10px] font-medium text-gray-400">
                                        {new Date(note.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-16 card-notion bg-gray-50 border border-gray-200 border-dashed rounded-xl flex flex-col items-center justify-center">
                        <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p className="text-sm font-semibold text-gray-500">No shared files yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesSharingPanel;
