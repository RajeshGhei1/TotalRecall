// Lazy load PDF libraries to reduce initial bundle size
let jsPDF: any = null;
let autoTable: any = null;

// Initialize PDF libraries only when needed
async function initializePDFLibraries() {
  if (!jsPDF) {
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.jsPDF;
  }
  if (!autoTable) {
    await import('jspdf-autotable');
    autoTable = (window as any).jsPDF.API.autoTable;
  }
}

export interface PDFExportOptions {
  includeLogo?: boolean;
  includeHeader?: boolean;
  includeFooter?: boolean;
  includeTableOfContents?: boolean;
  fontSize?: number;
  lineHeight?: number;
  margin?: number;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
}

export interface DocumentContent {
  title: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
  lastModified: string;
  estimatedReadTime: string;
  type?: string;
  difficulty?: string;
  version?: string;
}

// Total Recall Branding Colors
const BRAND_COLORS = {
  primaryColor: '#3B82F6',    // Blue
  secondaryColor: '#8B5CF6',  // Purple
  accentColor: '#F59E0B',     // Amber
  text: '#1F2937',       // Dark gray
  light: '#F3F4F6'       // Light gray
};

// Create Total Recall Logo SVG (simplified version)
const createLogo = (): string => {
  try {
    // Use a simpler SVG that's more compatible
    return `
      <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Background rectangle -->
        <rect x="2" y="8" width="24" height="24" rx="6" fill="${BRAND_COLORS.primaryColor}"/>
        
        <!-- Simple brain icon -->
        <circle cx="14" cy="16" r="4" fill="white"/>
        <circle cx="18" cy="20" r="3" fill="white"/>
        <circle cx="10" cy="20" r="3" fill="white"/>
        
        <!-- Sparkle -->
        <circle cx="22" cy="10" r="2" fill="${BRAND_COLORS.accentColor}"/>
        
        <!-- Text -->
        <text x="32" y="18" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${BRAND_COLORS.primaryColor}">
          TOTAL RECALL
        </text>
        <text x="32" y="28" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="${BRAND_COLORS.accentColor}">
          .ai
        </text>
      </svg>
    `;
  } catch (error) {
    console.error('Error creating logo:', error);
    // Fallback to text-only logo
    return `
      <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="25" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${BRAND_COLORS.primaryColor}">
          TOTAL RECALL.ai
        </text>
      </svg>
    `;
  }
};

export class PDFDocumentExporter {
  private doc: any;
  private options: PDFExportOptions;
  private currentY: number = 0;
  private pageHeight: number = 0;
  private margin: number = 20;

  constructor(options: PDFExportOptions = {}) {
    this.options = {
      includeLogo: true,
      includeHeader: true,
      includeFooter: true,
      includeTableOfContents: true,
      fontSize: 12,
      lineHeight: 1.5,
      margin: 20,
      branding: BRAND_COLORS,
      ...options
    };
  }

  async initialize(): Promise<void> {
    await initializePDFLibraries();
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = this.options.margin || 20;
    this.currentY = this.margin;
  }

  async exportDocument(document: DocumentContent): Promise<Blob> {
    try {
      await this.initialize();
      console.log('Starting PDF export for document:', document.title);
      
      // Add header with logo
      if (this.options.includeHeader) {
        console.log('Adding header...');
        this.addHeader(document);
      }

      // Add table of contents
      if (this.options.includeTableOfContents) {
        console.log('Adding table of contents...');
        this.addTableOfContents(document);
      }

      // Add main content
      console.log('Adding content...');
      this.addContent(document);

      // Add footer
      if (this.options.includeFooter) {
        console.log('Adding footer...');
        this.addFooter();
      }

      // Generate PDF blob
      console.log('Generating PDF blob...');
      const pdfBlob = this.doc.output('blob');
      console.log('PDF blob generated successfully, size:', pdfBlob.size);
      
      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  async exportMultipleDocuments(documents: DocumentContent[]): Promise<Blob> {
    try {
      await this.initialize();
      console.log('Starting multi-document PDF export for', documents.length, 'documents');
      
      // Add cover page
      console.log('Adding cover page...');
      this.addCoverPage(documents);

      // Add table of contents for all documents
      if (this.options.includeTableOfContents) {
        console.log('Adding master table of contents...');
        this.addMasterTableOfContents(documents);
      }

      // Add each document
      for (let i = 0; i < documents.length; i++) {
        const document = documents[i];
        console.log(`Adding document ${i + 1}/${documents.length}:`, document.title);
        this.addDocumentSeparator(document);
        this.addContent(document);
      }

      // Add footer
      if (this.options.includeFooter) {
        console.log('Adding footer...');
        this.addFooter();
      }

      console.log('Generating final PDF blob...');
      const pdfBlob = this.doc.output('blob');
      console.log('Multi-document PDF generated successfully, size:', pdfBlob.size);
      
      return pdfBlob;
    } catch (error) {
      console.error('Error generating multi-document PDF:', error);
      throw error;
    }
  }

  private addHeader(document: DocumentContent): void {
    const headerY = this.margin;
    
    // Add logo if enabled
    if (this.options.includeLogo) {
      try {
        console.log('Adding logo to header...');
        const logo = createLogo();
        this.doc.addImage(logo, 'SVG', this.margin, headerY, 30, 10);
        console.log('Logo added successfully');
      } catch (error) {
        console.error('Error adding logo, using text fallback:', error);
        // Fallback to text logo
        this.doc.setFontSize(12);
        this.doc.setTextColor(BRAND_COLORS.primaryColor);
        this.doc.text('TOTAL RECALL.ai', this.margin, headerY + 5);
      }
    }

    // Add document title
    this.doc.setFontSize(18);
    this.doc.setTextColor(BRAND_COLORS.primaryColor);
    this.doc.text(document.title, this.margin + 35, headerY + 7);

    // Add metadata
    this.doc.setFontSize(10);
    this.doc.setTextColor(BRAND_COLORS.text);
    this.doc.text(`Category: ${document.category}`, this.margin + 35, headerY + 12);
    this.doc.text(`Priority: ${document.priority}`, this.margin + 35, headerY + 16);
    this.doc.text(`Last Modified: ${document.lastModified}`, this.margin + 35, headerY + 20);

    // Add horizontal line
    this.doc.setDrawColor(BRAND_COLORS.light);
    this.doc.line(this.margin, headerY + 25, this.doc.internal.pageSize.width - this.margin, headerY + 25);

    this.currentY = headerY + 35;
  }

  private addCoverPage(documents: DocumentContent[]): void {
    // Add logo
    if (this.options.includeLogo) {
      try {
        console.log('Adding logo to cover page...');
        const logo = createLogo();
        this.doc.addImage(logo, 'SVG', this.margin, this.margin, 60, 20);
        console.log('Cover page logo added successfully');
      } catch (error) {
        console.error('Error adding cover page logo, using text fallback:', error);
        // Fallback to text logo
        this.doc.setFontSize(16);
        this.doc.setTextColor(BRAND_COLORS.primaryColor);
        this.doc.text('TOTAL RECALL.ai', this.margin, this.margin + 15);
      }
    }

    // Add title
    this.doc.setFontSize(24);
    this.doc.setTextColor(BRAND_COLORS.primaryColor);
    this.doc.text('Total Recall Documentation', this.margin, this.margin + 40);

    // Add subtitle
    this.doc.setFontSize(14);
    this.doc.setTextColor(BRAND_COLORS.text);
    this.doc.text('Complete System Documentation', this.margin, this.margin + 50);

    // Add document count
    this.doc.setFontSize(12);
    this.doc.text(`Total Documents: ${documents.length}`, this.margin, this.margin + 70);

    // Add generation date
    this.doc.text(`Generated: ${new Date().toLocaleDateString()}`, this.margin, this.margin + 80);

    // Add categories
    const categories = [...new Set(documents.map(d => d.category))];
    this.doc.text('Categories:', this.margin, this.margin + 100);
    categories.forEach((category, index) => {
      this.doc.text(`• ${category}`, this.margin + 10, this.margin + 110 + (index * 5));
    });

    this.currentY = this.margin + 130;
  }

  private addTableOfContents(document: DocumentContent): void {
    this.addPageBreak();
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(BRAND_COLORS.primaryColor);
    this.doc.text('Table of Contents', this.margin, this.currentY);
    this.currentY += 10;

    // Parse content for headings
    const headings = this.extractHeadings(document.content);
    headings.forEach((heading, index) => {
      this.doc.setFontSize(12);
      this.doc.setTextColor(BRAND_COLORS.text);
      this.doc.text(`${index + 1}. ${heading.text}`, this.margin, this.currentY);
      this.currentY += 5;
    });

    this.currentY += 10;
  }

  private addMasterTableOfContents(documents: DocumentContent[]): void {
    this.addPageBreak();
    
    this.doc.setFontSize(16);
    this.doc.setTextColor(BRAND_COLORS.primaryColor);
    this.doc.text('Document Index', this.margin, this.currentY);
    this.currentY += 10;

    documents.forEach((doc, index) => {
      this.doc.setFontSize(12);
      this.doc.setTextColor(BRAND_COLORS.text);
      this.doc.text(`${index + 1}. ${doc.title}`, this.margin, this.currentY);
      
      this.doc.setFontSize(10);
      this.doc.setTextColor(BRAND_COLORS.secondaryColor);
      this.doc.text(`   Category: ${doc.category} | Priority: ${doc.priority}`, this.margin + 5, this.currentY + 3);
      
      this.currentY += 8;
    });

    this.currentY += 10;
  }

  private addContent(document: DocumentContent): void {
    // Parse markdown content and convert to PDF
    const sections = this.parseMarkdownContent(document.content);
    
    sections.forEach(section => {
      if (section.type === 'heading') {
        this.addHeading(section.content, section.level);
      } else if (section.type === 'paragraph') {
        this.addParagraph(section.content);
      } else if (section.type === 'list') {
        this.addList(section.content, section.ordered);
      } else if (section.type === 'code') {
        this.addCodeBlock(section.content);
      }
    });
  }

  private addDocumentSeparator(document: DocumentContent): void {
    this.addPageBreak();
    
    // Add document title as section header
    this.doc.setFontSize(20);
    this.doc.setTextColor(BRAND_COLORS.primaryColor);
    this.doc.text(document.title, this.margin, this.currentY);
    this.currentY += 15;

    // Add document metadata
    this.doc.setFontSize(10);
    this.doc.setTextColor(BRAND_COLORS.secondaryColor);
    this.doc.text(`Category: ${document.category} | Priority: ${document.priority} | Type: ${document.type || 'Document'}`, this.margin, this.currentY);
    this.currentY += 8;

    // Add horizontal line
    this.doc.setDrawColor(BRAND_COLORS.light);
    this.doc.line(this.margin, this.currentY, this.doc.internal.pageSize.width - this.margin, this.currentY);
    this.currentY += 10;
  }

  private addHeading(text: string, level: number): void {
    const fontSize = level === 1 ? 16 : level === 2 ? 14 : 12;
    const color = level === 1 ? BRAND_COLORS.primaryColor : BRAND_COLORS.secondaryColor;
    
    this.checkPageBreak(10);
    
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(color);
    this.doc.text(text, this.margin, this.currentY);
    this.currentY += fontSize * 0.5;
  }

  private addParagraph(text: string): void {
    this.checkPageBreak(20);
    
    this.doc.setFontSize(this.options.fontSize || 12);
    this.doc.setTextColor(BRAND_COLORS.text);
    
    const maxWidth = this.doc.internal.pageSize.width - (this.margin * 2);
    const lines = this.doc.splitTextToSize(text, maxWidth);
    
    lines.forEach(line => {
      this.checkPageBreak(5);
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += 5;
    });
    
    this.currentY += 5;
  }

  private addList(items: string[], ordered: boolean = false): void {
    this.checkPageBreak(items.length * 8);
    
    this.doc.setFontSize(this.options.fontSize || 12);
    this.doc.setTextColor(BRAND_COLORS.text);
    
    items.forEach((item, index) => {
      this.checkPageBreak(8);
      const prefix = ordered ? `${index + 1}.` : '•';
      this.doc.text(`${prefix} ${item}`, this.margin + 5, this.currentY);
      this.currentY += 8;
    });
    
    this.currentY += 5;
  }

  private addCodeBlock(code: string): void {
    this.checkPageBreak(30);
    
    // Add code block background
    this.doc.setFillColor(BRAND_COLORS.light);
    this.doc.rect(this.margin, this.currentY - 2, this.doc.internal.pageSize.width - (this.margin * 2), 25, 'F');
    
    // Add code text
    this.doc.setFontSize(10);
    this.doc.setTextColor(BRAND_COLORS.text);
    this.doc.text(code, this.margin + 2, this.currentY + 2);
    
    this.currentY += 30;
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 15;
    
    // Add horizontal line
    this.doc.setDrawColor(BRAND_COLORS.light);
    this.doc.line(this.margin, footerY - 5, this.doc.internal.pageSize.width - this.margin, footerY - 5);
    
    // Add footer text
    this.doc.setFontSize(8);
    this.doc.setTextColor(BRAND_COLORS.secondaryColor);
    this.doc.text('Total Recall - Enterprise AI Platform', this.margin, footerY);
    this.doc.text(`Generated on ${new Date().toLocaleDateString()}`, this.doc.internal.pageSize.width - this.margin - 40, footerY);
    
    // Add page number
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.text(`Page ${i} of ${pageCount}`, this.doc.internal.pageSize.width / 2, footerY);
    }
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  private addPageBreak(): void {
    this.doc.addPage();
    this.currentY = this.margin;
  }

  private extractHeadings(content: string): Array<{text: string, level: number}> {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Array<{text: string, level: number}> = [];
    
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        text: match[2].trim(),
        level: match[1].length
      });
    }
    
    return headings;
  }

  private parseMarkdownContent(content: string): Array<{type: string, content: any, level?: number, ordered?: boolean}> {
    const sections: Array<{type: string, content: any, level?: number, ordered?: boolean}> = [];
    const lines = content.split('\n');
    
    let currentSection: any = null;
    
    lines.forEach(line => {
      // Headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          type: 'heading',
          content: headingMatch[2].trim(),
          level: headingMatch[1].length
        };
        sections.push(currentSection);
        currentSection = null;
        return;
      }
      
      // Lists
      const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
      if (listMatch) {
        if (!currentSection || currentSection.type !== 'list') {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            type: 'list',
            content: [],
            ordered: /\d+\./.test(listMatch[2])
          };
        }
        currentSection.content.push(listMatch[3].trim());
        return;
      }
      
      // Code blocks
      if (line.startsWith('```')) {
        if (currentSection && currentSection.type === 'code') {
          sections.push(currentSection);
          currentSection = null;
        } else {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            type: 'code',
            content: ''
          };
        }
        return;
      }
      
      // Regular paragraphs
      if (line.trim()) {
        if (!currentSection || currentSection.type !== 'paragraph') {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            type: 'paragraph',
            content: line.trim()
          };
        } else {
          currentSection.content += ' ' + line.trim();
        }
      } else {
        if (currentSection && currentSection.type === 'paragraph') {
          sections.push(currentSection);
          currentSection = null;
        }
      }
    });
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }
}

// Utility function to download PDF
export const downloadPDF = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Utility function to generate filename
export const generatePDFFilename = (document: DocumentContent, prefix: string = 'total-recall'): string => {
  const cleanTitle = document.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}-${cleanTitle}-${date}.pdf`;
};

// Test function to verify PDF export works
export const testPDFExport = async (): Promise<boolean> => {
  try {
    const testDocument: DocumentContent = {
      title: 'Test Document',
      content: '# Test Document\n\nThis is a test document to verify PDF export functionality.\n\n## Features\n- PDF generation\n- Logo integration\n- Professional formatting\n\n## Conclusion\nPDF export is working correctly!',
      category: 'test',
      priority: 'high',
      tags: ['test', 'pdf'],
      lastModified: new Date().toISOString().split('T')[0],
      estimatedReadTime: '2 min',
      type: 'guide',
      difficulty: 'beginner'
    };

    const exporter = new PDFDocumentExporter({
      includeLogo: true,
      includeHeader: true,
      includeFooter: true,
      includeTableOfContents: true
    });

    const pdfBlob = await exporter.exportDocument(testDocument);
    console.log('Test PDF generated successfully, size:', pdfBlob.size);
    
    // Download the test PDF
    downloadPDF(pdfBlob, 'test-pdf-export.pdf');
    return true;
  } catch (error) {
    console.error('Test PDF export failed:', error);
    return false;
  }
}; 