"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuote(formData: FormData) {
  const data = {
    description: formData.get("description"),
    tasks: formData.get("tasks"),
    material: formData.get("material"),
    deadline: formData.get("deadline"),
    budget: formData.get("budget"),
    comments: formData.get("comments"),
    customer: {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      country: formData.get("country"),
      city: formData.get("city"),
      zipcode: formData.get("zipcode"),
    },
    additional: {
      language: formData.get("language"),
    }
  };

  try {
    const prompt = `### Job Information:  
- **Description:** ${data.description}  
- **Pre-Job Tasks:** ${data.tasks}  
- **Required Materials:** ${data.material}  
- **Deadline:** ${data.deadline}  
- **Budget:** $${data.budget}  

### Additional Comments:  
${data.comments}  

### Customer Information:  
- **Name:** ${data.customer.name}  
- **Email:** ${data.customer.email}  
- **Phone:** ${data.customer.phone}  
- **Address:** ${data.customer.address}, ${data.customer.city}, ${data.customer.country}, ${data.customer.zipcode}  

**Use these details to make a quote for a potential customer in ${data.additional.language} language**`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional quote generator. Generate detailed, well-structured quotes based on the provided information.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return { quote: completion.choices[0].message.content };
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to generate quote");
  }
}
