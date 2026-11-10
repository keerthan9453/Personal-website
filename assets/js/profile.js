/*
 * All of the site's content lives in this file.
 * Edit the text here and the page re-renders itself; no build step needed.
 *
 * Conventions
 *  - Wrap words in **double asterisks** to make them bold.
 *  - Dates are "YYYY-MM". Use end: null for a role that is still going.
 *  - Every entry in a `tech` / `stack` list that matches a skill name below
 *    becomes clickable and powers the "where did I use this?" highlight.
 */
window.PROFILE = {
  name: "Keerthan Devera",
  location: "Toronto, ON",
  timezone: "America/Toronto",

  // Shown in the status pill in the hero. Set to "" to hide it.
  availability: "Open to software engineering roles",

  email: "deverakeerthan3030@gmail.com",
  links: {
    github: "https://github.com/keerthan9453",
    linkedin: "https://www.linkedin.com/in/Keerthan-Devera",
  },
  resume: {
    href: "assets/pdf/Keerthan_Software-16.pdf",
    downloadName: "Keerthan_Devera_Resume.pdf",
  },

  // Live repository list. Forks and archived repos are skipped automatically.
  github: {
    user: "keerthan9453",
    siteRepo: "personal-website", // used for the "site last updated" line
    exclude: ["personal-website"],
    limit: 6,
  },

  // The hero "test run". Each line plays in order.
  run: {
    suite: "recruiter-check",
    lines: [
      { label: "Cloud Engineering Intern", text: "Building cloud infrastructure and CI/CD pipelines with AWS, GCP and Kubernetes." },
      { label: "Quality engineering", text: "Test automation at Tangerine (Scotiabank) with WebdriverIO, Selenium, Appium, Karate and Rest Assured." },
      { label: "Backend", text: "Java Spring Boot services on SQL databases, plus Python tooling for reporting and dashboards." },
      { label: "Cloud and CI/CD", text: "GCP and Kubernetes test environments, Docker, Jenkins pipelines, and AWS EC2, Lambda and S3." },
      { label: "Blockchain", text: "Solidity smart contracts and dApps with Web3.js." },
      { label: "Full stack", text: "React, Node.js, Express, PostgreSQL and MongoDB. Hack the Valley winner." },
    ],
  },

  experience: [
    {
      role: "Cloud Engineering intern, COPS Team",
      org: "Scotiabank",
      place: "Toronto, ON",
      start: "2026-04",
      end: "2026-08",
      bullets: [
        "Building cloud infrastructure and CI/CD pipelines with **AWS**, **GCP** and **Kubernetes**.",
        "Automating provisioning of **EC2 instances, RDS backups and S3 lifecycle rules**, with **AWS Lambda** for automation.",
        "Implementing **Route 53 public/private zones** with health checks to simulate DNS failover and routing policies.",
      ],
      tech: ["AWS", "GCP", "Kubernetes", "Docker", "Jenkins"],
    },
    {
      role: "Technology Intern, QE Tools Team",
      org: "Tangerine (Scotiabank)",
      place: "Toronto, ON",
      start: "2025-09",
      end: "2025-12",
      bullets: [
        "Implemented end-to-end test automation using **WebdriverIO**, **Selenium** and **Appium** for UI testing in **TypeScript**, and **Karate** / **Rest Assured** for API automation in **Java**.",
        "Built and maintained fulfillment and backend test services using **Java Spring Boot** with **SQL** databases, and used **Python** for reporting, dashboards and internal tooling.",
        "Adopted **GCP** with **GKE / Kubernetes** for cloud-based test environments, containerized workflows with **Docker**, and managed pipelines through **Jenkins** for CI/CD execution.",
      ],
      tech: ["WebdriverIO", "Selenium", "Appium", "TypeScript", "Karate", "Rest Assured", "Java", "Spring Boot", "SQL", "Python", "GCP", "Kubernetes", "Docker", "Jenkins"],
    },
    {
      role: "Blockchain Developer Intern",
      org: "BlockseBlock",
      place: "Hyderabad, India",
      start: "2025-06",
      end: "2025-08",
      bullets: [
        "Worked on **smart contract development** using Solidity for Ethereum-based projects.",
        "Built and tested **decentralized applications (dApps)** to demonstrate blockchain use cases.",
        "Used tools like **Web3.js and Git** to integrate blockchain layers with web applications.",
      ],
      tech: ["Solidity", "Web3.js", "Git"],
    },
    {
      role: "STEM Education Specialist",
      org: "York University, Science Engagement Program",
      place: "Toronto, ON",
      start: "2023-05",
      end: "2024-08",
      bullets: [
        "Led collaborative engineering projects and simulations using **Python** and **MATLAB**, modeling structural integrity and applying real-world engineering principles.",
        "Designed and delivered curriculum for grades 7 to 12 covering **full stack web development** (HTML5, CSS3, JavaScript), **object-oriented programming in Java and Python**, and foundational **C/C#** with Arduino.",
      ],
      tech: ["Python", "Java", "JavaScript", "HTML/CSS"],
    },
  ],

  // Add `links: [{ label: "Source", href: "https://github.com/..." }]` to any
  // project once you want a "Source" or "Live demo" link to appear.
  projects: [
    {
      name: "Chat-With-Your-Document-RAG",
      categories: ["Full stack", "AI", "RAG"],
      stack: ["RAG", "Python", "ChromaDB", "Jupyter Notebook"],
      bullets: [
        "Built a **Retrieval-Augmented Generation (RAG)** system that allows users to chat with their documents using **Python** and **ChromaDB**.",
        "Implemented a **Jupyter Notebook** interface for users to upload documents and interact with the RAG system.",
        "Utilized **ChromaDB** with **Reciprocal Rank Fusion** (RRF)for efficient document retrieval and **Python** for natural language processing and response generation.",
        "**Cohere Rerank** to improve relevant passage ranking from 3rd to 2nd in a retrieval test"
      ],
      links: ["https://github.com/keerthan9453/Chat-With-Your-Documents-RAG-"]

    },
    {
      name: "Eco-Map",
      award: "Hack the Valley winner",
      categories: ["Full stack", "AI"],
      stack: ["Node.js", "Express", "MongoDB", "Postman", "GPT API", "Google Maps API"],
      bullets: [
        "Built a real-time customer support chatbot using the **GPT API with Google Maps integration**.",
        "Designed and implemented the backend with **Node.js and Express**, managing user queries through **MongoDB**.",
        "Provided optimized routes and used **Postman** to test API endpoints.",
      ],
      links: ["https://github.com/keerthan9453/eco-friendly-planner"],
    },
    {
      name: "Decentrify",
      award: "UofTHacks 13",
      categories: ["Full stack", "Distributed Systems", "Machine Learning", "Cloud"],
      stack: [
        "Python",
        "FastAPI",
        "PyTorch",
        "RabbitMQ",
        "MongoDB",
        "AWS S3",
        "Boto3",
        "Docker",
        "JWT",
        "Pandas"
      ],
      bullets: [
        "Developed a **peer-to-peer distributed machine learning platform** enabling multiple worker nodes to collaboratively train neural networks across distributed systems.",
        "Engineered a **FastAPI backend with RabbitMQ messaging**, coordinating distributed workers through asynchronous commands, training events, and real-time heartbeat monitoring.",
        "Integrated **AWS S3 and MongoDB** to manage dataset distribution, training sessions, worker states, and aggregated model performance metrics.",
        "Implemented configurable **PyTorch neural network training** with adjustable epochs, batch sizes, learning rates, and automatic GPU detection.",
        "Built **JWT-based authentication and secure communication** using password hashing and TLS/SSL for coordinating distributed training sessions."
      ],
      links: [
        "https://github.com/keerthan9453/Decentrify"
      ],

    },
    {
      name: "YorkU Blockchain Blog",
      categories: ["Full stack", "Blockchain"],
      stack: ["TypeScript", "React", "PostgreSQL", "Tailwind", "Figma"],
      bullets: [
        "Designed and deployed a blog platform for York University's Blockchain Association, delivering newsletters and blockchain updates.",
        "Implemented server-side rendering with **React DOM**, styled with **Tailwind**, and connected it to a **PostgreSQL** database.",
        "Collaborated with student contributors to publish technical posts and community updates.",
      ],
      links: [],
    },
    {
      name: "AWS Cloud Infrastructure",
      categories: ["Cloud"],
      stack: ["AWS", "EC2", "Lambda", "RDS", "S3", "Route 53", "CloudWatch", "IAM"],
      bullets: [
        "Building a fully functional cloud infrastructure stack on **AWS**, including networking, compute and storage layers for a mock application deployment.",
        "Automated provisioning of **EC2 instances, RDS backups and S3 lifecycle rules, with AWS Lambda for automation**.",
        "Planned next: **Route 53 public/private zones** with health checks to simulate DNS failover and routing policies.",
      ],
      links: [],
    },
  ],

  skills: [
    { group: "Languages", items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "HTML/CSS"] },
    { group: "Frameworks and libraries", items: ["React", "Node.js", "Express", "Spring Boot", "JUnit"] },
    { group: "Test automation", items: ["WebdriverIO", "Selenium", "Appium", "Karate", "Rest Assured", "Postman", "GitHub Actions"] },
    { group: "Cloud and DevOps", items: ["GCP", "Kubernetes", "Docker", "AWS", "Jenkins", "Git"] },
    { group: "Databases", items: ["MongoDB", "PostgreSQL", "SQL Server"] },
    { group: "Blockchain", items: ["Solidity", "Web3.js"] },
    { group: "Everyday tools", items: ["VS Code", "IntelliJ", "PyCharm", "Excel", "PowerPoint", "Word", "SharePoint"] },
  ],

  education: {
    school: "York University",
    degree: "Honours Bachelor of Science, Computer Science",
    place: "Toronto, ON",
    start: "2022-09",
    end: "2026-08",
    roles: [
      { title: "Python Developer", org: "YUBlueprint" },
      { title: "Blockchain Developer", org: "Blockchain @ Lassonde" },
      { title: "Instructor", org: "Science Engagement Programs (SEP)" },
    ],
  },
};
