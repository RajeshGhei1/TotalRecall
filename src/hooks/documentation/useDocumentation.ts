import { useState, useEffect } from 'react';
import { documentService } from '@/services/documentService';
import { getAllIntegratedDocuments } from '@/utils/documentTransformer';
import { atsDocuments } from '@/data/atsDocumentation';
import { PDFDocumentExporter, downloadPDF, generatePDFFilename, type DocumentContent as PDFDocumentContent } from '@/utils/documentExport';
import type { DocumentItem } from '@/data/documentationData';

export function useDocumentation() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const allDocuments = getAllIntegratedDocuments();

  const loadDocument = async (filePath: string) => {
    setLoading(true);
    try {
      // Check if it's an ATS document
      if (filePath.startsWith('ats-')) {
        const atsId = filePath.replace('ats-', '');
        const atsDoc = atsDocuments.find(d => d.id === atsId);
        if (atsDoc) {
          const documentContent: DocumentItem = {
            filePath: `ats-${atsDoc.id}`,
            title: atsDoc.title,
            description: atsDoc.content.substring(0, 200) + '...', // Use content preview as description
            content: atsDoc.content,
            category: 'ats',
            priority: 'high',
            tags: atsDoc.tags || [],
            lastModified: atsDoc.lastUpdated,
            estimatedReadTime: atsDoc.estimatedReadTime,
            type: atsDoc.type,
            difficulty: atsDoc.difficulty
          };
          setSelectedDocument(documentContent);
        }
      } else {
        const doc = allDocuments.find(d => d.filePath === filePath);
        if (doc && doc.content) {
          const documentContent: DocumentItem = {
            filePath: doc.filePath,
            title: doc.title,
            description: doc.description,
            content: doc.content,
            category: doc.category,
            priority: doc.priority,
            tags: doc.tags,
            lastModified: doc.lastModified,
            estimatedReadTime: doc.estimatedReadTime,
            type: doc.type,
            difficulty: doc.difficulty,
            version: doc.version
          };
          setSelectedDocument(documentContent);
        }
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (filePath: string, title: string) => {
    try {
      let content = '';
      
      // Check if it's an ATS document
      if (filePath.startsWith('ats-')) {
        const atsId = filePath.replace('ats-', '');
        const atsDoc = atsDocuments.find(d => d.id === atsId);
        if (atsDoc) {
          content = atsDoc.content;
        }
      } else {
        const doc = allDocuments.find(d => d.filePath === filePath);
        if (doc && doc.content) {
          content = doc.content;
        }
      }

      if (content) {
        const filename = `${title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}.md`;
        
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Document content not found');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const downloadAllDocuments = async () => {
    try {
      for (const doc of allDocuments) {
        if (doc.content) {
          const filename = `${doc.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}.md`;
          
          const blob = new Blob([doc.content], { type: 'text/markdown' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          
          document.body.appendChild(link);
          link.click();
          
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error downloading all documents:', error);
    }
  };

  const downloadDocumentAsPDF = async (filePath: string, title: string) => {
    try {
      let content = '';
      
      // Check if it's an ATS document
      if (filePath.startsWith('ats-')) {
        const atsId = filePath.replace('ats-', '');
        const atsDoc = atsDocuments.find(d => d.id === atsId);
        if (atsDoc) {
          content = atsDoc.content;
        }
      } else {
        const doc = allDocuments.find(d => d.filePath === filePath);
        if (doc && doc.content) {
          content = doc.content;
        }
      }

      if (content) {
        const documentData: PDFDocumentContent = {
          title,
          content,
          category: 'documentation',
          priority: 'high',
          tags: ['pdf', 'export'],
          lastModified: new Date().toISOString().split('T')[0],
          estimatedReadTime: '10 min',
          type: 'guide',
          difficulty: 'intermediate'
        };

        const exporter = new PDFDocumentExporter({
          includeLogo: true,
          includeHeader: true,
          includeFooter: true,
          includeTableOfContents: true
        });

        const pdfBlob = await exporter.exportDocument(documentData);
        const filename = generatePDFFilename(documentData);
        downloadPDF(pdfBlob, filename);
      } else {
        console.error('Document content not found');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const downloadAllDocumentsAsPDF = async () => {
    try {
      console.log('Starting PDF export for all documents...');
      console.log('Total documents to export:', allDocuments.length);
      
      const documents: PDFDocumentContent[] = allDocuments.map(doc => ({
        title: doc.title,
        content: doc.content,
        category: doc.category,
        priority: doc.priority,
        tags: doc.tags,
        lastModified: doc.lastModified,
        estimatedReadTime: doc.estimatedReadTime,
        type: doc.type,
        difficulty: doc.difficulty,
        version: doc.version
      }));

      console.log('Documents prepared for PDF export:', documents.length);

      const exporter = new PDFDocumentExporter({
        includeLogo: true,
        includeHeader: true,
        includeFooter: true,
        includeTableOfContents: true
      });

      console.log('PDF exporter created, generating PDF...');
      const pdfBlob = await exporter.exportMultipleDocuments(documents);
      console.log('PDF blob generated, size:', pdfBlob.size);

      const filename = `total-recall-complete-documentation-${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Downloading PDF as:', filename);
      
      downloadPDF(pdfBlob, filename);
      console.log('PDF download initiated successfully');
    } catch (error) {
      console.error('Error downloading all documents as PDF:', error);
      // Show user-friendly error message
      alert('Failed to generate PDF. Please check the console for details.');
    }
  };

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || doc.priority === selectedPriority;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || doc.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesType && matchesDifficulty;
  });

  return {
    selectedDocument,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedType,
    setSelectedType,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredDocuments,
    loadDocument,
    downloadDocument,
    downloadAllDocuments,
    downloadDocumentAsPDF,
    downloadAllDocumentsAsPDF,
  };
}
