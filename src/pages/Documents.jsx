import { FolderOpen, FileText, Search, Upload, FileSignature } from 'lucide-react';

const mockFolders = [
  { id: 1, name: '01. Trial Management', items: 12 },
  { id: 2, name: '02. Central Trial Documents', items: 45 },
  { id: 3, name: '03. Regulatory', items: 8 },
  { id: 4, name: '04. IRB / IEC', items: 23 },
  { id: 5, name: '05. Site Management', items: 112 },
];

const mockFiles = [
  { id: 101, name: 'Clinical_Study_Protocol_v2.0.pdf', size: '2.4 MB', date: '2026-08-30', type: 'PDF' },
  { id: 102, name: 'Investigator_Brochure_v1.2.pdf', size: '5.1 MB', date: '2026-08-28', type: 'PDF' },
  { id: 103, name: 'Informed_Consent_Form_Template.docx', size: '850 KB', date: '2026-08-15', type: 'DOCX' },
];

const Documents = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900 tracking-tight uppercase flex items-center gap-2 drop-shadow-sm">
          <FolderOpen size={28} className="text-slate-800" /> Document Management (eTMF)
        </h2>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm shadow-emerald-500/20">
          <Upload size={16} /> Upload Document
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        <div className="w-full lg:w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">TMF Structure</h3>
          </div>
          <div className="p-2 space-y-1">
            {mockFolders.map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors">
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <FolderOpen size={18} className="text-yellow-500 group-hover:text-yellow-600" />
                  {f.name}
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">{f.items}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FolderOpen size={18} className="text-slate-400" /> 02. Central Trial Documents
            </h3>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search files..." className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-emerald-500 w-48" />
            </div>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[11px] text-slate-500 bg-white uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Document Name</th>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3">Modified Date</th>
                  <th className="px-6 py-3 text-center">Signatures</th>
                </tr>
              </thead>
              <tbody>
                {mockFiles.map(file => (
                  <tr key={file.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-3">
                      <FileText size={18} className={file.type === 'PDF' ? 'text-red-500' : 'text-blue-500'} />
                      {file.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{file.size}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{file.date}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center text-slate-400 hover:text-emerald-500"><FileSignature size={16} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Documents;
