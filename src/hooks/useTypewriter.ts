import { useEffect, useState } from "react";

/** Types each word, holds it, deletes it, then moves to the next. */
export function useTypewriter(
  words: string[],
  { typeMs = 70, deleteMs = 35, holdMs = 1700 } = {}
) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const word = words[index % words.length];
    const finishedTyping = !deleting && text === word;
    const finishedDeleting = deleting && text === "";
    const delay = finishedTyping ? holdMs : deleting ? deleteMs : typeMs;

    const timer = setTimeout(() => {
      if (finishedTyping) {
        setDeleting(true);
      } else if (finishedDeleting) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words, typeMs, deleteMs, holdMs]);

  return text;
}
