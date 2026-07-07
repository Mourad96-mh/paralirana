import { waLink, PHONE_TEL } from "@/lib/format";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import PhoneIcon from "@/components/PhoneIcon";

// Floating quick-contact buttons: call + WhatsApp, stacked bottom-right.
export default function WhatsAppFloat() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a
        href={`tel:${PHONE_TEL}`}
        aria-label="Appeler Para Lirana"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-lg transition hover:scale-105"
      >
        <PhoneIcon className="h-7 w-7" />
      </a>
      <a
        href={waLink("Bonjour Para Lirana, j'ai une question 🙂")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nous contacter sur WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      >
        <WhatsAppIcon className="h-8 w-8" />
      </a>
    </div>
  );
}
