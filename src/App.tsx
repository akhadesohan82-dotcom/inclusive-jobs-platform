import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  User, 
  MessageSquare, 
  Search, 
  Filter, 
  Accessibility, 
  Menu, 
  X,
  ChevronRight,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  Sparkles,
  Send,
  Bookmark,
  FileText,
  BookOpen,
  ExternalLink,
  Sun,
  Moon,
  Eye,
  Bell,
  LayoutDashboard,
  Users,
  History,
  Info
} from 'lucide-react';
import { cn } from './lib/utils';
import { Job, UserProfile, DisabilityType, AccommodationType, Message, Application, Resource } from './types';
import { MOCK_JOBS, MOCK_RESOURCES } from './constants';
import { getJobRecommendations } from './services/geminiService';
import packageJson from '../package.json';

const APP_VERSION = packageJson.version;

const VERSION_HISTORY = [
  { version: '1.7.0', date: '2026-03-05', changes: ['AI Resume Optimizer', 'Real-time Chat (WebSockets)', 'Enhanced Backend API', 'Live Messaging System'] },
  { version: '1.6.0', date: '2026-03-05', changes: ['Accessibility Audit Tool', 'Employer Compliance Reports', 'Improved UI Performance', 'Bug Fixes'] },
  { version: '1.5.0', date: '2026-03-05', changes: ['Full-stack Backend Integration', 'Express Server Setup', 'Dynamic API Data Fetching', 'Improved Loading States'] },
  { version: '1.4.0', date: '2026-03-05', changes: ['Enhanced Employer Dashboard', 'Applicant Match Scoring', 'Hiring Insights & Analytics', 'Job Post Management'] },
  { version: '1.3.0', date: '2026-03-05', changes: ['Multi-Theme Support', 'Dark Mode Implementation', 'High Contrast Accessibility Mode', 'Theme Switcher Component'] },
  { version: '1.2.0', date: '2026-03-05', changes: ['Added Version History', 'Implemented Job Alerts', 'Interactive Version Tag', 'UI Refinements'] },
  { version: '1.1.0', date: '2026-03-04', changes: ['Added Job Application Tracking', 'Implemented Saved Jobs', 'Launched Resource Center', 'Enhanced Profile Dashboard'] },
  { version: '1.0.0', date: '2026-03-01', changes: ['Initial Launch', 'Smart Job Matching', 'Inclusive Profile Creation', 'Accessibility-First Design'] },
];

type Theme = 'light' | 'dark' | 'high-contrast';

// --- Components ---

const VersionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card-bg w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border-subtle"
          >
            <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-[#F5F5F0] dark:bg-[#333]">
              <div className="flex items-center gap-3">
                <History className="text-[#5A5A40]" size={24} />
                <h2 className="text-2xl">Version History</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-8">
              {VERSION_HISTORY.map((item, idx) => (
                <div key={item.version} className="relative pl-8 border-l-2 border-border-subtle last:border-l-0">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#5A5A40] border-4 border-card-bg" />
                  <div className="mb-1 flex items-center gap-3">
                    <span className="text-lg font-bold font-mono">v{item.version}</span>
                    <span className="text-xs text-[#999]">{item.date}</span>
                    {idx === 0 && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">Current</span>}
                  </div>
                  <ul className="space-y-1">
                    {item.changes.map(change => (
                      <li key={change} className="text-sm text-[#666] flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[#5A5A40] shrink-0" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="p-6 bg-[#FDFCFB] dark:bg-[#222] border-t border-border-subtle text-center">
              <p className="text-xs text-[#999]">Inclusive Jobs is continuously evolving to better serve our community.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ThemeSwitcher = ({ theme, setTheme }: { theme: Theme, setTheme: (t: Theme) => void }) => {
  return (
    <div className="flex items-center gap-2 bg-[#F5F5F0] dark:bg-[#333] p-1 rounded-full border border-border-subtle">
      <button 
        onClick={() => setTheme('light')}
        className={cn("p-2 rounded-full transition-all", theme === 'light' ? "bg-white text-[#5A5A40] shadow-sm" : "text-[#666]")}
        aria-label="Light mode"
      >
        <Sun size={16} />
      </button>
      <button 
        onClick={() => setTheme('dark')}
        className={cn("p-2 rounded-full transition-all", theme === 'dark' ? "bg-[#1A1A1A] text-white shadow-sm" : "text-[#666]")}
        aria-label="Dark mode"
      >
        <Moon size={16} />
      </button>
      <button 
        onClick={() => setTheme('high-contrast')}
        className={cn("p-2 rounded-full transition-all", theme === 'high-contrast' ? "bg-black text-white ring-1 ring-white shadow-sm" : "text-[#666]")}
        aria-label="High contrast mode"
      >
        <Eye size={16} />
      </button>
    </div>
  );
};

const Navbar = ({ user, theme, setTheme }: { user: UserProfile | null, theme: Theme, setTheme: (t: Theme) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showVersion, setShowVersion] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Find Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Resume AI', path: '/resume-ai', icon: Sparkles },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-[#E5E5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Accessibility size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold text-[#1A1A1A] leading-none">Inclusive Jobs</span>
                <button 
                  onClick={() => setShowVersion(true)}
                  className="text-[10px] font-mono font-bold text-[#5A5A40] mt-1 tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  v{APP_VERSION} <Info size={8} />
                </button>
              </div>
            </Link>
            <VersionModal isOpen={showVersion} onClose={() => setShowVersion(false)} />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#5A5A40]",
                  location.pathname === link.path ? "text-[#5A5A40]" : "text-[#666]"
                )}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
            {!user ? (
              <Link to="/login" className="btn-primary py-2 px-6">Sign In</Link>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-[#E5E5E0]">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-[#666] capitalize">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#F5F5F0] border border-[#E5E5E0] flex items-center justify-center">
                  <User size={20} className="text-[#5A5A40]" />
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[#5A5A40]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#E5E5E0] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium text-[#666] hover:bg-[#F5F5F0] hover:text-[#5A5A40]"
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}
              {!user && (
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center btn-primary mt-4"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

interface JobCardProps {
  job: Job;
  isRecommended?: boolean;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  onApply?: (job: Job) => void;
  key?: string | number;
}

const JobCard = ({ job, isRecommended, isSaved, onSave, onApply }: JobCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("card relative overflow-hidden flex flex-col h-full", isRecommended && "border-[#5A5A40] ring-1 ring-[#5A5A40]/20")}
  >
    {isRecommended && (
      <div className="absolute top-0 right-0 bg-[#5A5A40] text-white px-4 py-1 rounded-bl-2xl text-xs font-medium flex items-center gap-1">
        <Sparkles size={12} /> Smart Match
      </div>
    )}
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl mb-1">{job.title}</h3>
        <p className="text-[#5A5A40] font-medium">{job.employerName}</p>
      </div>
      {onSave && (
        <button 
          onClick={() => onSave(job.id)}
          className={cn("p-2 rounded-full transition-colors", isSaved ? "bg-[#5A5A40] text-white" : "bg-[#F5F5F0] text-[#5A5A40] hover:bg-[#E5E5E0]")}
          aria-label={isSaved ? "Remove from saved" : "Save job"}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      )}
    </div>
    
    <div className="flex flex-wrap gap-4 mb-6 text-sm text-[#666]">
      <div className="flex items-center gap-1.5">
        <MapPin size={16} /> {job.location}
      </div>
      <div className="flex items-center gap-1.5">
        <Clock size={16} /> {job.type}
      </div>
      <div className="flex items-center gap-1.5">
        <DollarSign size={16} /> {job.salaryRange}
      </div>
    </div>

    <div className="mb-6 flex-1">
      <p className="text-xs font-bold uppercase tracking-wider text-[#999] mb-2">Accommodations Provided</p>
      <div className="flex flex-wrap gap-2">
        {job.providedAccommodations.slice(0, 3).map((acc) => (
          <span key={acc} className="px-3 py-1 bg-[#F5F5F0] text-[#5A5A40] rounded-full text-xs font-medium border border-[#E5E5E0]">
            {acc}
          </span>
        ))}
        {job.providedAccommodations.length > 3 && (
          <span className="text-xs text-[#666] self-center">+{job.providedAccommodations.length - 3} more</span>
        )}
      </div>
    </div>

    <div className="flex gap-3 mt-auto">
      <Link to={`/jobs/${job.id}`} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2">
        Details
      </Link>
      {onApply && (
        <button 
          onClick={() => onApply(job)}
          className="btn-primary flex-1 flex items-center justify-center gap-2 py-2"
        >
          Apply Now
        </button>
      )}
    </div>
  </motion.div>
);

// --- Pages ---

const LandingPage = () => (
  <div className="space-y-20 pb-20">
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl mb-8 leading-tight">
            Work that works <br />
            <span className="italic text-[#5A5A40]">for everyone.</span>
          </h1>
          <p className="text-xl text-[#666] max-w-2xl mx-auto mb-10">
            The job platform built for accessibility. We match your unique skills 
            and accessibility needs with employers who value diversity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs" className="btn-primary text-lg px-10">Find a Job</Link>
            <Link to="/post-job" className="btn-secondary text-lg px-10">Post a Job</Link>
          </div>
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#5A5A40] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5A5A40] rounded-full blur-3xl animate-pulse delay-700" />
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#F5F5F0] rounded-2xl flex items-center justify-center mx-auto text-[#5A5A40]">
            <Sparkles size={32} />
          </div>
          <h3 className="text-2xl">Smart Matching</h3>
          <p className="text-[#666]">AI-driven recommendations that consider your skills and accessibility requirements.</p>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#F5F5F0] rounded-2xl flex items-center justify-center mx-auto text-[#5A5A40]">
            <Accessibility size={32} />
          </div>
          <h3 className="text-2xl">Inclusive Design</h3>
          <p className="text-[#666]">Built from the ground up to be accessible for screen readers and keyboard navigation.</p>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#F5F5F0] rounded-2xl flex items-center justify-center mx-auto text-[#5A5A40]">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-2xl">Verified Employers</h3>
          <p className="text-[#666]">We work with companies committed to providing real workplace accommodations.</p>
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl mb-2">Accessibility Resources</h2>
          <p className="text-[#666]">Expert advice for your professional growth.</p>
        </div>
        <Link to="/resources" className="text-[#5A5A40] font-medium flex items-center gap-2 hover:underline">
          View All <ChevronRight size={18} />
        </Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_RESOURCES.slice(0, 4).map(resource => (
          <div key={resource.id} className="card flex flex-col h-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] mb-2">{resource.category}</span>
            <h3 className="text-xl mb-3">{resource.title}</h3>
            <p className="text-sm text-[#666] mb-6 flex-1">{resource.description}</p>
            <Link to="/resources" className="text-[#5A5A40] font-medium flex items-center gap-2 hover:underline mt-auto">
              Read More <ChevronRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const JobsPage = ({ 
  user, 
  savedJobIds, 
  onSaveJob, 
  onApplyJob 
}: { 
  user: UserProfile | null, 
  savedJobIds: string[],
  onSaveJob: (id: string) => void,
  onApplyJob: (job: Job) => void
}) => {
  const [search, setSearch] = useState('');
  const [filterDisability, setFilterDisability] = useState<DisabilityType | 'All'>('All');
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs(MOCK_JOBS); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user && user.role === 'seeker' && jobs.length > 0) {
      getJobRecommendations(user, jobs).then(recs => {
        setRecommendations(recs);
      });
    }
  }, [user, jobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                         job.employerName.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#5A5A40] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-[#666]">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl mb-2">Available Opportunities</h1>
          <p className="text-[#666]">Find a workplace that values your unique perspective.</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={20} />
            <input 
              type="text" 
              placeholder="Search jobs or companies..." 
              className="input-field pl-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <p className="text-sm font-bold text-[#999] uppercase mb-4">Filter by Accessibility Focus</p>
        <div className="flex flex-wrap gap-3">
          {['All', ...Object.values(DisabilityType)].map((type) => (
            <button
              key={type}
              onClick={() => setFilterDisability(type as any)}
              className={cn(
                "px-6 py-2 rounded-full text-sm border transition-all",
                filterDisability === type 
                  ? "bg-[#5A5A40] text-white border-[#5A5A40]" 
                  : "bg-white text-[#5A5A40] border-[#E5E5E0] hover:border-[#5A5A40]"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {user && recommendations.length > 0 && !search && filterDisability === 'All' && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-[#5A5A40]" size={24} />
            <h2 className="text-3xl">Recommended for You</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendations.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                isRecommended 
                isSaved={savedJobIds.includes(job.id)}
                onSave={onSaveJob}
                onApply={onApplyJob}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-3xl mb-8">All Job Postings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              isSaved={savedJobIds.includes(job.id)}
              onSave={onSaveJob}
              onApply={onApplyJob}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => {
        setResources(data);
        setLoading(false);
      })
      .catch(() => {
        setResources(MOCK_RESOURCES as Resource[]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-20 text-center">Loading resources...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl mb-4">Accessibility Resource Center</h1>
        <p className="text-xl text-[#666] max-w-2xl mx-auto">
          Guides, tools, and success stories to help you navigate your career journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map(resource => (
          <div key={resource.id} className="card flex flex-col h-full">
            <div className="w-12 h-12 bg-[#F5F5F0] dark:bg-[#333] rounded-xl flex items-center justify-center text-[#5A5A40] mb-6">
              <BookOpen size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] mb-2">{resource.category}</span>
            <h3 className="text-xl mb-3">{resource.title}</h3>
            <p className="text-sm text-[#666] mb-6 flex-1">{resource.description}</p>
            <a href={resource.link} className="text-[#5A5A40] font-medium flex items-center gap-2 hover:underline">
              Read More <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplicationsPage = ({ applications }: { applications: Application[] }) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-4xl mb-8">Your Applications</h1>
    {applications.length === 0 ? (
      <div className="card text-center py-20 space-y-4">
        <FileText size={48} className="mx-auto text-[#999]" />
        <p className="text-[#666]">You haven't applied to any jobs yet.</p>
        <Link to="/jobs" className="btn-primary inline-block">Browse Jobs</Link>
      </div>
    ) : (
      <div className="space-y-4">
        {applications.map(app => (
          <div key={app.id} className="card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl mb-1">{app.jobTitle}</h3>
              <p className="text-[#5A5A40] font-medium">{app.employerName}</p>
              <p className="text-xs text-[#999] mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                app.status === 'pending' ? "bg-amber-50 text-amber-700" :
                app.status === 'interviewing' ? "bg-blue-50 text-blue-700" :
                app.status === 'offered' ? "bg-emerald-50 text-emerald-700" :
                "bg-gray-50 text-gray-700"
              )}>
                {app.status}
              </span>
              <Link to="/messages" className="btn-secondary p-2 rounded-full">
                <MessageSquare size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const SavedJobsPage = ({ 
  savedJobIds, 
  onSaveJob, 
  onApplyJob 
}: { 
  savedJobIds: string[], 
  onSaveJob: (id: string) => void,
  onApplyJob: (job: Job) => void
}) => {
  const savedJobs = MOCK_JOBS.filter(job => savedJobIds.includes(job.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl mb-8">Saved Opportunities</h1>
      {savedJobs.length === 0 ? (
        <div className="card text-center py-20 space-y-4">
          <Bookmark size={48} className="mx-auto text-[#999]" />
          <p className="text-[#666]">You haven't saved any jobs yet.</p>
          <Link to="/jobs" className="btn-primary inline-block">Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              isSaved={true} 
              onSave={onSaveJob}
              onApply={onApplyJob}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EmployerDashboard = ({ user }: { user: UserProfile | null }) => {
  const employerJobs = MOCK_JOBS.filter(j => j.employerId === 'emp1'); // Mocking for current user
  
  const applicants = [
    { id: 'a1', name: 'Alex Rivera', job: 'Frontend Developer', status: 'Reviewed', match: '95%' },
    { id: 'a2', name: 'Jordan Smith', job: 'Frontend Developer', status: 'Pending', match: '88%' },
    { id: 'a3', name: 'Casey Johnson', job: 'Graphic Designer', status: 'Interviewing', match: '92%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl mb-2">Employer Dashboard</h1>
          <p className="text-[#666]">Manage your job postings and track applicants.</p>
        </div>
        <Link to="/post-job" className="btn-primary flex items-center gap-2">
          <Briefcase size={20} /> Post New Job
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <LayoutDashboard className="text-[#5A5A40]" size={24} />
              <h2 className="text-2xl">Active Postings</h2>
            </div>
            <div className="space-y-4">
              {employerJobs.map(job => (
                <div key={job.id} className="card flex justify-between items-center">
                  <div>
                    <h3 className="text-xl mb-1">{job.title}</h3>
                    <p className="text-sm text-[#666]">{job.location} • {job.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">12</p>
                      <p className="text-xs text-[#999] uppercase">Applicants</p>
                    </div>
                    <button className="btn-secondary p-2 rounded-full">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-[#5A5A40]" size={24} />
              <h2 className="text-2xl">Recent Applicants</h2>
            </div>
            <div className="overflow-hidden card p-0">
              <table className="w-full text-left">
                <thead className="bg-[#F5F5F0] dark:bg-[#333] text-xs font-bold uppercase tracking-wider text-[#999]">
                  <tr>
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Job Role</th>
                    <th className="px-6 py-4">Match Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {applicants.map(applicant => (
                    <tr key={applicant.id} className="hover:bg-[#FDFCFB] dark:hover:bg-[#222] transition-colors">
                      <td className="px-6 py-4 font-medium">{applicant.name}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{applicant.job}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">
                          {applicant.match}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F5F5F0] dark:bg-[#333]">
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#5A5A40] hover:underline text-sm font-medium">View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="card bg-[#5A5A40] text-white">
            <h3 className="text-xl mb-4">Hiring Insights</h3>
            <div className="space-y-6">
              <div>
                <p className="text-3xl font-bold">84%</p>
                <p className="text-xs opacity-80 uppercase tracking-widest">Accessibility Score</p>
                <div className="w-full bg-white/20 h-1 rounded-full mt-2">
                  <div className="bg-white h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              <p className="text-sm opacity-90">Your job descriptions are highly inclusive. Adding more visual accommodations could improve your score.</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-xl hover:bg-[#F5F5F0] dark:hover:bg-[#333] transition-colors flex items-center gap-3">
                <MessageSquare size={18} className="text-[#5A5A40]" />
                <span className="text-sm">Message all applicants</span>
              </button>
              <button className="w-full text-left p-3 rounded-xl hover:bg-[#F5F5F0] dark:hover:bg-[#333] transition-colors flex items-center gap-3">
                <Bell size={18} className="text-[#5A5A40]" />
                <span className="text-sm">Set up hiring alerts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ 
  user, 
  setUser, 
  applicationsCount, 
  savedCount 
}: { 
  user: UserProfile | null, 
  setUser: (u: UserProfile) => void,
  applicationsCount: number,
  savedCount: number
}) => {
  const [isEditing, setIsEditing] = useState(!user);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [formData, setFormData] = useState<Partial<UserProfile>>(user || {
    name: '',
    email: '',
    role: 'seeker',
    skills: [],
    disabilities: [],
    neededAccommodations: [],
    preferredWorkType: 'remote'
  });

  const handleSave = () => {
    const newUser = { ...formData, id: 'u1' } as UserProfile;
    setUser(newUser);
    setIsEditing(false);
  };

  const toggleDisability = (type: DisabilityType) => {
    const current = formData.disabilities || [];
    setFormData({
      ...formData,
      disabilities: current.includes(type) 
        ? current.filter(t => t !== type)
        : [...current, type]
    });
  };

  const toggleAccommodation = (type: AccommodationType) => {
    const current = formData.neededAccommodations || [];
    setFormData({
      ...formData,
      neededAccommodations: current.includes(type) 
        ? current.filter(t => t !== type)
        : [...current, type]
    });
  };

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="card space-y-8">
          <h1 className="text-4xl text-center">Complete Your Profile</h1>
          
          <div className="space-y-6">
            <div>
              <label className="label">Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setFormData({...formData, role: 'seeker'})}
                  className={cn("p-4 rounded-2xl border transition-all", formData.role === 'seeker' ? "border-[#5A5A40] bg-[#F5F5F0]" : "border-[#E5E5E0]")}
                >
                  Job Seeker
                </button>
                <button 
                  onClick={() => setFormData({...formData, role: 'employer'})}
                  className={cn("p-4 rounded-2xl border transition-all", formData.role === 'employer' ? "border-[#5A5A40] bg-[#F5F5F0]" : "border-[#E5E5E0]")}
                >
                  Employer
                </button>
              </div>
            </div>

            {formData.role === 'seeker' && (
              <>
                <div>
                  <label className="label">Disability Type (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(DisabilityType).map(type => (
                      <button
                        key={type}
                        onClick={() => toggleDisability(type)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm border transition-all",
                          formData.disabilities?.includes(type) ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-white text-[#5A5A40] border-[#E5E5E0]"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Needed Accommodations</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(AccommodationType).map(type => (
                      <button
                        key={type}
                        onClick={() => toggleAccommodation(type)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm border transition-all",
                          formData.neededAccommodations?.includes(type) ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-white text-[#5A5A40] border-[#E5E5E0]"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button onClick={handleSave} className="btn-primary w-full text-lg">Save Profile</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="card">
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-[#F5F5F0] flex items-center justify-center text-[#5A5A40]">
              <User size={48} />
            </div>
            <div>
              <h1 className="text-4xl mb-2">{user?.name}</h1>
              <p className="text-[#666]">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-[#F5F5F0] text-[#5A5A40] rounded-full text-xs font-bold uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>
          <button onClick={() => setIsEditing(true)} className="btn-secondary py-2">Edit Profile</button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link to="/applications" className="card text-center hover:bg-[#F5F5F0] transition-colors">
            <FileText size={32} className="mx-auto text-[#5A5A40] mb-2" />
            <p className="text-2xl font-bold">{applicationsCount}</p>
            <p className="text-sm text-[#666]">Applications</p>
          </Link>
          <Link to="/saved-jobs" className="card text-center hover:bg-[#F5F5F0] transition-colors">
            <Bookmark size={32} className="mx-auto text-[#5A5A40] mb-2" />
            <p className="text-2xl font-bold">{savedCount}</p>
            <p className="text-sm text-[#666]">Saved Jobs</p>
          </Link>
          <div className="card text-center">
            <Accessibility size={32} className="mx-auto text-[#5A5A40] mb-2" />
            <p className="text-2xl font-bold">100%</p>
            <p className="text-sm text-[#666]">Profile Score</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl mb-4">Accessibility Profile</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-[#999] uppercase mb-2">Disabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {user?.disabilities.map(d => (
                      <span key={d} className="px-3 py-1 bg-[#F5F5F0] dark:bg-[#333] text-text-primary rounded-full text-sm">{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#999] uppercase mb-2">Required Accommodations</p>
                  <div className="flex flex-wrap gap-2">
                    {user?.neededAccommodations.map(a => (
                      <span key={a} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-full text-sm flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t border-border-subtle">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell size={20} className="text-[#5A5A40]" />
                  <h3 className="text-2xl">Job Alerts</h3>
                </div>
                <button 
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    alertsEnabled ? "bg-[#5A5A40]" : "bg-[#E5E5E0]"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    alertsEnabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
              <p className="text-sm text-[#666] mb-4">Receive notifications when new jobs matching your accessibility profile are posted.</p>
              <div className="space-y-2">
                {['Remote Roles', 'Frontend Positions', 'Visual Accessibility Focus'].map(alert => (
                  <div key={alert} className="flex items-center gap-2 text-sm text-text-primary">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {alert}
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl mb-4">Professional Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-[#999] uppercase mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'UI Design', 'Project Management'].map(s => (
                      <span key={s} className="px-3 py-1 bg-[#F5F5F0] text-[#5A5A40] rounded-full text-sm">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#999] uppercase mb-2">Preferred Work</p>
                  <p className="text-[#1A1A1A] capitalize">{user?.preferredWorkType}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumeOptimizerPage = () => {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<{ optimizedText: string, suggestions: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5A5A40]/10 text-[#5A5A40] rounded-2xl mb-4">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl mb-4">AI Resume Optimizer</h1>
        <p className="text-[#666]">Optimize your resume for accessibility-focused roles and inclusive employers.</p>
      </div>

      <div className="grid gap-8">
        <div className="card">
          <label className="label">Paste your resume content</label>
          <textarea 
            className="input-field min-h-[200px] font-mono text-sm"
            placeholder="Experience, skills, education..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <button 
            onClick={handleOptimize}
            disabled={loading || !resumeText.trim()}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Optimizing...' : <><Sparkles size={18} /> Optimize for Inclusivity</>}
          </button>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20">
              <h3 className="text-xl text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} /> AI Suggestions
              </h3>
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3 className="text-xl mb-4">Optimized Content</h3>
              <div className="p-4 bg-[#F5F5F0] dark:bg-[#333] rounded-xl font-mono text-sm whitespace-pre-wrap">
                {result.optimizedText}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const CommunityChatPage = ({ user }: { user: UserProfile | null }) => {
  const [messages, setMessages] = useState<{ text: string, sender: string, timestamp: string }[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages(prev => [...prev, msg]);
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    };

    setSocket(ws);
    return () => ws.close();
  }, []);

  const handleSend = () => {
    if (!input.trim() || !socket) return;
    const msg = {
      text: input,
      sender: user?.name || 'Anonymous',
      timestamp: new Date().toLocaleTimeString()
    };
    socket.send(JSON.stringify(msg));
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 h-[calc(100vh-160px)] flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="text-[#5A5A40]" size={32} />
        <h1 className="text-4xl">Community Chat</h1>
      </div>

      <div className="flex-1 card overflow-hidden flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FDFCFB] dark:bg-[#1A1A1A]">
          {messages.length === 0 && (
            <div className="text-center py-20 opacity-40">
              <MessageSquare size={48} className="mx-auto mb-4" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "max-w-[80%] p-4 rounded-2xl",
              msg.sender === user?.name ? "ml-auto bg-[#5A5A40] text-white" : "bg-[#F5F5F0] dark:bg-[#333] text-text-primary"
            )}>
              <div className="flex justify-between items-end gap-4 mb-1">
                <span className="text-xs font-bold opacity-70">{msg.sender}</span>
                <span className="text-[10px] opacity-50">{msg.timestamp}</span>
              </div>
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border-subtle bg-card-bg flex gap-2">
          <input 
            className="input-field"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="btn-primary p-3">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PostJobPage = ({ user }: { user: UserProfile | null }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    salary: '',
    description: '',
    accommodations: [] as AccommodationType[]
  });

  const toggleAccommodation = (type: AccommodationType) => {
    setFormData(prev => ({
      ...prev,
      accommodations: prev.accommodations.includes(type)
        ? prev.accommodations.filter(t => t !== type)
        : [...prev.accommodations, type]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card space-y-8">
        <div className="text-center">
          <h1 className="text-4xl mb-2">Post a New Opportunity</h1>
          <p className="text-[#666]">Reach talented individuals by highlighting your workplace accessibility.</p>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">Job Title</label>
              <input type="text" className="input-field" placeholder="e.g. Senior Software Engineer" />
            </div>
            <div>
              <label className="label">Company Name</label>
              <input type="text" className="input-field" placeholder="e.g. Inclusive Tech" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="label">Location</label>
              <input type="text" className="input-field" placeholder="e.g. Remote / London" />
            </div>
            <div>
              <label className="label">Job Type</label>
              <select className="input-field">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </div>
            <div>
              <label className="label">Salary Range</label>
              <input type="text" className="input-field" placeholder="e.g. $60k - $80k" />
            </div>
          </div>

          <div>
            <label className="label">Job Description</label>
            <textarea className="input-field h-32 resize-none" placeholder="Describe the role and your company culture..."></textarea>
          </div>

          <div>
            <label className="label">Available Accommodations</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(AccommodationType).map(type => (
                <button
                  key={type}
                  onClick={() => toggleAccommodation(type)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-all",
                    formData.accommodations.includes(type) ? "bg-[#5A5A40] text-white border-[#5A5A40]" : "bg-white text-[#5A5A40] border-[#E5E5E0]"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary w-full text-lg py-4">Publish Job Posting</button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleSaveJob = (id: string) => {
    setSavedJobIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleApplyJob = (job: Job) => {
    if (applications.some(app => app.jobId === job.id)) {
      alert('You have already applied to this job.');
      return;
    }
    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      jobId: job.id,
      jobTitle: job.title,
      employerName: job.employerName,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    alert(`Successfully applied to ${job.title} at ${job.employerName}!`);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} theme={theme} setTheme={setTheme} />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={
                <JobsPage 
                  user={user} 
                  savedJobIds={savedJobIds} 
                  onSaveJob={handleSaveJob}
                  onApplyJob={handleApplyJob}
                />
              } />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/applications" element={<ApplicationsPage applications={applications} />} />
              <Route path="/saved-jobs" element={
                <SavedJobsPage 
                  savedJobIds={savedJobIds} 
                  onSaveJob={handleSaveJob} 
                  onApplyJob={handleApplyJob}
                />
              } />
              <Route path="/profile" element={
                user?.role === 'employer' ? (
                  <EmployerDashboard user={user} />
                ) : (
                  <ProfilePage 
                    user={user} 
                    setUser={setUser} 
                    applicationsCount={applications.length}
                    savedCount={savedJobIds.length}
                  />
                )
              } />
              <Route path="/chat" element={<CommunityChatPage user={user} />} />
              <Route path="/resume-ai" element={<ResumeOptimizerPage />} />
              <Route path="/login" element={
                <ProfilePage 
                  user={user} 
                  setUser={setUser} 
                  applicationsCount={applications.length}
                  savedCount={savedJobIds.length}
                />
              } />
              <Route path="/register" element={
                <ProfilePage 
                  user={user} 
                  setUser={setUser} 
                  applicationsCount={applications.length}
                  savedCount={savedJobIds.length}
                />
              } />
              <Route path="/post-job" element={<PostJobPage user={user} />} />
              <Route path="/dashboard" element={<EmployerDashboard user={user} />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        <footer className="bg-[#F5F5F0] border-t border-[#E5E5E0] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <Accessibility className="text-[#5A5A40]" size={24} />
                <span className="text-xl font-serif font-bold">Inclusive Jobs</span>
              </div>
              <p className="text-[#666] text-sm">© 2026 Inclusive Jobs. Built with accessibility in mind.</p>
              <div className="flex gap-6">
                <a href="#" className="text-[#666] hover:text-[#5A5A40] text-sm">Privacy Policy</a>
                <a href="#" className="text-[#666] hover:text-[#5A5A40] text-sm">Terms of Service</a>
                <a href="#" className="text-[#666] hover:text-[#5A5A40] text-sm">Accessibility Statement</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
