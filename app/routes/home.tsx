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
  //className="bg-[url('/images/blurry-gradient-haikei.svg')] bg-cover"
  return (
    <main>
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Application & Resume Ratings</h1>
          <h2>Review your submission and check AI-powered feedback</h2>
        </div>
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
