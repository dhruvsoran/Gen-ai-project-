import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export async function generateStory(
  userInput: string,
  craftType: string,
  experience: string
): Promise<string> {
  try {
    const prompt = `You are a skilled storyteller helping traditional artisans share their craft stories. 
    
    Based on the following information about an artisan, create a compelling, authentic story that captures their passion, heritage, and craftsmanship:
    
    Craft Type: ${craftType}
    Experience: ${experience}
    Artisan's Description: ${userInput}
    
    Guidelines:
    - Write in first person from the artisan's perspective
    - Emphasize the cultural heritage and traditional techniques
    - Include emotional connection to the craft
    - Mention the learning journey and skill development
    - Keep it between 150-300 words
    - Make it authentic and respectful to Indian craftsmanship traditions
    - Focus on the human story behind the craft
    
    Create a story that would help customers connect with the artisan and appreciate the value of handcrafted work.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Unable to generate story at this time. Please try again.";
  } catch (error) {
    console.error('Failed to generate story:', error);
    throw new Error('Failed to generate story. Please check your input and try again.');
  }
}

export async function analyzeProduct(
  productName: string,
  description: string,
  category: string
): Promise<string> {
  try {
    const prompt = `You are an expert in traditional Indian crafts and marketplace marketing. 
    
    Create an enhanced product description that will help customers understand the value and uniqueness of this handcrafted item:
    
    Product Name: ${productName}
    Category: ${category}
    Basic Description: ${description}
    
    Guidelines:
    - Enhance the description while keeping it authentic
    - Highlight traditional techniques and cultural significance
    - Mention quality aspects and craftsmanship details
    - Add context about the craft tradition
    - Keep it between 100-200 words
    - Make it appealing to modern customers while respecting tradition
    - Include care instructions if relevant
    - Emphasize the handmade, unique nature
    
    Create a description that would convince customers of the product's value and authenticity.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Beautifully handcrafted with traditional techniques, this piece represents the rich heritage of Indian craftsmanship.";
  } catch (error) {
    console.error('Failed to analyze product:', error);
    // Return a fallback description instead of throwing
    return "This handcrafted piece showcases traditional Indian artisan skills, made with care and attention to detail using time-honored techniques.";
  }
}

export async function generateMarketingContent(
  artisanName: string,
  craftType: string,
  productName: string,
  targetAudience: string = "global customers interested in authentic handcrafted items"
): Promise<string> {
  try {
    const prompt = `Create compelling marketing content for a traditional Indian artisan's product.
    
    Details:
    - Artisan: ${artisanName}
    - Craft: ${craftType}
    - Product: ${productName}
    - Target Audience: ${targetAudience}
    
    Create marketing copy that:
    - Tells the story behind the product
    - Connects with the target audience emotionally
    - Highlights uniqueness and authenticity
    - Includes a call-to-action
    - Respects cultural heritage
    - Is suitable for social media or website use
    - Is between 100-150 words
    
    Make it engaging and authentic.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Discover authentic handcrafted beauty from talented traditional artisans. Each piece tells a story of heritage, skill, and passion.";
  } catch (error) {
    console.error('Failed to generate marketing content:', error);
    throw new Error('Failed to generate marketing content. Please try again.');
  }
}
