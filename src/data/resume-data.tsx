import ConsultlyLogo from "../images/logos/consultly.svg";
import AmbitLogo from "../images/logos/ambit.png";
import BarepapersLogo from "../images/logos/barepapers.svg";
import BimLogo from "../images/logos/bim.png";
import CDGOLogo from "../images/logos/cdgo.png";
import ClevertechLogo from "../images/logos/clevertech.png";
import EvercastLogo from "../images/logos/evercast.svg";
import Howdy from "../images/logos/howdy.png";
import TouhiMeLogo from "../images/logos/touhi.svg"
import JojoMobileLogo from "../images/logos/jojomobile.png";
import MonitoLogo from "../images/logos/monito.svg";
import MobileVikingsLogo from "../images/logos/mv.png";
import NSNLogo from "../images/logos/nsn.svg";
import ParabolLogo from "../images/logos/parabol.svg";
import TastyCloudLogo from "../images/logos/tastycloud.png";
import YearProgressLogo from "../images/logos/yearprogress.svg";
import Minimal from "../images/logos/minimal.svg";
import { GitHubIcon } from "../components/icons/GitHubIcon";
import { LinkedInIcon } from "../components/icons/LinkedInIcon";
import { XIcon } from "../components/icons/XIcon";

export const RESUME_DATA = {
  name: "Touhidul Alam",
  initials: "TA",
  role: "Senior Solution Engineer",
  company: "deepset",
  specialties: "GenAI & NLP Specialist",
  location: "Munich, Germany",
  timezone: "CET",
  locationLink: "https://www.google.com/maps/place/Munich,+Germany",
  summary:
    "As a Senior Solution Engineer / Architect at deepset, I work hands-on with enterprise customers as a \
  forward deployed engineer on the Haystack Enterprise Platform, helping them design, build, and ship \
  production-grade Generative AI applications. Previously at \
  Accenture, I led technical delivery for on-prem/sovereign AI initiatives, drove client workshops and \
  hackathons to validate GenAI use cases, and mentored engineers on architecture decisions balancing \
  security, compliance, and scale.",
  avatarUrl: "/touhi.jpg",
  personalWebsiteUrl: "https://touhi.me",
  contact: {
    email: "tapos.alam@gmail.com",
    tel: "",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/touhi99",
        icon: GitHubIcon,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/touhi/",
        icon: LinkedInIcon,
      },
    ],
  },
  education: [
    {
      school: "University of Stuttgart",
      degree: "Master's Degree in Computational Linguistics",
      start: "2017",
      end: "2020",
    },
    {
      school: "Islamic University of Technology",
      degree: "Bachelor's Degree in Computer Science and Engineering",
      start: "2011",
      end: "2015",
    }
  ],
  work: [
    {
      company: "deepset",
      link: "https://www.deepset.ai",
      badges: ["Munich"],
      title: "Senior Solution Engineer",
      logo: ParabolLogo,
      start: "2026",
      end: "Present",
      description:
        "Forward deployed engineer for the Haystack Enterprise Platform, partnering with enterprise customers to design, build, and ship production-grade GenAI applications.",
    },
    {
      company: "Accenture",
      link: "https://accenture.com",
      badges: ["Munich", "Frankfurt"],
      title: "GenAI Solution Architect",
      logo: ParabolLogo,
      start: "2020",
      end: "2026",
      description:
        "Tech lead for enterprise on-prem and sovereign AI delivery, owning solution architecture and platform engineering.",
      highlights: [
        "Defined a scalable RAG reference architecture and rollout standards.",
        "Introduced evaluation and observability for LLM applications, tracking quality, latency, and cost in production.",
        "Shipped an NLP recommendation system, improving content relevance and user engagement.",
        "Led client discovery workshops and internal hackathons, driving PoCs/MVPs to validate AI use cases.",
        "Mentored engineers and guided architecture decisions balancing security, compliance, and scale.",
      ],
    },
    {
      company: "Fraunhofer IIS",
      link: "https://www.iis.fraunhofer.de/",
      badges: ["Erlangen"],
      title: "Research Assistant",
      logo: ClevertechLogo,
      start: "2019",
      end: "2020",
      description:
        "Built and integrated a deep-learning temporal tagger for voice assistants as part of my master's thesis.",
    },
    {
      company: "Accenture",
      link: "https://accenture.com",
      badges: ["Munich"],
      title: "Student Intern",
      logo: ParabolLogo,
      start: "2018",
      end: "2019",
      description:
        "Built a 3D holographic chatbot that increased user engagement through interactive experiences.",
    },
    {
      company: "Smart Digital GmbH",
      link: "https://www.smart-digital.de/",
      badges: ["Gerlingen"],
      title: "Student Assistant",
      logo: NSNLogo,
      start: "2017",
      end: "2018",
      description:
        "Built a real-time anomaly detection system on time-series data, alerting on operational discrepancies to improve reliability.",
    },
    {
      company: "Panacea Live Limited",
      link: "https://panacea.live/",
      badges: ["Dhaka"],
      title: "Backend Developer",
      logo: NSNLogo,
      start: "2016",
      end: "2017",
      description:
        "Built the Panacea web platform and explored fraud-detection use cases for the business.",
    },
  ],
  skillGroups: [
    {
      title: "GenAI & NLP",
      skills: [
        "LLM",
        "RAG",
        "Fine-tuning",
        "Multi-agent Systems",
        "LLM Evaluation",
        "Haystack",
        "LangChain",
        "Langfuse",
      ],
    },
    {
      title: "Engineering & Data",
      skills: [
        "Python",
        "FastAPI",
        "SQL",
        "Cypher",
        "Vector DB",
        "Graph DB",
      ],
    },
    {
      title: "ML & Platform",
      skills: [
        "PyTorch",
        "Azure",
        "AWS",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "MLOps",
      ],
    },
  ],
  projects: [
    {
      title: "A Voice-based LLM Crew Agent",
      featured: true,
      techStack: ["Python", "OpenAI", "LangChain", "CrewAI", "Streamlit", "Elevenlabs", "Crawler"],
      description:
        "A text/voice-based multi-agent system with RAG in specialized domain",
      logo: BarepapersLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/tldr-ai-news-crew",
      },
    },
    {
      title: "LLM Multi-Agent for Search",
      featured: true,
      techStack: ["Python", "OpenAI", "LangChain", "LangGraph", "Streamlit"],
      description:
        "Simple multi-agent system with external search API to search, analyze, generate content",
      logo: BarepapersLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/genai-job-agents",
      },
    },
    {
      title: "Knowledge Graph LLM Agent",
      featured: true,
      techStack: ["Python", "OpenAI", "Neo4j", "LangChain", "Streamlit"],
      description:
        "A knowledge-graph based LLM agent to perform search with different Cypher query",
      logo: BarepapersLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/msf-agents",
      },
    },
    {
      title: "Tags generation",
      featured: true,
      techStack: ["Python", "LLM", "Mistral-7B"],
      description:
        "Simple prototyping of generating tags from forums with Open-source LLM",
      logo: BarepapersLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/tags-generation",
      },
    },
    {
      title: "DA-Time",
      featured: true,
      techStack: [
        "Python",
        "BERT",
        "Keras",
      ],
      description: "A domain-adapted temporal expression recognizer for the English Voice Assistant domain", 
      logo: ConsultlyLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/DA-Time",
      },
    },
    {
      title: "AI Music Generation",
      featured: true,
      techStack: [
        "Python",
        "Language Modeling",
        "PyTorch",
      ],
      description: "A simple language modeling project to generate music trained by MIDI files pattern", 
      logo: ConsultlyLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/Generate-music",
      },
    },
    {
      title: "Dialogue Act Classification",
      techStack: ["Python", "Keras", "Ensemble model"],
      description:
        "A Simple Dialogue Act Classification project using Keras from speech and text with an Ensemble model",
      logo: MonitoLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/DL_Dialogue_act_classification",
      },
    },
    {
      title: "Emotion Classification from Twitter text and image",
      techStack: ["Python", "Perceptron"],
      description:
        "Document Level Emotion Classification from Twitter Text and Images",
      logo: TouhiMeLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/Teamlab_emotion_detection",
      },
    },
    {
      title: "Minimalistic Language Modeling",
      techStack: ["Python"],
      description:
        "A Simple n-gram language modeling from scratch to understand the basic concept of language modeling",
      logo: Minimal,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/N-gram-Language-model",
      },
    },
  ],
  publications: [
    {
      title: "Enhancing Pipeline-Based Conversational Agents with Large Language Models",
      techStack: ["Python", "GPT-4"],
      description:
        "This study examines enhancing pipeline-based conversational agents with GPT-4, focusing on a hybrid approach that combines LLM strengths with existing system safeguards.        ",
      logo: BarepapersLogo,
      link: {
        label: "arXiv",
        href: "https://arxiv.org/pdf/2309.03748.pdf",
      },
    },
    {
      title: "New Domain, Major Effort? How Much Data is Necessary to Adapt a Temporal Tagger to the Voice Assistant Domain",
      techStack: [
        "Python",
        "BERT",
        "Keras",
      ],
      description: "The study introduces DA-Time, a hybrid temporal tagger for voice assistants, \
      proving that minimal in-domain data via transfer learning significantly enhances temporal expression recognition in diverse domains.", 
      logo: ConsultlyLogo,
      link: {
        label: "aclweb",
        href: "https://aclanthology.org/2021.iwcs-1.14/",
      },
    },
    {
      title: "PÂTÉ: A Corpus of Temporal Expressions for the In-car Voice Assistant Domain",
      techStack: ["Python"],
      description:
        "This study introduces a crowdsourcing method to collect and annotate natural-language commands with temporal expressions for AI voice assistants, \
        differing from typical domains, to enhance their interaction with applications.",
      logo: MonitoLogo,
      link: {
        label: "aclweb",
        href: "https://aclanthology.org/2020.lrec-1.66.pdf",
      },
    },
  ],
} as const;
