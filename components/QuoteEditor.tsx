import { useState } from "react";
import dynamic from "next/dynamic";
import { cleanEditorHtml } from "@/utils/helpers";

// Load Markdown Editor dynamically to avoid SSR issues in Next.js
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function QuoteEditor({
  initialQuote,
  onSendQuote,
  onQuoteRegenerate
}: {
  initialQuote: string;
  onSendQuote: (quote: string) => Promise<boolean>;
  onQuoteRegenerate: () => void;
}) {
  const [quote, setQuote] = useState(
    initialQuote || "## Generated Quote\n\n*Edit this text...*"
  );

  const [sending, setSending] = useState(false);

  const sendQuote = async () => {
    setSending(true);
    try {
      // Get the MDEditor instance's root element
      const editorElement = document.querySelector('.w-md-editor-preview');
      if (!editorElement) {
        throw new Error('Editor preview not found');
      }
      
      // Get HTML content directly from the preview element
      const htmlContent = cleanEditorHtml(editorElement.innerHTML);
      
      const res = await onSendQuote(htmlContent);
      if (res) {
        alert("Quote sent successfully!");
      } else {
        alert("Failed to send quote!");
      }
    } catch (error) {
      alert("An error occurred while sending the quote.");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full mt-8 p-6 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Quotation</h2>

      {/* Markdown Editor */}
      <MDEditor
        value={quote}
        onChange={(val) => setQuote(val || "")}
        height={600}
      />

      <button
        type="button"
        className="bg-blue-500 text-white px-10 py-3 rounded-lg shadow-lg transition-all uppercase mt-3 hover:bg-blue-700 disabled:bg-gray-400"
        disabled={sending}
        aria-disabled={sending}
        onClick={sendQuote}
      >
        {sending ? "Sending..." : "Send Quote"}
      </button>

      <button
        type="button"
        className="bg-amber-500 mx-2 text-white px-10 py-3 rounded-lg shadow-lg transition-all uppercase mt-3 hover:bg-amber-700 disabled:bg-gray-400"
        onClick={onQuoteRegenerate}
      >
        Edit Details
      </button>
    </div>
  );
}
