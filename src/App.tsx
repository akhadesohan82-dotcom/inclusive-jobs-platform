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
  Send
} from 'lucide-react';
import { cn } from './lib/utils';
import { Job, UserProfile, DisabilityType, AccommodationType, Message } from './types';
import { MOCK_JOBS } from './constants';
import { getJobRecommendations } from './services/geminiService';

// --- Components ---

const Navbar = ({ user }: { user: UserProfile | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Find Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-[#E5E5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Accessibility size={24} />
            </div>
            <span className="text-2xl font-serif font-bold text-[#1A1A1A]">Inclusive Jobs</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
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
  key?: string | number;
}

const JobCard = ({ job, isRecommended }: JobCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("card relative overflow-hidden", isRecommended && "border-[#5A5A40] ring-1 ring-[#5A5A40]/20")}
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

    <div className="mb-6">
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

    <Link to={`/jobs/${job.id}`} className="btn-secondary w-full flex items-center justify-center gap-2">
      View Details <ChevronRight size={18} />
    </Link>
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
  </div>
);

const JobsPage = ({ user }: { user: UserProfile | null }) => {
  const [search, setSearch] = useState('');
  const [filterDisability, setFilterDisability] = useState<DisabilityType | 'All'>('All');
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'seeker') {
      setLoading(true);
      getJobRecommendations(user, MOCK_JOBS).then(recs => {
        setRecommendations(recs);
        setLoading(false);
      });
    }
  }, [user]);

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                         job.employerName.toLowerCase().includes(search.toLowerCase());
    
    // Simple logic: if a disability filter is selected, we could show jobs that provide 
    // accommodations typically associated with that disability. 
    // For this demo, we'll just show all jobs but highlight the filter.
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <h1 className="text-4xl">Available Opportunities</h1>
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
              <JobCard key={job.id} job={job} isRecommended />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-3xl mb-8">All Job Postings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ user, setUser }: { user: UserProfile | null, setUser: (u: UserProfile) => void }) => {
  const [isEditing, setIsEditing] = useState(!user);
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

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl mb-4">Accessibility Profile</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-[#999] uppercase mb-2">Disabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {user?.disabilities.map(d => (
                      <span key={d} className="px-3 py-1 bg-[#F5F5F0] text-[#5A5A40] rounded-full text-sm">{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#999] uppercase mb-2">Required Accommodations</p>
                  <div className="flex flex-wrap gap-2">
                    {user?.neededAccommodations.map(a => (
                      <span key={a} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> {a}
                      </span>
                    ))}
                  </div>
                </div>
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

const MessagesPage = ({ user }: { user: UserProfile | null }) => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const contacts = [
    { id: 'emp1', name: 'TechFlow Solutions', lastMsg: 'We would love to schedule an interview!', time: '2h ago' },
    { id: 'emp2', name: 'Green Horizon', lastMsg: 'Thank you for your application.', time: '1d ago' },
  ];

  if (!user) return <div className="text-center py-20">Please sign in to view messages.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 h-[calc(100vh-160px)]">
      <div className="card h-full p-0 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-[#E5E5E0] flex flex-col">
          <div className="p-6 border-b border-[#E5E5E0]">
            <h2 className="text-2xl">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={cn(
                  "w-full p-6 text-left transition-all hover:bg-[#F5F5F0]",
                  activeChat === contact.id && "bg-[#F5F5F0]"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium">{contact.name}</p>
                  <span className="text-xs text-[#999]">{contact.time}</span>
                </div>
                <p className="text-sm text-[#666] truncate">{contact.lastMsg}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#FDFCFB]">
          {activeChat ? (
            <>
              <div className="p-6 border-b border-[#E5E5E0] bg-white">
                <h3 className="text-xl">{contacts.find(c => c.id === activeChat)?.name}</h3>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E5E5E0] p-4 rounded-2xl max-w-md">
                    <p className="text-sm">Hello! We reviewed your profile and your accessibility needs align perfectly with our remote work setup. Would you be available for a call next Tuesday?</p>
                    <span className="text-[10px] text-[#999] mt-2 block">10:30 AM</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#5A5A40] text-white p-4 rounded-2xl max-w-md">
                    <p className="text-sm">Hi! That sounds great. Tuesday works for me. I prefer text-based communication for the initial interview if possible.</p>
                    <span className="text-[10px] text-white/60 mt-2 block">10:35 AM</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white border-t border-[#E5E5E0]">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="input-field"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button className="btn-primary px-6 flex items-center gap-2">
                    <Send size={18} /> <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#999] space-y-4">
              <MessageSquare size={48} />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
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

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/jobs" element={<JobsPage user={user} />} />
              <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="/messages" element={<MessagesPage user={user} />} />
              <Route path="/login" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="/register" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="/post-job" element={<PostJobPage user={user} />} />
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
