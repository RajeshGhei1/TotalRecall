
export interface DocumentContent {
  title: string;
  content: string;
  lastModified: string;
  wordCount: number;
}

class DocumentService {
  async loadDocument(filePath: string): Promise<DocumentContent> {
    // Since we're using embedded content, we'll throw an error for now
    // The component should handle this by using the embedded content instead
    throw new Error(`Document not found: ${filePath}`);
  }

  async downloadDocument(filePath: string, filename: string): Promise<void> {
    // For downloads, we'll create the file from the embedded content
    throw new Error(`Document not found: ${filePath}`);
  }

  async downloadAllDocuments(documents: unknown[]): Promise<void> {
    try {
      // Create a zip-like structure by downloading individual files
      for (const doc of documents) {
        if (doc.content) {
          const filename = `${doc.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}.md`;
          await this.downloadSingleDocument(doc.content, filename, doc.title);
        }
      }
    } catch (error) {
      console.error('Error downloading all documents:', error);
      throw error;
    }
  }

  private async downloadSingleDocument(content: string, filename: string, title: string): Promise<void> {
    try {
      // Create a blob with the markdown content
      const blob = new Blob([content], { type: 'text/markdown' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading document ${title}:`, error);
      throw error;
    }
  }

  // Helper method to create document content from embedded data
  createDocumentContent(doc: any): DocumentContent {
    return {
      title: doc.title,
      content: doc.content,
      lastModified: doc.lastModified,
      wordCount: doc.content.split(' ').length
    };
  }
}

export const documentService = new DocumentService();
