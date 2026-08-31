import React from 'react';

const PageStub = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
      <div className="text-6xl text-slate-200">🛠️</div>
      <h2 className="text-2xl font-semibold text-slate-700">{title}</h2>
      <p>This module is currently under active development.</p>
    </div>
  );
};

export default PageStub;
