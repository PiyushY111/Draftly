export type Template = {
    id: string;
    label: string;
    imageUrl: string;
    initialContent: string;
};

export const TEMPLATES: Template[] = [
    {
        id: "blank",
        label: "Blank document",
        imageUrl: "galleries/blank-document.png",
        initialContent: "<p></p>",
    },
    {
        id: "software-proposal",
        label: "Software development proposal",
        imageUrl: "galleries/software-proposal.png",
        initialContent: `
        <h1>Software Development Proposal</h1>
        <p><strong>Prepared by:</strong> [Your Name]</p>
        <h2>Project Overview</h2>
        <p>Brief description of the software project, including its goals, target users, and expected impact.</p>
        <h2>Scope of Work</h2>
        <ul>
          <li>Requirement analysis</li>
          <li>Design and architecture</li>
          <li>Development and testing</li>
          <li>Deployment and maintenance</li>
        </ul>
        <h2>Timeline</h2>
        <p>Estimated delivery timeline with milestones.</p>
      `,
    },
    {
        id: "project-proposal",
        label: "Project proposal",
        imageUrl: "galleries/project-proposal.png",
        initialContent: `
        <h1>Project Proposal</h1>
        <p><strong>Proposed by:</strong> [Your Name]</p>
        <h2>Objective</h2>
        <p>State the primary objective of the project.</p>
        <h2>Background</h2>
        <p>Provide context or background information that supports the need for this project.</p>
        <h2>Implementation Plan</h2>
        <p>Describe the phases, deliverables, and resources required.</p>
      `,
    },
    {
        id: "business-letter",
        label: "Business letter",
        imageUrl: "galleries/business-letter.png",
        initialContent: `
        <p>Your Name<br>Your Address<br>City, State ZIP Code<br>Email Address</p>
        <p>Date</p>
        <p>Recipient's Name<br>Recipient's Title<br>Company Name<br>Company Address</p>
        <p>Dear [Recipient's Name],</p>
        <p>I am writing to [state your purpose for writing the letter].</p>
        <p>[Body of the letter]</p>
        <p>Sincerely,<br>Your Name</p>
      `,
    },
    {
        id: "resume",
        label: "Resume",
        imageUrl: "galleries/resume.png",
        initialContent: `
        <h1>Your Name</h1>
        <p>Email: your.email@example.com | Phone: (123) 456-7890 | LinkedIn: yourprofile</p>
        <h2>Summary</h2>
        <p>Brief summary of your qualifications and career goals.</p>
        <h2>Experience</h2>
        <p><strong>Job Title</strong> – Company Name<br>Dates of Employment</p>
        <ul>
          <li>Key responsibility or achievement</li>
          <li>Key responsibility or achievement</li>
        </ul>
        <h2>Education</h2>
        <p>Degree – University Name, Graduation Year</p>
      `,
    },
    {
        id: "cover-letter",
        label: "Cover letter",
        imageUrl: "galleries/cover-letter.png",
        initialContent: `
        <p>Your Name<br>Your Address<br>Email Address<br>Phone Number</p>
        <p>Date</p>
        <p>Hiring Manager's Name<br>Company Name<br>Company Address</p>
        <p>Dear [Hiring Manager's Name],</p>
        <p>I am excited to apply for the [Job Title] position at [Company Name].</p>
        <p>[Body of the letter describing your qualifications and fit for the role]</p>
        <p>Thank you for considering my application. I look forward to hearing from you.</p>
        <p>Sincerely,<br>Your Name</p>
      `,
    },
    {
        id: "report",
        label: "Report",
        imageUrl: "galleries/report.png",
        initialContent: `
        <h1>Report Title</h1>
        <p><strong>Author:</strong> Your Name</p>
        <h2>Introduction</h2>
        <p>Provide an overview of the report topic and objectives.</p>
        <h2>Methodology</h2>
        <p>Describe the methods used to collect and analyze data.</p>
        <h2>Findings</h2>
        <p>Summarize the key findings of your research or analysis.</p>
        <h2>Conclusion</h2>
        <p>Present final thoughts, insights, or recommendations.</p>
      `,
    },
];
