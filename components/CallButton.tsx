// components/CallButton.tsx
export default function CallToActionButton() {
  return (
    <div className="flex justify-center items-center mt-12">
        <a
        href="https://corplink.co"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-full border border-white/20 text-white text-base font-medium tracking-wide hover:bg-white/10 transition-colors duration-300"
        >
        Faça Parte →
        </a>
    </div>
  );
}