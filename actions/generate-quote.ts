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
    const prompt = `Generate a professional and structured quote for a customer based on the provided details. The quote should be clear, polite, and follow a professional business format. It must be written in "${data.additional.language}" language and be structured with sections to ensure readability and professionalism.

Structure of the Quote:
1. Header:
• Title: Generate a relevant title based on the work description (e.g., “Tilbud på [Service Type]”)
• Recipient Information: Include customer name, email, phone, address, city, country and zipcode

2. Introduction:
• Address the recipient politely (e.g., Dear [Customer Name],)
• Thank them for their interest in the service
• Briefly summarize the requested work based on the details provided

3. Scope of Work: (Use checkmarks for readability)
• List all specific tasks provided in the input (e.g., removal of old roof, material installation, structural adjustments)
• Ensure descriptions are concise yet informative

4. Materials:
• List all materials specified in the input (e.g., natural thatch from Ukraine, specific tile types)
• Highlight any special properties of the materials (e.g., durability, sustainability)

5. Project Timeline:
• 🕒 Clearly state the estimated completion time provided in the input

6. Price & Budget:
• 💰 Display the total price, ensuring clarity about what is included (e.g., materials, labor, waste disposal)

7. Quality & Warranty:
• If warranty details are provided, include them (e.g., workmanship guarantee, material warranty)
• If not specified, generate a standard professional phrase ensuring quality and adherence to industry standards

8. Payment Terms:
• Clearly state any payment structure provided (e.g., installment percentages at different project stages)

9. Closing & Contact Details:
• End the quote politely, inviting the customer to reach out for further clarification
• Sign off with regards followed by the sender’s name, company name, and contact details

Formatting Instructions:
• Use clear, structured language suitable for a formal quote
• Ensure icons (✔, ✅, 💰, 🕒) are included where applicable for better readability
• Adapt all text dynamically based on the provided service details (no static phrases that may not apply)”*

How This Works in Your System:
• All details (title, tasks, materials, price, deadline, etc.) will come dynamically from form inputs
• No fixed text is included—everything adjusts based on the input
• The AI will generate a complete quote, ensuring clarity, professionalism, and readability

--- Here are the details entered in inputs
Job Information:  
Description: ${data.description}  
Pre-Job Tasks: ${data.tasks}  
Required Materials: ${data.material}  
Deadline: ${data.deadline}  
Budget: ${data.budget}  

Additional Comments:  
${data.comments}  

Customer Information:  
Name: ${data.customer.name}  
Email: ${data.customer.email}  
Phone: ${data.customer.phone}  
Address: ${data.customer.address}
City: ${data.customer.city}
Country: ${data.customer.country}
Zipcode: ${data.customer.zipcode}`;

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
