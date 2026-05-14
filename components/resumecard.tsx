import React, { useEffect, useState } from "react";
import { Link } from "react-router";

import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { fs } = usePuterStore();

  const [resumeUrl, setResumeUrl] = useState("");

  const title = resume.companyName || "Resume";
  const subtitle = resume.jobTitle;

  useEffect(() => {
    let objectUrl: string;

    const loadResume = async () => {
      const blob = await fs.read(resume.imagePath);

      if (!blob) return;

      objectUrl = URL.createObjectURL(blob);
      setResumeUrl(objectUrl);
    };

    loadResume();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [resume.imagePath, fs]);

  return (
    <Link
      to={`/resume/${resume.id}`}
      className="resume-card group animate-in fade-in duration-700 border-2 shadow-2xl"
    >
      {/* Header */}
      <div className="resume-card-header">
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-2xl font-bold text-black">{title}</h2>

          {subtitle && (
            <p className="mt-1 break-words text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={resume.feedback.overallScore} />
        </div>
      </div>

      {/* Resume Preview */}
      {resumeUrl && (
        <div className="border-2 mt-2 overflow-hidden rounded-2xl animate-in fade-in duration-1000">
          <img
            src={resumeUrl}
            alt="Resume Preview"
            className="h-[350px] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] max-sm:h-[220px]"
          />
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
