import ConsultlyLogo from "../images/logos/consultly.svg";
import AmbitLogo from "../images/logos/ambit.png";
import BarepapersLogo from "../images/logos/barepapers.svg";
import BimLogo from "../images/logos/bim.png";
import CDGOLogo from "../images/logos/cdgo.png";
import ClevertechLogo from "../images/logos/clevertech.png";
import EvercastLogo from "../images/logos/evercast.svg";
import Howdy from "../images/logos/howdy.png";
import JarockiMeLogo from "../images/logos/jarocki.svg";
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
  initials: "Touhi",
  location: "Munich, Germany, CET",
  locationLink: "https://www.google.com/maps/place/Munich",
  about:
    "NLP/AI Engineer, currently heavily focusing on LLM/Generative AI",
  summary:
    "As an NLP Specialist, I transform business challenges into data-driven solutions. My expertise encompasses NLP, \
    ML, and LLMs. At Accenture, I am dedicated to developing Generative AI architecture that deliver innovative solutions",
  avatarUrl: "https://media.licdn.com/dms/image/C4D03AQEpHNZm7I3p0A/profile-displayphoto-shrink_800_800/0/1566726532818?e=1715817600&v=beta&t=vJCKdHTPbDDWsMGX-hBZm_AGIlb82xmAJI_W4RJGYjE",
  personalWebsiteUrl: "https://touhi.me",
  contact: {
    email: "tapos.alam@gmail.com",
    tel: "+4915156037142",
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
      company: "Accenture",
      link: "https://accenture.com",
      badges: ["Munich", "Frankfurt"],
      title: "NLP Specialist",
      logo: ParabolLogo,
      start: "2020",
      end: "Present",
      description:"Facilitating LLM-based applications (RAG, Agents, Fine-tuning) \
      Developed an NLP recommendation system on production. Developed an NLP backend for semantic search enhancement. \
      Leading as a Generative AI expert, driving backend team, client PoC/workshops, and innovative hackathons for GenAI tech demonstrations. "
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
        "Developing and integrating a Deep learning based temporal tagger for Voice Assistants as a part of Master thesis.",
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
        "Developed a 3D holographic chatbot, increasing user engagement through interactive experiences.",
    },
    {
      company: "Smart Digital GmbH",
      link: "https://www.smart-digital.de/",
      badges: ["Gerlingen"],
      title: "Student Assistant",
      logo: NSNLogo,
      start: "2017",
      end: "2018",
      description: "Implemented a real-time anomaly detection system using time-series data to monitor and alert on\
      operational discrepancies, enhancing system reliability ",
    },
    {
      company: "Panacea Live Limited",
      link: "https://panacea.live/",
      badges: ["Dhaka"],
      title: "Backend Developer",
      logo: NSNLogo,
      start: "2016",
      end: "2017",
      description: "Developed the Panacea Web system. Explored potential business use cases for fraud detection technology.      ",
    },
  ],
  skills: [
    "Python",
    "NLP",
    "ML",
    "LLM",
    "Langchain",
    "Haystack",
    "Vector DB",
    "Javascript",
    "Pytorch",
    "SQL",
    "Cypher",
    "Azure",
    "AWS",
    "MLOps",
  ],
  projects: [
    {
      title: "LLM Multi-Agent",
      techStack: ["Python", "OpenAI", "Langchain", "Langgraph", "Streamlit"],
      description:
        "Simple multi-agent system with external search api to search, analyze, generate content",
      logo: BarepapersLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/genai-job-agents",
      },
    },
    {
      title: "Knowledge Graph LLM Agent",
      techStack: ["Python", "OpenAI", "Neo4J", "Langchain", "Streamlit"],
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
      techStack: [
        "Python",
        "Bert",
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
      techStack: [
        "Python",
        "Language Modeling",
        "Pytorch",
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
      logo: JarockiMeLogo,
      link: {
        label: "Github",
        href: "https://github.com/touhi99/DL_Dialogue_act_classification",
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
  Publications: [
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
