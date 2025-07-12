
export class FormUsabilityScorer {
  static calculateUsabilityScore(form: any, fields: unknown[]): number {
    let score = 50; // Base score
    
    // Field count scoring
    if (fields.length >= 3 && fields.length <= 10) {
      score += 20;
    } else if (fields.length > 10) {
      score -= 10;
    }
    
    // Required fields balance
    const requiredFields = fields.filter(f => f.required).length;
    const requiredRatio = requiredFields / fields.length;
    if (requiredRatio > 0.3 && requiredRatio < 0.7) {
      score += 15;
    }
    
    // Field variety
    const fieldTypes = new Set(fields.map(f => f.field_type || f.type));
    if (fieldTypes.size > 2) {
      score += 15;
    }
    
    return Math.min(100, Math.max(0, score));
  }
}
