import React from 'react';

const GroupLeaderboard = ({ leaderboard, compact = false }) => {
    return (
        <div className="flex flex-col space-y-2">
            {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                    <div
                        key={entry.userId}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
                            index === 0 ? 'bg-red-50 border-red-100 hover:border-red-200' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            index === 0 ? 'bg-red-500 text-white' :
                            index === 1 ? 'bg-gray-200 text-black' :
                            index === 2 ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-black truncate leading-tight">
                                {entry.userName}
                            </p>
                            {!compact && (
                                <p className="text-xs font-medium text-gray-500 mt-0.5">
                                    {entry.totalFocusTime}m focused
                                </p>
                            )}
                        </div>
                        {index === 0 && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full uppercase tracking-wider">
                                #1
                            </span>
                        )}
                        {compact && (
                            <span className="text-xs font-semibold text-gray-700">
                                {entry.totalFocusTime}m
                            </span>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-8">
                    <p className="text-xs text-gray-400 italic">No rankings available</p>
                </div>
            )}
        </div>
    );
};

export default GroupLeaderboard;
