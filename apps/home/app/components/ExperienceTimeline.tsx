"use client";

import { useState } from "react";
import styles from "./ExperienceTimeline.module.css";

interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  details: string[];
}

const EXPERIENCES: Experience[] = [
  {
    company: "Canterr IT Services (Wayfair)",
    role: "Senior Software Engineer",
    duration: "May 2023 – Present",
    location: "Remote (India)",
    details: [
      "Built scalable micro-frontend architecture using Module Federation, enabling independent deployment across teams",
      "Migrated global navigation system to Contentful, enabling dynamic updates without code deployments",
      "Contributed to enterprise design system and shared component library used across multiple teams",
      "Improved developer productivity by standardizing reusable UI patterns and components",
      "Worked on platform-level frontend infrastructure supporting large-scale applications",
    ],
  },
  {
    company: "Anar App Pvt Ltd",
    role: "Software Engineer",
    duration: "Apr 2022 – Aug 2022",
    location: "Remote (India)",
    details: [
      "Led adoption of TypeScript and modern React patterns, improving code quality and maintainability",
      "Built dynamic calling feature used by 100K+ users",
      "Established code review guidelines and PR standards, improving team-wide code quality",
      "Introduced scalable frontend architecture practices for faster feature development",
    ],
  },
  {
    company: "GeekyAnts",
    role: "Software Engineer",
    duration: "Jul 2020 – Mar 2022",
    location: "Bangalore (Remote)",
    details: [
      "Core contributor to NativeBase 3.0, building cross-platform UI components used by 50K+ developers",
      "Designed and implemented reusable components, hooks, and utilities for large-scale usage",
      "Led development of the NativeBase KitchenSink app to showcase component capabilities",
      "Contributed to documentation system and automation workflows",
      "Actively engaged with developer community via GitHub and Discord",
    ],
  },
  {
    company: "Apostek Software LLP",
    role: "Associate UI Developer",
    duration: "Sep 2018 – Jun 2020",
    location: "Bangalore, India",
    details: [
      "Migrated legacy monolithic application to modern React architecture",
      "Built new frontend modules and improved performance using React Hooks",
      "Enhanced UI consistency and maintainability across multiple product areas",
      "Worked closely with backend teams to deliver scalable features",
    ],
  },
  {
    company: "Innolat Technologies Pvt Ltd",
    role: "Software Developer (Intern)",
    duration: "Jun 2014 – Mar 2018",
    location: "Raipur, India",
    details: [
      "Developed UI features and resolved bugs across multiple modules",
      "Assisted in product design through wireframing and implementation",
      "Mentored students and contributed to internal projects",
      "Secured 1st runner-up position in state-level hackathon",
    ],
  },
];

export function ExperienceTimeline() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="experience" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          <span className="gradient-text">Experience</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          My professional journey across product companies and open-source
        </p>

        <div className={styles.timeline}>
          <div className={styles.timelineLine} />

          {EXPERIENCES.map((exp, index) => {
            const isExpanded = expandedIndex === index;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className={`${styles.timelineItem} ${isLeft ? styles.left : styles.right}`}
                onMouseEnter={() => setExpandedIndex(index)}
                onMouseLeave={() => setExpandedIndex(null)}
              >
                {/* Node on the center line */}
                <div className={styles.node}>
                  <div className={styles.nodeDot} />
                </div>

                {/* Card */}
                <button
                  className={`${styles.card} ${isExpanded ? styles.cardExpanded : ""}`}
                  onClick={() => toggleExpand(index)}
                  aria-expanded={isExpanded}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.duration}>{exp.duration}</span>
                    <h3 className={styles.role}>{exp.role}</h3>
                    <p className={styles.company}>
                      {exp.company}
                      <span className={styles.location}>
                        {" "}
                        · {exp.location}
                      </span>
                    </p>
                  </div>

                  <div
                    className={`${styles.cardDetails} ${isExpanded ? styles.detailsVisible : ""}`}
                  >
                    <ul className={styles.detailsList}>
                      {exp.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.expandHint}>
                    <svg
                      className={`${styles.expandIcon} ${isExpanded ? styles.expandIconRotated : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
