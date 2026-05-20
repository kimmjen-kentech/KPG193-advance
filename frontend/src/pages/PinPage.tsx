import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { cn } from '../lib/cn';
import { useI18n } from '../hooks/useI18n';

export const PinPage = () => {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const nextPath = params.get('next') ?? '/';

  const [digits, setDigits] = useState(['', '', '', '']);
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refs[0].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const nextDigits = [...digits];
    nextDigits[index] = value;
    setDigits(nextDigits);
    setError(false);
    if (value && index < 3) refs[index + 1].current?.focus();
    else if (value && index === 3) textRef.current?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
    if (e.key === 'Enter') void submit();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text');
    const numPart = raw.replace(/\D/g, '').slice(0, 4);
    const textPart = raw.replace(/^\d+/, '');
    if (!numPart) return;
    const nextDigits = ['', '', '', ''];
    for (let i = 0; i < numPart.length; i++) nextDigits[i] = numPart[i];
    setDigits(nextDigits);
    if (textPart) setText(textPart);
    refs[Math.min(numPart.length, 3)].current?.focus();
  };

  const submit = async () => {
    const pin = digits.join('') + text;
    if (digits.join('').length < 4 || !text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        // 쿠키가 다음 요청에 반영되도록 full reload
        window.location.href = nextPath;
      } else {
        setError(true);
        setDigits(['', '', '', '']);
        setText('');
        refs[0].current?.focus();
        setShake(true);
        setTimeout(() => setShake(false), 450);
      }
    } finally {
      setLoading(false);
    }
  };

  const filled = digits.every(Boolean) && text.trim().length > 0;
  const submitLabel = loading ? t.pin.submitLoading : t.pin.submitLabel;

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-bg p-4 text-fg">
      <div className="w-full max-w-sm space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-border bg-bg-elev">
            <Lock size={18} strokeWidth={1.6} />
          </div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            KPG_193 · v1.5
          </div>
          <h1 className="mt-2 font-serif text-3xl italic leading-none tracking-tight text-fg">
            {t.pin.title}
          </h1>
          <p className="mt-2 font-serif text-sm italic text-fg-muted">{t.pin.sub}</p>
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
              {t.pin.digitLabel}
            </p>
            <div
              className={cn(
                'flex justify-center gap-2 sm:gap-3',
                shake && 'animate-[pinShake_0.4s_ease]',
              )}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={refs[i]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => updateDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  aria-label={`PIN ${i + 1}/4`}
                  className={cn(
                    'h-12 w-11 border-2 bg-bg-elev text-center font-mono text-lg font-bold tabular-nums text-fg caret-transparent outline-none transition-colors sm:h-14 sm:w-12 sm:text-xl',
                    d ? 'border-fg' : 'border-border focus:border-fg/60',
                    error && 'border-[#ef4444]',
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
              {t.pin.textLabel}
            </p>
            <input
              ref={textRef}
              type="password"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void submit();
              }}
              placeholder="••••••"
              className={cn(
                'h-11 w-full border-2 bg-bg-elev px-4 text-center font-mono text-base tracking-widest text-fg placeholder:text-fg-subtle/40 outline-none transition-colors',
                text ? 'border-fg' : 'border-border focus:border-fg/60',
                error && 'border-[#ef4444]',
              )}
            />
          </div>

          <div className="h-5 text-center">
            {error && <p className="font-mono text-[11px] text-[#ef4444]">{t.pin.errorMsg}</p>}
          </div>

          <button
            onClick={() => void submit()}
            disabled={!filled || loading}
            className={cn(
              'h-11 w-full font-mono text-xs font-bold uppercase tracking-[0.2em] transition-all',
              filled && !loading
                ? 'bg-fg text-bg hover:opacity-90'
                : 'cursor-not-allowed border border-border bg-bg-elev text-fg-subtle',
            )}
          >
            {submitLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pinShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>

    </div>
  );
};
