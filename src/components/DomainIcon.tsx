import React from 'react';
import { 
  Code2, 
  Database, 
  Brain, 
  ShieldCheck, 
  Cloud, 
  Palette, 
  Compass, 
  LucideProps 
} from 'lucide-react';

interface DomainIconProps extends LucideProps {
  name: string;
}

export default function DomainIcon({ name, ...props }: DomainIconProps) {
  switch (name.toLowerCase()) {
    case 'code2':
    case 'web-dev':
    case 'web development':
      return <Code2 {...props} />;
    case 'database':
    case 'data-science':
    case 'data science':
      return <Database {...props} />;
    case 'brain':
    case 'ai-ml':
    case 'ai & machine learning':
      return <Brain {...props} />;
    case 'shieldcheck':
    case 'cybersecurity':
      return <ShieldCheck {...props} />;
    case 'cloud':
    case 'cloud-devops':
    case 'cloud & devops':
      return <Cloud {...props} />;
    case 'palette':
    case 'ui-ux':
    case 'ui/ux design':
      return <Palette {...props} />;
    default:
      return <Compass {...props} />;
  }
}
