import type { Route } from "./+types/home";
import Navbar from "../../components/navbar";
import ResumeCard from "../../components/resumecard";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NeuraHire" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

const stats = [
  { value: "94%", label: "Match Accuracy" },
  { value: "2.3s", label: "Avg. Feedback Time" },
  { value: "10k+", label: "Resumes Analyzed" },
];

const features = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3"
        />
      </svg>
    ),
    title: "AI Scoring",
    desc: "Precise 0–100 score based on role fit, clarity, and keyword alignment.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    title: "Instant Feedback",
    desc: "Actionable suggestions delivered in seconds — not hours.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664"
        />
      </svg>
    ),
    title: "Track Applications",
    desc: "All your job applications and resume versions in one place.",
  },
];

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume*", true)) as KVItem[];

      const seen = new Set<string>();
      const parsedResumes = resumes
        ?.map((r) => JSON.parse(r.value) as Resume)
        .filter((r) => {
          if (!r.id || !r.feedback || seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        });

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, [kv]);

  return (
    <main>
      <Navbar />

      <section className="main-section">
        {/* Hero heading — unchanged */}
        <div className="page-heading py-16">
          <h1>Track your Application & Resume Ratings</h1>
          <h2>Review your submission and check AI-powered feedback</h2>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap justify-center gap-4 px-4 mb-12 -mt-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center px-8 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm min-w-[120px]"
            >
              <span className="text-2xl font-bold text-violet-600">
                {s.value}
              </span>
              <span className="text-xs text-gray-400 mt-0.5 tracking-wide">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Feature cards + empty state — only when no resumes */}
        {!loadingResumes && resumes.length === 0 && (
          <div className="max-w-3xl mx-auto px-4 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-200 p-5"
                >
                  <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center mb-3 group-hover:bg-violet-100 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Empty state nudge */}
            <div className="flex flex-col items-center gap-3 text-center py-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-400 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-400">
                No resumes yet. Upload one to get started.
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
              >
                Upload Resume
              </button>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loadingResumes && (
          <div className="max-w-3xl mx-auto px-4 mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-36 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Resume cards — completely unchanged */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
