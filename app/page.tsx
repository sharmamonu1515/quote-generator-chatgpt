"use client";
import { generateQuote } from "@/actions/generate-quote";
import QuoteEditor from "@/components/QuoteEditor";
import { useState } from "react";

interface QuoteResponse {
  quote: string | null;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<string|null>("");
  const [email, setEmail] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent form reset and reload
  
    const form = event.target as HTMLFormElement; // Type assertion to HTMLFormElement
    const formData = new FormData(form);
  
    setIsLoading(true);
    console.log(formData.get("description")); // Check what data is in formData
    
    try {
      const result: QuoteResponse = await generateQuote(formData);
      setQuote(result.quote);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const sendQuote = async (quote: string) => {
    const response = await fetch("/api/sendQuote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote, recipient: email }),
    });

    const data = await response.json();

    return data.success;
  };

  return (
    <div className="grid items-center justify-items-center min-h-screen px-8 py-5 pb-20 gap-4 font-[family-name:var(--font-geist-sans)]">
      {!quote ? (
        <>
          <h1 className="text-4xl font-bold">Create Quote</h1>
          <form className="w-[1000px]" onSubmit={onSubmit}>
            <h2 className="text-2xl font-semibold mb-2">Task Information</h2>
            <div className="mb-3">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter detailed description"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                rows={5}
                defaultValue={
                  "Write a script to scrape data for amazon product url using python"
                }
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="tasks">Pre-Job Tasks</label>
              <textarea
                id="tasks"
                placeholder="Enter tasks"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                rows={3}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="material">Material</label>
              <textarea
                id="material"
                name="material"
                placeholder="Enter material details"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                rows={3}
                defaultValue="Cpanel, SSH, FTP"
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="deadline">Deadline</label>
              <input
                type="text"
                name="deadline"
                id="deadline"
                placeholder="Enter deadline"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                defaultValue="2 days"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="budget">Budget</label>
              <input
                type="text"
                id="budget"
                name="budget"
                placeholder="Enter budget"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                defaultValue={"100 USD"}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                name="comments"
                placeholder="Enter comments details"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                rows={3}
              ></textarea>
            </div>

            <h2 className="text-2xl font-semibold mb-2">Additional Information</h2>
            <div className="mb-3">
              <label htmlFor="language">Language</label>
              <input
                type="text"
                id="language"
                name="language"
                placeholder="Enter language"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                defaultValue={'English'}
              />
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              Customer Information
            </h2>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter name"
                className="border-gray-400 border p-2 rounded-md min-w-full"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter email address"
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-400 border p-2 rounded-md min-w-full"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter phone"
                className="border-gray-400 border p-2 rounded-md min-w-full"
              />
            </div>
            <div className="flex gap-2 mb-3">
              <div className="w-full">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  className="border-gray-400 border p-2 rounded-md min-w-full"
                />
              </div>
              <div className="w-full">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Enter country"
                  className="border-gray-400 border p-2 rounded-md min-w-full"
                />
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="w-full">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Enter city"
                  className="border-gray-400 border p-2 rounded-md min-w-full"
                />
              </div>
              <div className="w-full">
                <label htmlFor="zipcode">Zipcode</label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  placeholder="Enter zipcode"
                  className="border-gray-400 border p-2 rounded-md min-w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-10 py-3 rounded-lg shadow-lg transition-all uppercase mt-3 hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Quote"}
            </button>
          </form>
        </>
      ) : (
        <QuoteEditor initialQuote={quote} onSendQuote={sendQuote} onQuoteRegenerate={() => setQuote('')} />
      )}
    </div>
  );
}
