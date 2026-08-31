import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  PlayCircle, 
  FileText, 
  Activity, 
  Users, 
  Settings, 
  LayoutDashboard,
  CheckCircle,
  Stethoscope,
  Lock,
  Database,
  Cloud,
  Link as LinkIcon,
  Search,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-white text-slate-900">
      {/* 1. Navbar */}
      <header className="bg-[#020817] text-white border-b border-slate-800 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Tracera Logo" className="w-8 h-8 rounded-md object-cover" />
            <span className="font-bold text-xl tracking-tight">Tracera</span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#platform" className="hover:text-emerald-400 transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-emerald-400 transition-colors">Solutions</a>
            <a href="#modules" className="hover:text-emerald-400 transition-colors">Modules</a>
            <a href="#resources" className="hover:text-emerald-400 transition-colors">Resources</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium hover:text-emerald-400 transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20"
            >
              Request Demo
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-[#020817] pt-32 pb-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block bg-slate-800/50 border border-slate-700 px-3 py-1 rounded-full text-xs font-medium text-slate-300">
                Built for AIIA. Designed for India. Ready for the Future.
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Intelligent Clinical Trial Management & <span className="text-emerald-400">Pharmacovigilance Platform</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl">
                Tracera unifies study management, real-time analytics, safety monitoring, compliance, and data interoperability in one secure, AI-enabled platform.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-slate-300"><CheckCircle className="text-emerald-500" size={18}/> Real-time Dashboards</div>
                <div className="flex items-center gap-2 text-slate-300"><CheckCircle className="text-emerald-500" size={18}/> Compliance by Design</div>
                <div className="flex items-center gap-2 text-slate-300"><CheckCircle className="text-emerald-500" size={18}/> AI-driven Insights</div>
                <div className="flex items-center gap-2 text-slate-300"><CheckCircle className="text-emerald-500" size={18}/> End-to-End Audit Trail</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => navigate('/dashboard')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition-all">
                  Explore Platform <ArrowRight size={18} />
                </button>
                <button className="border border-slate-600 hover:bg-slate-800 text-white px-8 py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition-all">
                  <PlayCircle size={18} /> Watch Overview
                </button>
              </div>
            </div>

            {/* Right Dashboard Mockup */}
            <div className="relative rounded-xl border border-slate-800 bg-[#0a192f] p-4 shadow-2xl shadow-emerald-900/10 transform rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
               {/* Simplified Mockup UI */}
               <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/logo.jpg" alt="Tracera Logo" className="w-5 h-5 rounded object-cover" />
                    <span className="font-bold text-sm">Tracera</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-4 mb-4">
                 <div className="bg-[#020817] p-3 rounded border border-slate-800">
                    <div className="text-xs text-slate-500">Total Studies</div>
                    <div className="text-2xl font-bold">58</div>
                 </div>
                 <div className="bg-[#020817] p-3 rounded border border-slate-800">
                    <div className="text-xs text-slate-500">Active Studies</div>
                    <div className="text-2xl font-bold text-blue-400">36</div>
                 </div>
                 <div className="bg-[#020817] p-3 rounded border border-red-900/30">
                    <div className="text-xs text-slate-500">At Risk</div>
                    <div className="text-2xl font-bold text-red-400">5</div>
                 </div>
               </div>
               <div className="h-40 bg-[#020817] rounded border border-slate-800 relative overflow-hidden flex items-end p-4 gap-2">
                  <div className="w-1/6 bg-blue-500 h-[40%] rounded-t"></div>
                  <div className="w-1/6 bg-blue-500 h-[60%] rounded-t"></div>
                  <div className="w-1/6 bg-emerald-500 h-[90%] rounded-t"></div>
                  <div className="w-1/6 bg-blue-500 h-[50%] rounded-t"></div>
                  <div className="w-1/6 bg-blue-500 h-[70%] rounded-t"></div>
                  <div className="w-1/6 bg-emerald-500 h-[100%] rounded-t"></div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <div className="bg-[#071324] border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <p className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Trusted by Researchers. Built on Global Best Practices.</p>
           <div className="flex flex-wrap justify-center gap-12 text-slate-300 text-sm font-medium">
              <div className="flex items-center gap-2"><Stethoscope size={20} className="text-slate-500" /> Designed for AIIA & Ayurveda Research</div>
              <div className="flex items-center gap-2"><FileText size={20} className="text-slate-500" /> GCP & Regulatory Compliant</div>
              <div className="flex items-center gap-2"><Cloud size={20} className="text-slate-500" /> Secure, Cloud Native & Scalable</div>
              <div className="flex items-center gap-2"><Database size={20} className="text-slate-500" /> Data Resident (India)</div>
           </div>
        </div>
      </div>

      {/* 3. Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">One Platform. Every Trial. <span className="text-emerald-600">Complete Visibility.</span></h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-16">End-to-end clinical trial management system tailored for precision and compliance.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[
              { icon: <LayoutDashboard size={32}/>, color: "text-blue-600", title: "Study Management", desc: "Protocol to close-out, milestones, sites, teams, and documents." },
              { icon: <Users size={32}/>, color: "text-indigo-600", title: "Clinical Operations", desc: "Participant lifecycle, visits, randomization, and monitoring." },
              { icon: <Shield size={32}/>, color: "text-red-500", title: "Pharmacovigilance", desc: "AE/SAE capture, coding, signal detection, and safety oversight." },
              { icon: <CheckCircle size={32}/>, color: "text-emerald-600", title: "Compliance & Quality", desc: "Ethics, CTRI, consent, data quality, and audit-ready compliance." },
              { icon: <Activity size={32}/>, color: "text-orange-500", title: "Analytics & KPIs", desc: "Real-time KPIs, predictive insights, and portfolio intelligence." },
              { icon: <LinkIcon size={32}/>, color: "text-teal-600", title: "Interoperability", desc: "FHIR R4, EDC, HIS integration and CDISC standards support." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow text-center flex flex-col items-center">
                <div className={`mb-4 ${feature.color}`}>{feature.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-600 mb-4">{feature.desc}</p>
                <a href="#" className="mt-auto text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">Learn more <ArrowRight size={12}/></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Lifecycle Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Clinical Trial Lifecycle</h2>
          <p className="text-slate-600 mb-16">From Protocol to Close-out — digitally connected at every step.</p>

          <div className="relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block"></div>
             <div className="grid grid-cols-2 md:grid-cols-7 gap-8 relative z-10">
                {[
                  { icon: <FileText size={24}/>, title: "Protocol Development" },
                  { icon: <Shield size={24}/>, title: "Ethics Submission" },
                  { icon: <LinkIcon size={24}/>, title: "CTRI Registration" },
                  { icon: <Settings size={24}/>, title: "Site Activation" },
                  { icon: <Users size={24}/>, title: "Screening & Enrollment" },
                  { icon: <Activity size={24}/>, title: "Visits & Assessments" },
                  { icon: <CheckCircle size={24}/>, title: "Close-out & Reporting" },
                ].map((step, i) => (
                   <div key={i} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm bg-white relative">
                        {step.icon}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 leading-tight max-w-[100px]">{step.title}</h4>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 5. Interoperability & Security */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Interoperable. Standardized. Future-Ready.</h2>
            <p className="text-slate-600">Built to communicate securely across the healthcare ecosystem.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 lg:p-12">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-3 border border-slate-200 p-4 rounded-xl shadow-sm w-full md:w-auto justify-center">
                 <img src="/logo.jpg" alt="Tracera Logo" className="w-8 h-8 rounded-md object-cover" />
                 <span className="font-bold text-lg">Tracera CTMS</span>
               </div>
               
               <div className="hidden md:flex flex-1 items-center justify-center relative">
                 <div className="h-px bg-slate-300 w-full absolute"></div>
                 <div className="bg-white px-2 text-xs font-semibold text-slate-500 relative z-10 border border-slate-200 rounded-full py-1">FHIR R4</div>
               </div>

               <div className="flex items-center gap-3 border border-slate-200 p-4 rounded-xl shadow-sm w-full md:w-auto justify-center bg-slate-50">
                 <Database className="text-blue-600" size={32}/>
                 <span className="font-bold text-lg">EDC / HIS Systems</span>
               </div>

               <div className="hidden md:flex flex-1 items-center justify-center relative">
                 <div className="h-px bg-slate-300 w-full absolute"></div>
                 <ArrowRight className="text-slate-400 relative z-10 bg-white" size={20}/>
               </div>

               <div className="flex items-center gap-3 border border-slate-200 p-4 rounded-xl shadow-sm w-full md:w-auto justify-center">
                 <Cloud className="text-indigo-600" size={32}/>
                 <span className="font-bold text-lg">ABDM (India Stack)</span>
               </div>
             </div>
             
             <div className="mt-12 text-center">
                <div className="inline-block bg-slate-100 rounded-lg p-1 border border-slate-200">
                   <div className="text-xs font-semibold text-slate-500 mb-2 uppercase">CDISC Standards</div>
                   <div className="flex gap-2">
                     <span className="bg-white px-4 py-1.5 rounded border border-slate-200 text-sm font-medium">CDASH</span>
                     <span className="bg-white px-4 py-1.5 rounded border border-slate-200 text-sm font-medium">SDTM</span>
                     <span className="bg-white px-4 py-1.5 rounded border border-slate-200 text-sm font-medium">ADaM</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-24 bg-white text-center px-6">
        <div className="max-w-4xl mx-auto bg-[#020817] rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 to-transparent"></div>
           <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Clinical Research?</h2>
              <p className="text-slate-300 mb-8 text-lg">Join AIIA in building a smarter, safer, and more efficient research ecosystem.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button onClick={() => navigate('/dashboard')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-md font-semibold transition-colors">
                   Request a Demo
                 </button>
                 <button className="border border-slate-600 hover:bg-slate-800 text-white px-8 py-3 rounded-md font-semibold transition-colors">
                   Contact Us
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-[#020817] pt-16 pb-8 border-t border-slate-800 text-slate-400">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
               <div className="col-span-2 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4 text-white">
                    <img src="/logo.jpg" alt="Tracera Logo" className="w-8 h-8 rounded-md object-cover" />
                    <span className="font-bold text-lg">Tracera</span>
                  </div>
                  <p className="text-sm text-slate-500 max-w-sm mb-6">
                    Empowering Ayurveda clinical research with real-time intelligence, safety, and compliance.
                  </p>
               </div>
               
               <div>
                  <h4 className="text-white font-semibold mb-4">Platform</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-emerald-400">Overview</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Features</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Modules</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Pricing</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="text-white font-semibold mb-4">Solutions</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-emerald-400">For Investigators</a></li>
                    <li><a href="#" className="hover:text-emerald-400">For Study Teams</a></li>
                    <li><a href="#" className="hover:text-emerald-400">For Pharmacovigilance</a></li>
                    <li><a href="#" className="hover:text-emerald-400">For Regulators</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="text-white font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-emerald-400">About Us</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Careers</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Contact</a></li>
                    <li><a href="#" className="hover:text-emerald-400">Privacy Policy</a></li>
                  </ul>
               </div>
            </div>

            <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
               <p>© 2026 AIIA — All India Institute of Ayurveda. All Rights Reserved.</p>
               <p>Made with ❤️ in India</p>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
