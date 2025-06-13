
import type { DocumentItem } from '@/data/documentationData';
import type { ATSDocument } from '@/data/atsDocumentation';
import { availableDocuments } from '@/data/documentationData';
import { atsDocuments } from '@/data/atsDocumentation';

export function transformATSDocumentToStandard(atsDoc: ATSDocument): DocumentItem {
  // Map ATS difficulty to priority
  const priorityMap: Record<string, string> = {
    'beginner': 'medium',
    'intermediate': 'high', 
    'advanced': 'critical'
  };

  return {
    title: atsDoc.title,
    description: atsDoc.content.substring(0, 200) + '...',
    filePath: `ats-${atsDoc.id}`,
    category: 'ats',
    priority: priorityMap[atsDoc.difficulty] || 'medium',
    tags: atsDoc.tags,
    lastModified: atsDoc.lastUpdated,
    estimatedReadTime: atsDoc.estimatedReadTime,
    content: atsDoc.content,
    type: atsDoc.type,
    difficulty: atsDoc.difficulty,
    version: atsDoc.version
  };
}

export function getAllIntegratedDocuments(): DocumentItem[] {
  const standardDocs = availableDocuments;
  const transformedATSDocs = atsDocuments.map(transformATSDocumentToStandard);
  
  return [...standardDocs, ...transformedATSDocs];
}
