import { Domain } from '@/types/domain';
import rawDomains from '../../data/domains.json';

export const domains: Domain[] = rawDomains as unknown as Domain[];

export function getAllDomains(): Domain[] {
  return domains;
}

export function getDomainBySlug(slug: string): Domain | undefined {
  return domains.find((d) => d.slug.toLowerCase() === slug.toLowerCase() || d.id.toLowerCase() === slug.toLowerCase());
}

export function getDomainById(id: string): Domain | undefined {
  return domains.find((d) => d.id.toLowerCase() === id.toLowerCase() || d.slug.toLowerCase() === id.toLowerCase());
}

export const POPULAR_SKILLS_BY_DOMAIN: Record<string, string[]> = {
  'web-dev': ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git', 'REST APIs', 'Docker'],
  'data-science': ['Python', 'Pandas', 'NumPy', 'SQL', 'Data Visualization', 'Scikit-Learn', 'Statistics', 'EDA', 'Tableau', 'FastAPI', 'PySpark', 'Machine Learning'],
  'ai-ml': ['Python', 'PyTorch', 'Linear Algebra', 'Transformers', 'Hugging Face', 'Prompt Engineering', 'LangChain', 'RAG', 'Vector DBs', 'TensorFlow', 'LLMs', 'Deep Learning'],
  'cybersecurity': ['Networking', 'Linux', 'Wireshark', 'Python', 'OWASP Top 10', 'Burp Suite', 'Nmap', 'Metasploit', 'Cryptography', 'SIEM / Splunk', 'Bash', 'Incident Response'],
  'cloud-devops': ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines', 'GitHub Actions', 'Bash', 'Nginx', 'Prometheus', 'Grafana', 'Helm'],
  'ui-ux': ['Figma', 'Wireframing', 'User Research', 'Design Systems', 'Prototyping', 'Usability Testing', 'Typography', 'Color Theory', 'Mobile Design', 'Information Architecture', 'WCAG Accessibility', 'Micro-interactions']
};
