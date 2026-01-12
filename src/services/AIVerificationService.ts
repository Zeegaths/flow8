interface VerificationResult {
  approved: boolean;
  confidence: number;
  reasoning: string;
  suggestions?: string[];
}

export class AIVerificationService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
  }

  async verifyDeliverables(
    milestoneTitle: string,
    milestoneDescription: string,
    deliverables: Array<{
      title: string;
      description: string;
      url?: string;
      proof?: string;
      type: string;
    }>
  ): Promise<VerificationResult> {
    // If no API key, use mock verification
    if (!this.apiKey) {
      return this.mockVerification(deliverables);
    }

    try {
      const prompt = this.buildVerificationPrompt(
        milestoneTitle,
        milestoneDescription,
        deliverables
      );

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error('AI verification failed, using mock');
        return this.mockVerification(deliverables);
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Parse AI response
      return this.parseAIResponse(content);
    } catch (error) {
      console.error('AI verification error:', error);
      return this.mockVerification(deliverables);
    }
  }

  private buildVerificationPrompt(
    milestoneTitle: string,
    milestoneDescription: string,
    deliverables: Array<any>
  ): string {
    return `You are an AI verification agent for Flow8, a milestone-based escrow platform. Your job is to verify if deliverables meet the milestone requirements.

Milestone: ${milestoneTitle}
Description: ${milestoneDescription}

Deliverables submitted:
${deliverables
  .map(
    (d, i) => `
${i + 1}. ${d.title}
   Type: ${d.type}
   Description: ${d.description}
   ${d.url ? `URL: ${d.url}` : ''}
   ${d.proof ? `Proof: ${d.proof}` : ''}
`
  )
  .join('\n')}

Please analyze these deliverables and provide:
1. Should this milestone be APPROVED or REJECTED?
2. Confidence level (0-100%)
3. Brief reasoning (2-3 sentences)
4. Suggestions for improvement (if any)

Respond ONLY in this JSON format:
{
  "approved": true/false,
  "confidence": 85,
  "reasoning": "Your reasoning here",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;
  }

  private parseAIResponse(content: string): VerificationResult {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          approved: parsed.approved || false,
          confidence: parsed.confidence || 0,
          reasoning: parsed.reasoning || 'AI verification completed',
          suggestions: parsed.suggestions || [],
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // Fallback parsing
    const approved = content.toLowerCase().includes('approved');
    return {
      approved,
      confidence: approved ? 75 : 25,
      reasoning: content.substring(0, 200),
      suggestions: [],
    };
  }

  private mockVerification(deliverables: Array<any>): VerificationResult {
    // Mock verification logic
    const hasUrls = deliverables.some((d) => d.url);
    const hasProof = deliverables.some((d) => d.proof);
    const allHaveDescriptions = deliverables.every((d) => d.description?.trim());

    const score = (hasUrls ? 40 : 0) + (hasProof ? 30 : 0) + (allHaveDescriptions ? 30 : 0);

    return {
      approved: score >= 70,
      confidence: score,
      reasoning: `Deliverables have been reviewed. ${
        hasUrls ? 'Links provided. ' : ''
      }${hasProof ? 'Proof of work submitted. ' : ''}${
        allHaveDescriptions ? 'All descriptions complete.' : 'Some descriptions missing.'
      }`,
      suggestions:
        score < 70
          ? [
              !hasUrls && 'Consider adding links to deliverables',
              !hasProof && 'Add proof of work (commits, screenshots, etc.)',
              !allHaveDescriptions && 'Complete all deliverable descriptions',
            ].filter(Boolean) as string[]
          : [],
    };
  }
}

export const aiVerificationService = new AIVerificationService();