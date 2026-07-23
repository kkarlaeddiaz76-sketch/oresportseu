export const WHATSAPP_NUMBER = "34600000000";

export function waLink(msg: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function WhatsAppFloating() {
  return (
    <a
      href={waLink("Hola KitCraft, quiero información sobre uniformes personalizados.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-black/10 transition hover:scale-110"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6a12 12 0 0 0 17.8-10.4c0-3.2-1.2-6.2-3.5-8.5ZM12 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 21.8 12 9.8 9.8 0 0 1 12 21.8Zm5.4-7.3c-.3-.1-1.8-.9-2-1s-.5-.2-.7.1-.8 1-1 1.2-.4.2-.7 0a8 8 0 0 1-2.4-1.5 8.9 8.9 0 0 1-1.6-2c-.2-.4 0-.5.1-.7l.4-.5.3-.5c.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4a3 3 0 0 0-1 2.3c0 1.4 1 2.7 1.2 2.9.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4 0-.1-.3-.2-.6-.3Z" />
      </svg>
    </a>
  );
}
