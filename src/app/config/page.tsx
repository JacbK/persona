'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Sparkles, Upload, FileText, Image as ImageIcon, X, Check, Terminal, ArrowRight, ChevronRight, Loader2, Edit3 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ARCHETYPE_EXAMPLES } from './inspirations';
import { generateProfileYaml, type ProfileConfig } from '@/lib/profile-config';

type ConfigStep = 'basics' | 'design' | 'review';


export default function ConfigPage() {
  const [config, setConfig] = useState<ProfileConfig>({
    name: '',
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    cli: 'claude-code',
    sections: {
      hero: true,
      about: true,
      experience: true,
      projects: true,
      skills: false,
      education: false,
      contact: true,
      blog: false,
      testimonials: false,
    },
    design: {
      creativity: 5,
      simplicity: 7,
      playfulness: 4,
      animation: 5,
      color_intensity: 4,
      notes: '',
    },
    content: {
      tone: 'conversational',
      length: 'balanced',
      focus: 'projects',
    },
    ai: {
      quality_bar: 7,
      research_depth: 6,
      copy_creativity: 5,
    },
    notes: '',
  });

  const [selectedExamples, setSelectedExamples] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; path: string; folder: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [showDownloadHelp, setShowDownloadHelp] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConfigStep>('basics');
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingConfig, setHasExistingConfig] = useState(false);

  // Load existing config on mount
  useEffect(() => {
    async function loadExistingConfig() {
      try {
        const res = await fetch('/api/read-config');
        const data = await res.json();

        if (data.exists && data.config) {
          const c = data.config;
          const enabledSections = Array.isArray(c.sections)
            ? new Set<string>(c.sections)
            : null;
          setHasExistingConfig(true);

          // Populate form with existing values
          setConfig({
            name: c.name || '',
            email: c.email || '',
            github: c.github || '',
            linkedin: c.linkedin || '',
            twitter: c.twitter || '',
            website: c.website || '',
            cli: c.cli || 'claude-code',
            sections: {
              hero: enabledSections ? enabledSections.has('hero') : c.sections?.hero ?? true,
              about: enabledSections ? enabledSections.has('about') : c.sections?.about ?? true,
              experience: enabledSections ? enabledSections.has('experience') : c.sections?.experience ?? true,
              projects: enabledSections ? enabledSections.has('projects') : c.sections?.projects ?? true,
              skills: enabledSections ? enabledSections.has('skills') : c.sections?.skills ?? false,
              education: enabledSections ? enabledSections.has('education') : c.sections?.education ?? false,
              contact: enabledSections ? enabledSections.has('contact') : c.sections?.contact ?? true,
              blog: enabledSections ? enabledSections.has('blog') : c.sections?.blog ?? false,
              testimonials: enabledSections ? enabledSections.has('testimonials') : c.sections?.testimonials ?? false,
            },
            design: {
              creativity: c.design?.creativity ?? 5,
              simplicity: c.design?.simplicity ?? 7,
              playfulness: c.design?.playfulness ?? 4,
              animation: c.design?.animation ?? 5,
              color_intensity: c.design?.color_intensity ?? 4,
              notes: c.design?.notes || '',
            },
            content: {
              tone: c.content?.tone || 'conversational',
              length: c.content?.length || 'balanced',
              focus: c.content?.focus || 'projects',
            },
            ai: {
              quality_bar: c.ai?.quality_bar ?? 7,
              research_depth: c.ai?.research_depth ?? 6,
              copy_creativity: c.ai?.copy_creativity ?? 5,
            },
            notes: c.notes || '',
          });

          // Load design inspirations if they exist
          if (c.design_inspirations && Array.isArray(c.design_inspirations)) {
            const urls = c.design_inspirations.map((i: { url?: string }) => i.url).filter(Boolean);
            setSelectedExamples(urls);
          }
        }
      } catch (err) {
        console.error('Failed to load config:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadExistingConfig();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: 'documents' | 'images') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      try {
        const res = await fetch('/api/upload-material', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          setUploadedFiles(prev => [...prev, { name: data.name, path: data.path, folder }]);
        } else {
          const data = await res.json().catch(() => ({ error: 'Upload failed' }));
          setUploadError(data.error || 'Upload failed');
        }
      } catch (err) {
        console.error('Upload failed:', err);
        setUploadError('Upload failed. Check the local server and try again.');
      }
    }

    setIsUploading(false);
    e.target.value = '';
  };

  const removeUploadedFile = async (path: string) => {
    setUploadError('');
    const res = await fetch('/api/upload-material', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });

    if (res.ok) {
      setUploadedFiles(prev => prev.filter(f => f.path !== path));
    } else {
      const data = await res.json().catch(() => ({ error: 'Delete failed' }));
      setUploadError(data.error || 'Delete failed');
    }
  };

  const toggleExample = (url: string) => {
    setSelectedExamples((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const downloadConfig = () => {
    const yaml = generateProfileYaml(config, selectedExamples, ARCHETYPE_EXAMPLES);
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile.yaml';
    a.click();
    URL.revokeObjectURL(url);
    setShowDownloadHelp(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 size={32} className="animate-spin mx-auto text-neutral-400" />
          <p className="text-neutral-500">Loading configuration...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'basics' as const, label: 'Basics', description: 'Name & contact info' },
    { id: 'design' as const, label: 'Design', description: 'Style & inspirations' },
    { id: 'review' as const, label: 'Review', description: 'Save your profile' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} className="text-green-500" />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Config Saved!</h2>
              <p className="text-neutral-400">
                Your profile has been saved to <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">profile.yaml</code>
              </p>
            </div>

            <div className="bg-neutral-800 rounded-xl p-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Terminal size={20} className="text-green-500" />
                <span className="font-semibold">Next Step</span>
              </div>
              <p className="text-neutral-400 text-sm mb-4">
                Close this tab and return to your terminal. The setup script will ask which AI tool you want to launch.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-sm"
              >
                Keep Editing
              </button>
              <button
                onClick={() => {
                  // Try to close the tab - this works if the page was opened by a script
                  window.close();
                  // If window.close() didn't work (browser security), show a message
                  setShowSuccessModal(false);
                  setConfigSaved(true);
                }}
                className="flex-1 px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                Done
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              {hasExistingConfig && (
                <span className="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                  <Edit3 size={14} />
                  Editing existing config
                </span>
              )}
              <h1 className="text-xl font-bold">Portfolio Config</h1>
            </div>
            <div className="w-20" /> {/* Spacer for balance */}
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    currentStep === step.id
                      ? 'bg-white text-black'
                      : index < currentStepIndex
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step.id
                      ? 'bg-black text-white'
                      : index < currentStepIndex
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}>
                    {index < currentStepIndex ? <Check size={14} /> : index + 1}
                  </span>
                  <div className="text-left">
                    <div className="font-medium text-sm">{step.label}</div>
                    <div className={`text-xs ${currentStep === step.id ? 'text-neutral-600' : 'text-neutral-500'}`}>
                      {step.description}
                    </div>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight size={20} className="mx-2 text-neutral-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Persistent success banner */}
      {configSaved && (
        <div className="bg-green-600 text-white py-4 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check size={20} />
              <span className="font-medium">Config saved!</span>
              <span className="text-green-100">Return to your terminal. The setup script will continue.</span>
            </div>
            <button
              onClick={() => setConfigSaved(false)}
              className="text-green-100 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Step 1: Basics */}
        {currentStep === 'basics' && (
          <>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
              <div className="flex gap-3">
                <Sparkles size={24} className="text-neutral-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-bold text-lg mb-2">Let&apos;s start with the basics</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Only your <span className="text-white font-medium">name</span> is required.
                    Your coding agent can ask before researching any missing details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Column 1: Basic Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
                Basic Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-400">
                    GitHub
                  </label>
                  <input
                    type="text"
                    value={config.github}
                    onChange={(e) => setConfig({ ...config, github: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-400">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={config.linkedin}
                    onChange={(e) => setConfig({ ...config, linkedin: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    AI CLI Tool <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={config.cli}
                    onChange={(e) => setConfig({ ...config, cli: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  >
                    <option value="claude-code">Claude Code</option>
                    <option value="codex">OpenAI Codex</option>
                    <option value="gemini">Google Gemini CLI</option>
                    <option value="aider">Aider</option>
                    <option value="cursor">Cursor AI</option>
                    <option value="devin">Devin CLI</option>
                    <option value="antigravity">Antigravity</option>
                    <option value="other">Other / Custom</option>
                  </select>
                  <p className="text-xs text-neutral-500 mt-1.5">Which AI coding assistant will build your portfolio?</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
                Sections
              </h2>
              <p className="text-neutral-400 text-sm mb-4">
                Choose what to include on your portfolio.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'hero', label: 'Hero', desc: 'Main intro banner' },
                  { key: 'about', label: 'About', desc: 'Bio & background' },
                  { key: 'experience', label: 'Experience', desc: 'Work history' },
                  { key: 'projects', label: 'Projects', desc: 'Portfolio pieces' },
                  { key: 'skills', label: 'Skills', desc: 'Tech & abilities' },
                  { key: 'education', label: 'Education', desc: 'Schools & certs' },
                  { key: 'contact', label: 'Contact', desc: 'Get in touch' },
                  { key: 'blog', label: 'Blog', desc: 'Articles & posts' },
                  { key: 'testimonials', label: 'Testimonials', desc: 'Recommendations' },
                ].map(({ key, label, desc }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setConfig({
                      ...config,
                      sections: { ...config.sections, [key]: !config.sections[key as keyof typeof config.sections] }
                    })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      config.sections[key as keyof typeof config.sections]
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs opacity-60">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
                Content
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tone</label>
                  <select
                    value={config.content.tone}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        content: { ...config.content, tone: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="professional">Professional</option>
                    <option value="conversational">Conversational</option>
                    <option value="technical">Technical</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Focus</label>
                  <select
                    value={config.content.focus}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        content: { ...config.content, focus: e.target.value },
                      })
                    }
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="projects">Projects</option>
                    <option value="experience">Experience</option>
                    <option value="skills">Skills</option>
                    <option value="personality">Personality</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Personal Notes</label>
              <textarea
                value={config.notes}
                onChange={(e) => setConfig({ ...config, notes: e.target.value })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20 h-32 resize-none text-sm"
                placeholder="Tell the AI about yourself, your goals, design inspirations..."
              />
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
                Materials
              </h2>
              <p className="text-neutral-400 text-sm mb-4">
                Add local files for your coding agent to use. Maximum 10 MB each. Review them before pushing to a public repository.
              </p>

              <div className="space-y-3">
                {/* Documents upload */}
                <label className="flex items-center gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-lg cursor-pointer hover:border-neutral-600 transition-colors">
                  <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Upload Documents</div>
                    <div className="text-xs text-neutral-500">PDF, TXT, MD (resume, cover letter, etc.)</div>
                  </div>
                  <Upload size={16} className="text-neutral-500" />
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.md,.doc,.docx"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'documents')}
                  />
                </label>

                {/* Images upload */}
                <label className="flex items-center gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-lg cursor-pointer hover:border-neutral-600 transition-colors">
                  <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                    <ImageIcon size={20} className="text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Upload Images</div>
                    <div className="text-xs text-neutral-500">JPG, PNG, WebP (headshot, projects, etc.)</div>
                  </div>
                  <Upload size={16} className="text-neutral-500" />
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'images')}
                  />
                </label>
              </div>

              {/* Upload status */}
              {isUploading && (
                <div className="mt-3 text-sm text-neutral-400 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
                  Uploading...
                </div>
              )}

              {uploadError && (
                <p className="mt-3 text-sm text-red-400" role="alert">
                  {uploadError}
                </p>
              )}

              {/* Uploaded files list */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Uploaded</div>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.path}
                      className="flex items-center gap-2 p-2 bg-neutral-900/50 rounded-md text-sm"
                    >
                      <Check size={14} className="text-green-500" />
                      <span className="flex-1 truncate text-neutral-300">{file.name}</span>
                      <span className="text-xs text-neutral-600">{file.folder}</span>
                      <button
                        onClick={() => removeUploadedFile(file.path)}
                        type="button"
                        aria-label={`Delete ${file.name}`}
                        className="p-1 hover:bg-neutral-800 rounded transition-colors"
                      >
                        <X size={14} className="text-neutral-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
            </div>

            {/* Next Step Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setCurrentStep('design')}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
              >
                Next: Design
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Design */}
        {currentStep === 'design' && (
          <>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
              <div className="flex gap-3">
                <Sparkles size={24} className="text-neutral-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-bold text-lg mb-2">Choose your design direction</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Select websites that inspire you. The AI will synthesize their styles into something unique for you.
                  </p>
                </div>
              </div>
            </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
              Design Inspirations
            </h2>
            <p className="text-neutral-400 text-sm mb-6">
              Click websites whose design you admire. The AI will draw inspiration from their specific attributes (typography, spacing, color, layout).
            </p>

            {selectedExamples.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-blue-400 font-medium mb-2">
                  ✓ {selectedExamples.length} design inspiration{selectedExamples.length !== 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedExamples.map((url) => {
                    const example = ARCHETYPE_EXAMPLES.flatMap(a => a.examples).find(e => e.url === url);
                    return (
                      <span key={url} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        {example?.name || url}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-8">
              {ARCHETYPE_EXAMPLES.map((archetype) => (
                <div key={archetype.id} className="border-b border-neutral-800 pb-8 last:border-0">
                  <h3 className="font-bold text-lg mb-1">{archetype.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{archetype.description}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {archetype.examples.map((example) => (
                      <button
                        key={example.url}
                        onClick={() => toggleExample(example.url)}
                        className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          selectedExamples.includes(example.url)
                            ? 'border-white ring-2 ring-white/20'
                            : 'border-neutral-800 hover:border-neutral-600'
                        }`}
                      >
                        <Image
                          src={example.screenshot}
                          alt={example.name}
                          fill
                          sizes="(max-width: 768px) 33vw, 300px"
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to gradient if screenshot fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.classList.add('bg-gradient-to-br');
                              // Add each class from archetype.color separately
                              archetype.color.split(' ').forEach(cls => parent.classList.add(cls));
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{example.name}</span>
                        </div>
                        {selectedExamples.includes(example.url) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-black rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-800 pt-8 mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-6">
                Design Preferences
              </h2>
              <div className="space-y-6">
                {[
                  { key: 'creativity', label: 'Creativity', desc: 'Conservative → Experimental' },
                  { key: 'simplicity', label: 'Simplicity', desc: 'Dense → Minimal' },
                  { key: 'playfulness', label: 'Playfulness', desc: 'Professional → Playful' },
                  { key: 'animation', label: 'Animation', desc: 'Static → Motion-rich' },
                  { key: 'color_intensity', label: 'Color', desc: 'Monochrome → Vibrant' },
                ].map(({ key, label, desc }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-sm">{label}</div>
                        <div className="text-xs text-neutral-500">{desc}</div>
                      </div>
                      <div className="text-2xl font-bold tabular-nums w-12 text-right">
                        {config.design[key as keyof typeof config.design]}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={config.design[key as keyof typeof config.design]}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            design: {
                              ...config.design,
                              [key]: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-5
                          [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:transition-transform
                          [&::-webkit-slider-thumb]:hover:scale-110
                          [&::-moz-range-thumb]:w-5
                          [&::-moz-range-thumb]:h-5
                          [&::-moz-range-thumb]:bg-white
                          [&::-moz-range-thumb]:border-0
                          [&::-moz-range-thumb]:rounded-full
                          [&::-moz-range-thumb]:cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-neutral-600 mt-2">
                        <span>1</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('basics')}
                className="flex items-center gap-2 bg-neutral-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-700 transition-colors"
              >
                <ArrowLeft size={18} />
                Back: Basics
              </button>
              <button
                onClick={() => setCurrentStep('review')}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
              >
                Next: Review & Save
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Review */}
        {currentStep === 'review' && (
          <>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
              <div className="flex gap-3">
                <Check size={24} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-bold text-lg mb-2">Review & Save</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {hasExistingConfig
                      ? 'Review your changes and save to update your config.'
                      : 'Review your choices and save to generate your portfolio.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Basic Info</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Name</dt>
                    <dd>{config.name || <span className="text-neutral-600">Not set</span>}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Email</dt>
                    <dd>{config.email || <span className="text-neutral-600">Not set</span>}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">GitHub</dt>
                    <dd>{config.github || <span className="text-neutral-600">Not set</span>}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">AI Tool</dt>
                    <dd>{config.cli}</dd>
                  </div>
                </dl>
                <button
                  onClick={() => setCurrentStep('basics')}
                  className="mt-4 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  Edit basics →
                </button>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Design</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Inspirations</dt>
                    <dd>{selectedExamples.length} selected</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Creativity</dt>
                    <dd>{config.design.creativity}/10</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Simplicity</dt>
                    <dd>{config.design.simplicity}/10</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Animation</dt>
                    <dd>{config.design.animation}/10</dd>
                  </div>
                </dl>
                <button
                  onClick={() => setCurrentStep('design')}
                  className="mt-4 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  Edit design →
                </button>
              </div>
            </div>

            {/* Save Section */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold mb-2">
                {hasExistingConfig ? 'Save Changes' : 'Ready to build?'}
              </h3>
              <p className="text-neutral-400 mb-6">
                {hasExistingConfig
                  ? 'Your changes will be saved to profile.yaml'
                  : 'Save your profile, then return to the setup script to choose your coding agent'}
              </p>

          {/* Primary action - Save to Project */}
          <button
            onClick={async () => {
              if (!config.name.trim()) {
                setCurrentStep('basics');
                return;
              }
                  const yaml = generateProfileYaml(config, selectedExamples, ARCHETYPE_EXAMPLES);
              try {
                const res = await fetch('/api/save-config', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ yaml })
                });
                if (res.ok) {
                  setShowSuccessModal(true);
                } else {
                  alert('Failed to save. Try Download instead.');
                }
              } catch {
                alert('Failed to save. Try Download instead.');
              }
            }}
            disabled={!config.name.trim()}
            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-semibold text-lg flex items-center gap-3 mx-auto"
          >
            <Check size={24} />
            Save to Project
          </button>
          <p className="text-neutral-500 text-sm mt-3">
            This saves directly to your project folder
          </p>

          {/* Secondary action - Download */}
          <div className="mt-6 pt-6 border-t border-neutral-800">
            <button
              onClick={downloadConfig}
              className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
            >
              <Download size={16} />
              Or download file manually
            </button>
          </div>

              {showDownloadHelp && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-left">
                  <p className="text-amber-400 font-medium mb-2">Downloaded! Here&apos;s what to do next:</p>
                  <ol className="text-sm text-amber-200/80 space-y-1 list-decimal list-inside">
                    <li>Move <code className="bg-amber-500/20 px-1 rounded">profile.yaml</code> to your Persona project folder</li>
                    <li>Run <code className="bg-amber-500/20 px-1 rounded">./setup.sh</code> in that folder</li>
                    <li>It will automatically detect and use your downloaded config</li>
                  </ol>
                </div>
              )}

            </div>

            {/* Back Button */}
            <div className="flex justify-start mt-8">
              <button
                onClick={() => setCurrentStep('design')}
                className="flex items-center gap-2 bg-neutral-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-700 transition-colors"
              >
                <ArrowLeft size={18} />
                Back: Design
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
