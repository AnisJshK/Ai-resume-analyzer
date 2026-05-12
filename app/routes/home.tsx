import type { Route } from "./+types/home";
import Navbar from "~/Components/navbar";
import {resumes} from "../../constants";
import ResumeCard from "../Components/resumecard";
import { useEffect } from "react";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NeuraHire" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar></Navbar>

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Application & Resume Ratings</h1>
          <h2>Review your submission and check AI-powered feedback</h2>
        </div>
        {resumes.length > 0 && (
          <div className={"resumes-section"}>
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
