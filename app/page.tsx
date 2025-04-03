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
  const [formData, setFormData] = useState<FormData | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent form reset and reload
  
    const form = event.target as HTMLFormElement; // Type assertion to HTMLFormElement
    const formData = new FormData(form);

    setFormData(formData);
  
    setIsLoading(true);
    
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
          <h1 className="text-4xl font-bold">Lav tilbud - Create Quote</h1>
          <form className="w-[1000px]" onSubmit={onSubmit}>
            <h2 className="text-2xl font-semibold mb-2">Opgave detaljer:</h2>
            <div className="mb-3">
              <label htmlFor="description">Beskrivelse:</label>
              <textarea
                id="description"
                name="description"
                placeholder="Beskriv hvad der skal laves"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                rows={5}
                defaultValue={formData?.get('description') as string}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="tasks">Forberedende opgaver:</label>
              <textarea
                id="tasks"
                name="tasks"
                placeholder="Skriv dem ind her"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                rows={3}
                defaultValue={formData?.get('tasks') as string}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="material">Materialer:</label>
              <textarea
                id="material"
                name="material"
                placeholder="Hvilke materialer skal der bruges"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                rows={3}
                defaultValue={formData?.get('material') as string}
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="deadline">Tidsramme:</label>
              <input
                type="text"
                name="deadline"
                id="deadline"
                placeholder="Hvor mange dage er der afsat til opgaven"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                defaultValue={formData?.get('deadline') as string}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="budget">Pris:</label>
              <input
                type="text"
                id="budget"
                name="budget"
                placeholder="Total pris til kunde"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                defaultValue={formData?.get('budget') as string}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="comments">Evt. kommentarer:</label>
              <textarea
                id="comments"
                name="comments"
                placeholder="Andre kommentarer"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                rows={3}
                defaultValue={formData?.get('comments') as string}
              ></textarea>
            </div>

            <h2 className="text-2xl font-semibold mb-2">Hvilket sprog skal tilbudet laves i</h2>
            <div className="mb-3">
              <label htmlFor="language">Vælg sprog:</label>
              <input
                type="text"
                id="language"
                name="language"
                placeholder="Skriv sprog på engelsk: Danish"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                defaultValue={formData?.get('language') as string || 'English'}
              />
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              Kunde detaljer
            </h2>
            <div className="mb-3">
              <label htmlFor="name">Navn:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Kundens navn"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                defaultValue={formData?.get('name') as string}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Kundens email adresse"
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-400 border p-2 rounded-md min-w-full"
                defaultValue={formData?.get('email') as string}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone">Telefon:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Telefon nummer"
                className="border-gray-400 border p-2 rounded-md min-w-full"
                defaultValue={formData?.get('phone') as string}
              />
            </div>
            <div className="flex gap-2 mb-3">
              <div className="w-full">
                <label htmlFor="address">Adresse:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Kundens adresse"
                  className="border-gray-400 border p-2 rounded-md min-w-full"
                  defaultValue={formData?.get('address') as string}
                />
              </div>
              <div className="w-full">
                <label htmlFor="country">Land:</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Kundens land"
                  className="border-gray-400 border p-2 rounded-md min-w-full"
                  defaultValue={formData?.get('country') as string}
                />
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="w-full">
                <label htmlFor="city">By:</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Kundens by"
                  className="border-gray-400 border p-2 rounded-md min-w-full"
                  defaultValue={formData?.get('city') as string}
                />
              </div>
              <div className="w-full">
                <label htmlFor="zipcode">Postnummer:</label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  placeholder="Kundens postnummer"
                  className="border-gray-400 border p-2 rounded-md min-w-full"
                  defaultValue={formData?.get('zipcode') as string}
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-10 py-3 rounded-lg shadow-lg transition-all uppercase mt-3 hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Lav tilbud"}
            </button>
          </form>
        </>
      ) : (
        <QuoteEditor initialQuote={quote} onSendQuote={sendQuote} onQuoteRegenerate={() => setQuote('')} />
      )}
    </div>
  );
}
